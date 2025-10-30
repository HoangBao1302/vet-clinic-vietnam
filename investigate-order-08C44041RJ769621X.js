// Script to investigate order 08C44041RJ769621X
// Run: node investigate-order-08C44041RJ769621X.js

const mongoose = require('mongoose');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'your-mongodb-uri';

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

async function investigateOrder() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const orderId = '08C44041RJ769621X';
    
    // Find the order
    const order = await Order.findOne({ orderId });
    
    if (!order) {
      console.log('❌ Order not found in database!');
      console.log('This means the webhook did not save the order.');
      return;
    }

    console.log('\n📦 Order Details:');
    console.log('================');
    console.log('Order ID:', order.orderId);
    console.log('Product ID:', order.productId);
    console.log('Product Name:', order.productName);
    console.log('Customer Email:', order.customerEmail);
    console.log('Customer Name:', order.customerName);
    console.log('Amount:', order.amount);
    console.log('Status:', order.status);
    console.log('Payment Method:', order.paymentMethod);
    console.log('Created At:', order.createdAt);
    console.log('Paid At:', order.paidAt);

    // Check if productId is valid
    const validProductIds = [
      'indicator-pro-mt4',
      'ea-full-mt4',
      'ea-pro-source-mt4',
      'indicator-pro-mt5',
      'ea-full-mt5',
      'ea-pro-source-mt5'
    ];

    console.log('\n🔍 Validation:');
    console.log('================');
    console.log('Is productId valid?', validProductIds.includes(order.productId) ? '✅ YES' : '❌ NO');
    
    if (!validProductIds.includes(order.productId)) {
      console.log('❌ PROBLEM: Invalid productId!');
      console.log('Expected one of:', validProductIds);
      console.log('Got:', order.productId);
      
      // Try to determine correct productId from amount
      const amountVND = order.amount / 100;
      console.log('\nAmount in VND:', amountVND.toLocaleString('vi-VN') + 'đ');
      
      let suggestedProductId = null;
      if (Math.abs(amountVND - 14900000) < 100000) {
        // Check product name for MT4/MT5
        if (order.productName.includes('MT5')) {
          suggestedProductId = 'ea-pro-source-mt5';
        } else {
          suggestedProductId = 'ea-pro-source-mt4';
        }
      } else if (Math.abs(amountVND - 7900000) < 100000) {
        if (order.productName.includes('MT5')) {
          suggestedProductId = 'ea-full-mt5';
        } else {
          suggestedProductId = 'ea-full-mt4';
        }
      } else if (Math.abs(amountVND - 1990000) < 100000) {
        if (order.productName.includes('MT5')) {
          suggestedProductId = 'indicator-pro-mt5';
        } else {
          suggestedProductId = 'indicator-pro-mt4';
        }
      }
      
      if (suggestedProductId) {
        console.log('💡 Suggested productId:', suggestedProductId);
        console.log('\nTo fix this order, run:');
        console.log(`db.orders.updateOne({ orderId: "${orderId}" }, { $set: { productId: "${suggestedProductId}" } })`);
      }
    }

    // Check all orders for this customer
    console.log('\n📋 All orders for this customer:');
    console.log('================');
    const allOrders = await Order.find({ customerEmail: order.customerEmail }).sort({ createdAt: -1 });
    allOrders.forEach((o, i) => {
      console.log(`\n${i + 1}. Order: ${o.orderId}`);
      console.log('   Product ID:', o.productId);
      console.log('   Product Name:', o.productName);
      console.log('   Amount:', (o.amount / 100).toLocaleString('vi-VN') + 'đ');
      console.log('   Status:', o.status);
      console.log('   Date:', o.createdAt);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

investigateOrder();

