// Fix all kietdangtong orders based on email confirmations
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

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

async function fixOrders() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Order corrections based on email confirmations
    const corrections = [
      {
        orderId: '08C44041RJ769621X',
        correctData: {
          productId: 'ea-pro-source-mt5',
          productName: 'EA ThebenchmarkTrader Pro + Source Code (MT5)',
          amount: 1489992000 // 14.899.920đ in cents
        },
        reason: 'Email shows: MT5 Source Code, 14.899.920đ'
      },
      {
        orderId: '4GJ92129R5593362B',
        correctData: {
          productId: 'ea-pro-source-mt4',
          productName: 'EA ThebenchmarkTrader Pro + Source Code (MT4)',
          amount: 1489992000 // 14.899.920đ in cents
        },
        reason: 'Email shows: MT4 Source Code, 14.899.920đ'
      }
    ];

    console.log('🔧 Fixing orders...\n');
    console.log('='.repeat(80));

    for (const correction of corrections) {
      console.log(`\n📦 Order: ${correction.orderId}`);
      console.log(`Reason: ${correction.reason}`);
      
      // Find current order
      const currentOrder = await Order.findOne({ orderId: correction.orderId });
      
      if (!currentOrder) {
        console.log(`❌ Order not found!`);
        continue;
      }

      console.log(`\n📋 Current Data:`);
      console.log(`   Product ID: ${currentOrder.productId}`);
      console.log(`   Product Name: ${currentOrder.productName}`);
      console.log(`   Amount: ${(currentOrder.amount / 100).toLocaleString('vi-VN')}đ`);

      console.log(`\n✅ Correct Data:`);
      console.log(`   Product ID: ${correction.correctData.productId}`);
      console.log(`   Product Name: ${correction.correctData.productName}`);
      console.log(`   Amount: ${(correction.correctData.amount / 100).toLocaleString('vi-VN')}đ`);

      // Update order
      const result = await Order.updateOne(
        { orderId: correction.orderId },
        { $set: correction.correctData }
      );

      if (result.modifiedCount > 0) {
        console.log(`\n✅ Order updated successfully!`);
        
        // Verify
        const updatedOrder = await Order.findOne({ orderId: correction.orderId });
        console.log(`\n🔍 Verified:`);
        console.log(`   Product ID: ${updatedOrder.productId}`);
        console.log(`   Product Name: ${updatedOrder.productName}`);
        console.log(`   Amount: ${(updatedOrder.amount / 100).toLocaleString('vi-VN')}đ`);
      } else {
        console.log(`\n⚠️ No changes made`);
      }

      console.log('\n' + '-'.repeat(80));
    }

    console.log('\n' + '='.repeat(80));
    console.log('\n🎉 All orders fixed!');
    console.log('\n📋 Summary:');
    console.log(`- Order 08C44041RJ769621X: MT5 Source Code (14.9M)`);
    console.log(`- Order 4GJ92129R5593362B: MT4 Source Code (14.9M)`);
    console.log('\n✅ Customers can now download correct products!');

  } catch (error) {
    console.error('\n❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB\n');
  }
}

fixOrders();

