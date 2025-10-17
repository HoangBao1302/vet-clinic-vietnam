import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import AffiliateClick from '@/lib/models/AffiliateClick';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get all approved affiliates
    const approvedAffiliates = await User.find({ 
      affiliateStatus: 'approved',
      affiliateCode: { $exists: true, $ne: null }
    }).select('username email affiliateCode membershipTier isPaid createdAt');

    if (approvedAffiliates.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No approved affiliates found',
        affiliates: []
      });
    }

    // Get stats for each affiliate
    const affiliatesWithStats = await Promise.all(
      approvedAffiliates.map(async (affiliate) => {
        const clicks = await AffiliateClick.find({ affiliateCode: affiliate.affiliateCode });
        const conversions = clicks.filter(c => c.status === 'converted' || c.status === 'paid');
        const totalCommission = clicks.reduce((sum, c) => sum + (c.commissionAmount || 0), 0);

        return {
          ...affiliate.toObject(),
          stats: {
            totalClicks: clicks.length,
            conversions: conversions.length,
            conversionRate: clicks.length > 0 ? (conversions.length / clicks.length * 100).toFixed(1) : 0,
            totalCommission
          }
        };
      })
    );

    return NextResponse.json({
      success: true,
      affiliates: affiliatesWithStats,
      count: approvedAffiliates.length
    });

  } catch (error: any) {
    console.error('Error getting approved affiliates:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
