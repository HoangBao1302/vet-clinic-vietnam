import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import AffiliateClick from '@/lib/models/AffiliateClick';

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

    // Get all approved affiliates
    const affiliates = await User.find({ 
      affiliateStatus: 'approved',
      affiliateCode: { $exists: true, $ne: null }
    }).select('username email affiliateCode affiliateStatus createdAt');

    if (affiliates.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No approved affiliates found',
        alerts: [],
        summary: {
          totalAffiliates: 0,
          problematicAffiliates: 0,
          alertsGenerated: 0
        }
      });
    }

    const alerts = [];
    let problematicCount = 0;

    // Analyze each affiliate
    for (const affiliate of affiliates) {
      const clicks = await AffiliateClick.find({ affiliateCode: affiliate.affiliateCode });
      const conversions = clicks.filter(c => c.status === 'converted' || c.status === 'paid');
      const totalCommission = clicks.reduce((sum, c) => sum + (c.commissionAmount || 0), 0);
      const conversionRate = clicks.length > 0 ? (conversions.length / clicks.length * 100) : 0;

      // Check for various issues
      const issues = [];

      // 1. No conversions despite clicks
      if (clicks.length > 0 && conversions.length === 0) {
        issues.push({
          type: 'no_conversions',
          severity: 'high',
          message: `Có ${clicks.length} click nhưng 0 conversion`,
          recommendation: 'Kiểm tra chất lượng traffic và cải thiện landing page'
        });
        problematicCount++;
      }

      // 2. Low conversion rate
      else if (clicks.length >= 3 && conversionRate < 10) {
        issues.push({
          type: 'low_conversion_rate',
          severity: 'medium',
          message: `Conversion rate thấp: ${conversionRate.toFixed(1)}%`,
          recommendation: 'Tối ưu hóa targeting và cải thiện call-to-action'
        });
        problematicCount++;
      }

      // 3. No clicks for new affiliates (older than 7 days)
      const daysSinceCreated = Math.floor((Date.now() - new Date(affiliate.createdAt).getTime()) / (1000 * 60 * 60 * 24));
      if (clicks.length === 0 && daysSinceCreated > 7) {
        issues.push({
          type: 'no_activity',
          severity: 'medium',
          message: `Không có click nào trong ${daysSinceCreated} ngày`,
          recommendation: 'Cần hỗ trợ marketing và training'
        });
        problematicCount++;
      }

      // 4. High clicks but low commission
      if (clicks.length >= 5 && totalCommission < 1000000) {
        issues.push({
          type: 'low_commission',
          severity: 'low',
          message: `${clicks.length} clicks nhưng chỉ kiếm ${totalCommission.toLocaleString('vi-VN')}đ`,
          recommendation: 'Kiểm tra product mix và commission rates'
        });
      }

      // Add alert if there are issues
      if (issues.length > 0) {
        alerts.push({
          affiliate: {
            username: affiliate.username,
            email: affiliate.email,
            affiliateCode: affiliate.affiliateCode,
            daysSinceCreated
          },
          stats: {
            totalClicks: clicks.length,
            conversions: conversions.length,
            conversionRate: parseFloat(conversionRate.toFixed(1)),
            totalCommission,
            userCommissionEarned: affiliate.totalCommissionEarned || 0
          },
          issues,
          priority: issues.some(i => i.severity === 'high') ? 'high' : 
                   issues.some(i => i.severity === 'medium') ? 'medium' : 'low'
        });
      }
    }

    // Sort alerts by priority
    alerts.sort((a, b) => {
      const priorityOrder: { [key: string]: number } = { high: 3, medium: 2, low: 1 };
      return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
    });

    // Generate summary recommendations
    const recommendations = [];
    
    const highPriorityAlerts = alerts.filter(a => a.priority === 'high');
    if (highPriorityAlerts.length > 0) {
      recommendations.push({
        type: 'urgent',
        message: `${highPriorityAlerts.length} affiliate cần hỗ trợ ngay`,
        action: 'Gửi email coaching và cung cấp marketing materials'
      });
    }

    const noConversionAlerts = alerts.filter(a => a.issues.some(i => i.type === 'no_conversions'));
    if (noConversionAlerts.length > 0) {
      recommendations.push({
        type: 'training',
        message: `${noConversionAlerts.length} affiliate cần training conversion optimization`,
        action: 'Tổ chức workshop và cung cấp case studies'
      });
    }

    const lowActivityAlerts = alerts.filter(a => a.issues.some(i => i.type === 'no_activity'));
    if (lowActivityAlerts.length > 0) {
      recommendations.push({
        type: 'engagement',
        message: `${lowActivityAlerts.length} affiliate cần tăng cường engagement`,
        action: 'Gửi email motivation và incentive programs'
      });
    }

    return NextResponse.json({
      success: true,
      alerts,
      recommendations,
      summary: {
        totalAffiliates: affiliates.length,
        problematicAffiliates: problematicCount,
        alertsGenerated: alerts.length,
        highPriority: alerts.filter(a => a.priority === 'high').length,
        mediumPriority: alerts.filter(a => a.priority === 'medium').length,
        lowPriority: alerts.filter(a => a.priority === 'low').length
      }
    });

  } catch (error: any) {
    console.error('Error generating affiliate alerts:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
