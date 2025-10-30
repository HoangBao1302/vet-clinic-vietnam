// Check hoangkim's latest order
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

async function checkHoangKimOrders() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('════════════════════════════════════════════════════════════════════════════════');
    console.log('🔍 CHECKING HOANGKIM ORDERS');
    console.log('════════════════════════════════════════════════════════════════════════════════\n');

    // Find all hoangkim orders
    const orders = await Order.find({
      $or: [
        { customerEmail: /hoangkim/i },
        { customerName: /hoang.*kim/i }
      ]
    }).sort({ createdAt: -1 });

    console.log(`📊 Found ${orders.length} order(s) for hoangkim\n`);

    if (orders.length === 0) {
      console.log('⚠️  No orders found for hoangkim!');
      console.log('💡 This means:');
      console.log('   1. PayPal webhook has not been received yet');
      console.log('   2. Or email/name is different');
      console.log('   3. Or payment not completed\n');
    } else {
      orders.forEach((order, index) => {
        console.log(`${index + 1}. Order ID: ${order.orderId}`);
        console.log(`   Customer: ${order.customerName} (${order.customerEmail})`);
        console.log(`   Product: ${order.productId}`);
        console.log(`   Name: ${order.productName}`);
        console.log(`   Amount: ${(order.amount / 100).toLocaleString('vi-VN')}đ (${order.amount} cents)`);
        console.log(`   Status: ${order.status}`);
        console.log(`   Method: ${order.paymentMethod}`);
        console.log(`   Date: ${order.createdAt.toLocaleString('vi-VN')}\n`);
        
        // Validate
        if (order.amount < 1000000) {
          console.log(`   ⚠️  WARNING: Amount suspiciously low!`);
        }
        if (!order.productId.includes('mt4') && !order.productId.includes('mt5')) {
          console.log(`   ⚠️  WARNING: ProductId missing MT4/MT5 suffix!`);
        }
        console.log('   ─────────────────────────────────────────────────────────────────────────\n');
      });

      // Show latest order details
      const latestOrder = orders[0];
      console.log('📦 LATEST ORDER DETAILS:');
      console.log('════════════════════════════════════════════════════════════════════════════════');
      console.log(`Order ID: ${latestOrder.orderId}`);
      console.log(`Product: ${latestOrder.productName}`);
      console.log(`Amount: ${(latestOrder.amount / 100).toLocaleString('vi-VN')}đ`);
      console.log(`Email: ${latestOrder.customerEmail}`);
      console.log(`Created: ${latestOrder.createdAt.toLocaleString('vi-VN')}`);
      console.log('════════════════════════════════════════════════════════════════════════════════\n');

      // Expected vs Actual
      console.log('🔍 VALIDATION:');
      console.log('────────────────────────────────────────────────────────────────────────────────');
      console.log('Expected (EA Pro + Source Code MT4):');
      console.log('  - ProductId: ea-pro-source-mt4');
      console.log('  - Amount: 14.900.000đ (1,490,000,000 cents)');
      console.log('  - USD: $620.83\n');
      
      console.log('Actual in database:');
      console.log(`  - ProductId: ${latestOrder.productId}`);
      console.log(`  - Amount: ${(latestOrder.amount / 100).toLocaleString('vi-VN')}đ (${latestOrder.amount.toLocaleString()} cents)`);
      console.log(`  - USD: $${(latestOrder.amount / 100 / 24000).toFixed(2)}\n`);

      const isCorrect = 
        latestOrder.productId === 'ea-pro-source-mt4' &&
        Math.abs(latestOrder.amount - 1490000000) < 100000;

      if (isCorrect) {
        console.log('✅ ORDER DATA IS CORRECT!');
        console.log('💡 If download not working, issue might be in verify-order API\n');
      } else {
        console.log('❌ ORDER DATA IS WRONG!');
        console.log('💡 Webhook received wrong data or old buggy code ran\n');
      }
    }

    // Also check for the old order code user mentioned
    console.log('════════════════════════════════════════════════════════════════════════════════');
    console.log('🔍 CHECKING OLD ORDER CODE: 76S07151S357764P');
    console.log('════════════════════════════════════════════════════════════════════════════════\n');

    const oldOrder = await Order.findOne({ orderId: '76S07151S357764P' });
    if (oldOrder) {
      console.log('📦 Found old order:');
      console.log(`   Product: ${oldOrder.productName}`);
      console.log(`   Amount: ${(oldOrder.amount / 100).toLocaleString('vi-VN')}đ`);
      console.log(`   Date: ${oldOrder.createdAt.toLocaleString('vi-VN')}\n`);
      console.log('💡 This is why download failed - trying to use old order code!\n');
    } else {
      console.log('❌ Order 76S07151S357764P not found in database\n');
    }

    await mongoose.connection.close();
    console.log('👋 Database connection closed');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkHoangKimOrders();

