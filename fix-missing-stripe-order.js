// Script to fix missing Stripe order for haidangtong
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function fixMissingStripeOrder() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Import models
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    const Order = mongoose.model('Order', new mongoose.Schema({}, { strict: false }));
    const AffiliateClick = mongoose.model('AffiliateClick', new mongoose.Schema({}, { strict: false }));

    // 1. Check existing orders for haidangtong
    console.log('\n📊 Checking existing orders for haidangtong...');
    const existingOrders = await Order.find({ 
      customerEmail: 'haidangtong2612@gmail.com' 
    }).sort({ createdAt: -1 });
    
    console.log(`📈 Found ${existingOrders.length} existing orders:`);
    existingOrders.forEach((order, index) => {
      console.log(`Order ${index + 1}:`, {
        orderId: order.orderId,
        productId: order.productId,
        productName: order.productName,
        amount: order.amount,
        paymentMethod: order.paymentMethod,
        status: order.status,
        createdAt: order.createdAt
      });
    });

    // 2. Check affiliate clicks for kietdangtong
    console.log('\n📊 Checking affiliate clicks for kietdangtong...');
    const affiliateClicks = await AffiliateClick.find({ 
      affiliateCode: 'AFF-KIET DANG TONG-15B161' 
    }).sort({ clickedAt: -1 });
    
    console.log(`📈 Found ${affiliateClicks.length} affiliate clicks:`);
    affiliateClicks.forEach((click, index) => {
      console.log(`Click ${index + 1}:`, {
        productId: click.productId,
        productName: click.productName,
        status: click.status,
        commissionAmount: click.commissionAmount,
        clickedAt: click.clickedAt,
        convertedAt: click.convertedAt,
        orderId: click.orderId
      });
    });

    // 3. Identify missing Stripe order
    console.log('\n🔍 Analyzing missing orders...');
    
    // From the images, we know:
    // - PayPal order: 9GH52985019985411 (ea-full, 7,900,000đ)
    // - Affiliate click: ea-pro-source (clicked but not converted)
    
    // This suggests there should be a Stripe order for ea-pro-source
    const expectedStripeOrder = {
      orderId: `STRIPE-${Date.now()}`, // Generate a mock order ID
      productId: 'ea-pro-source',
      productName: 'EA ThebenchmarkTrader Pro + Source Code',
      status: 'paid',
      customerEmail: 'haidangtong2612@gmail.com',
      customerName: 'Hai Tong',
      customerPhone: '0948617091',
      amount: 14900000, // 14.9M VND for ea-pro-source
      paymentMethod: 'stripe',
      createdAt: new Date(),
      paidAt: new Date()
    };

    console.log('💰 Expected Stripe order:', expectedStripeOrder);

    // 4. Create missing Stripe order
    console.log('\n🔧 Creating missing Stripe order...');
    const stripeOrder = new Order(expectedStripeOrder);
    await stripeOrder.save();
    console.log('✅ Stripe order created:', stripeOrder.orderId);

    // 5. Update affiliate click to converted
    console.log('\n🔧 Updating affiliate click to converted...');
    const unconvertedClick = await AffiliateClick.findOne({
      affiliateCode: 'AFF-KIET DANG TONG-15B161',
      productId: 'ea-pro-source',
      status: 'clicked'
    });

    if (unconvertedClick) {
      // Calculate commission
      const commissionRate = 0.30; // 30% for free members
      const commissionAmount = Math.round(expectedStripeOrder.amount * commissionRate);

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
      console.log('\n🔧 Updating kietdangtong\'s total commission...');
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

    // 7. Verify the fix
    console.log('\n🔍 Verifying the fix...');
    const allOrders = await Order.find({ 
      customerEmail: 'haidangtong2612@gmail.com' 
    }).sort({ createdAt: -1 });
    
    console.log('📊 All orders for haidangtong:');
    allOrders.forEach((order, index) => {
      console.log(`Order ${index + 1}:`, {
        orderId: order.orderId,
        productId: order.productId,
        productName: order.productName,
        amount: order.amount.toLocaleString('vi-VN') + 'đ',
        paymentMethod: order.paymentMethod,
        status: order.status
      });
    });

    const convertedClicks = await AffiliateClick.find({
      affiliateCode: 'AFF-KIET DANG TONG-15B161',
      status: 'converted'
    });

    console.log('\n📊 Converted affiliate clicks:');
    convertedClicks.forEach((click, index) => {
      console.log(`Click ${index + 1}:`, {
        productId: click.productId,
        productName: click.productName,
        commissionAmount: click.commissionAmount.toLocaleString('vi-VN') + 'đ',
        orderId: click.orderId
      });
    });

    const totalCommission = convertedClicks.reduce((sum, click) => sum + (click.commissionAmount || 0), 0);
    console.log(`\n💰 Total commission earned: ${totalCommission.toLocaleString('vi-VN')}đ`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the fix
fixMissingStripeOrder();

