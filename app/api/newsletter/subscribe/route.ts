import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Get token from header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Không có token xác thực' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { message: 'Token không hợp lệ' },
        { status: 401 }
      );
    }

    // Get request body
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: 'Email là bắt buộc' },
        { status: 400 }
      );
    }

    // Get user
    const user = await User.findById(decoded.userId);

    if (!user) {
      return NextResponse.json(
        { message: 'User không tồn tại' },
        { status: 404 }
      );
    }

    // Check if user is premium
    if (!user.isPaid) {
      return NextResponse.json(
        { message: 'Newsletter premium chỉ dành cho thành viên trả phí' },
        { status: 403 }
      );
    }

    // Check if already subscribed
    if (user.newsletterSubscribed) {
      return NextResponse.json({
        message: 'Bạn đã đăng ký newsletter rồi',
        alreadySubscribed: true
      });
    }

    // Subscribe to newsletter
    user.newsletterSubscribed = true;
    user.newsletterEmail = email;
    user.newsletterSubscribedAt = new Date();
    await user.save();

    // Here you would typically integrate with email service like SendGrid, Mailchimp, etc.
    // For now, we'll just log it
    console.log(`Newsletter subscription: ${email} - User: ${user.username}`);

    return NextResponse.json({
      message: 'Đăng ký newsletter thành công!',
      success: true
    });

  } catch (error: any) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { message: 'Lỗi server', error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    // Get token from header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Không có token xác thực' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { message: 'Token không hợp lệ' },
        { status: 401 }
      );
    }

    // Get user
    const user = await User.findById(decoded.userId);

    if (!user) {
      return NextResponse.json(
        { message: 'User không tồn tại' },
        { status: 404 }
      );
    }

    // Unsubscribe from newsletter
    user.newsletterSubscribed = false;
    user.newsletterEmail = undefined;
    user.newsletterUnsubscribedAt = new Date();
    await user.save();

    return NextResponse.json({
      message: 'Hủy đăng ký newsletter thành công',
      success: true
    });

  } catch (error: any) {
    console.error('Newsletter unsubscription error:', error);
    return NextResponse.json(
      { message: 'Lỗi server', error: error.message },
      { status: 500 }
    );
  }
}
