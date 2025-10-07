import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
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

    // Check if user is admin
    const adminUser = await User.findById(decoded.userId);
    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json(
        { message: 'Không có quyền truy cập' },
        { status: 403 }
      );
    }

    // Get newsletter subscribers (premium users who subscribed)
    const subscribers = await User.find({
      isPaid: true,
      newsletterSubscribed: true
    }).select('username email newsletterSubscribedAt newsletterEmail').sort({ newsletterSubscribedAt: -1 });

    const formattedSubscribers = subscribers.map(user => ({
      id: user._id.toString(),
      email: user.newsletterEmail || user.email,
      username: user.username,
      subscribedAt: user.newsletterSubscribedAt,
      isActive: user.newsletterSubscribed
    }));

    return NextResponse.json({
      success: true,
      subscribers: formattedSubscribers
    });

  } catch (error: any) {
    console.error('Error fetching newsletter subscribers:', error);
    return NextResponse.json(
      { message: 'Lỗi server', error: error.message },
      { status: 500 }
    );
  }
}
