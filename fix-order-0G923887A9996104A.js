// Fix order 0G923887A9996104A
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

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

async function fixOrder() {
  try {
    await mongoose.connect(MONGODB_URI);
    
    console.log('🔧 FIXING ORDER: 0G923887A9996104A\n');

    // Based on Vercel log: ea-pro-source-mt5
    const result = await Order.updateOne(
      { orderId: '0G923887A9996104A' },
      {
        $set: {
          productId: 'ea-pro-source-mt5',
          productName: 'EA ThebenchmarkTrader Pro + Source Code (MT5)',
          amount: 1490000000,
        }
      }
    );

    if (result.modifiedCount > 0) {
      const order = await Order.findOne({ orderId: '0G923887A9996104A' });
      console.log('✅ Fixed!');
      console.log(`   ProductId: ${order.productId}`);
      console.log(`   ProductName: ${order.productName}`);
      console.log(`   Amount: ${(order.amount / 100).toLocaleString('vi-VN')}đ\n`);
      
      console.log('✅ Download: https://thebenchmarktrader.com/downloads?order=0G923887A9996104A\n');
    }

    await mongoose.connection.close();

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixOrder();




