import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import AffiliateClick from '@/lib/models/AffiliateClick';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { affiliateUsername, customerUsername, products } = await request.json();

    if (!affiliateUsername || !customerUsername) {
      return NextResponse.json(
        { success: false, error: 'Missing affiliateUsername or customerUsername' },
        { status: 400 }
      );
    }

    console.log('🔧 Fixing affiliate commission:', {
      affiliateUsername,
      customerUsername,
      products
    });

    // 1. Get affiliate user
    const affiliate = await User.findOne({ username: affiliateUsername });
    if (!affiliate) {
      return NextResponse.json(
        { success: false, error: 'Affiliate user not found' },
        { status: 404 }
      );
    }

    // 2. Get customer user
    const customer = await User.findOne({ username: customerUsername });
    if (!customer) {
      return NextResponse.json(
        { success: false, error: 'Customer user not found' },
        { status: 404 }
      );
    }

    // 3. Ensure affiliate is approved
    if (affiliate.affiliateStatus !== 'approved') {
      affiliate.affiliateStatus = 'approved';
      if (!affiliate.affiliateCode) {
        affiliate.affiliateCode = `AFF-${affiliateUsername.toUpperCase()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      }
      await affiliate.save();
      console.log('✅ Approved affiliate:', affiliate.affiliateCode);
    }

    // 4. Calculate commission for products
    const productPrices = {
      'ea-full': 7900000,
      'ea-pro-source': 14900000,
      'indicator-pro': 1990000,
      'course': 5000000,
      'social-copy': 2000000,
    };

    const commissionRates = {
      'ea-full': affiliate.isPaid ? 0.35 : 0.30,
      'ea-pro-source': affiliate.isPaid ? 0.35 : 0.30,
      'indicator-pro': affiliate.isPaid ? 0.35 : 0.30,
      'course': 0.25,
      'social-copy': 0.10,
    };

    const productNames = {
      'ea-full': 'EA ThebenchmarkTrader Full Version',
      'ea-pro-source': 'EA ThebenchmarkTrader Pro + Source Code',
      'indicator-pro': 'Multi-Indicator Pro Pack',
      'course': 'Khóa Học Forex Trading',
      'social-copy': 'Copy Social Trading',
    };

    let totalCommission = 0;
    const commissionRecords = [];

    // Use provided products or customer's purchased products
    type ProductId = keyof typeof productPrices;
    const productsToProcess: string[] = (products as string[] | undefined) 
      || (customer.purchasedProducts as string[] | undefined) 
      || [];

    for (const productId of productsToProcess) {
      const id = productId as ProductId;
      const productPrice = productPrices[id] || 0;
      const commissionRate = commissionRates[id] || 0.30;
      const commissionAmount = Math.round(productPrice * commissionRate);

      if (commissionAmount > 0) {
        totalCommission += commissionAmount;
        
        // Create affiliate click record
        const clickRecord = new AffiliateClick({
          affiliateCode: affiliate.affiliateCode,
          clickedAt: new Date(),
          ipAddress: 'manual-fix',
          userAgent: 'manual-fix-api',
          referrer: 'manual-fix',
          convertedAt: new Date(),
          orderId: `manual-fix-${Date.now()}-${productId}`,
          commissionAmount: commissionAmount,
          productId: productId,
          productName: productNames[id] || productId,
          customerEmail: customer.email,
          customerName: customer.username,
          status: 'converted'
        });

        await clickRecord.save();
        commissionRecords.push({
          productId,
          productName: productNames[id] || productId,
          price: productPrice,
          commissionRate: commissionRate * 100,
          commissionAmount
        });

        console.log(`✅ Created commission record for ${productId}: ${commissionAmount.toLocaleString('vi-VN')}đ`);
      }
    }

    // 5. Update affiliate's total commission
    if (totalCommission > 0) {
      affiliate.totalCommissionEarned = (affiliate.totalCommissionEarned || 0) + totalCommission;
      await affiliate.save();

      console.log(`✅ Updated ${affiliateUsername}'s total commission: ${affiliate.totalCommissionEarned.toLocaleString('vi-VN')}đ`);
    }

    return NextResponse.json({
      success: true,
      message: 'Commission fixed successfully',
      data: {
        affiliate: {
          username: affiliate.username,
          affiliateCode: affiliate.affiliateCode,
          totalCommissionEarned: affiliate.totalCommissionEarned
        },
        customer: {
          username: customer.username,
          email: customer.email,
          purchasedProducts: customer.purchasedProducts
        },
        commissionRecords,
        totalCommission
      }
    });

  } catch (error: any) {
    console.error('❌ Fix commission error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

