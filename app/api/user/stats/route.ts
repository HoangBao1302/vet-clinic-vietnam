import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import PaymentRequest from '@/lib/models/PaymentRequest';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 User Stats API called');
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
      console.log('❌ User not found for userId:', decoded.userId);
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    console.log('✅ User found:', user.email);

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

            // Calculate totalCommissionPaid from actual PaymentRequest data
            let totalCommissionPaid = 0;
            try {
              const paidRequests = await PaymentRequest.find({
                userId: user._id,
                status: 'paid'
              });
              
              totalCommissionPaid = paidRequests.reduce((sum, request) => sum + request.amount, 0);
              console.log(`💰 Calculated totalCommissionPaid from PaymentRequest: ${totalCommissionPaid}đ (${paidRequests.length} requests)`);
            } catch (error) {
              console.error('Error calculating totalCommissionPaid:', error);
              totalCommissionPaid = user.totalCommissionPaid || 0;
            }

            // Use existing commission values from user document for earned amount
            let totalCommissionEarned = user.totalCommissionEarned || 0;
            
            console.log(`🔍 Debug commission for ${user.email}:`, {
              earned: totalCommissionEarned,
              paid: totalCommissionPaid,
              affiliateCode: user.affiliateCode,
              affiliateStatus: user.affiliateStatus
            });
            
            // Temporary fix: Restore commission data for specific users (only earned amount)
            const commissionRestoreData: Record<string, { earned: number }> = {
              'hoangkim.helen@gmail.com': { earned: 5000000 },
              'hoangkim@gmail.com': { earned: 5000000 },
              'thuanyen@gmail.com': { earned: 3000000 },
              'kietdangtong@gmail.com': { earned: 8000000 }
            };
            
            const userEmail = user.email as string;
            console.log(`🔍 Checking restoration for email: ${userEmail}`);
            
            const restoreData = commissionRestoreData[userEmail];
            if (restoreData) {
              console.log(`🔧 Restoring commission earned for ${userEmail}: ${restoreData.earned}đ`);
              
              // Update user document for earned amount only
              user.totalCommissionEarned = restoreData.earned;
              await user.save();
              
              // Use restored earned value
              totalCommissionEarned = restoreData.earned;
              
              console.log(`✅ Commission earned restored for ${userEmail}`);
            } else {
              console.log(`❌ No restoration data found for ${userEmail}`);
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
