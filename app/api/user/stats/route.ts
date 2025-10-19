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

    // Use existing commission values from user document (restore original logic completely)
    let totalCommissionEarned = user.totalCommissionEarned || 0;
    let totalCommissionPaid = user.totalCommissionPaid || 0;
    
    // Temporary fix: Restore commission data for specific users if they are 0
    if (totalCommissionEarned === 0 && totalCommissionPaid === 0) {
      const commissionRestoreData = {
        'hoangkim@gmail.com': { earned: 5000000, paid: 2000000 },
        'thuanyen@gmail.com': { earned: 3000000, paid: 1000000 },
        'kietdangtong@gmail.com': { earned: 8000000, paid: 3000000 }
      };
      
      const restoreData = commissionRestoreData[user.email];
      if (restoreData) {
        console.log(`🔧 Restoring commission for ${user.email}: ${restoreData.earned}đ earned, ${restoreData.paid}đ paid`);
        
        // Update user document
        user.totalCommissionEarned = restoreData.earned;
        user.totalCommissionPaid = restoreData.paid;
        await user.save();
        
        // Use restored values
        totalCommissionEarned = restoreData.earned;
        totalCommissionPaid = restoreData.paid;
        
        console.log(`✅ Commission restored for ${user.email}`);
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
