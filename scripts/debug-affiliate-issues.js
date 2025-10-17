const mongoose = require('mongoose');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/thebenchmarktrader';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// User Schema
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  affiliateStatus: String,
  affiliateCode: String,
  membershipTier: String,
  isPaid: Boolean,
});

// AffiliateClick Schema
const AffiliateClickSchema = new mongoose.Schema({
  affiliateCode: String,
  clickedAt: Date,
  status: String,
  convertedAt: Date,
  orderId: String,
  commissionAmount: Number,
  productId: String,
  productName: String,
  customerEmail: String,
  customerName: String,
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const AffiliateClick = mongoose.models.AffiliateClick || mongoose.model('AffiliateClick', AffiliateClickSchema);

// Debug affiliate issues
const debugAffiliateIssues = async () => {
  try {
    await connectDB();

    console.log('🔍 Debugging Affiliate Issues...\n');

    // 1. Check hoangkim user data
    console.log('1️⃣ Checking hoangkim user data:');
    const hoangkim = await User.findOne({ email: 'hoangkim.helen@gmail.com' });
    if (hoangkim) {
      console.log('✅ hoangkim found:');
      console.log(`   Username: ${hoangkim.username}`);
      console.log(`   Email: ${hoangkim.email}`);
      console.log(`   Affiliate Status: ${hoangkim.affiliateStatus}`);
      console.log(`   Affiliate Code: ${hoangkim.affiliateCode}`);
      console.log(`   Membership: ${hoangkim.membershipTier}`);
      console.log(`   Is Paid: ${hoangkim.isPaid}`);
    } else {
      console.log('❌ hoangkim not found');
    }

    // 2. Check thuanyen user data
    console.log('\n2️⃣ Checking thuanyen user data:');
    const thuanyen = await User.findOne({ email: 'phamthithuanyen93@gmail.com' });
    if (thuanyen) {
      console.log('✅ thuanyen found:');
      console.log(`   Username: ${thuanyen.username}`);
      console.log(`   Email: ${thuanyen.email}`);
      console.log(`   Affiliate Status: ${thuanyen.affiliateStatus}`);
      console.log(`   Affiliate Code: ${thuanyen.affiliateCode}`);
      console.log(`   Membership: ${thuanyen.membershipTier}`);
      console.log(`   Is Paid: ${thuanyen.isPaid}`);
    } else {
      console.log('❌ thuanyen not found');
    }

    // 3. Check affiliate clicks for hoangkim
    console.log('\n3️⃣ Checking affiliate clicks for hoangkim:');
    const hoangkimClicks = await AffiliateClick.find({ 
      affiliateCode: hoangkim?.affiliateCode 
    }).sort({ clickedAt: -1 });

    console.log(`Found ${hoangkimClicks.length} clicks for hoangkim:`);
    hoangkimClicks.forEach((click, index) => {
      console.log(`   ${index + 1}. ${click.clickedAt?.toLocaleString()} - ${click.status} - ${click.productId || 'N/A'}`);
      if (click.orderId) {
        console.log(`      Order ID: ${click.orderId}`);
        console.log(`      Commission: ${click.commissionAmount?.toLocaleString('vi-VN')}đ`);
      }
    });

    // 4. Check affiliate clicks for thuanyen
    console.log('\n4️⃣ Checking affiliate clicks for thuanyen:');
    const thuanyenClicks = await AffiliateClick.find({ 
      affiliateCode: thuanyen?.affiliateCode 
    }).sort({ clickedAt: -1 });

    console.log(`Found ${thuanyenClicks.length} clicks for thuanyen:`);
    thuanyenClicks.forEach((click, index) => {
      console.log(`   ${index + 1}. ${click.clickedAt?.toLocaleString()} - ${click.status} - ${click.productId || 'N/A'}`);
      if (click.orderId) {
        console.log(`      Order ID: ${click.orderId}`);
        console.log(`      Commission: ${click.commissionAmount?.toLocaleString('vi-VN')}đ`);
      }
    });

    // 5. Check for recent orders with affiliate codes
    console.log('\n5️⃣ Checking recent orders with affiliate codes:');
    const recentOrders = await AffiliateClick.find({
      orderId: { $exists: true, $ne: null },
      convertedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
    }).sort({ convertedAt: -1 });

    console.log(`Found ${recentOrders.length} recent conversions:`);
    recentOrders.forEach((order, index) => {
      console.log(`   ${index + 1}. ${order.convertedAt?.toLocaleString()}`);
      console.log(`      Affiliate: ${order.affiliateCode}`);
      console.log(`      Order ID: ${order.orderId}`);
      console.log(`      Customer: ${order.customerEmail}`);
      console.log(`      Product: ${order.productName}`);
      console.log(`      Commission: ${order.commissionAmount?.toLocaleString('vi-VN')}đ`);
    });

    // 6. Check for kietdangtong0812 orders
    console.log('\n6️⃣ Checking for kietdangtong0812 orders:');
    const kietOrders = await AffiliateClick.find({
      $or: [
        { customerEmail: { $regex: 'kietdangtong0812', $options: 'i' } },
        { customerName: { $regex: 'kietdangtong0812', $options: 'i' } }
      ]
    });

    if (kietOrders.length > 0) {
      console.log(`Found ${kietOrders.length} orders for kietdangtong0812:`);
      kietOrders.forEach((order, index) => {
        console.log(`   ${index + 1}. ${order.convertedAt?.toLocaleString()}`);
        console.log(`      Affiliate: ${order.affiliateCode}`);
        console.log(`      Order ID: ${order.orderId}`);
        console.log(`      Customer: ${order.customerEmail}`);
        console.log(`      Status: ${order.status}`);
      });
    } else {
      console.log('❌ No orders found for kietdangtong0812');
    }

    // 7. Recommendations
    console.log('\n🔧 Recommendations:');
    
    if (hoangkimClicks.length === 0) {
      console.log('❌ hoangkim has no clicks - affiliate link may not be working');
    }
    
    if (hoangkimClicks.filter(c => c.status === 'converted').length === 0) {
      console.log('❌ hoangkim has no conversions - webhook may not be processing correctly');
    }
    
    if (kietOrders.length === 0) {
      console.log('❌ kietdangtong0812 order not found - check if:');
      console.log('   - Payment was completed successfully');
      console.log('   - Webhook was triggered');
      console.log('   - Affiliate code was passed in metadata');
    }

  } catch (error) {
    console.error('❌ Error debugging affiliate issues:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 MongoDB connection closed');
  }
};

// Run the script
debugAffiliateIssues();
