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

    const { orderId, customerEmail, customerName, productId, amount, paidAt, ipAddress, affiliateCode } = await request.json();

    if (!orderId || !customerEmail || !productId || !affiliateCode) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('🔧 Creating Virtual Click:', {
      orderId,
      customerEmail,
      customerName,
      productId,
      amount,
      paidAt,
      ipAddress,
      affiliateCode
    });

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

    // Get product name
    const productNames: Record<string, string> = {
      'ea-full': 'EA ThebenchmarkTrader Full Version',
      'ea-pro-source': 'EA Pro + Source Code',
      'indicator-pro': 'Multi-Indicator Pro Pack',
      'course': 'Khóa học Forex Trading',
      'social-copy': 'Copy Social Trading',
    };

    // Create virtual click (already converted)
    const virtualClick = await AffiliateClick.create({
      affiliateCode,
      ipAddress: ipAddress || 'unknown',
      userAgent: 'Manual Conversion Fix',
      referrer: 'Manual Attribution',
      productId,
      productName: productNames[productId] || productId,
      customerEmail,
      customerName,
      status: 'converted',
      clickedAt: new Date(paidAt), // Use order time as click time
      convertedAt: new Date(paidAt),
      orderId,
      commissionAmount,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Update affiliate's total commission earned
    affiliate.totalCommissionEarned = (affiliate.totalCommissionEarned || 0) + commissionAmount;
    await affiliate.save();

    console.log(`✅ Virtual click created:`, {
      clickId: virtualClick._id,
      affiliateCode,
      orderId,
      commissionAmount,
      totalEarned: affiliate.totalCommissionEarned
    });

    return NextResponse.json({
      success: true,
      message: 'Virtual click created successfully',
      data: {
        clickId: virtualClick._id,
        affiliateCode,
        affiliateName: affiliate.username,
        orderId,
        commissionAmount,
        totalCommissionEarned: affiliate.totalCommissionEarned,
        conversionRate: commissionRate * 100
      }
    });

  } catch (error: any) {
    console.error('Virtual Click Creation Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
