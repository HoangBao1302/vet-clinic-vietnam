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

    // Get user
    const user = await User.findById(decoded.userId);

    if (!user) {
      return NextResponse.json(
        { message: 'User không tồn tại' },
        { status: 404 }
      );
    }

    // Don't track for paid members
    if (user.isPaid) {
      return NextResponse.json({
        message: 'Paid member - no tracking needed',
        tracked: false,
      });
    }

    // Check if already at limit
    if (user.premiumPostsReadThisMonth >= 3) {
      return NextResponse.json(
        { message: 'Đã đạt giới hạn đọc bài premium' },
        { status: 403 }
      );
    }

    // Get request body for reading analytics
    const body = await request.json();
    const { postId, category, readTimeMinutes } = body;

    // Increment counter
    user.premiumPostsReadThisMonth += 1;
    
    // Update reading analytics
    user.totalPostsRead = (user.totalPostsRead || 0) + 1;
    user.readingTimeMinutes = (user.readingTimeMinutes || 0) + (readTimeMinutes || 5);
    user.lastReadDate = new Date();
    
    // Update favorite categories
    if (category) {
      const currentCategories = user.favoriteCategories || [];
      if (!currentCategories.includes(category)) {
        currentCategories.push(category);
      }
      user.favoriteCategories = currentCategories.slice(0, 10); // Keep only top 10
    }
    
    await user.save();

    return NextResponse.json({
      message: 'Tracked successfully',
      tracked: true,
      premiumPostsReadThisMonth: user.premiumPostsReadThisMonth,
      remaining: Math.max(0, 3 - user.premiumPostsReadThisMonth),
      totalPostsRead: user.totalPostsRead,
      readingTimeMinutes: user.readingTimeMinutes,
    });
  } catch (error: any) {
    console.error('Track blog read error:', error);
    return NextResponse.json(
      { message: 'Lỗi server', error: error.message },
      { status: 500 }
    );
  }
}

