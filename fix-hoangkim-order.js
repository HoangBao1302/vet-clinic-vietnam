// Fix hoangkim order 76096027707236020
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

async function fixOrder() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const orderId = '76096027707236020';
    
    // Find current order
    const order = await Order.findOne({ orderId });
    
    if (!order) {
      console.log('❌ Order not found!');
      return;
    }

    console.log('📦 Current Order:');
    console.log('='.repeat(80));
    console.log('Order ID:', order.orderId);
    console.log('Product ID:', order.productId, '❌');
    console.log('Product Name:', order.productName);
    console.log('Amount:', (order.amount / 100).toLocaleString('vi-VN') + 'đ', '❌');

    // Correct data based on email
    const correctData = {
      productId: 'ea-full-mt4',
      productName: 'EA ThebenchmarkTrader Full Version (MT4)',
      amount: 790008000 // 7.900.080đ in cents
    };

    console.log('\n✅ Correct Data:');
    console.log('='.repeat(80));
    console.log('Product ID:', correctData.productId, '✅');
    console.log('Product Name:', correctData.productName);
    console.log('Amount:', (correctData.amount / 100).toLocaleString('vi-VN') + 'đ', '✅');

    console.log('\n🔧 Updating order...');
    
    const result = await Order.updateOne(
      { orderId },
      { $set: correctData }
    );

    if (result.modifiedCount > 0) {
      console.log('✅ Order updated successfully!\n');
      
      // Verify
      const updatedOrder = await Order.findOne({ orderId });
      console.log('🔍 Verified:');
      console.log('='.repeat(80));
      console.log('Product ID:', updatedOrder.productId);
      console.log('Product Name:', updatedOrder.productName);
      console.log('Amount:', (updatedOrder.amount / 100).toLocaleString('vi-VN') + 'đ');
      
      console.log('\n✅ Customer can now download the correct product!');
      console.log('📝 Test: Go to downloads page, enter code 76096027707236020 in EA Full (MT4) card');
    } else {
      console.log('⚠️ No changes made');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB\n');
  }
}

fixOrder();

