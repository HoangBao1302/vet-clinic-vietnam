import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AffiliateClick from '@/lib/models/AffiliateClick';
import User from '@/lib/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { customerEmail, productId, orderId } = await request.json();

    if (!customerEmail) {
      return NextResponse.json(
        { success: false, error: 'Customer email is required' },
        { status: 400 }
      );
    }

    console.log('🔍 Testing URL Parameter Fallback:', {
      customerEmail,
      productId,
      orderId
    });

    // Find recent clicks for this customer email (within last 30 days)
    const recentClicks = await AffiliateClick.find({
      customerEmail: customerEmail,
      clickedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // Last 30 days
      status: 'clicked' // Only unconverted clicks
    }).sort({ clickedAt: -1 }).limit(10);

    console.log(`📊 Found ${recentClicks.length} recent clicks for ${customerEmail}`);

    const results = [];

    for (const click of recentClicks) {
      // Find the affiliate user
      const affiliate = await User.findOne({ 
        affiliateCode: click.affiliateCode, 
        affiliateStatus: 'approved' 
      });

      if (affiliate) {
        // Calculate commission
        const commissionRates: Record<string, number> = {
          'ea-full': affiliate.isPaid ? 0.35 : 0.30,
          'ea-pro-source': affiliate.isPaid ? 0.35 : 0.30,
          'indicator-pro': affiliate.isPaid ? 0.35 : 0.30,
          'course': 0.25,
          'social-copy': 0.10,
        };

        const commissionRate = commissionRates[productId] || 0.30;
        const commissionAmount = Math.round(7900000 * commissionRate); // Assuming ea-full price

        results.push({
          clickId: click._id,
          affiliateCode: click.affiliateCode,
          affiliateName: affiliate.username,
          affiliateEmail: affiliate.email,
          clickedAt: click.clickedAt,
          productId: click.productId,
          commissionAmount,
          commissionRate: commissionRate * 100,
          canConvert: true
        });
      }
    }

    return NextResponse.json({
      success: true,
      customerEmail,
      totalClicks: recentClicks.length,
      convertibleClicks: results.length,
      results,
      message: results.length > 0 
        ? `Found ${results.length} convertible clicks for ${customerEmail}`
        : `No convertible clicks found for ${customerEmail}`
    });

  } catch (error: any) {
    console.error('URL Parameter Fallback Test Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
