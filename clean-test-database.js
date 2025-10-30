// Clean all test orders from database
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

async function cleanDatabase() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('════════════════════════════════════════════════════════════════════════════════');
    console.log('🗑️  CLEANING TEST DATABASE');
    console.log('════════════════════════════════════════════════════════════════════════════════\n');

    // Count all orders
    const totalOrders = await Order.countDocuments();
    console.log(`📊 Total orders in database: ${totalOrders}\n`);

    if (totalOrders === 0) {
      console.log('✅ Database is already clean!');
      await mongoose.connection.close();
      return;
    }

    // Show all orders before deletion
    const allOrders = await Order.find().sort({ createdAt: -1 });
    
    console.log('📋 Orders to be deleted:\n');
    allOrders.forEach((order, index) => {
      console.log(`${index + 1}. ${order.orderId}`);
      console.log(`   Customer: ${order.customerName} (${order.customerEmail})`);
      console.log(`   Product: ${order.productId}`);
      console.log(`   Amount: ${(order.amount / 100).toLocaleString('vi-VN')}đ`);
      console.log(`   Method: ${order.paymentMethod}`);
      console.log(`   Date: ${order.createdAt.toLocaleString('vi-VN')}\n`);
    });

    console.log('════════════════════════════════════════════════════════════════════════════════');
    console.log('⚠️  DELETING ALL TEST ORDERS...');
    console.log('════════════════════════════════════════════════════════════════════════════════\n');

    // Delete all orders
    const result = await Order.deleteMany({});

    console.log(`✅ Successfully deleted ${result.deletedCount} orders!\n`);

    // Verify deletion
    const remainingOrders = await Order.countDocuments();
    console.log(`📊 Remaining orders: ${remainingOrders}`);

    if (remainingOrders === 0) {
      console.log('✅ Database is now clean and ready for testing!\n');
    } else {
      console.log(`⚠️  Warning: ${remainingOrders} orders still remain`);
    }

    console.log('════════════════════════════════════════════════════════════════════════════════');
    console.log('🎯 NEXT STEPS:');
    console.log('════════════════════════════════════════════════════════════════════════════════\n');
    console.log('1. Run comprehensive test: node test-all-6-products-paypal.js');
    console.log('2. Test Stripe flow: node test-all-6-products-stripe.js');
    console.log('3. Verify downloads work correctly');
    console.log('4. Deploy to production\n');

    await mongoose.connection.close();
    console.log('👋 Database connection closed');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

cleanDatabase();

