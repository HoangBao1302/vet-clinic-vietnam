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

    const { productId, productName, baseUrl } = await request.json();

    // Get user
    const user = await User.findById(decoded.userId);

    if (!user) {
      return NextResponse.json(
        { message: 'User không tồn tại' },
        { status: 404 }
      );
    }

    // Check if user is approved affiliate
    if (user.affiliateStatus !== 'approved' || !user.affiliateCode) {
      return NextResponse.json(
        { message: 'Bạn chưa được duyệt làm affiliate' },
        { status: 400 }
      );
    }

    // Generate tracking link
    const trackingParams = new URLSearchParams({
      affiliate: user.affiliateCode,
      product: productId || 'general',
    });

    const trackingLink = `${baseUrl || process.env.NEXT_PUBLIC_BASE_URL || 'https://thebenchmarktrader.com'}?${trackingParams.toString()}`;

    // Commission rates based on membership tier
    const commissionRates = {
      'ea-full': user.isPaid ? 0.35 : 0.30, // 35% for paid members, 30% for free
      'ea-pro-source': user.isPaid ? 0.35 : 0.30,
      'indicator-pro': user.isPaid ? 0.35 : 0.30,
      'course': 0.25, // 25% for courses
      'social-copy': 0.10, // 10% for social copy (recurring)
    };

    const commissionRate = commissionRates[productId as keyof typeof commissionRates] || 0.30;

    return NextResponse.json({
      success: true,
      trackingLink,
      affiliateCode: user.affiliateCode,
      commissionRate: commissionRate * 100, // Return as percentage
      productId,
      productName,
      membershipTier: user.membershipTier,
      isPaid: user.isPaid,
    });
  } catch (error: any) {
    console.error('Generate tracking link error:', error);
    return NextResponse.json(
      { message: 'Lỗi server', error: error.message },
      { status: 500 }
    );
  }
}

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
    const user = await User.findById(decoded.userId);

    if (!user) {
      return NextResponse.json(
        { message: 'User không tồn tại' },
        { status: 404 }
      );
    }

    // Check if user is approved affiliate
    if (user.affiliateStatus !== 'approved' || !user.affiliateCode) {
      return NextResponse.json(
        { message: 'Bạn chưa được duyệt làm affiliate' },
        { status: 400 }
      );
    }

    // Predefined products with their info
    const products = [
      {
        id: 'ea-full',
        name: 'EA ThebenchmarkTrader Full Version',
        price: 7900000,
        commissionRate: user.isPaid ? 35 : 30,
        description: 'Phiên bản đầy đủ cho tài khoản thực',
      },
      {
        id: 'ea-pro-source',
        name: 'EA ThebenchmarkTrader Pro + Source Code',
        price: 14900000,
        commissionRate: user.isPaid ? 35 : 30,
        description: 'Phiên bản Pro với source code đầy đủ',
      },
      {
        id: 'indicator-pro',
        name: 'Multi-Indicator Pro Pack',
        price: 1990000,
        commissionRate: user.isPaid ? 35 : 30,
        description: 'Bộ 10 indicators chuyên nghiệp',
      },
      {
        id: 'course',
        name: 'Khóa Học Forex Trading',
        price: 5000000,
        commissionRate: 25,
        description: 'Khóa học trading từ cơ bản đến nâng cao',
      },
      {
        id: 'social-copy',
        name: 'Copy Social Trading',
        price: 2000000,
        commissionRate: 10,
        description: 'Copy trades từ trader chuyên nghiệp (recurring)',
      },
    ];

    // Generate tracking links for all products
    const trackingLinks = products.map(product => {
      const trackingParams = new URLSearchParams({
        affiliate: user.affiliateCode,
        product: product.id,
      });

      const trackingLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://thebenchmarktrader.com'}?${trackingParams.toString()}`;

      return {
        ...product,
        trackingLink,
        estimatedCommission: Math.round(product.price * product.commissionRate / 100),
      };
    });

    return NextResponse.json({
      success: true,
      affiliateCode: user.affiliateCode,
      membershipTier: user.membershipTier,
      isPaid: user.isPaid,
      products: trackingLinks,
    });
  } catch (error: any) {
    console.error('Get tracking links error:', error);
    return NextResponse.json(
      { message: 'Lỗi server', error: error.message },
      { status: 500 }
    );
  }
}
