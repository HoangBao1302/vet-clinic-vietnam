import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { generateResetToken } from '@/lib/auth';
import { sendEmail, getResetPasswordEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Vui lòng cung cấp email' },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      // Return success even if user not found (security best practice)
      return NextResponse.json({
        success: true,
        message:
          'Nếu email tồn tại trong hệ thống, bạn sẽ nhận được link reset mật khẩu',
      });
    }

    // Generate reset token
    const { token, hashedToken } = generateResetToken();

    // Save hashed token and expiry to database
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    // Create reset URL
    const resetUrl = `${
      process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    }/reset-password?token=${token}`;

    // Send email
    const emailResult = await sendEmail({
      to: user.email,
      subject: 'Reset Mật Khẩu - EA Forex ThebenchmarkTrader',
      html: getResetPasswordEmail(resetUrl, user.username),
    });

    if (!emailResult.success) {
      // Remove reset token if email fails
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      return NextResponse.json(
        {
          success: false,
          message: 'Không thể gửi email. Vui lòng thử lại sau',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Email reset mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư',
    });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Đã xảy ra lỗi',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

