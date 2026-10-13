import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { requireUser } from '@/lib/requestAuth';

export async function POST(request: NextRequest) {
  try {
    const auth = requireUser(request);
    if (!auth.authorized) return auth.response;

    await connectDB();

    const user = await User.findById(auth.user.userId).select('-password');
    
    if (!user) {
      return NextResponse.json(
        { message: 'User không tồn tại' },
        { status: 404 }
      );
    }

    // Return fresh user data
    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        role: user.role,
        isPaid: user.isPaid,
        membershipTier: user.membershipTier,
        affiliateStatus: user.affiliateStatus,
        affiliateCode: user.affiliateCode,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });

  } catch (error: any) {
    console.error('Refresh user data error:', error);
    return NextResponse.json(
      { message: 'Lỗi server: ' + error.message },
      { status: 500 }
    );
  }
}
