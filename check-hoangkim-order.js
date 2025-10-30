// Check hoangkim order 76096027707236020
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

async function checkOrder() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const orderId = '76096027707236020';
    
    // Find the order
    const order = await Order.findOne({ orderId });
    
    if (!order) {
      console.log('❌ Order not found in database!');
      console.log('This means the webhook did not save the order.');
      return;
    }

    console.log('📦 Order Details:');
    console.log('='.repeat(80));
    console.log('Order ID:', order.orderId);
    console.log('Product ID:', order.productId);
    console.log('Product Name:', order.productName);
    console.log('Customer Email:', order.customerEmail);
    console.log('Customer Name:', order.customerName);
    console.log('Amount:', (order.amount / 100).toLocaleString('vi-VN') + 'đ');
    console.log('Status:', order.status);
    console.log('Payment Method:', order.paymentMethod);
    console.log('Created At:', order.createdAt);

    // Expected from email
    console.log('\n📧 Expected from Email:');
    console.log('='.repeat(80));
    console.log('Product: EA ThebenchmarkTrader Full Version (MT4)');
    console.log('Expected ProductId: ea-full-mt4');
    console.log('Amount: 7.900.080đ');

    // Validation
    console.log('\n🔍 Validation:');
    console.log('='.repeat(80));
    
    const expectedProductId = 'ea-full-mt4';
    const expectedAmount = 7900080;
    const amountVND = order.amount / 100;
    
    if (order.productId === expectedProductId) {
      console.log('✅ ProductId is CORRECT:', order.productId);
    } else {
      console.log('❌ ProductId is WRONG!');
      console.log('   Expected:', expectedProductId);
      console.log('   Got:', order.productId);
      console.log('   💡 Need to fix this!');
    }
    
    if (Math.abs(amountVND - expectedAmount) < 1000) {
      console.log('✅ Amount is CORRECT:', amountVND.toLocaleString('vi-VN') + 'đ');
    } else {
      console.log('❌ Amount is WRONG!');
      console.log('   Expected:', expectedAmount.toLocaleString('vi-VN') + 'đ');
      console.log('   Got:', amountVND.toLocaleString('vi-VN') + 'đ');
    }

    // Check all orders for this customer
    console.log('\n📋 All orders for hoangkim:');
    console.log('='.repeat(80));
    const allOrders = await Order.find({ 
      customerEmail: /hoangkim/i 
    }).sort({ createdAt: -1 });
    
    allOrders.forEach((o, i) => {
      console.log(`\n${i + 1}. Order: ${o.orderId}`);
      console.log(`   Product ID: ${o.productId}`);
      console.log(`   Product Name: ${o.productName}`);
      console.log(`   Amount: ${(o.amount / 100).toLocaleString('vi-VN')}đ`);
      console.log(`   Date: ${o.createdAt}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

checkOrder();

