import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { generateToken } from '@/lib/auth';
import { loginLimiter, getClientIP } from '@/lib/rateLimit';
import { applyAuthCookie } from '@/lib/authCookie';

async function verifyRecaptcha(token: string | undefined) {
  if (!token) {
    if (process.env.NODE_ENV === 'production') {
      return { ok: false, message: 'Security verification required' };
    }
    return { ok: true };
  }

  try {
    const recaptchaResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/verify-recaptcha`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    const recaptchaData = await recaptchaResponse.json();
    if (!recaptchaData.success) {
      return { ok: false, message: 'reCAPTCHA verification failed. Please try again.' };
    }
    return { ok: true };
  } catch {
    if (process.env.NODE_ENV === 'production') {
      return { ok: false, message: 'Security verification failed. Please try again.' };
    }
    return { ok: true };
  }
}

export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);
    const rateLimitResult = loginLimiter(clientIP);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { success: false, message: rateLimitResult.message || 'Quá nhiều lần đăng nhập. Vui lòng thử lại sau 15 phút.' },
        {
          status: 429,
          headers: {
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

    const { email, password, recaptchaToken } = await request.json();

    const captcha = await verifyRecaptcha(recaptchaToken);
    if (!captcha.ok) {
      return NextResponse.json({ success: false, message: captcha.message }, { status: 400 });
    }

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Vui lòng điền email và mật khẩu' },
        { status: 400 }
      );
    }

    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Email hoặc mật khẩu không đúng' },
        { status: 401 }
      );
    }

    // Check if account is active
    if (!user.isActive) {
      return NextResponse.json(
        { success: false, message: 'Tài khoản đã bị vô hiệu hóa' },
        { status: 403 }
      );
    }

    // Check if email is verified (skip for admin/staff)
    // Also skip for legacy users (created before email verification system - no verification token)
    if (user.role !== 'admin' && user.role !== 'staff' && !user.emailVerified) {
      // Check if this is a new user who needs verification (has verification token)
      // Legacy users (no token) are considered verified for backward compatibility
      if (user.emailVerificationToken) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'Vui lòng xác thực email trước khi đăng nhập. Kiểm tra email và click link xác thực.',
            requiresVerification: true
          },
          { status: 403 }
        );
      }
      // Legacy user without verification token - auto-verify for backward compatibility
      user.emailVerified = true;
      await user.save();
      console.log('✅ Auto-verified legacy user:', user.email);
    }

    // Verify password
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return NextResponse.json(
        { success: false, message: 'Email hoặc mật khẩu không đúng' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Đăng nhập thành công!',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
    return applyAuthCookie(response, token);
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Đã xảy ra lỗi khi đăng nhập',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

