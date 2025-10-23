import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AffiliateClick from '@/lib/models/AffiliateClick';
import User from '@/lib/models/User';

// Automated monitoring system for affiliate tracking issues
export async function GET(request: NextRequest) {
  try {
    const db = await connectDB();
    
    if (!db) {
      return NextResponse.json({
        success: true,
        message: 'Database not available - returning empty data',
        data: []
      });
    }

    console.log('🔍 Running automated affiliate monitoring...');

    const monitoringResults = await performComprehensiveMonitoring();

    return NextResponse.json({
      success: true,
      message: 'Monitoring completed',
      data: monitoringResults,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Monitoring System Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Comprehensive monitoring function
async function performComprehensiveMonitoring() {
  const results = {
    summary: {
      totalClicks: 0,
      totalConversions: 0,
      totalCommission: 0,
      conversionRate: 0,
      issuesFound: 0,
      recommendations: [] as Array<{
        type: string;
        priority: string;
        title: string;
        description: string;
        action: string;
      }>
    },
    issues: [] as Array<{
      type: string;
      severity: string;
      clickId?: any;
      affiliateCode?: string;
      productId?: string;
      hoursSinceClick?: number;
      recommendation?: string;
    }>,
    performance: {} as any,
    recommendations: [] as Array<{
      type: string;
      priority: string;
      title: string;
      description: string;
      action: string;
    }>
  };

  // 1. Check for orphaned clicks (clicks without conversions)
  const orphanedClicks = await AffiliateClick.find({
    status: 'clicked',
    clickedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
  }).sort({ clickedAt: -1 });

  console.log(`📊 Found ${orphanedClicks.length} orphaned clicks in last 7 days`);

  for (const click of orphanedClicks) {
    const timeSinceClick = Date.now() - new Date(click.clickedAt).getTime();
    const hoursSinceClick = timeSinceClick / (1000 * 60 * 60);

    if (hoursSinceClick > 24) { // More than 24 hours old
      results.issues.push({
        type: 'orphaned_click',
        severity: 'medium',
        clickId: click._id,
        affiliateCode: click.affiliateCode,
        productId: click.productId,
        hoursSinceClick: Math.round(hoursSinceClick),
        recommendation: 'Check if customer made purchase without proper tracking'
      });
    }
  }

  // 2. Check for potential correlations
  const potentialCorrelations = await findPotentialCorrelations();
  results.issues.push(...potentialCorrelations);

  // 3. Performance analysis
  const performanceAnalysis = await analyzePerformance();
  results.performance = performanceAnalysis;

  // 4. Generate recommendations
  const recommendations = await generateRecommendations(results);
  results.recommendations = recommendations;

  // 5. Calculate summary statistics
  const allClicks = await AffiliateClick.find({
    clickedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
  });

  const convertedClicks = allClicks.filter(click => click.status === 'converted');
  const totalCommission = convertedClicks.reduce((sum, click) => sum + (click.commissionAmount || 0), 0);

  results.summary = {
    totalClicks: allClicks.length,
    totalConversions: convertedClicks.length,
    totalCommission: totalCommission,
    conversionRate: allClicks.length > 0 ? (convertedClicks.length / allClicks.length) * 100 : 0,
    issuesFound: results.issues.length,
    recommendations: recommendations
  };

  console.log('📊 Monitoring Results:', results.summary);

  return results;
}

// Find potential correlations between orders and clicks
async function findPotentialCorrelations(): Promise<Array<{
  type: string;
  severity: string;
  clickId?: any;
  affiliateCode?: string;
  productId?: string;
  hoursSinceClick?: number;
  recommendation?: string;
}>> {
  const issues: Array<{
    type: string;
    severity: string;
    clickId?: any;
    affiliateCode?: string;
    productId?: string;
    hoursSinceClick?: number;
    recommendation?: string;
  }> = [];

  // This would implement logic to find orders that might be correlated with clicks
  // For now, return empty array as it requires more complex implementation
  
  return issues;
}

// Analyze affiliate performance
async function analyzePerformance(): Promise<{
  topPerformers: Array<{
    affiliateCode: string;
    username: string;
    conversionRate: number;
    totalCommission: number;
  }>;
  underPerformers: Array<{
    affiliateCode: string;
    username: string;
    conversionRate: number;
    totalCommission: number;
    clicks: number;
  }>;
  conversionRates: Record<string, number>;
  commissionTotals: Record<string, number>;
}> {
  const performance: {
    topPerformers: Array<{
      affiliateCode: string;
      username: string;
      conversionRate: number;
      totalCommission: number;
    }>;
    underPerformers: Array<{
      affiliateCode: string;
      username: string;
      conversionRate: number;
      totalCommission: number;
      clicks: number;
    }>;
    conversionRates: Record<string, number>;
    commissionTotals: Record<string, number>;
  } = {
    topPerformers: [],
    underPerformers: [],
    conversionRates: {},
    commissionTotals: {}
  };

  // Get all affiliates
  const affiliates = await User.find({
    affiliateStatus: 'approved',
    affiliateCode: { $exists: true }
  });

  for (const affiliate of affiliates) {
    const clicks = await AffiliateClick.find({
      affiliateCode: affiliate.affiliateCode,
      clickedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
    });

    const conversions = clicks.filter(click => click.status === 'converted');
    const totalCommission = conversions.reduce((sum, click) => sum + (click.commissionAmount || 0), 0);
    const conversionRate = clicks.length > 0 ? (conversions.length / clicks.length) * 100 : 0;

    performance.conversionRates[affiliate.affiliateCode] = conversionRate;
    performance.commissionTotals[affiliate.affiliateCode] = totalCommission;

    if (conversionRate >= 20) {
      performance.topPerformers.push({
        affiliateCode: affiliate.affiliateCode,
        username: affiliate.username,
        conversionRate: conversionRate,
        totalCommission: totalCommission
      });
    } else if (conversionRate < 5 && clicks.length > 5) {
      performance.underPerformers.push({
        affiliateCode: affiliate.affiliateCode,
        username: affiliate.username,
        conversionRate: conversionRate,
        totalCommission: totalCommission,
        clicks: clicks.length
      });
    }
  }

  return performance;
}

// Generate recommendations based on monitoring results
async function generateRecommendations(results: {
  issues: Array<{
    type: string;
    severity: string;
    clickId?: any;
    affiliateCode?: string;
    productId?: string;
    hoursSinceClick?: number;
    recommendation?: string;
  }>;
  performance: {
    topPerformers: Array<{
      affiliateCode: string;
      username: string;
      conversionRate: number;
      totalCommission: number;
    }>;
    underPerformers: Array<{
      affiliateCode: string;
      username: string;
      conversionRate: number;
      totalCommission: number;
      clicks: number;
    }>;
    conversionRates: Record<string, number>;
    commissionTotals: Record<string, number>;
  };
}): Promise<Array<{
  type: string;
  priority: string;
  title: string;
  description: string;
  action: string;
}>> {
  const recommendations: Array<{
    type: string;
    priority: string;
    title: string;
    description: string;
    action: string;
  }> = [];

  // Recommendation based on orphaned clicks
  if (results.issues.filter((issue: any) => issue.type === 'orphaned_click').length > 0) {
    recommendations.push({
      type: 'tracking_improvement',
      priority: 'high',
      title: 'Improve Click-to-Order Correlation',
      description: 'Multiple orphaned clicks detected. Consider implementing session-based tracking.',
      action: 'Implement enhanced tracking system with session IDs'
    });
  }

  // Recommendation based on conversion rates
  if (results.performance.underPerformers && results.performance.underPerformers.length > 0) {
    recommendations.push({
      type: 'performance_improvement',
      priority: 'medium',
      title: 'Support Underperforming Affiliates',
      description: `${results.performance.underPerformers.length} affiliates have low conversion rates.`,
      action: 'Provide training and support to improve performance'
    });
  }

  // Recommendation based on system issues
  if (results.issues.length > 5) {
    recommendations.push({
      type: 'system_improvement',
      priority: 'high',
      title: 'System Optimization Needed',
      description: 'Multiple tracking issues detected. System needs optimization.',
      action: 'Review and optimize tracking system'
    });
  }

  return recommendations;
}
