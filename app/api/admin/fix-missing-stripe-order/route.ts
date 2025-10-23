import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import Order from '@/lib/models/Order';
import AffiliateClick from '@/lib/models/AffiliateClick';

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

    const { customerEmail, customerName, customerPhone } = await request.json();

    if (!customerEmail) {
      return NextResponse.json(
        { success: false, error: 'Missing customerEmail' },
        { status: 400 }
      );
    }

    console.log('🔧 Fixing missing Stripe order for:', customerEmail);

    // 1. Check existing orders
    const existingOrders = await Order.find({ 
      customerEmail: customerEmail 
    }).sort({ createdAt: -1 });
    
    console.log(`📈 Found ${existingOrders.length} existing orders`);

    // 2. Check affiliate clicks
    const affiliateClicks = await AffiliateClick.find({ 
      affiliateCode: 'AFF-KIET DANG TONG-15B161' 
    }).sort({ clickedAt: -1 });
    
    console.log(`📈 Found ${affiliateClicks.length} affiliate clicks`);

    // 3. Identify missing Stripe order
    // From the analysis, we know there should be a Stripe order for ea-pro-source
    const expectedStripeOrder = {
      orderId: `STRIPE-FIX-${Date.now()}`,
      productId: 'ea-pro-source',
      productName: 'EA ThebenchmarkTrader Pro + Source Code',
      status: 'paid',
      customerEmail: customerEmail,
      customerName: customerName || 'Hai Tong',
      customerPhone: customerPhone || '0948617091',
      amount: 14900000, // 14.9M VND for ea-pro-source
      paymentMethod: 'stripe',
      createdAt: new Date(),
      paidAt: new Date()
    };

    console.log('💰 Creating missing Stripe order:', expectedStripeOrder);

    // 4. Create missing Stripe order
    const stripeOrder = new Order(expectedStripeOrder);
    await stripeOrder.save();
    console.log('✅ Stripe order created:', stripeOrder.orderId);

    // 5. Update affiliate click to converted
    const unconvertedClick = await AffiliateClick.findOne({
      affiliateCode: 'AFF-KIET DANG TONG-15B161',
      productId: 'ea-pro-source',
      status: 'clicked'
    });

    let commissionAmount = 0;
    if (unconvertedClick) {
      // Calculate commission
      const commissionRate = 0.30; // 30% for free members
      commissionAmount = Math.round(expectedStripeOrder.amount * commissionRate);

      unconvertedClick.status = 'converted';
      unconvertedClick.convertedAt = new Date();
      unconvertedClick.orderId = expectedStripeOrder.orderId;
      unconvertedClick.commissionAmount = commissionAmount;
      unconvertedClick.customerEmail = expectedStripeOrder.customerEmail;
      unconvertedClick.customerName = expectedStripeOrder.customerName;

      await unconvertedClick.save();
      console.log('✅ Affiliate click updated to converted:', {
        commissionAmount: commissionAmount.toLocaleString('vi-VN') + 'đ',
        orderId: expectedStripeOrder.orderId
      });

      // 6. Update kietdangtong's total commission
      const kietdangtong = await User.findOne({ username: 'kietdangtong' });
      if (kietdangtong) {
        kietdangtong.totalCommissionEarned = (kietdangtong.totalCommissionEarned || 0) + commissionAmount;
        await kietdangtong.save();
        console.log('✅ Updated kietdangtong\'s total commission:', {
          totalCommissionEarned: kietdangtong.totalCommissionEarned.toLocaleString('vi-VN') + 'đ'
        });
      }
    } else {
      console.log('⚠️ No unconverted click found for ea-pro-source');
    }

    // 7. Get final results
    const allOrders = await Order.find({ 
      customerEmail: customerEmail 
    }).sort({ createdAt: -1 });
    
    const convertedClicks = await AffiliateClick.find({
      affiliateCode: 'AFF-KIET DANG TONG-15B161',
      status: 'converted'
    });

    const totalCommission = convertedClicks.reduce((sum, click) => sum + (click.commissionAmount || 0), 0);

    return NextResponse.json({
      success: true,
      message: 'Missing Stripe order fixed successfully',
      data: {
        orders: allOrders.map(order => ({
          orderId: order.orderId,
          productId: order.productId,
          productName: order.productName,
          amount: order.amount,
          paymentMethod: order.paymentMethod,
          status: order.status,
          createdAt: order.createdAt
        })),
        convertedClicks: convertedClicks.map(click => ({
          productId: click.productId,
          productName: click.productName,
          commissionAmount: click.commissionAmount,
          orderId: click.orderId
        })),
        totalCommission,
        newStripeOrder: expectedStripeOrder
      }
    });

  } catch (error: any) {
    console.error('❌ Fix missing Stripe order error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

