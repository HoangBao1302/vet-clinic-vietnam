// Script to fix order 08C44041RJ769621X
// This order should be for MT5 but was saved as MT4
// Run: MONGODB_URI="your-uri" node fix-order-08C44041RJ769621X.js

const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI environment variable is required');
  console.log('Usage: MONGODB_URI="your-uri" node fix-order-08C44041RJ769621X.js');
  process.exit(1);
}

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
    console.log('✅ Connected to MongoDB');

    const orderId = '08C44041RJ769621X';
    
    // Find the order
    const order = await Order.findOne({ orderId });
    
    if (!order) {
      console.log('❌ Order not found in database!');
      return;
    }

    console.log('\n📦 Current Order Details:');
    console.log('========================');
    console.log('Order ID:', order.orderId);
    console.log('Product ID:', order.productId);
    console.log('Product Name:', order.productName);
    console.log('Customer Email:', order.customerEmail);
    console.log('Amount:', (order.amount / 100).toLocaleString('vi-VN') + 'đ');

    // Determine correct productId
    let correctProductId = order.productId;
    let correctProductName = order.productName;
    
    // Check if product name indicates MT5
    if (order.productName.includes('(MT5)') || order.productName.includes('MT5')) {
      // This should be MT5 product
      if (order.productId.endsWith('-mt4')) {
        correctProductId = order.productId.replace('-mt4', '-mt5');
        console.log('\n⚠️ Product ID mismatch detected!');
        console.log('Product Name says: MT5');
        console.log('Product ID says: MT4');
        console.log('Correcting productId:', order.productId, '→', correctProductId);
      }
    } else if (order.productName.includes('(MT4)') || order.productName.includes('MT4')) {
      // This should be MT4 product
      if (order.productId.endsWith('-mt5')) {
        correctProductId = order.productId.replace('-mt5', '-mt4');
        console.log('\n⚠️ Product ID mismatch detected!');
        console.log('Product Name says: MT4');
        console.log('Product ID says: MT5');
        console.log('Correcting productId:', order.productId, '→', correctProductId);
      }
    }

    // If productId needs correction
    if (correctProductId !== order.productId) {
      console.log('\n🔧 Updating order...');
      
      const result = await Order.updateOne(
        { orderId },
        { 
          $set: { 
            productId: correctProductId
          } 
        }
      );

      if (result.modifiedCount > 0) {
        console.log('✅ Order updated successfully!');
        
        // Verify the update
        const updatedOrder = await Order.findOne({ orderId });
        console.log('\n📦 Updated Order Details:');
        console.log('========================');
        console.log('Order ID:', updatedOrder.orderId);
        console.log('Product ID:', updatedOrder.productId);
        console.log('Product Name:', updatedOrder.productName);
        console.log('\n✅ Fix complete! Customer can now download the correct product.');
      } else {
        console.log('⚠️ No changes made (order may already be correct)');
      }
    } else {
      console.log('\n✅ Order is already correct! No changes needed.');
    }

    // Also check for other orders that might have the same issue
    console.log('\n🔍 Checking for other orders with similar issues...');
    const allOrders = await Order.find({});
    let issuesFound = 0;
    
    for (const o of allOrders) {
      let hasIssue = false;
      let suggestedFix = '';
      
      if (o.productName.includes('(MT5)') && o.productId.endsWith('-mt4')) {
        hasIssue = true;
        suggestedFix = o.productId.replace('-mt4', '-mt5');
      } else if (o.productName.includes('(MT4)') && o.productId.endsWith('-mt5')) {
        hasIssue = true;
        suggestedFix = o.productId.replace('-mt5', '-mt4');
      }
      
      if (hasIssue) {
        issuesFound++;
        console.log(`\n⚠️ Issue found in order: ${o.orderId}`);
        console.log(`   Product Name: ${o.productName}`);
        console.log(`   Current ID: ${o.productId}`);
        console.log(`   Suggested ID: ${suggestedFix}`);
        console.log(`   Customer: ${o.customerEmail}`);
      }
    }
    
    if (issuesFound > 0) {
      console.log(`\n⚠️ Found ${issuesFound} order(s) with platform mismatch issues.`);
      console.log('Run this script again to fix them, or fix manually in MongoDB.');
    } else {
      console.log('\n✅ No other issues found!');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

fixOrder();

