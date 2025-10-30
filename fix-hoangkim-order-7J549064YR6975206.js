const mongoose = require('mongoose');

// MongoDB connection string
const MONGODB_URI = 'mongodb+srv://ethannguyen108:09012003@cluster0.fzwnf.mongodb.net/thebenchmarktrader?retryWrites=true&w=majority&appName=Cluster0';

// Order Schema
const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  status: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerName: { type: String, required: false, default: 'Customer' },
  customerPhone: { type: String, required: false, default: '' },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  paidAt: { type: Date },
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

async function fixOrder() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const orderId = '7J549064YR6975206';
    
    // Find the order
    console.log(`🔍 Searching for order: ${orderId}...\n`);
    const order = await Order.findOne({ orderId });

    if (!order) {
      console.log(`❌ Order not found: ${orderId}`);
      console.log('\n🔍 Searching by customer email: hoangkim.helen@gmail.com...\n');
      
      const orders = await Order.find({ 
        customerEmail: 'hoangkim.helen@gmail.com' 
      }).sort({ createdAt: -1 });
      
      if (orders.length === 0) {
        console.log('❌ No orders found for hoangkim.helen@gmail.com');
      } else {
        console.log(`📋 Found ${orders.length} order(s) for hoangkim.helen@gmail.com:\n`);
        orders.forEach((o, index) => {
          console.log(`Order ${index + 1}:`);
          console.log(`  Order ID: ${o.orderId}`);
          console.log(`  Product ID: ${o.productId}`);
          console.log(`  Product Name: ${o.productName}`);
          console.log(`  Amount: ${o.amount} cents (${(o.amount / 100).toLocaleString('vi-VN')}đ)`);
          console.log(`  Status: ${o.status}`);
          console.log(`  Created: ${o.createdAt}`);
          console.log('');
        });
      }
      
      return;
    }

    console.log('📋 Current order details:');
    console.log(`  Order ID: ${order.orderId}`);
    console.log(`  Product ID: ${order.productId}`);
    console.log(`  Product Name: ${order.productName}`);
    console.log(`  Amount: ${order.amount} cents (${(order.amount / 100).toLocaleString('vi-VN')}đ)`);
    console.log(`  Status: ${order.status}`);
    console.log(`  Customer: ${order.customerName} (${order.customerEmail})`);
    console.log(`  Phone: ${order.customerPhone || 'N/A'}`);
    console.log('');

    // IMPORTANT: Based on the email confirmation, determine what product was purchased
    // You need to tell me:
    // 1. What product did hoangkim buy? (ea-full-mt4, ea-pro-source-mt4, etc.)
    // 2. What was the price?
    
    // Example fix (ADJUST BASED ON ACTUAL PURCHASE):
    const correctProductId = 'ea-pro-source-mt4'; // CHANGE THIS!
    const correctAmount = 14900000 * 100; // 14.9M VND in cents
    const correctProductName = 'EA ThebenchmarkTrader Pro + Source Code (MT4)';

    console.log('🔧 Proposed fix:');
    console.log(`  Product ID: ${order.productId} → ${correctProductId}`);
    console.log(`  Product Name: ${order.productName} → ${correctProductName}`);
    console.log(`  Amount: ${order.amount} cents → ${correctAmount} cents`);
    console.log(`  Amount VND: ${(order.amount / 100).toLocaleString('vi-VN')}đ → ${(correctAmount / 100).toLocaleString('vi-VN')}đ`);
    console.log('');

    // Uncomment to apply fix:
    /*
    await Order.updateOne(
      { orderId },
      {
        $set: {
          productId: correctProductId,
          productName: correctProductName,
          amount: correctAmount
        }
      }
    );
    console.log('✅ Order updated successfully!');
    */
    
    console.log('⚠️ Fix NOT applied - uncomment the update code and adjust values first!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  }
}

fixOrder();

