// Find exact hoangkim order ID
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

async function findHoangKim() {
  try {
    await mongoose.connect(MONGODB_URI);
    
    console.log('🔍 SEARCHING FOR HOANGKIM ORDERS\n');
    console.log('════════════════════════════════════════════════════════════════════════════════\n');

    // Find all similar order IDs
    const similarOrders = await Order.find({
      orderId: { $regex: /76.*1S.*357.*64P/i }
    });

    console.log(`Found ${similarOrders.length} order(s) matching pattern:\n`);

    similarOrders.forEach((order, index) => {
      console.log(`${index + 1}. Order ID: ${order.orderId}`);
      console.log(`   Email: ${order.customerEmail}`);
      console.log(`   Product: ${order.productId}`);
      console.log(`   Amount: ${(order.amount / 100).toLocaleString('vi-VN')}đ`);
      console.log(`   Date: ${order.createdAt.toLocaleString('vi-VN')}\n`);
    });

    // Also find by email
    console.log('════════════════════════════════════════════════════════════════════════════════');
    console.log('🔍 SEARCHING BY EMAIL: hoangkim\n');

    const emailOrders = await Order.find({
      customerEmail: { $regex: /hoangkim/i }
    }).sort({ createdAt: -1 });

    console.log(`Found ${emailOrders.length} order(s) for hoangkim email:\n`);

    emailOrders.forEach((order, index) => {
      console.log(`${index + 1}. Order ID: ${order.orderId}`);
      console.log(`   Email: ${order.customerEmail}`);
      console.log(`   Product: ${order.productId}`);
      console.log(`   Name: ${order.productName}`);
      console.log(`   Amount: ${(order.amount / 100).toLocaleString('vi-VN')}đ`);
      console.log(`   Date: ${order.createdAt.toLocaleString('vi-VN')}\n`);
    });

    // Check the exact codes user mentioned
    console.log('════════════════════════════════════════════════════════════════════════════════');
    console.log('🔍 CHECKING SPECIFIC ORDER IDS:\n');

    const codes = [
      '76S07151S357764P',   // User typed (no space)
      '76S07151S5357764P',  // With extra 5
      '76S 07151 S5357764P', // With spaces
      '76S071515357764P',   // All together
    ];

    for (const code of codes) {
      const order = await Order.findOne({ orderId: code });
      if (order) {
        console.log(`✅ FOUND: ${code}`);
        console.log(`   Product: ${order.productId} - ${order.productName}`);
        console.log(`   Amount: ${(order.amount / 100).toLocaleString('vi-VN')}đ`);
        console.log(`   Email: ${order.customerEmail}\n`);
      } else {
        console.log(`❌ NOT FOUND: ${code}\n`);
      }
    }

    await mongoose.connection.close();

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

findHoangKim();



