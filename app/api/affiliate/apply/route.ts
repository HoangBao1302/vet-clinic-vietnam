import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { verifyToken } from '@/lib/auth';
import crypto from 'crypto';

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

    const {
      fullName,
      phone,
      company,
      website,
      experience,
      audience,
      promochannel,
      reason,
    } = await request.json();

    // Get user
    const user = await User.findById(decoded.userId);

    if (!user) {
      return NextResponse.json(
        { message: 'User không tồn tại' },
        { status: 404 }
      );
    }

    // Check if already applied
    if (user.affiliateStatus && user.affiliateStatus !== 'none' && user.affiliateStatus !== 'rejected') {
      return NextResponse.json(
        { message: 'Bạn đã đăng ký affiliate rồi' },
        { status: 400 }
      );
    }

    // Generate unique affiliate code
    const affiliateCode = `AFF-${user.username.toUpperCase()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

    // Update user
    user.affiliateStatus = 'pending';
    user.affiliateCode = affiliateCode;
    
    // Store application data (you might want to create a separate AffiliateApplication model)
    // For now, we'll just update the user status
    
    await user.save();

    // TODO: Send email notification to admin about new affiliate application
    // TODO: Send confirmation email to user

    return NextResponse.json({
      message: 'Đăng ký thành công',
      affiliateStatus: 'pending',
      affiliateCode,
    });
  } catch (error: any) {
    console.error('Affiliate apply error:', error);
    return NextResponse.json(
      { message: 'Lỗi server', error: error.message },
      { status: 500 }
    );
  }
}

