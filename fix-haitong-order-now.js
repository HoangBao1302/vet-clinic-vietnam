// Fix haitong's latest order
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined');
  process.exit(1);
}

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerName: { type: String },
  paymentMethod: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
}, { collection: 'orders' });

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

async function fixHaiTong() {
  try {
    await mongoose.connect(MONGODB_URI);
    
    console.log('🔧 FIXING HAITONG ORDER: 1LL53598H5875614L\n');

    const order = await Order.findOne({ orderId: '1LL53598H5875614L' });
    
    if (!order) {
      console.error('❌ Order not found!');
      await mongoose.connection.close();
      return;
    }

    console.log('📦 Current (WRONG):');
    console.log(`   ProductId: ${order.productId}`);
    console.log(`   ProductName: ${order.productName}`);
    console.log(`   Amount: ${(order.amount / 100).toLocaleString('vi-VN')}đ\n`);

    // Update - assuming it's EA Full MT4 based on email
    const result = await Order.updateOne(
      { orderId: '1LL53598H5875614L' },
      {
        $set: {
          productId: 'ea-full-mt4',
          productName: 'EA ThebenchmarkTrader Full Version (MT4)',
          amount: 790000000,
        }
      }
    );

    if (result.modifiedCount > 0) {
      const updated = await Order.findOne({ orderId: '1LL53598H5875614L' });
      console.log('✅ Fixed!\n');
      console.log('📦 New (CORRECT):');
      console.log(`   ProductId: ${updated.productId}`);
      console.log(`   ProductName: ${updated.productName}`);
      console.log(`   Amount: ${(updated.amount / 100).toLocaleString('vi-VN')}đ\n`);
      
      console.log('✅ Download should work now at:');
      console.log('   https://thebenchmarktrader.com/downloads?order=1LL53598H5875614L\n');
    }

    await mongoose.connection.close();

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixHaiTong();



