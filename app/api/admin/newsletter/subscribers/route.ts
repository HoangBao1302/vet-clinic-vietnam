import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { verifyToken } from '@/lib/auth';
import { getRequestToken, requireAdmin } from "@/lib/requestAuth";

export async function GET(request: NextRequest) {
  const auth = requireAdmin(request);
  if (!auth.authorized) return auth.response;

  try {
    const db = await connectDB();
    
    if (!db) {
      return NextResponse.json({
        success: true,
        message: 'Database not available - returning empty data',
        data: []
      });
    }

    // Get token from header
    const token = getRequestToken(request);
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
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
