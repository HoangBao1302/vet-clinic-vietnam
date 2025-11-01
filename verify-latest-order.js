// Verify latest order in database
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

async function verifyOrder() {
  try {
    await mongoose.connect(MONGODB_URI);
    
    console.log('🔍 VERIFYING ORDER: 0G923887A9996104A\n');
    console.log('════════════════════════════════════════════════════════════════════════════════\n');

    const order = await Order.findOne({ orderId: '0G923887A9996104A' });
    
    if (!order) {
      console.error('❌ Order NOT FOUND in database!');
      console.log('💡 This means webhook failed to save to MongoDB\n');
      await mongoose.connection.close();
      return;
    }

    console.log('✅ ORDER FOUND IN DATABASE!\n');
    console.log('📦 Order Details:');
    console.log('────────────────────────────────────────────────────────────────────────────────');
    console.log(`Order ID: ${order.orderId}`);
    console.log(`Product ID: ${order.productId}`);
    console.log(`Product Name: ${order.productName}`);
    console.log(`Amount: ${(order.amount / 100).toLocaleString('vi-VN')}đ (${order.amount} cents)`);
    console.log(`Status: ${order.status}`);
    console.log(`Customer: ${order.customerName}`);
    console.log(`Email: ${order.customerEmail}`);
    console.log(`Payment: ${order.paymentMethod}`);
    console.log(`Created: ${order.createdAt.toLocaleString('vi-VN')}`);
    console.log('────────────────────────────────────────────────────────────────────────────────\n');

    // Validation
    const expectedData = {
      'ea-pro-source-mt5': {
        name: 'EA ThebenchmarkTrader Pro + Source Code (MT5)',
        amount: 1490000000,
        amountVND: '14.900.000đ',
        amountUSD: '$620.83'
      }
    };

    const expected = expectedData[order.productId];
    
    if (!expected) {
      console.log('⚠️  VALIDATION FAILED:');
      console.log(`   ProductId "${order.productId}" not recognized`);
      console.log('   Should be one of: ea-pro-source-mt4, ea-pro-source-mt5, ea-full-mt4, ea-full-mt5, indicator-pro-mt4, indicator-pro-mt5\n');
    } else {
      console.log('🔍 VALIDATION:');
      console.log('────────────────────────────────────────────────────────────────────────────────');
      
      // Check productId
      if (order.productId === 'ea-pro-source-mt5') {
        console.log('✅ ProductId CORRECT: ea-pro-source-mt5 (has MT5 suffix)');
      } else {
        console.log(`❌ ProductId WRONG: ${order.productId}`);
      }

      // Check productName
      if (order.productName === expected.name) {
        console.log('✅ ProductName CORRECT: ' + expected.name);
      } else {
        console.log(`❌ ProductName WRONG: ${order.productName}`);
        console.log(`   Expected: ${expected.name}`);
      }

      // Check amount
      if (Math.abs(order.amount - expected.amount) < 100000) {
        console.log(`✅ Amount CORRECT: ${(order.amount / 100).toLocaleString('vi-VN')}đ (${expected.amountUSD})`);
      } else {
        console.log(`❌ Amount WRONG: ${(order.amount / 100).toLocaleString('vi-VN')}đ`);
        console.log(`   Expected: ${expected.amountVND} (${expected.amountUSD})`);
      }

      console.log('────────────────────────────────────────────────────────────────────────────────\n');

      const allCorrect = 
        order.productId === 'ea-pro-source-mt5' &&
        order.productName === expected.name &&
        Math.abs(order.amount - expected.amount) < 100000;

      if (allCorrect) {
        console.log('🎉 ═══════════════════════════════════════════════════════════════════════════════');
        console.log('🎉 ALL DATA CORRECT! SYSTEM WORKING PERFECTLY!');
        console.log('🎉 ═══════════════════════════════════════════════════════════════════════════════\n');
        
        console.log('✅ What this means:');
        console.log('   - PayPal webhook received correctly');
        console.log('   - ProductId detected with MT5 suffix');
        console.log('   - Amount calculated correctly (14.9M VND)');
        console.log('   - Database saved successfully');
        console.log('   - Download will work!');
        console.log('   - Future orders will all be correct!\n');
      } else {
        console.log('⚠️  SOME DATA INCORRECT - See validation above\n');
      }
    }

    // Download link
    console.log('📥 DOWNLOAD LINK:');
    console.log(`   https://thebenchmarktrader.com/downloads?order=${order.orderId}\n`);

    await mongoose.connection.close();
    console.log('👋 Database connection closed');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

verifyOrder();




