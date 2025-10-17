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

    // Get user
    const user = await User.findById(decoded.userId).select('username email affiliateStatus affiliateCode membershipTier isPaid');

    if (!user) {
      return NextResponse.json(
        { message: 'User không tồn tại' },
        { status: 404 }
      );
    }

    // Check affiliate status
    const canAccessDashboard = user.affiliateStatus === 'approved' && user.affiliateCode;

    return NextResponse.json({
      success: true,
      user: {
        username: user.username,
        email: user.email,
        affiliateStatus: user.affiliateStatus,
        affiliateCode: user.affiliateCode,
        membershipTier: user.membershipTier,
        isPaid: user.isPaid,
      },
      canAccessDashboard,
      reason: !canAccessDashboard ? 
        (user.affiliateStatus !== 'approved' ? 'Affiliate not approved' : 'No affiliate code') : 
        'Can access dashboard'
    });

  } catch (error: any) {
    console.error('Error checking affiliate access:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
