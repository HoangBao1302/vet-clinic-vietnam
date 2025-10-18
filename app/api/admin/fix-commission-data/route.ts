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

    // Calculate correct totalCommissionEarned from AffiliateClick records
    const AffiliateClick = require('@/lib/models/AffiliateClick').default;
    const clicks = await AffiliateClick.find({ 
      affiliateCode: user.affiliateCode,
      status: 'converted'
    });

    const calculatedCommission = clicks.reduce((sum: number, click: any) => sum + (click.commissionAmount || 0), 0);
    
    // Update user's totalCommissionEarned
    const oldCommission = user.totalCommissionEarned || 0;
    user.totalCommissionEarned = calculatedCommission;
    await user.save();

    console.log(`✅ Fixed commission data for ${email}:`, {
      oldCommission,
      newCommission: calculatedCommission,
      clicksCount: clicks.length
    });

    return NextResponse.json({
      success: true,
      message: 'Commission data fixed successfully',
      user: {
        email: user.email,
        affiliateCode: user.affiliateCode,
        oldCommissionEarned: oldCommission,
        newCommissionEarned: calculatedCommission,
        clicksCount: clicks.length
      }
    });

  } catch (error: any) {
    console.error('Fix commission data error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
