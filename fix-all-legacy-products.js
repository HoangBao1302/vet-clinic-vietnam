const mongoose = require('mongoose');

// MongoDB connection string
const MONGODB_URI = 'mongodb+srv://ethannguyen108:09012003@cluster0.fzwnf.mongodb.net/thebenchmarktrader?retryWrites=true&w=majority&appName=Cluster0';

// Order Schema
const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  status: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerName: { type: String, required: false, default: 'Customer' },
  customerPhone: { type: String, required: false, default: '' },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  paidAt: { type: Date },
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

async function fixAllLegacyProducts() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find all orders with legacy product IDs (missing -mt4/-mt5)
    const legacyOrders = await Order.find({
      productId: { 
        $in: ['ea-full', 'ea-pro-source', 'indicator-pro']
      }
    });

    console.log(`📋 Found ${legacyOrders.length} orders with legacy product IDs\n`);

    if (legacyOrders.length === 0) {
      console.log('✅ No legacy orders to fix!');
      return;
    }

    // Mapping for legacy products (default to MT4)
    const productMapping = {
      'ea-full': {
        newId: 'ea-full-mt4',
        newName: 'EA ThebenchmarkTrader Full Version (MT4)',
        expectedAmount: 790000000
      },
      'ea-pro-source': {
        newId: 'ea-pro-source-mt4',
        newName: 'EA ThebenchmarkTrader Pro + Source Code (MT4)',
        expectedAmount: 1490000000
      },
      'indicator-pro': {
        newId: 'indicator-pro-mt4',
        newName: 'Multi-Indicator Pro Pack (MT4)',
        expectedAmount: 199000000
      }
    };

    let fixedCount = 0;
    let skippedCount = 0;

    for (const order of legacyOrders) {
      const mapping = productMapping[order.productId];
      
      if (!mapping) {
        console.log(`⚠️ No mapping for ${order.productId}, skipping...`);
        skippedCount++;
        continue;
      }

      console.log(`🔧 Fixing order: ${order.orderId}`);
      console.log(`   Customer: ${order.customerEmail}`);
      console.log(`   Old: ${order.productId} (${(order.amount / 100).toLocaleString('vi-VN')}đ)`);
      console.log(`   New: ${mapping.newId} (${(mapping.expectedAmount / 100).toLocaleString('vi-VN')}đ)`);

      await Order.updateOne(
        { orderId: order.orderId },
        {
          $set: {
            productId: mapping.newId,
            productName: mapping.newName,
            amount: mapping.expectedAmount
          }
        }
      );

      fixedCount++;
      console.log(`   ✅ Fixed!\n`);
    }

    console.log('\n📊 Summary:');
    console.log(`   ✅ Fixed: ${fixedCount} orders`);
    console.log(`   ⚠️ Skipped: ${skippedCount} orders`);
    console.log(`   📋 Total: ${legacyOrders.length} orders`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  }
}

fixAllLegacyProducts();

