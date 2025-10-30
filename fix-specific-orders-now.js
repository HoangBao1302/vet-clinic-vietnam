const mongoose = require('mongoose');

// MongoDB URI - Update this!
const MONGODB_URI = process.env.MONGODB_URI || 'your-mongodb-uri-here';

// Define Order schema
const orderSchema = new mongoose.Schema({
  orderId: String,
  productId: String,
  productName: String,
  status: String,
  customerEmail: String,
  customerName: String,
  customerPhone: String,
  amount: Number,
  paymentMethod: String,
  createdAt: Date,
  paidAt: Date,
}, { collection: 'orders', timestamps: false });

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

async function fixSpecificOrders() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find orders by specific order IDs from screenshots
    const orderIds = [
      '96K95691P40465515', // kiettong's order
      '9GK95691P40465515', // Try variations in case of typo
    ];
    
    console.log('📊 Looking for specific orders...\n');
    
    // Also search by customer names
    const orders = await Order.find({
      $or: [
        { orderId: { $in: orderIds } },
        { customerName: /kiettong/i },
        { customerName: /kiet.*tong/i },
        { customerName: /haitong/i },
        { customerName: /hai.*tong/i },
        { customerEmail: /kiettong/i },
        { customerEmail: /haitong/i },
        // Recent PayPal orders with potential issues
        {
          paymentMethod: 'paypal',
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        }
      ]
    }).sort({ createdAt: -1 }).limit(20);

    if (orders.length === 0) {
      console.log('❌ No orders found for kiettong or haitong');
      console.log('\n💡 Please provide the exact order ID or email\n');
      return;
    }

    console.log(`✅ Found ${orders.length} order(s):\n`);

    for (const order of orders) {
      console.log('═'.repeat(80));
      console.log(`\n📦 Order: ${order.orderId}`);
      console.log(`   Customer: ${order.customerName} (${order.customerEmail})`);
      console.log(`   Created: ${order.createdAt}`);
      console.log(`   Payment: ${order.paymentMethod}`);
      console.log(`\n   CURRENT DATA (WRONG):`);
      console.log(`   ❌ ProductId: ${order.productId}`);
      console.log(`   ❌ ProductName: ${order.productName}`);
      console.log(`   ❌ Amount: ${(order.amount / 100).toLocaleString('vi-VN')}đ`);
      
      // Determine correct product based on amount
      const amountVND = order.amount / 100;
      let correctProductId = order.productId;
      let correctProductName = order.productName;
      let correctAmount = order.amount;
      let needsFix = false;
      
      // Check if this looks like a problematic order
      if (amountVND < 1000000) {
        // Amount is very small (79.000đ) - definitely wrong
        needsFix = true;
        
        // Try to determine from order ID or look at PayPal directly
        console.log(`\n   ⚠️  Amount is suspiciously low: ${amountVND.toLocaleString('vi-VN')}đ`);
        console.log(`   💡 Need to check PayPal order data to get correct amount`);
        
        // For now, ask user to confirm
        console.log(`\n   ❓ What product did customer actually buy?`);
        console.log(`      1. Multi-Indicator Pro Pack (1.99M VND)`);
        console.log(`      2. EA Full Version (7.9M VND)`);
        console.log(`      3. EA Pro + Source Code (14.9M VND)`);
        
      } else if (Math.abs(amountVND - 14900000) < 100000) {
        // Should be EA Pro + Source Code
        if (!order.productId.includes('pro-source')) {
          needsFix = true;
          correctProductId = 'ea-full-mt4'; // Based on screenshot showing "EA Full Version"
          correctProductName = 'EA ThebenchmarkTrader Full Version (MT4)';
          correctAmount = 790000000; // 7.9M in cents
          
          console.log(`\n   🔄 WILL UPDATE TO:`);
          console.log(`   ✅ ProductId: ${correctProductId}`);
          console.log(`   ✅ ProductName: ${correctProductName}`);
          console.log(`   ✅ Amount: ${(correctAmount / 100).toLocaleString('vi-VN')}đ`);
        }
      } else if (Math.abs(amountVND - 7900000) < 100000) {
        // This is EA Full Version - should be correct
        if (order.productId.includes('full') && !order.productId.includes('pro-source')) {
          console.log(`\n   ✅ This order looks correct (EA Full Version, 7.9M)`);
        }
      }
      
      if (needsFix) {
        // For orders with very low amount, we need to query PayPal API
        console.log(`\n   ⚠️  MANUAL ACTION REQUIRED:`);
        console.log(`   1. Check PayPal dashboard for order: ${order.orderId}`);
        console.log(`   2. Note the actual amount paid (USD)`);
        console.log(`   3. Determine correct product`);
        console.log(`   4. Run update manually`);
        console.log(`\n   📝 Update command template:`);
        console.log(`   db.orders.updateOne(`);
        console.log(`     { orderId: "${order.orderId}" },`);
        console.log(`     { $set: {`);
        console.log(`       productId: "ea-full-mt4",  // Replace with correct`);
        console.log(`       productName: "EA ThebenchmarkTrader Full Version (MT4)",`);
        console.log(`       amount: 790000000  // Replace with correct (in cents)`);
        console.log(`     }}`);
        console.log(`   )`);
      }
    }

    console.log('\n' + '═'.repeat(80));
    console.log('\n🎯 NEXT STEPS:\n');
    console.log('1. Check PayPal Dashboard for actual order amounts');
    console.log('2. Use Vercel logs to see webhook data');
    console.log('3. Manually update orders with correct data');
    console.log('4. Re-send emails to customers');
    console.log('\n💡 Or provide exact order details and I will fix automatically\n');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Database connection closed');
  }
}

fixSpecificOrders();

/*
USAGE:
1. Set MONGODB_URI environment variable
2. Run: node fix-specific-orders-now.js
3. Review output and follow instructions
4. Or provide order details for automatic fix

TO CHECK PAYPAL ORDER:
1. Go to: https://www.sandbox.paypal.com (or live site)
2. Search for order ID: 96K95691P40465515
3. Check actual amount paid
4. Update database accordingly
*/

