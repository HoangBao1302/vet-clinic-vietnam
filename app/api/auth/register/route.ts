import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { generateToken } from '@/lib/auth';
import { sendEmail, getEmailVerificationEmail } from '@/lib/email';
import { registerLimiter, getClientIP } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    const rateLimitResult = registerLimiter(clientIP);

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: rateLimitResult.message || 'Quá nhiều requests. Vui lòng thử lại sau.',
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '5',
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    const db = await connectDB();
    
    if (!db) {
      return NextResponse.json(
        { success: false, message: 'Database không khả dụng' },
        { status: 503 }
      );
    }

    const { username, email, password, recaptchaToken, honeypot } = await request.json();

    // Honeypot check - if filled, it's a bot
    if (honeypot && honeypot.trim() !== '') {
      console.warn('🚫 Bot detected via honeypot field');
      return NextResponse.json(
        { success: false, message: 'Invalid request' },
        { status: 400 }
      );
    }

    // reCAPTCHA verification
    if (recaptchaToken) {
      try {
        const recaptchaResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/verify-recaptcha`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: recaptchaToken }),
        });

        const recaptchaData = await recaptchaResponse.json();

        if (!recaptchaData.success) {
          console.warn('🚫 reCAPTCHA verification failed:', recaptchaData.message);
          return NextResponse.json(
            { success: false, message: 'reCAPTCHA verification failed. Please try again.' },
            { status: 403 }
          );
        }

        console.log('✅ reCAPTCHA verified - Score:', recaptchaData.score);
      } catch (recaptchaError) {
        console.error('reCAPTCHA verification error:', recaptchaError);
        // In development, allow if reCAPTCHA is not configured
        if (process.env.NODE_ENV !== 'development') {
          return NextResponse.json(
            { success: false, message: 'Security verification failed. Please try again.' },
            { status: 500 }
          );
        }
      }
    } else if (process.env.NODE_ENV === 'production') {
      // Require reCAPTCHA in production
      console.warn('🚫 Missing reCAPTCHA token in production');
      return NextResponse.json(
        { success: false, message: 'Security verification required' },
        { status: 400 }
      );
    }

    // Validation
    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Vui lòng điền đầy đủ thông tin' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: existingUser.email === email
            ? 'Email đã được sử dụng'
            : 'Username đã được sử dụng',
        },
        { status: 400 }
      );
    }

    // Generate email verification token
    const crypto = await import('crypto');
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationExpire = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create new user
    const user = await User.create({
      username,
      email,
      password,
      role: 'user',
      emailVerified: false,
      emailVerificationToken,
      emailVerificationExpire,
    });

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
    });

    // Send email verification email (ONLY verification email - welcome email will be sent AFTER verification)
    const verifyUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/verify-email?token=${emailVerificationToken}`;
    
    try {
      const emailResult = await sendEmail({
        to: user.email,
        subject: '✅ Xác thực email của bạn - EA Forex ThebenchmarkTrader',
        html: getEmailVerificationEmail(verifyUrl, user.username),
      });

      if (emailResult.success) {
        console.log('✅ Email verification sent successfully to:', user.email);
      } else {
        console.error('⚠️ Email verification failed to send to:', user.email);
      }
    } catch (emailError) {
      console.error('❌ Error sending verification email:', emailError);
      // Continue even if email fails - user is already registered
    }

    // NOTE: Welcome email will be sent AFTER email verification (in verify-email route)

    return NextResponse.json(
      {
        success: true,
        message: 'Tài khoản đã được tạo! Vui lòng kiểm tra email để xác thực tài khoản trước khi sử dụng dịch vụ.',
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          emailVerified: user.emailVerified,
        },
        requiresVerification: true,
        accountActive: false, // Tài khoản chưa được kích hoạt
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Register error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Đã xảy ra lỗi khi đăng ký',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

