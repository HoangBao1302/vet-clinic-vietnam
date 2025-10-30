const mongoose = require('mongoose');

// MongoDB connection string - UPDATE THIS IF DIFFERENT
const MONGODB_URI = process.env.MONGODB_URI || 'your-mongodb-uri-here';

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

async function fixKietTongOrder() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find kiettong's recent orders
    console.log('📊 Looking for problematic orders...\n');
    
    // Search for orders that might be kiettong's based on common patterns
    // 1. Recent PayPal orders with wrong amount (7.9M instead of 14.9M)
    // 2. Recent PayPal orders with Full Version product but high price
    const problematicOrders = await Order.find({
      paymentMethod: 'paypal',
      $or: [
        // Case 1: Amount is around 79000 (wrong - should be 14900000)
        { amount: { $gte: 7800000, $lte: 8000000 } },
        // Case 2: ProductId is ea-full but amount suggests ea-pro-source
        { 
          productId: { $in: ['ea-full-mt4', 'ea-full-mt5', 'ea-full'] },
          amount: { $gte: 14800000, $lte: 15000000 }
        }
      ],
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
    }).sort({ createdAt: -1 });

    if (problematicOrders.length === 0) {
      console.log('❌ No problematic orders found in the last 7 days');
      console.log('\n📧 Please provide the customer email or order ID to search directly\n');
      return;
    }

    console.log(`✅ Found ${problematicOrders.length} potentially problematic order(s):\n`);

    for (const order of problematicOrders) {
      console.log('=' .repeat(80));
      console.log(`\n📦 Order Analysis:`);
      console.log(`   Order ID: ${order.orderId}`);
      console.log(`   Customer: ${order.customerName} (${order.customerEmail})`);
      console.log(`   Current Product ID: ${order.productId}`);
      console.log(`   Current Product Name: ${order.productName}`);
      console.log(`   Current Amount: ${(order.amount / 100).toLocaleString('vi-VN')}đ`);
      console.log(`   Created: ${order.createdAt}`);
      
      // Determine what the correct values should be
      const amountVND = order.amount / 100;
      let correctProductId = order.productId;
      let correctProductName = order.productName;
      let correctAmount = order.amount;
      let needsFix = false;
      
      // Check if amount suggests this should be ea-pro-source
      if (Math.abs(amountVND - 14900000) < 100000) {
        // Amount is around 14.9M - this should be ea-pro-source
        if (!order.productId.includes('pro-source')) {
          needsFix = true;
          correctProductId = 'ea-pro-source-mt4'; // Default to MT4
          correctProductName = 'EA ThebenchmarkTrader Pro + Source Code (MT4)';
          correctAmount = 1489900000; // 14.899M VND in cents
        }
      } else if (Math.abs(amountVND - 7900000) < 100000) {
        // Amount is around 7.9M - this is correct for ea-full
        if (order.productId.includes('full') && !order.productId.includes('pro-source')) {
          console.log(`   ✅ This order appears correct (EA Full Version, 7.9M VND)`);
        }
      } else if (amountVND < 100000) {
        // Amount is very small (like 79,000) - likely display error, need to recalculate
        needsFix = true;
        // Try to determine from productName or productId
        if (order.productName.includes('Pro + Source')) {
          correctAmount = 1489900000; // 14.9M
          correctProductId = order.productId.includes('mt5') ? 'ea-pro-source-mt5' : 'ea-pro-source-mt4';
          correctProductName = order.productId.includes('mt5') 
            ? 'EA ThebenchmarkTrader Pro + Source Code (MT5)'
            : 'EA ThebenchmarkTrader Pro + Source Code (MT4)';
        } else if (order.productName.includes('Full Version')) {
          correctAmount = 790000000; // 7.9M
          correctProductId = order.productId.includes('mt5') ? 'ea-full-mt5' : 'ea-full-mt4';
          correctProductName = order.productId.includes('mt5')
            ? 'EA ThebenchmarkTrader Full Version (MT5)'
            : 'EA ThebenchmarkTrader Full Version (MT4)';
        }
      }
      
      if (needsFix) {
        console.log(`\n   ⚠️  NEEDS FIX:`);
        console.log(`   Should be:`);
        console.log(`     Product ID: ${correctProductId}`);
        console.log(`     Product Name: ${correctProductName}`);
        console.log(`     Amount: ${(correctAmount / 100).toLocaleString('vi-VN')}đ`);
        
        console.log(`\n   🔧 Applying fix...`);
        
        const result = await Order.updateOne(
          { _id: order._id },
          {
            $set: {
              productId: correctProductId,
              productName: correctProductName,
              amount: correctAmount
            }
          }
        );
        
        if (result.modifiedCount > 0) {
          console.log(`   ✅ Order fixed successfully!`);
          
          // Display the updated order
          const updatedOrder = await Order.findById(order._id);
          console.log(`\n   📋 Updated Order:`);
          console.log(`     Product ID: ${updatedOrder.productId}`);
          console.log(`     Product Name: ${updatedOrder.productName}`);
          console.log(`     Amount: ${(updatedOrder.amount / 100).toLocaleString('vi-VN')}đ`);
          
          console.log(`\n   📧 Send this info to customer:`);
          console.log(`     Email: ${order.customerEmail}`);
          console.log(`     Order ID: ${order.orderId}`);
          console.log(`     Product: ${correctProductName}`);
          console.log(`     Amount: ${(correctAmount / 100).toLocaleString('vi-VN')}đ`);
          console.log(`     Download link: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://thebenchmarktrader.com'}/downloads?order=${order.orderId}`);
        } else {
          console.log(`   ❌ Failed to update order`);
        }
      } else {
        console.log(`\n   ✅ No fix needed - order data looks correct`);
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log('\n🎯 Fix Summary:\n');
    const fixedCount = problematicOrders.filter(o => {
      const amountVND = o.amount / 100;
      return (Math.abs(amountVND - 14900000) < 100000 && !o.productId.includes('pro-source')) ||
             (amountVND < 100000);
    }).length;
    
    if (fixedCount > 0) {
      console.log(`✅ Fixed ${fixedCount} order(s)`);
      console.log(`📧 Please send updated order confirmation emails to affected customers`);
    } else {
      console.log(`✅ No orders needed fixing`);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Database connection closed');
  }
}

// Run the fix
fixKietTongOrder();

/* 
USAGE:
1. Set MONGODB_URI environment variable or update it in the script
2. Run: node fix-kiettong-order.js
3. Review the changes before confirming
4. Send updated confirmation email to customer
*/

