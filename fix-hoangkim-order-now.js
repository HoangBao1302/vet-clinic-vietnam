// Fix hoangkim order immediately
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined');
  process.exit(1);
}

// Define Order schema
const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerName: { type: String },
  customerPhone: { type: String },
  paymentMethod: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
}, { collection: 'orders' });

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

async function fixHoangKimOrder() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('════════════════════════════════════════════════════════════════════════════════');
    console.log('🔧 FIXING HOANGKIM ORDER: 76S07151S5357764P');
    console.log('════════════════════════════════════════════════════════════════════════════════\n');

    // Find order
    const order = await Order.findOne({ orderId: '76S07151S5357764P' });
    
    if (!order) {
      console.error('❌ Order not found!');
      await mongoose.connection.close();
      return;
    }

    console.log('📦 Current data:');
    console.log(`   ProductId: ${order.productId}`);
    console.log(`   ProductName: ${order.productName}`);
    console.log(`   Amount: ${(order.amount / 100).toLocaleString('vi-VN')}đ (${order.amount} cents)`);
    console.log(`   Email: ${order.customerEmail}\n`);

    // Update order
    const result = await Order.updateOne(
      { orderId: '76S07151S5357764P' },
      {
        $set: {
          productId: 'ea-pro-source-mt4',
          productName: 'EA ThebenchmarkTrader Pro + Source Code (MT4)',
          amount: 1490000000,  // 14.9M VND in cents
        }
      }
    );

    if (result.modifiedCount > 0) {
      console.log('✅ Successfully updated order!\n');
      
      const updatedOrder = await Order.findOne({ orderId: '76S07151S5357764P' });
      console.log('📦 New data:');
      console.log(`   ProductId: ${updatedOrder.productId}`);
      console.log(`   ProductName: ${updatedOrder.productName}`);
      console.log(`   Amount: ${(updatedOrder.amount / 100).toLocaleString('vi-VN')}đ (${updatedOrder.amount} cents)\n`);
      
      console.log('════════════════════════════════════════════════════════════════════════════════');
      console.log('✅ FIX COMPLETE!');
      console.log('════════════════════════════════════════════════════════════════════════════════\n');
      
      console.log('📝 Next steps:');
      console.log('   1. Download should work now at:');
      console.log('      https://thebenchmarktrader.com/downloads?order=76S07151S5357764P');
      console.log('   2. User can try download again');
      console.log('   3. Need to re-send correct email to hoangkim.helen@gmail.com\n');
      
    } else {
      console.log('⚠️  No changes made (maybe already correct?)\n');
    }

    await mongoose.connection.close();
    console.log('👋 Database connection closed');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixHoangKimOrder();

