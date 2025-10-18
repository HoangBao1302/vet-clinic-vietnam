import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get all affiliates with potential issues
    const affiliates = await User.find({ 
      affiliateStatus: 'approved',
      affiliateCode: { $exists: true, $ne: null }
    }).select('username email affiliateCode affiliateStatus');

    const affiliateStats = [];

    for (const affiliate of affiliates) {
      // Get stats for each affiliate
      const statsResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/affiliate/track?affiliateCode=${affiliate.affiliateCode}`);
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        
        affiliateStats.push({
          email: affiliate.email,
          username: affiliate.username,
          affiliateCode: affiliate.affiliateCode,
          totalClicks: statsData.stats.totalClicks,
          conversions: statsData.stats.conversions,
          conversionRate: statsData.stats.conversionRate,
          totalCommission: statsData.stats.totalCommission,
          hasIssues: statsData.stats.totalClicks > 0 && statsData.stats.conversions === 0
        });
      }
    }

    // Find affiliates with potential issues
    const problematicAffiliates = affiliateStats.filter(affiliate => affiliate.hasIssues);

    return NextResponse.json({
      success: true,
      totalAffiliates: affiliateStats.length,
      problematicAffiliates: problematicAffiliates.length,
      affiliates: affiliateStats,
      issues: problematicAffiliates
    });

  } catch (error: any) {
    console.error('Monitor affiliates error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
