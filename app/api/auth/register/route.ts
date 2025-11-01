import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { generateToken } from '@/lib/auth';
import { sendEmail, getWelcomeEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
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

    // Create new user
    const user = await User.create({
      username,
      email,
      password,
      role: 'user',
    });

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
    });

    // Send welcome email (use same config as forgot-password)
    try {
      const emailResult = await sendEmail({
        to: user.email,
        subject: 'Chào mừng đến với EA Forex ThebenchmarkTrader!',
        html: getWelcomeEmail(user.username),
      });

      if (emailResult.success) {
        console.log('✅ Welcome email sent successfully to:', user.email);
      } else {
        console.error('⚠️ Welcome email failed to send to:', user.email);
      }
    } catch (emailError) {
      console.error('❌ Error sending welcome email:', emailError);
      // Continue even if email fails - user is already registered
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Đăng ký thành công!',
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
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

