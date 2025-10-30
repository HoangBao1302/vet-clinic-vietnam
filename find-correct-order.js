// Find the correct order for kietdangtong MT5 Source Code
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

const OrderSchema = new mongoose.Schema({
  orderId: String,
  productId: String,
  productName: String,
  status: String,
  customerEmail: String,
  customerName: String,
  customerPhone: String,
  amount: Number,
  createdAt: Date,
  paidAt: Date,
  paymentMethod: String
});

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

async function findOrders() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find all orders for kietdangtong
    const orders = await Order.find({ 
      customerEmail: /kietdangtong/i 
    }).sort({ createdAt: -1 });

    console.log(`📋 Found ${orders.length} order(s) for kietdangtong:\n`);
    console.log('='.repeat(80));

    orders.forEach((order, index) => {
      const amountVND = order.amount / 100;
      console.log(`\n${index + 1}. Order ID: ${order.orderId}`);
      console.log(`   Product ID: ${order.productId}`);
      console.log(`   Product Name: ${order.productName}`);
      console.log(`   Amount: ${amountVND.toLocaleString('vi-VN')}đ`);
      console.log(`   Customer Email: ${order.customerEmail}`);
      console.log(`   Status: ${order.status}`);
      console.log(`   Created: ${order.createdAt}`);
      console.log(`   Payment Method: ${order.paymentMethod}`);
      
      // Check if this matches MT5 Source Code (14.9M VND)
      if (Math.abs(amountVND - 14900000) < 100000) {
        console.log(`   ⭐ THIS IS THE MT5 SOURCE CODE ORDER!`);
        
        // Check for issues
        if (!order.productId.includes('mt4') && !order.productId.includes('mt5')) {
          console.log(`   ⚠️ ISSUE: Missing platform suffix (-mt4 or -mt5)`);
          console.log(`   💡 Should be: ea-pro-source-mt5`);
        } else if (order.productId.includes('mt4')) {
          console.log(`   ⚠️ ISSUE: Says MT4 but should be MT5`);
          console.log(`   💡 Should be: ${order.productId.replace('-mt4', '-mt5')}`);
        }
      }
    });

    console.log('\n' + '='.repeat(80));
    console.log('\n📊 Summary:');
    console.log(`Total orders: ${orders.length}`);
    
    const mt5Orders = orders.filter(o => {
      const amountVND = o.amount / 100;
      return Math.abs(amountVND - 14900000) < 100000;
    });
    
    console.log(`MT5 Source Code orders (14.9M): ${mt5Orders.length}`);
    
    if (mt5Orders.length > 0) {
      console.log('\n🎯 MT5 Source Code Order Details:');
      mt5Orders.forEach(o => {
        console.log(`\nOrder ID: ${o.orderId}`);
        console.log(`Product ID: ${o.productId} ${!o.productId.includes('mt5') ? '❌ WRONG' : '✅ CORRECT'}`);
        console.log(`Product Name: ${o.productName}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

findOrders();

