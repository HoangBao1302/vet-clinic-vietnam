import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import AffiliateClick from '@/lib/models/AffiliateClick';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Force refresh user data by updating lastLoginAt
    user.lastLoginAt = new Date();
    await user.save();

    // Get fresh user data
    const refreshedUser = await User.findById(user._id).select(
      'username email affiliateStatus affiliateCode membershipTier isPaid totalCommissionEarned totalCommissionPaid'
    );

    console.log(`✅ User data refreshed for ${email}:`, {
      affiliateStatus: refreshedUser.affiliateStatus,
      affiliateCode: refreshedUser.affiliateCode,
      isPaid: refreshedUser.isPaid
    });

    return NextResponse.json({
      success: true,
      message: 'User data refreshed successfully',
      user: refreshedUser
    });

  } catch (error: any) {
    console.error('Refresh user data error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
