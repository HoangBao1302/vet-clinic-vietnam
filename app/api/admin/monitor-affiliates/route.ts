import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import AffiliateClick from '@/lib/models/AffiliateClick';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get all affiliates with potential issues
    const affiliates = await User.find({ 
      affiliateStatus: 'approved',
      affiliateCode: { $exists: true, $ne: null }
    }).select('username email affiliateCode affiliateStatus totalCommissionEarned totalCommissionPaid');

    const affiliateStats = [];
    const issues = [];

    for (const affiliate of affiliates) {
      // Get affiliate clicks and conversions
      const clicks = await AffiliateClick.find({ affiliateCode: affiliate.affiliateCode });
      
      const totalClicks = clicks.length;
      const conversions = clicks.filter(click => click.status === 'converted').length;
      const totalCommission = clicks.reduce((sum, click) => sum + (click.commissionAmount || 0), 0);
      const conversionRate = totalClicks > 0 ? (conversions / totalClicks * 100).toFixed(2) : 0;
      
      // Check for potential issues
      const hasIssues = totalClicks > 0 && conversions === 0;
      const hasDataInconsistency = affiliate.totalCommissionEarned !== totalCommission;
      
      if (hasIssues || hasDataInconsistency) {
        issues.push({
          email: affiliate.email,
          username: affiliate.username,
          affiliateCode: affiliate.affiliateCode,
          issue: hasIssues ? 'No conversions despite clicks' : 'Data inconsistency',
          totalClicks,
          conversions,
          totalCommission,
          userCommissionEarned: affiliate.totalCommissionEarned || 0
        });
      }
      
      affiliateStats.push({
        email: affiliate.email,
        username: affiliate.username,
        affiliateCode: affiliate.affiliateCode,
        totalClicks,
        conversions,
        conversionRate: `${conversionRate}%`,
        totalCommission,
        userCommissionEarned: affiliate.totalCommissionEarned || 0,
        hasIssues,
        hasDataInconsistency
      });
    }

    return NextResponse.json({
      success: true,
      totalAffiliates: affiliateStats.length,
      problematicAffiliates: issues.length,
      affiliates: affiliateStats,
      issues: issues,
      summary: {
        totalClicks: affiliateStats.reduce((sum, a) => sum + a.totalClicks, 0),
        totalConversions: affiliateStats.reduce((sum, a) => sum + a.conversions, 0),
        totalCommission: affiliateStats.reduce((sum, a) => sum + a.totalCommission, 0)
      }
    });

  } catch (error: any) {
    console.error('Monitor affiliates error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
