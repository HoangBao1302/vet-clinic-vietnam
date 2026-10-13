import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { requireUser } from '@/lib/requestAuth';

export async function GET(request: NextRequest) {
  try {
    const auth = requireUser(request);
    if (!auth.authorized) return auth.response;

    const db = await connectDB();
    if (!db) {
      return NextResponse.json({
        success: true,
        userId: auth.user.userId,
        role: auth.user.role,
        user: {
          id: auth.user.userId,
          username: auth.user.username,
          email: auth.user.email,
          role: auth.user.role,
        },
      });
    }

    const user = await User.findById(auth.user.userId).select('-password');
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Token is valid',
      userId: user._id.toString(),
      role: user.role,
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        role: user.role,
        isPaid: user.isPaid,
        membershipTier: user.membershipTier,
        affiliateStatus: user.affiliateStatus,
        affiliateCode: user.affiliateCode,
      },
    });
  } catch (error: any) {
    console.error('Token validation error:', error);
    return NextResponse.json(
      { success: false, message: 'Token validation failed' },
      { status: 500 }
    );
  }
}
