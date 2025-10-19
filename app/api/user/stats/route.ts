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

    // Use existing commission values from user document (restore original logic)
    let totalCommissionEarned = user.totalCommissionEarned || 0;
    let totalCommissionPaid = user.totalCommissionPaid || 0;
    
    // Optional: Try to sync with AffiliateClick data if user document values are 0
    if (user.affiliateCode && (totalCommissionEarned === 0 || totalCommissionPaid === 0)) {
      try {
        const AffiliateClick = require('@/lib/models/AffiliateClick').default;
        
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
          const realTimeEarned = commissionStats[0].totalEarned || 0;
          const realTimePaid = commissionStats[0].totalPaid || 0;
          
          // Use real-time data if user document is 0
          if (totalCommissionEarned === 0 && realTimeEarned > 0) {
            totalCommissionEarned = realTimeEarned;
          }
          if (totalCommissionPaid === 0 && realTimePaid > 0) {
            totalCommissionPaid = realTimePaid;
          }
        }
        
        console.log('Commission sync for', user.email, ':', {
          affiliateCode: user.affiliateCode,
          userDocument: { earned: user.totalCommissionEarned, paid: user.totalCommissionPaid },
          realTime: { earned: totalCommissionEarned, paid: totalCommissionPaid }
        });
      } catch (error) {
        console.error('Error syncing commission:', error);
        // Keep original values
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
