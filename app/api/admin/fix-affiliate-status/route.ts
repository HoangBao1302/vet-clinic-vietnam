import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

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

    // Check if user should have affiliate status
    const shouldHaveAffiliate = user.affiliateStatus === 'approved' || user.affiliateStatus === 'pending';

    if (shouldHaveAffiliate && !user.affiliateCode) {
      // Generate affiliate code if missing
      const affiliateCode = `AFF-${user.username.toUpperCase().replace(/\s+/g, '')}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
      
      user.affiliateCode = affiliateCode;
      await user.save();

      console.log(`✅ Generated affiliate code for ${email}: ${affiliateCode}`);

      return NextResponse.json({
        success: true,
        message: 'Affiliate code generated',
        affiliateCode
      });
    }

    // Check if affiliate status is inconsistent
    if (user.affiliateCode && user.affiliateStatus !== 'approved') {
      // If user has affiliate code but status is not approved, check if they should be approved
      // This could be based on other criteria like payment status, etc.
      console.log(`ℹ️ User ${email} has affiliate code but status is ${user.affiliateStatus}`);
    }

    console.log(`✅ Affiliate status check completed for ${email}`);

    return NextResponse.json({
      success: true,
      message: 'Affiliate status check completed',
      user: {
        email: user.email,
        affiliateStatus: user.affiliateStatus,
        affiliateCode: user.affiliateCode
      }
    });

  } catch (error: any) {
    console.error('Fix affiliate status error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
