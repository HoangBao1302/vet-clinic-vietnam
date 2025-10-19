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
        { 
          success: false, 
          canAccessDashboard: false,
          message: 'Không có token xác thực',
          reason: 'no_token'
        },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { 
          success: false, 
          canAccessDashboard: false,
          message: 'Token không hợp lệ',
          reason: 'invalid_token'
        },
        { status: 401 }
      );
    }

    // Get user
    const user = await User.findById(decoded.userId).select(
      'affiliateStatus affiliateCode membershipTier isPaid email username'
    );

    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          canAccessDashboard: false,
          message: 'User không tồn tại',
          reason: 'user_not_found'
        },
        { status: 404 }
      );
    }

    // Check affiliate status
    if (user.affiliateStatus !== 'approved') {
      return NextResponse.json({
        success: false,
        canAccessDashboard: false,
        message: 'Affiliate chưa được duyệt',
        reason: 'affiliate_not_approved',
        affiliateStatus: user.affiliateStatus,
        user: {
          email: user.email,
          username: user.username,
          membershipTier: user.membershipTier,
          isPaid: user.isPaid
        }
      });
    }

    // Check affiliate code
    if (!user.affiliateCode) {
      return NextResponse.json({
        success: false,
        canAccessDashboard: false,
        message: 'Không có mã affiliate',
        reason: 'no_affiliate_code',
        user: {
          email: user.email,
          username: user.username,
          membershipTier: user.membershipTier,
          isPaid: user.isPaid
        }
      });
    }

    // All checks passed
    return NextResponse.json({
      success: true,
      canAccessDashboard: true,
      message: 'Có thể truy cập dashboard',
      user: {
        email: user.email,
        username: user.username,
        affiliateStatus: user.affiliateStatus,
        affiliateCode: user.affiliateCode,
        membershipTier: user.membershipTier,
        isPaid: user.isPaid
      }
    });

  } catch (error: any) {
    console.error('Check affiliate access error:', error);
    return NextResponse.json(
      { 
        success: false, 
        canAccessDashboard: false,
        message: 'Lỗi server', 
        error: error.message,
        reason: 'server_error'
      },
      { status: 500 }
    );
  }
}