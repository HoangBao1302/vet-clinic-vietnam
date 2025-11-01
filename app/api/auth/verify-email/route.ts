import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { generateToken } from '@/lib/auth';
import { sendEmail, getWelcomeEmail } from '@/lib/email';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Token không hợp lệ' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find user with valid token
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpire: { $gt: new Date() }, // Token not expired
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Token không hợp lệ hoặc đã hết hạn' },
        { status: 400 }
      );
    }

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { 
          success: true, 
          message: 'Email đã được xác thực trước đó',
          alreadyVerified: true
        },
        { status: 200 }
      );
    }

    // Verify email
    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;
    await user.save();

    console.log('✅ Email verified for user:', user.email);

    // Send welcome email AFTER verification
    try {
      const welcomeResult = await sendEmail({
        to: user.email,
        subject: '🎉 Chào mừng đến với EA Forex ThebenchmarkTrader!',
        html: getWelcomeEmail(user.username),
      });

      if (welcomeResult.success) {
        console.log('✅ Welcome email sent successfully to:', user.email);
      } else {
        console.error('⚠️ Welcome email failed to send to:', user.email);
      }
    } catch (emailError) {
      console.error('❌ Error sending welcome email:', emailError);
      // Non-critical, continue
    }

    // Generate JWT token for auto-login
    const jwtToken = generateToken({
      userId: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Email đã được xác thực thành công!',
        token: jwtToken,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          emailVerified: user.emailVerified,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Verify email error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Đã xảy ra lỗi khi xác thực email',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

