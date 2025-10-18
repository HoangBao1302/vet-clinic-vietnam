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

    if (!user || !user.affiliateCode) {
      return NextResponse.json(
        { success: false, error: 'User not found or no affiliate code' },
        { status: 404 }
      );
    }

    // Check for clicks without conversions
    const unconvertedClicks = await AffiliateClick.find({
      affiliateCode: user.affiliateCode,
      status: 'clicked'
    });

    if (unconvertedClicks.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No unconverted clicks found',
        conversionsFixed: 0
      });
    }

    // Check if there are any recent payments that should be linked to these clicks
    // This would require integration with payment systems
    // For now, we'll just log the unconverted clicks

    console.log(`🔍 Found ${unconvertedClicks.length} unconverted clicks for ${email}`);

    // In a real scenario, you would:
    // 1. Check payment records for this affiliate
    // 2. Match payments to clicks
    // 3. Update click status to 'converted'
    // 4. Calculate and update commission

    return NextResponse.json({
      success: true,
      message: 'Conversion check completed',
      unconvertedClicks: unconvertedClicks.length,
      clicks: unconvertedClicks.map(click => ({
        id: click._id,
        clickedAt: click.clickedAt,
        productId: click.productId,
        productName: click.productName
      }))
    });

  } catch (error: any) {
    console.error('Auto-fix conversions error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
