import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AffiliateClick from '@/lib/models/AffiliateClick';
import User from '@/lib/models/User';

export async function POST(request: NextRequest) {
  try {
    const db = await connectDB();
    
    if (!db) {
      return NextResponse.json({
        success: true,
        message: 'Database not available - returning empty data',
        data: []
      });
    }

    const { orderId, customerEmail, customerName, productId, amount, paidAt, ipAddress } = await request.json();

    if (!orderId || !customerEmail || !productId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('🔧 Manual Conversion Fix:', {
      orderId,
      customerEmail,
      customerName,
      productId,
      amount,
      paidAt,
      ipAddress
    });

    // Find matching affiliate click based on time and IP
    const orderTime = new Date(paidAt);
    const timeWindow = 30 * 60 * 1000; // 30 minutes before payment
    
    // Find clicks within time window and same IP
    const matchingClicks = await AffiliateClick.find({
      ipAddress: ipAddress,
      clickedAt: { 
        $gte: new Date(orderTime.getTime() - timeWindow),
        $lte: orderTime
      },
      status: 'clicked',
      productId: productId
    }).sort({ clickedAt: -1 });

    console.log(`📊 Found ${matchingClicks.length} matching clicks`);

    if (matchingClicks.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No matching affiliate clicks found',
        details: {
          timeWindow: `${timeWindow / 60000} minutes`,
          ipAddress,
          productId,
          orderTime: paidAt
        }
      });
    }

    // Use the most recent matching click
    const matchingClick = matchingClicks[0];
    const affiliateCode = matchingClick.affiliateCode;

    console.log(`✅ Using click: ${matchingClick._id} for affiliate: ${affiliateCode}`);

    // Find the affiliate user
    const affiliate = await User.findOne({ 
      affiliateCode, 
      affiliateStatus: 'approved' 
    });

    if (!affiliate) {
      return NextResponse.json({
        success: false,
        error: 'Affiliate not found or not approved',
        affiliateCode
      });
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

    console.log(`💰 Commission Calculation:`, {
      amount,
      commissionRate: commissionRate * 100,
      commissionAmount,
      affiliatePaid: affiliate.isPaid
    });

    // Update affiliate click record
    const updatedClick = await AffiliateClick.findByIdAndUpdate(
      matchingClick._id,
      {
        $set: {
          status: 'converted',
          convertedAt: new Date(paidAt),
          orderId: orderId,
          customerEmail: customerEmail,
          customerName: customerName,
          commissionAmount: commissionAmount,
          productName: productId === 'ea-full' ? 'EA ThebenchmarkTrader Full Version' : 
                       productId === 'ea-pro-source' ? 'EA Pro + Source Code' :
                       productId === 'indicator-pro' ? 'Multi-Indicator Pro Pack' :
                       productId === 'course' ? 'Khóa học Forex Trading' :
                       productId === 'social-copy' ? 'Copy Social Trading' : productId
        }
      },
      { new: true }
    );

    if (!updatedClick) {
      return NextResponse.json({
        success: false,
        error: 'Failed to update affiliate click'
      });
    }

    // Update affiliate's total commission earned
    affiliate.totalCommissionEarned = (affiliate.totalCommissionEarned || 0) + commissionAmount;
    await affiliate.save();

    console.log(`✅ Manual conversion completed:`, {
      affiliateCode,
      clickId: updatedClick._id,
      orderId,
      commissionAmount,
      totalEarned: affiliate.totalCommissionEarned
    });

    return NextResponse.json({
      success: true,
      message: 'Manual conversion completed successfully',
      data: {
        affiliateCode,
        affiliateName: affiliate.username,
        clickId: updatedClick._id,
        orderId,
        commissionAmount,
        totalCommissionEarned: affiliate.totalCommissionEarned,
        conversionRate: commissionRate * 100
      }
    });

  } catch (error: any) {
    console.error('Manual Conversion Fix Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
