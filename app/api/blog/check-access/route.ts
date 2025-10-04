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
        { message: 'Không có token xác thực', canAccess: false },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { message: 'Token không hợp lệ', canAccess: false },
        { status: 401 }
      );
    }

    // Get user
    const user = await User.findById(decoded.userId);

    if (!user) {
      return NextResponse.json(
        { message: 'User không tồn tại', canAccess: false },
        { status: 404 }
      );
    }

    // Paid members always have access
    if (user.isPaid) {
      return NextResponse.json({
        canAccess: true,
        isPaid: true,
        unlimited: true,
      });
    }

    // Check if need to reset monthly counter
    const now = new Date();
    const lastReset = new Date(user.lastPremiumPostReset);
    const daysSinceReset = Math.floor((now.getTime() - lastReset.getTime()) / (1000 * 60 * 60 * 24));

    if (daysSinceReset >= 30) {
      user.premiumPostsReadThisMonth = 0;
      user.lastPremiumPostReset = now;
      await user.save();
    }

    // Free members have 3 posts/month limit
    const canAccess = user.premiumPostsReadThisMonth < 3;

    return NextResponse.json({
      canAccess,
      isPaid: false,
      premiumPostsReadThisMonth: user.premiumPostsReadThisMonth,
      limit: 3,
      remaining: Math.max(0, 3 - user.premiumPostsReadThisMonth),
    });
  } catch (error: any) {
    console.error('Check blog access error:', error);
    return NextResponse.json(
      { message: 'Lỗi server', error: error.message, canAccess: false },
      { status: 500 }
    );
  }
}

