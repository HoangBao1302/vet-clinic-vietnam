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

async function investigateOrder() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find all orders for hoangkim.helen@gmail.com
    console.log('🔍 Searching for orders with hoangkim.helen@gmail.com...\n');
    const orders = await Order.find({ 
      customerEmail: 'hoangkim.helen@gmail.com' 
    }).sort({ createdAt: -1 });

    if (orders.length === 0) {
      console.log('❌ No orders found for hoangkim.helen@gmail.com');
    } else {
      console.log(`📋 Found ${orders.length} order(s):\n`);
      
      orders.forEach((order, index) => {
        console.log(`Order ${index + 1}:`);
        console.log(`  Order ID: ${order.orderId}`);
        console.log(`  Product ID: ${order.productId}`);
        console.log(`  Product Name: ${order.productName}`);
        console.log(`  Amount: ${order.amount} cents (${(order.amount / 100).toLocaleString('vi-VN')}đ)`);
        console.log(`  Status: ${order.status}`);
        console.log(`  Customer: ${order.customerName} (${order.customerEmail})`);
        console.log(`  Phone: ${order.customerPhone || 'N/A'}`);
        console.log(`  Created: ${order.createdAt}`);
        console.log(`  Paid: ${order.paidAt || 'N/A'}`);
        console.log('');
        
        // Check if productId and amount match
        const expectedPrices = {
          'ea-pro-source-mt4': 14900000,
          'ea-pro-source-mt5': 14900000,
          'ea-full-mt4': 7900000,
          'ea-full-mt5': 7900000,
          'indicator-pro-mt4': 1990000,
          'indicator-pro-mt5': 1990000,
        };
        
        const expectedPrice = expectedPrices[order.productId];
        const actualPrice = order.amount / 100;
        
        if (expectedPrice && Math.abs(actualPrice - expectedPrice) > 1000) {
          console.log(`  ⚠️ AMOUNT MISMATCH!`);
          console.log(`     Expected: ${expectedPrice.toLocaleString('vi-VN')}đ`);
          console.log(`     Actual: ${actualPrice.toLocaleString('vi-VN')}đ`);
          console.log(`     Difference: ${Math.abs(actualPrice - expectedPrice).toLocaleString('vi-VN')}đ`);
        } else if (expectedPrice) {
          console.log(`  ✅ Amount matches expected price for ${order.productId}`);
        } else {
          console.log(`  ⚠️ Unknown productId: ${order.productId}`);
        }
        
        console.log('---\n');
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

investigateOrder();

