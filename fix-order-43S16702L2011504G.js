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

    const orderId = '43S16702L2011504G';
    
    // Find the order
    console.log(`🔍 Searching for order: ${orderId}...\n`);
    const order = await Order.findOne({ orderId });

    if (!order) {
      console.log(`❌ Order not found: ${orderId}`);
      return;
    }

    console.log('📋 Current order details:');
    console.log(`  Order ID: ${order.orderId}`);
    console.log(`  Product ID: ${order.productId}`);
    console.log(`  Product Name: ${order.productName}`);
    console.log(`  Amount: ${order.amount} cents (${(order.amount / 100).toLocaleString('vi-VN')}đ)`);
    console.log(`  Status: ${order.status}`);
    console.log(`  Customer: ${order.customerName} (${order.customerEmail})`);
    console.log('');

    // Based on email confirmation: EA Full MT4 - 7.9M
    const correctProductId = 'ea-full-mt4';
    const correctAmount = 790000000; // 7.9M * 100
    const correctProductName = 'EA ThebenchmarkTrader Full Version (MT4)';

    console.log('🔧 Fixing to correct values:');
    console.log(`  Product ID: ${order.productId} → ${correctProductId}`);
    console.log(`  Product Name: ${order.productName} → ${correctProductName}`);
    console.log(`  Amount: ${order.amount} cents → ${correctAmount} cents`);
    console.log(`  Amount VND: ${(order.amount / 100).toLocaleString('vi-VN')}đ → ${(correctAmount / 100).toLocaleString('vi-VN')}đ`);
    console.log('');

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
    
    // Verify update
    const updatedOrder = await Order.findOne({ orderId });
    console.log('\n📋 Updated order details:');
    console.log(`  Product ID: ${updatedOrder.productId}`);
    console.log(`  Product Name: ${updatedOrder.productName}`);
    console.log(`  Amount: ${updatedOrder.amount} cents (${(updatedOrder.amount / 100).toLocaleString('vi-VN')}đ)`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  }
}

fixOrder();

