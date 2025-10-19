import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    await connectDB();

    // Get user stats
    const user = await User.findById(decoded.userId).select(
      'downloadsThisMonth premiumPostsReadThisMonth affiliateStatus affiliateCode membershipTier isPaid totalPostsRead readingTimeMinutes favoriteCategories lastReadDate totalCommissionEarned totalCommissionPaid'
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Check if need to reset monthly counters
    const now = new Date();
    const lastReset = new Date(user.lastDownloadReset);
    
    if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
      user.downloadsThisMonth = { eaDemo: 0, indicators: 0 };
      user.premiumPostsReadThisMonth = 0;
      user.lastDownloadReset = now;
      user.lastPremiumPostReset = now;
      await user.save();
    }

    // Calculate real-time commission from affiliate clicks
    let totalCommissionEarned = 0;
    let totalCommissionPaid = 0;
    
    if (user.affiliateCode) {
      try {
        const AffiliateClick = require('@/models/AffiliateClick').default;
        
        // Get total commission earned from all affiliate clicks
        const commissionStats = await AffiliateClick.aggregate([
          { $match: { affiliateCode: user.affiliateCode } },
          {
            $group: {
              _id: null,
              totalEarned: { $sum: '$commissionAmount' },
              totalPaid: { 
                $sum: { 
                  $cond: [
                    { $eq: ['$status', 'paid'] }, 
                    '$commissionAmount', 
                    0
                  ] 
                } 
              }
            }
          }
        ]);
        
        if (commissionStats.length > 0) {
          totalCommissionEarned = commissionStats[0].totalEarned || 0;
          totalCommissionPaid = commissionStats[0].totalPaid || 0;
        }
        
        console.log('Commission calculation for', user.email, ':', {
          affiliateCode: user.affiliateCode,
          totalCommissionEarned,
          totalCommissionPaid
        });
      } catch (error) {
        console.error('Error calculating commission:', error);
        // Fallback to user document values
        totalCommissionEarned = user.totalCommissionEarned || 0;
        totalCommissionPaid = user.totalCommissionPaid || 0;
      }
    }

    return NextResponse.json({
      success: true,
      stats: {
        downloadsThisMonth: user.downloadsThisMonth,
        premiumPostsReadThisMonth: user.premiumPostsReadThisMonth,
        premiumPostsLimit: user.isPaid ? 999 : 3,
        totalPostsRead: user.totalPostsRead || 0,
        readingTimeMinutes: user.readingTimeMinutes || 0,
        favoriteCategories: user.favoriteCategories || [],
        lastReadDate: user.lastReadDate,
        affiliateStatus: user.affiliateStatus,
        affiliateCode: user.affiliateCode,
        membershipTier: user.membershipTier,
        isPaid: user.isPaid,
        totalCommissionEarned,
        totalCommissionPaid,
      },
    });
  } catch (error: any) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json(
      { success: false, message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}
