// Fix specific orders for kiettong and haitong
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined');
  process.exit(1);
}

// Define Order schema (must match your actual schema)
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

async function fixOrders() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Fix kiettong's order
    console.log('════════════════════════════════════════════════════════════════════════════════');
    console.log('🔧 FIXING KIETTONG ORDER: 96K95691P40465515');
    console.log('════════════════════════════════════════════════════════════════════════════════\n');

    const kietOrder = await Order.findOne({ orderId: '96K95691P40465515' });
    
    if (!kietOrder) {
      console.error('❌ Order 96K95691P40465515 not found!');
    } else {
      console.log('📦 Current data:');
      console.log(`   ProductId: ${kietOrder.productId}`);
      console.log(`   ProductName: ${kietOrder.productName}`);
      console.log(`   Amount: ${kietOrder.amount.toLocaleString('vi-VN')}đ`);
      console.log(`   Email: ${kietOrder.customerEmail}\n`);

      const kietResult = await Order.updateOne(
        { orderId: '96K95691P40465515' },
        {
          $set: {
            productId: 'ea-pro-source-mt4',
            productName: 'EA ThebenchmarkTrader Pro + Source Code (MT4)',
            amount: 1490000000, // 14.9M VND in cents
          }
        }
      );

      if (kietResult.modifiedCount > 0) {
        console.log('✅ Successfully updated kiettong order!');
        const updatedKiet = await Order.findOne({ orderId: '96K95691P40465515' });
        console.log('\n📦 New data:');
        console.log(`   ProductId: ${updatedKiet.productId}`);
        console.log(`   ProductName: ${updatedKiet.productName}`);
        console.log(`   Amount: ${(updatedKiet.amount / 100).toLocaleString('vi-VN')}đ (${updatedKiet.amount} cents)`);
      } else {
        console.log('⚠️  No changes made (maybe already correct?)');
      }
    }

    // Fix haitong's order
    console.log('\n════════════════════════════════════════════════════════════════════════════════');
    console.log('🔧 FIXING HAITONG ORDER: 0P865189JG6525712');
    console.log('════════════════════════════════════════════════════════════════════════════════\n');

    const haiOrder = await Order.findOne({ orderId: '0P865189JG6525712' });
    
    if (!haiOrder) {
      console.error('❌ Order 0P865189JG6525712 not found!');
    } else {
      console.log('📦 Current data:');
      console.log(`   ProductId: ${haiOrder.productId}`);
      console.log(`   ProductName: ${haiOrder.productName}`);
      console.log(`   Amount: ${haiOrder.amount.toLocaleString('vi-VN')}đ`);
      console.log(`   Email: ${haiOrder.customerEmail}\n`);

      const haiResult = await Order.updateOne(
        { orderId: '0P865189JG6525712' },
        {
          $set: {
            productId: 'ea-full-mt4',
            productName: 'EA ThebenchmarkTrader Full Version (MT4)',
            amount: 790000000, // 7.9M VND in cents
          }
        }
      );

      if (haiResult.modifiedCount > 0) {
        console.log('✅ Successfully updated haitong order!');
        const updatedHai = await Order.findOne({ orderId: '0P865189JG6525712' });
        console.log('\n📦 New data:');
        console.log(`   ProductId: ${updatedHai.productId}`);
        console.log(`   ProductName: ${updatedHai.productName}`);
        console.log(`   Amount: ${(updatedHai.amount / 100).toLocaleString('vi-VN')}đ (${updatedHai.amount} cents)`);
      } else {
        console.log('⚠️  No changes made (maybe already correct?)');
      }
    }

    console.log('\n════════════════════════════════════════════════════════════════════════════════');
    console.log('✅ ALL FIXES COMPLETED!');
    console.log('════════════════════════════════════════════════════════════════════════════════\n');

    console.log('📧 Next step: Send corrected emails to:');
    console.log('   - kietdangtong0812@gmail.com (EA Pro + Source Code MT4 - 14.9M VND)');
    console.log('   - haidangtong2612@gmail.com (EA Full Version MT4 - 7.9M VND)\n');

    await mongoose.connection.close();
    console.log('👋 Database connection closed');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixOrders();

