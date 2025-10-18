import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AffiliateClick from '@/lib/models/AffiliateClick';
import User from '@/lib/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { affiliateCode, orderId, productId, productName, amount, customerEmail, customerName } = await request.json();

    if (!affiliateCode || !orderId) {
      return NextResponse.json(
        { success: false, error: 'Affiliate code and order ID are required' },
        { status: 400 }
      );
    }

    // Find the affiliate user
    const affiliate = await User.findOne({ 
      affiliateCode, 
      affiliateStatus: 'approved' 
    });

    if (!affiliate) {
      return NextResponse.json(
        { success: false, error: 'Affiliate not found or not approved' },
        { status: 404 }
      );
    }

    // Calculate commission
    const commissionRates: Record<string, number> = {
      'ea-full': affiliate.isPaid ? 0.35 : 0.30,
      'ea-pro-source': affiliate.isPaid ? 0.35 : 0.30,
      'indicator-pro': affiliate.isPaid ? 0.35 : 0.30,
      'course': 0.25,
      'social-copy': 0.10,
    };

    const commissionRate = commissionRates[productId] || 0.30;
    const commissionAmount = Math.round(amount * commissionRate);

    // Find the most recent unconverted click
    const unconvertedClick = await AffiliateClick.findOne({
      affiliateCode,
      status: 'clicked'
    }).sort({ clickedAt: -1 });

    if (unconvertedClick) {
      // Update existing click
      unconvertedClick.status = 'converted';
      unconvertedClick.convertedAt = new Date();
      unconvertedClick.orderId = orderId;
      unconvertedClick.commissionAmount = commissionAmount;
      unconvertedClick.productId = productId;
      unconvertedClick.productName = productName || 'Unknown Product';
      unconvertedClick.customerEmail = customerEmail;
      unconvertedClick.customerName = customerName;
      
      await unconvertedClick.save();

      console.log('✅ Updated existing click:', {
        clickId: unconvertedClick._id,
        affiliateCode,
        orderId,
        commissionAmount
      });
    } else {
      // Create new conversion record
      const newClick = await AffiliateClick.create({
        affiliateCode,
        clickedAt: new Date(),
        convertedAt: new Date(),
        orderId,
        commissionAmount,
        productId,
        productName: productName || 'Unknown Product',
        customerEmail,
        customerName,
        status: 'converted',
        ipAddress: 'manual',
        userAgent: 'manual',
        referrer: 'manual'
      });

      console.log('✅ Created new conversion record:', {
        clickId: newClick._id,
        affiliateCode,
        orderId,
        commissionAmount
      });
    }

    // Update user's total commission earned
    affiliate.totalCommissionEarned = (affiliate.totalCommissionEarned || 0) + commissionAmount;
    await affiliate.save();

    console.log('✅ Updated affiliate commission:', {
      affiliateCode,
      commissionAmount,
      totalEarned: affiliate.totalCommissionEarned
    });

    return NextResponse.json({
      success: true,
      message: 'Conversion recorded successfully',
      data: {
        affiliateCode,
        orderId,
        commissionAmount,
        totalEarned: affiliate.totalCommissionEarned
      }
    });

  } catch (error: any) {
    console.error('Manual conversion error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const affiliateCode = searchParams.get('affiliateCode');

    if (!affiliateCode) {
      return NextResponse.json(
        { success: false, error: 'Affiliate code is required' },
        { status: 400 }
      );
    }

    // Get all clicks for this affiliate
    const clicks = await AffiliateClick.find({ affiliateCode })
      .sort({ clickedAt: -1 });

    // Get affiliate user info
    const affiliate = await User.findOne({ affiliateCode })
      .select('username email affiliateStatus isPaid totalCommissionEarned totalCommissionPaid');

    return NextResponse.json({
      success: true,
      affiliate,
      clicks,
      summary: {
        totalClicks: clicks.length,
        conversions: clicks.filter(c => c.status === 'converted').length,
        totalCommission: clicks.reduce((sum, c) => sum + (c.commissionAmount || 0), 0)
      }
    });

  } catch (error: any) {
    console.error('Get affiliate data error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}