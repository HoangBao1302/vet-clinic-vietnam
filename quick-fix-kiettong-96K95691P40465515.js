const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'your-mongodb-uri';

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

const Order = mongoose.model('Order', orderSchema);

async function quickFix() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Fix order 96K95691P40465515
    const orderId = '96K95691P40465515';
    
    console.log(`🔧 Fixing order: ${orderId}\n`);
    
    // First, show current data
    const currentOrder = await Order.findOne({ orderId });
    
    if (!currentOrder) {
      console.log('❌ Order not found!');
      console.log('💡 Try these order IDs:');
      console.log('   - 96K95691P40465515');
      console.log('   - 9GK95691P40465515');
      console.log('   - Or check PayPal for exact ID\n');
      return;
    }
    
    console.log('CURRENT (WRONG) DATA:');
    console.log(`   ProductId: ${currentOrder.productId}`);
    console.log(`   ProductName: ${currentOrder.productName}`);
    console.log(`   Amount: ${(currentOrder.amount / 100).toLocaleString('vi-VN')}đ`);
    console.log(`   Customer: ${currentOrder.customerName} (${currentOrder.customerEmail})\n`);
    
    // Update to EA Pro + Source Code MT4
    const result = await Order.updateOne(
      { orderId },
      {
        $set: {
          productId: 'ea-pro-source-mt4',
          productName: 'EA ThebenchmarkTrader Pro + Source Code (MT4)',
          amount: 1490000000  // 14.9M VND in cents
        }
      }
    );
    
    if (result.modifiedCount > 0) {
      console.log('✅ Order updated successfully!\n');
      
      // Show new data
      const updatedOrder = await Order.findOne({ orderId });
      console.log('NEW (CORRECT) DATA:');
      console.log(`   ProductId: ${updatedOrder.productId}`);
      console.log(`   ProductName: ${updatedOrder.productName}`);
      console.log(`   Amount: ${(updatedOrder.amount / 100).toLocaleString('vi-VN')}đ`);
      console.log(`   Customer: ${updatedOrder.customerName} (${updatedOrder.customerEmail})\n`);
      
      console.log('🎯 NEXT STEPS:');
      console.log('   1. Resend email to customer');
      console.log(`   2. Email: ${updatedOrder.customerEmail}`);
      console.log(`   3. Order code: ${orderId}`);
      console.log(`   4. Product: EA Pro + Source Code (MT4)`);
      console.log(`   5. Amount: 14.900.000đ\n`);
      
      console.log('📧 Email template: KIETTONG_CORRECTED_EMAIL_TEMPLATE.html');
      console.log('   Replace [ORDER_ID] with: ' + orderId);
      console.log('   Replace [CUSTOMER_NAME] with: ' + updatedOrder.customerName);
    } else {
      console.log('⚠️  No changes made - order might already be correct\n');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Done!');
  }
}

quickFix();

/*
USAGE:
export MONGODB_URI="your-mongodb-uri"
node quick-fix-kiettong-96K95691P40465515.js

NOTE: This assumes customer bought EA Pro + Source Code (14.9M)
If they bought a different product, adjust the script accordingly!
*/

