import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'reCAPTCHA token is required' },
        { status: 400 }
      );
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    if (!secretKey) {
      console.error('RECAPTCHA_SECRET_KEY is not configured');
      // In development, allow without reCAPTCHA if not configured
      if (process.env.NODE_ENV === 'development') {
        return NextResponse.json({ success: true, score: 0.9 });
      }
      return NextResponse.json(
        { success: false, message: 'reCAPTCHA is not configured' },
        { status: 503 }
      );
    }

    // Verify token with Google
    const verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
    const response = await fetch(verifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${secretKey}&response=${token}`,
    });

    const data = await response.json();

    if (!data.success) {
      console.error('reCAPTCHA verification failed:', data['error-codes']);
      return NextResponse.json(
        { 
          success: false, 
          message: 'reCAPTCHA verification failed',
          errors: data['error-codes']
        },
        { status: 400 }
      );
    }

    // Check score (for v3, score ranges from 0.0 to 1.0)
    // 1.0 = very likely human, 0.0 = very likely bot
    const score = data.score || 0;
    const threshold = 0.5; // Adjust based on your needs (0.5 = moderate)

    if (score < threshold) {
      console.warn(`reCAPTCHA score too low: ${score} (threshold: ${threshold})`);
      return NextResponse.json(
        { 
          success: false, 
          message: 'reCAPTCHA score too low - possible bot detected',
          score 
        },
        { status: 403 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      score,
      action: data.action 
    });
  } catch (error: any) {
    console.error('reCAPTCHA verification error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to verify reCAPTCHA', error: error.message },
      { status: 500 }
    );
  }
}

