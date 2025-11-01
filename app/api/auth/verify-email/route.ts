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
        { 
          success: false, 
          message: 'Link xác thực không hợp lệ hoặc đã hết hạn. Vui lòng đăng ký lại hoặc yêu cầu gửi lại email xác thực.',
          invalidToken: true
        },
        { status: 400 }
      );
    }

    // Check if already verified
    if (user.emailVerified) {
      console.log('✅ Email already verified for user:', user.email);
      // Generate token even if already verified (for auto-login)
      const jwtToken = generateToken({
        userId: user._id.toString(),
        username: user.username,
        email: user.email,
        role: user.role,
      });
      
      return NextResponse.json(
        { 
          success: true, 
          message: 'Email đã được xác thực trước đó',
          alreadyVerified: true,
          token: jwtToken, // Provide token for auto-login
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            emailVerified: true,
          },
        },
        { status: 200 }
      );
    }

    // Verify email - use findOneAndUpdate for atomic operation
    const updatedUser = await User.findOneAndUpdate(
      {
        _id: user._id,
        emailVerificationToken: token,
        emailVerificationExpire: { $gt: new Date() },
        emailVerified: false, // Double check not already verified
      },
      {
        $set: {
          emailVerified: true,
        },
        $unset: {
          emailVerificationToken: '',
          emailVerificationExpire: '',
        },
      },
      {
        new: true, // Return updated document
      }
    );

    if (!updatedUser) {
      // Race condition: another request already verified
      console.log('⚠️ Race condition: Email already verified by another request');
      const alreadyVerifiedUser = await User.findById(user._id);
      if (alreadyVerifiedUser?.emailVerified) {
        const jwtToken = generateToken({
          userId: alreadyVerifiedUser._id.toString(),
          username: alreadyVerifiedUser.username,
          email: alreadyVerifiedUser.email,
          role: alreadyVerifiedUser.role,
        });
        
        return NextResponse.json(
          { 
            success: true, 
            message: 'Email đã được xác thực thành công',
            alreadyVerified: true,
            token: jwtToken,
            user: {
              id: alreadyVerifiedUser._id,
              username: alreadyVerifiedUser.username,
              email: alreadyVerifiedUser.email,
              role: alreadyVerifiedUser.role,
              emailVerified: true,
            },
          },
          { status: 200 }
        );
      }
      
      return NextResponse.json(
        { 
          success: false, 
          message: 'Link xác thực không hợp lệ hoặc đã hết hạn. Email có thể đã được xác thực trước đó hoặc link đã hết hạn (24 giờ). Vui lòng đăng nhập hoặc yêu cầu gửi lại email xác thực.',
          invalidToken: true
        },
        { status: 400 }
      );
    }

    console.log('✅ Email verified for user:', updatedUser.email);

    // Send welcome email AFTER verification (async, don't wait)
    sendEmail({
      to: updatedUser.email,
      subject: '🎉 Chào mừng đến với EA Forex ThebenchmarkTrader!',
      html: getWelcomeEmail(updatedUser.username),
    }).then((welcomeResult) => {
      if (welcomeResult.success) {
        console.log('✅ Welcome email sent successfully to:', updatedUser.email);
      } else {
        console.error('⚠️ Welcome email failed to send to:', updatedUser.email);
      }
    }).catch((emailError) => {
      console.error('❌ Error sending welcome email:', emailError);
      // Non-critical, continue
    });

    // Generate JWT token for auto-login
    const jwtToken = generateToken({
      userId: updatedUser._id.toString(),
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Email đã được xác thực thành công!',
        token: jwtToken,
        user: {
          id: updatedUser._id,
          username: updatedUser.username,
          email: updatedUser.email,
          role: updatedUser.role,
          emailVerified: true,
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

