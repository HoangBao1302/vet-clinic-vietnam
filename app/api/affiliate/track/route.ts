import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AffiliateClick from '@/lib/models/AffiliateClick';
import User from '@/lib/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { affiliateCode, productId, productName } = await request.json();

    if (!affiliateCode) {
      return NextResponse.json(
        { success: false, error: 'Affiliate code is required' },
        { status: 400 }
      );
    }

    // Verify affiliate code exists and is approved
    const affiliate = await User.findOne({ 
      affiliateCode, 
      affiliateStatus: 'approved' 
    });

    if (!affiliate) {
      return NextResponse.json(
        { success: false, error: 'Invalid or unapproved affiliate code' },
        { status: 400 }
      );
    }

    // Get client IP
    const ipAddress = 
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      request.headers.get('cf-connecting-ip') ||
      'unknown';

    // Get user agent
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Get referrer
    const referrer = request.headers.get('referer') || 'direct';

    // Create affiliate click record
    const click = await AffiliateClick.create({
      affiliateCode,
      ipAddress,
      userAgent,
      referrer,
      productId,
      productName,
      status: 'clicked',
    });

    // Set cookie for 30 days to track conversion
    const cookieValue = `${affiliateCode}:${click._id}`;
    const cookieExpiry = new Date();
    cookieExpiry.setDate(cookieExpiry.getDate() + 30);

    const response = NextResponse.json({
      success: true,
      clickId: click._id,
      message: 'Affiliate click tracked successfully',
    });

    // Set cookie
    response.cookies.set('affiliate', cookieValue, {
      expires: cookieExpiry,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return response;
  } catch (error: any) {
    console.error('Affiliate click tracking error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const affiliateCode = searchParams.get('affiliateCode');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!affiliateCode) {
      return NextResponse.json(
        { success: false, error: 'Affiliate code is required' },
        { status: 400 }
      );
    }

    // Build query
    const query: any = { affiliateCode };

    if (startDate && endDate) {
      query.clickedAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Get clicks
    const clicks = await AffiliateClick.find(query)
      .sort({ clickedAt: -1 })
      .limit(100);

    // Get stats
    const stats = await AffiliateClick.aggregate([
      { $match: { affiliateCode } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalCommission: { $sum: '$commissionAmount' },
        },
      },
    ]);

    const totalClicks = clicks.length;
    const conversions = clicks.filter(c => c.status === 'converted' || c.status === 'paid').length;
    const conversionRate = totalClicks > 0 ? (conversions / totalClicks * 100).toFixed(2) : 0;
    const totalCommission = stats.reduce((sum, stat) => sum + (stat.totalCommission || 0), 0);

    return NextResponse.json({
      success: true,
      clicks,
      stats: {
        totalClicks,
        conversions,
        conversionRate: parseFloat(conversionRate.toString()),
        totalCommission,
        breakdown: stats,
      },
    });
  } catch (error: any) {
    console.error('Get affiliate stats error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
