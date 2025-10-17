import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AffiliateClick from '@/lib/models/AffiliateClick';
import User from '@/lib/models/User';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const affiliateCode = searchParams.get('affiliateCode');
    const customerEmail = searchParams.get('customerEmail');

    let query: any = {};

    if (affiliateCode) {
      query.affiliateCode = affiliateCode;
    }

    if (customerEmail) {
      query.customerEmail = { $regex: customerEmail, $options: 'i' };
    }

    // Get recent conversions (last 30 days)
    const recentConversions = await AffiliateClick.find({
      ...query,
      status: { $in: ['converted', 'paid'] },
      convertedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    }).sort({ convertedAt: -1 });

    // Get all clicks for the affiliate
    const allClicks = await AffiliateClick.find({
      affiliateCode: affiliateCode || { $exists: true }
    }).sort({ clickedAt: -1 });

    // Get affiliate info
    const affiliates = await User.find({
      affiliateStatus: 'approved',
      affiliateCode: { $exists: true, $ne: null }
    }).select('username email affiliateCode affiliateStatus membershipTier isPaid');

    return NextResponse.json({
      success: true,
      recentConversions,
      allClicks,
      affiliates,
      summary: {
        totalConversions: recentConversions.length,
        totalClicks: allClicks.length,
        conversionRate: allClicks.length > 0 ? (recentConversions.length / allClicks.length * 100).toFixed(2) : 0
      }
    });

  } catch (error: any) {
    console.error('Error checking conversions:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { orderId, affiliateCode, customerEmail, productId, amount } = await request.json();

    if (!orderId || !affiliateCode) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find the affiliate
    const affiliate = await User.findOne({ 
      affiliateCode, 
      affiliateStatus: 'approved' 
    });

    if (!affiliate) {
      return NextResponse.json(
        { success: false, error: 'Affiliate not found or not approved' },
        { status: 404 }
      );
    }

    // Calculate commission
    const commissionRates = {
      'ea-full': affiliate.isPaid ? 0.35 : 0.30,
      'ea-pro-source': affiliate.isPaid ? 0.35 : 0.30,
      'indicator-pro': affiliate.isPaid ? 0.35 : 0.30,
      'course': 0.25,
      'social-copy': 0.10,
    };

    const commissionRate = commissionRates[productId as keyof typeof commissionRates] || 0.30;
    const commissionAmount = Math.round(amount * commissionRate);

    // Update or create conversion record
    const conversion = await AffiliateClick.findOneAndUpdate(
      { affiliateCode },
      {
        $set: {
          convertedAt: new Date(),
          orderId,
          commissionAmount,
          productId,
          customerEmail,
          status: 'converted',
        },
      },
      { 
        sort: { clickedAt: -1 },
        upsert: true,
        new: true
      }
    );

    return NextResponse.json({
      success: true,
      conversion,
      commissionAmount,
      commissionRate: commissionRate * 100
    });

  } catch (error: any) {
    console.error('Error creating conversion:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
