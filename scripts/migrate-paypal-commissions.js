/**
 * Migration script to add affiliate commissions for old PayPal orders
 * Usage: 
 *   - Dry run: node scripts/migrate-paypal-commissions.js
 *   - Apply: node scripts/migrate-paypal-commissions.js --apply
 *   - From file: node scripts/migrate-paypal-commissions.js --file paypal-orders.json --apply
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Define schemas directly (simpler than importing TS models)
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
  paymentMethod: String,
  customId: String,
  metadata: mongoose.Schema.Types.Mixed,
  affiliateCode: String
});

const AffiliateClickSchema = new mongoose.Schema({
  affiliateCode: String,
  clickedAt: Date,
  ipAddress: String,
  userAgent: String,
  referrer: String,
  convertedAt: Date,
  orderId: String,
  commissionAmount: Number,
  productId: String,
  productName: String,
  customerEmail: String,
  customerName: String,
  status: String
}, { timestamps: true });

const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  affiliateCode: String,
  affiliateStatus: String,
  totalCommissionEarned: Number,
  totalCommissionPaid: Number,
  isPaid: Boolean
});

// Get or create models
const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);
const AffiliateClick = mongoose.models.AffiliateClick || mongoose.model('AffiliateClick', AffiliateClickSchema);
const User = mongoose.models.User || mongoose.model('User', UserSchema);

// Parse command line arguments
const args = process.argv.slice(2);
const isDryRun = !args.includes('--apply');
const fileArg = args.find(arg => arg.startsWith('--file'));
const inputFile = fileArg ? fileArg.split('=')[1] : null;

// Commission rates
const COMMISSION_RATES = {
  'ea-full': { free: 0.30, paid: 0.35 },
  'ea-pro-source': { free: 0.30, paid: 0.35 },
  'indicator-pro': { free: 0.30, paid: 0.35 },
  'course': { free: 0.25, paid: 0.25 },
  'social-copy': { free: 0.10, paid: 0.10 },
};

const PRODUCT_NAMES = {
  'ea-full': 'EA ThebenchmarkTrader Full Version',
  'ea-pro-source': 'EA Pro + Source Code',
  'indicator-pro': 'Multi-Indicator Pro Pack',
  'course': 'Khóa học Forex Trading',
  'social-copy': 'Copy Social Trading',
};

/**
 * Load orders from file or database
 */
async function loadOrders() {
  if (inputFile) {
    console.log(`📂 Loading orders from file: ${inputFile}`);
    const filePath = path.join(process.cwd(), inputFile);
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return data.orders || data;
  } else {
    console.log('📦 Loading PayPal orders from database...');
    const orders = await Order.find({ paymentMethod: 'paypal' }).sort({ createdAt: -1 });
    return orders;
  }
}

/**
 * Parse affiliate code from custom_id or other fields
 */
function parseAffiliateCode(order) {
  // Try to get from custom_id format: "productId|affiliateCode"
  if (order.customId) {
    const parts = order.customId.split('|');
    if (parts.length === 2 && parts[1]) {
      return parts[1];
    }
  }
  
  // Try to get from metadata
  if (order.metadata && order.metadata.affiliateCode) {
    return order.metadata.affiliateCode;
  }
  
  // Try to get from affiliateCode field
  if (order.affiliateCode) {
    return order.affiliateCode;
  }
  
  return null;
}

/**
 * Calculate commission for an order
 */
function calculateCommission(order, affiliate) {
  const productId = order.productId;
  const amount = order.amount || 0;
  
  const rates = COMMISSION_RATES[productId];
  if (!rates) {
    console.warn(`  ⚠️ Unknown product: ${productId}, using default 30%`);
    return Math.round(amount * 0.30);
  }
  
  const rate = affiliate.isPaid ? rates.paid : rates.free;
  return Math.round(amount * rate);
}

/**
 * Process a single order
 */
async function processOrder(order, stats) {
  const orderId = order.orderId || order.id;
  console.log(`\n📦 Processing Order: ${orderId}`);
  console.log(`   Product: ${order.productName || order.productId}`);
  console.log(`   Amount: ${((order.amount || 0) / 100).toLocaleString('vi-VN')}đ`);
  console.log(`   Customer: ${order.customerName || 'N/A'} (${order.customerEmail || 'N/A'})`);
  
  // Parse affiliate code
  const affiliateCode = parseAffiliateCode(order);
  
  if (!affiliateCode) {
    console.log('   ⚠️ No affiliate code found - skipping');
    stats.skipped++;
    return;
  }
  
  console.log(`   Affiliate Code: ${affiliateCode}`);
  
  // Find affiliate user
  const affiliate = await User.findOne({ 
    affiliateCode, 
    affiliateStatus: 'approved' 
  });
  
  if (!affiliate) {
    console.log(`   ❌ Affiliate not found or not approved - skipping`);
    stats.skipped++;
    return;
  }
  
  console.log(`   Affiliate User: ${affiliate.username} (${affiliate.email})`);
  
  // Check if already processed
  const existingClick = await AffiliateClick.findOne({ 
    orderId: orderId,
    status: 'converted'
  });
  
  if (existingClick) {
    console.log(`   ✅ Already processed (Click ID: ${existingClick._id})`);
    stats.alreadyProcessed++;
    return;
  }
  
  // Calculate commission
  const commission = calculateCommission(order, affiliate);
  console.log(`   💰 Commission: ${commission.toLocaleString('vi-VN')}đ (${affiliate.isPaid ? '35%' : '30%'})`);
  
  if (isDryRun) {
    console.log('   🔍 DRY RUN - Would create/update:');
    console.log(`      - AffiliateClick with commission: ${commission}đ`);
    console.log(`      - User totalCommissionEarned: ${(affiliate.totalCommissionEarned || 0).toLocaleString('vi-VN')} → ${((affiliate.totalCommissionEarned || 0) + commission).toLocaleString('vi-VN')}đ`);
    stats.wouldProcess++;
  } else {
    try {
      // Find the most recent unconverted click for this affiliate
      let click = await AffiliateClick.findOne({
        affiliateCode,
        status: 'clicked',
        clickedAt: { $lte: new Date(order.createdAt || order.paidAt) }
      }).sort({ clickedAt: -1 });
      
      if (click) {
        // Update existing click
        click.status = 'converted';
        click.convertedAt = new Date(order.paidAt || order.createdAt);
        click.orderId = orderId;
        click.commissionAmount = commission;
        click.productId = order.productId;
        click.productName = PRODUCT_NAMES[order.productId] || order.productName || order.productId;
        click.customerEmail = order.customerEmail;
        click.customerName = order.customerName;
        await click.save();
        console.log(`   ✅ Updated existing click: ${click._id}`);
      } else {
        // Create new click record
        click = await AffiliateClick.create({
          affiliateCode,
          status: 'converted',
          clickedAt: new Date(order.createdAt || Date.now()),
          convertedAt: new Date(order.paidAt || order.createdAt || Date.now()),
          orderId: orderId,
          commissionAmount: commission,
          productId: order.productId,
          productName: PRODUCT_NAMES[order.productId] || order.productName || order.productId,
          customerEmail: order.customerEmail,
          customerName: order.customerName,
          ipAddress: 'migration',
          userAgent: 'migration-script',
          referrer: 'paypal-migration'
        });
        console.log(`   ✅ Created new click: ${click._id}`);
      }
      
      // Update user's total commission earned
      const oldTotal = affiliate.totalCommissionEarned || 0;
      affiliate.totalCommissionEarned = oldTotal + commission;
      await affiliate.save();
      
      console.log(`   ✅ Updated user commission: ${oldTotal.toLocaleString('vi-VN')} → ${affiliate.totalCommissionEarned.toLocaleString('vi-VN')}đ`);
      
      stats.processed++;
      stats.totalCommissionAdded += commission;
    } catch (error) {
      console.error(`   ❌ Error processing order:`, error.message);
      stats.errors++;
    }
  }
}

/**
 * Main migration function
 */
async function migrate() {
  try {
    console.log('🚀 PayPal Commissions Migration Script');
    console.log('═'.repeat(100));
    console.log(`Mode: ${isDryRun ? '🔍 DRY RUN (no changes will be made)' : '✅ APPLY MODE (changes will be saved)'}`);
    console.log('═'.repeat(100));
    
    console.log('\n🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Load orders
    const orders = await loadOrders();
    console.log(`\n📊 Found ${orders.length} orders to process\n`);
    
    if (orders.length === 0) {
      console.log('⚠️ No orders found to process');
      console.log('\n💡 Tips:');
      console.log('   1. Check if PayPal orders are saved in database');
      console.log('   2. Create a JSON file with orders and use --file option');
      console.log('   3. Example JSON format:');
      console.log('   {');
      console.log('     "orders": [');
      console.log('       {');
      console.log('         "orderId": "PAYPAL-123456",');
      console.log('         "productId": "ea-full",');
      console.log('         "amount": 790000000,');
      console.log('         "customerEmail": "customer@example.com",');
      console.log('         "customerName": "John Doe",');
      console.log('         "customId": "ea-full|AFF-USERNAME-ABC123",');
      console.log('         "createdAt": "2025-01-15T10:00:00Z",');
      console.log('         "paidAt": "2025-01-15T10:05:00Z"');
      console.log('       }');
      console.log('     ]');
      console.log('   }');
      return;
    }
    
    // Statistics
    const stats = {
      processed: 0,
      alreadyProcessed: 0,
      skipped: 0,
      wouldProcess: 0,
      errors: 0,
      totalCommissionAdded: 0
    };
    
    // Process each order
    for (const order of orders) {
      await processOrder(order, stats);
    }
    
    // Print summary
    console.log('\n' + '═'.repeat(100));
    console.log('📊 MIGRATION SUMMARY');
    console.log('═'.repeat(100));
    
    if (isDryRun) {
      console.log(`🔍 DRY RUN RESULTS:`);
      console.log(`   Would process: ${stats.wouldProcess} orders`);
      console.log(`   Already processed: ${stats.alreadyProcessed} orders`);
      console.log(`   Skipped (no affiliate): ${stats.skipped} orders`);
      console.log(`   \n💡 Run with --apply to actually apply changes`);
    } else {
      console.log(`✅ MIGRATION COMPLETE:`);
      console.log(`   Successfully processed: ${stats.processed} orders`);
      console.log(`   Already processed: ${stats.alreadyProcessed} orders`);
      console.log(`   Skipped (no affiliate): ${stats.skipped} orders`);
      console.log(`   Errors: ${stats.errors} orders`);
      console.log(`   Total commission added: ${stats.totalCommissionAdded.toLocaleString('vi-VN')}đ`);
    }
    
    console.log('═'.repeat(100));
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

// Run migration
migrate().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

