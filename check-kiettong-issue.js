const mongoose = require('mongoose');

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://thebenchmarktrader:Kiet123456789@cluster0.s0pqz.mongodb.net/eawebsite?retryWrites=true&w=majority&appName=Cluster0';

// Define Order schema
const orderSchema = new mongoose.Schema({
  orderId: String,
  productId: String,
  productName: String,
  status: String,
  customerEmail: String,
  customerName: String,
  customerPhone: String,
  amount: Number,
  paymentMethod: String,
  createdAt: Date,
  paidAt: Date,
}, { collection: 'orders', timestamps: false });

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

async function checkKietTongIssue() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find kiettong's recent orders
    console.log('📊 Looking for kiettong orders...\n');
    const orders = await Order.find({
      $or: [
        { customerEmail: /kiettong/i },
        { customerName: /kiet.*tong/i },
        { customerName: /tong.*kiet/i }
      ]
    }).sort({ createdAt: -1 }).limit(10);

    if (orders.length === 0) {
      console.log('❌ No orders found for kiettong');
      console.log('\n📊 Checking all recent PayPal orders...\n');
      
      // Check all recent PayPal orders
      const recentOrders = await Order.find({
        paymentMethod: 'paypal'
      }).sort({ createdAt: -1 }).limit(10);
      
      recentOrders.forEach((order, index) => {
        console.log(`\n📦 Order ${index + 1}:`);
        console.log(`   Order ID: ${order.orderId}`);
        console.log(`   Product ID: ${order.productId}`);
        console.log(`   Product Name: ${order.productName}`);
        console.log(`   Customer: ${order.customerName} (${order.customerEmail})`);
        console.log(`   Amount: ${(order.amount / 100).toLocaleString('vi-VN')}đ`);
        console.log(`   Status: ${order.status}`);
        console.log(`   Created: ${order.createdAt}`);
      });
      
      return;
    }

    console.log(`✅ Found ${orders.length} order(s) for kiettong:\n`);

    orders.forEach((order, index) => {
      console.log(`\n📦 Order ${index + 1}:`);
      console.log('=' .repeat(80));
      console.log(`   Order ID: ${order.orderId}`);
      console.log(`   Product ID: ${order.productId}`);
      console.log(`   Product Name: ${order.productName}`);
      console.log(`   Customer Name: ${order.customerName}`);
      console.log(`   Customer Email: ${order.customerEmail}`);
      console.log(`   Customer Phone: ${order.customerPhone}`);
      console.log(`   Amount: ${(order.amount / 100).toLocaleString('vi-VN')}đ`);
      console.log(`   Payment Method: ${order.paymentMethod}`);
      console.log(`   Status: ${order.status}`);
      console.log(`   Created At: ${order.createdAt}`);
      console.log(`   Paid At: ${order.paidAt}`);
      
      // Analyze the issue
      console.log(`\n   🔍 ANALYSIS:`);
      
      // Expected products and prices
      const expectedProducts = {
        'ea-pro-source-mt4': { name: 'EA ThebenchmarkTrader Pro + Source Code (MT4)', price: 14900000 },
        'ea-pro-source-mt5': { name: 'EA ThebenchmarkTrader Pro + Source Code (MT5)', price: 14900000 },
        'ea-full-mt4': { name: 'EA ThebenchmarkTrader Full Version (MT4)', price: 7900000 },
        'ea-full-mt5': { name: 'EA ThebenchmarkTrader Full Version (MT5)', price: 7900000 },
        'indicator-pro-mt4': { name: 'Multi-Indicator Pro Pack (MT4)', price: 1990000 },
        'indicator-pro-mt5': { name: 'Multi-Indicator Pro Pack (MT5)', price: 1990000 }
      };
      
      const amountVND = order.amount / 100;
      
      // Check if amount matches expected price
      if (Math.abs(amountVND - 14900000) < 100000) {
        console.log(`   ✅ Amount matches: EA Pro + Source Code (14.9M VND)`);
        if (order.productName !== 'EA ThebenchmarkTrader Pro + Source Code (MT4)' && 
            order.productName !== 'EA ThebenchmarkTrader Pro + Source Code (MT5)') {
          console.log(`   ❌ MISMATCH: Product name is wrong!`);
          console.log(`      Expected: EA ThebenchmarkTrader Pro + Source Code`);
          console.log(`      Got: ${order.productName}`);
        }
      } else if (Math.abs(amountVND - 7900000) < 100000) {
        console.log(`   ⚠️  Amount matches: EA Full Version (7.9M VND)`);
        if (order.productName.includes('Full Version')) {
          console.log(`   ✅ Product name is correct`);
        } else {
          console.log(`   ❌ MISMATCH: Product name is wrong!`);
        }
      } else if (Math.abs(amountVND - 1990000) < 100000) {
        console.log(`   ⚠️  Amount matches: Indicator Pro Pack (1.99M VND)`);
      } else {
        console.log(`   ⚠️  Amount ${amountVND.toLocaleString('vi-VN')}đ doesn't match any standard price`);
      }
      
      // Check if productId matches expected format
      if (order.productId && (order.productId.includes('mt4') || order.productId.includes('mt5'))) {
        console.log(`   ✅ Product ID has platform suffix: ${order.productId}`);
      } else if (order.productId && !order.productId.includes('mt')) {
        console.log(`   ⚠️  Product ID missing platform suffix: ${order.productId}`);
        console.log(`      This might cause download issues!`);
      }
    });

    console.log('\n' + '='.repeat(80));
    console.log('\n🎯 SUMMARY OF ISSUES:\n');
    
    const mainIssue = orders.find(o => {
      const amountVND = o.amount / 100;
      return Math.abs(amountVND - 14900000) < 100000 && 
             !o.productName.includes('Pro + Source Code');
    });
    
    if (mainIssue) {
      console.log('❌ CRITICAL ISSUE FOUND:');
      console.log(`   Order ID: ${mainIssue.orderId}`);
      console.log(`   Paid: ${(mainIssue.amount / 100).toLocaleString('vi-VN')}đ (14.9M VND)`);
      console.log(`   Expected Product: EA Pro + Source Code`);
      console.log(`   Stored Product: ${mainIssue.productName}`);
      console.log(`   Product ID: ${mainIssue.productId}`);
      console.log('\n💡 CAUSE: PayPal webhook received wrong productId from PayPal order');
      console.log('   This happened because:');
      console.log('   1. User clicked button for "EA Pro + Source Code" (price: 14.9M)');
      console.log('   2. PayPal order was created with wrong reference_id');
      console.log('   3. Webhook saved order with wrong productId/productName');
      console.log('   4. Email was sent with wrong product information');
      console.log('\n🔧 FIXES NEEDED:');
      console.log('   1. Fix PayPal create-order to send correct productId');
      console.log('   2. Add validation in webhook to verify amount matches product');
      console.log('   3. Update email template to show correct product');
      console.log('   4. Manually update this order in database');
    } else {
      console.log('✅ No critical issues found in recent orders');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Database connection closed');
  }
}

checkKietTongIssue();

