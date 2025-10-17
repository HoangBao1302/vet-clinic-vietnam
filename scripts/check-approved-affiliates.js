const mongoose = require('mongoose');

// Connect to MongoDB
const connectDB = async () => {
  try {
    // Use the MongoDB URI from environment or default
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/thebenchmarktrader';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    console.log('💡 Make sure to set MONGODB_URI environment variable');
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
  createdAt: Date,
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

// Check approved affiliates
const checkApprovedAffiliates = async () => {
  try {
    await connectDB();

    console.log('🔍 Checking approved affiliates...\n');

    // Find all approved affiliates
    const approvedAffiliates = await User.find({ 
      affiliateStatus: 'approved',
      affiliateCode: { $exists: true, $ne: null }
    }).select('username email affiliateCode membershipTier isPaid createdAt');

    if (approvedAffiliates.length === 0) {
      console.log('❌ No approved affiliates found');
      return;
    }

    console.log(`✅ Found ${approvedAffiliates.length} approved affiliate(s):\n`);

    approvedAffiliates.forEach((affiliate, index) => {
      console.log(`📋 Affiliate #${index + 1}:`);
      console.log(`   Username: ${affiliate.username}`);
      console.log(`   Email: ${affiliate.email}`);
      console.log(`   Affiliate Code: ${affiliate.affiliateCode}`);
      console.log(`   Membership: ${affiliate.membershipTier}`);
      console.log(`   Is Paid: ${affiliate.isPaid}`);
      console.log(`   Created: ${affiliate.createdAt?.toLocaleDateString()}`);
      console.log('');
    });

    // Generate tracking links for each affiliate
    console.log('🔗 Tracking Links for Testing:\n');

    const products = [
      { id: 'ea-full', name: 'EA Full Version', price: 7900000 },
      { id: 'ea-pro-source', name: 'EA Pro + Source', price: 14900000 },
      { id: 'indicator-pro', name: 'Multi-Indicator Pack', price: 1990000 },
    ];

    approvedAffiliates.forEach((affiliate, index) => {
      console.log(`🎯 Affiliate #${index + 1} (${affiliate.username}):`);
      
      products.forEach(product => {
        const commissionRate = affiliate.isPaid ? 35 : 30;
        const estimatedCommission = Math.round(product.price * commissionRate / 100);
        
        console.log(`   ${product.name}:`);
        console.log(`   https://thebenchmarktrader.com?affiliate=${affiliate.affiliateCode}&product=${product.id}`);
        console.log(`   Commission: ${commissionRate}% (${estimatedCommission.toLocaleString('vi-VN')}đ)`);
        console.log('');
      });
    });

    // Check existing clicks/conversions
    console.log('📊 Existing Affiliate Activity:\n');

    const AffiliateClickSchema = new mongoose.Schema({
      affiliateCode: String,
      clickedAt: Date,
      status: String,
      commissionAmount: Number,
      productId: String,
    });

    const AffiliateClick = mongoose.models.AffiliateClick || mongoose.model('AffiliateClick', AffiliateClickSchema);

    for (const affiliate of approvedAffiliates) {
      const clicks = await AffiliateClick.find({ affiliateCode: affiliate.affiliateCode });
      const conversions = clicks.filter(c => c.status === 'converted' || c.status === 'paid');
      const totalCommission = clicks.reduce((sum, c) => sum + (c.commissionAmount || 0), 0);

      console.log(`📈 ${affiliate.username} (${affiliate.affiliateCode}):`);
      console.log(`   Total Clicks: ${clicks.length}`);
      console.log(`   Conversions: ${conversions.length}`);
      console.log(`   Conversion Rate: ${clicks.length > 0 ? (conversions.length / clicks.length * 100).toFixed(1) : 0}%`);
      console.log(`   Total Commission: ${totalCommission.toLocaleString('vi-VN')}đ`);
      console.log('');
    }

    console.log('🧪 Testing Instructions:');
    console.log('1. Use the tracking links above to test');
    console.log('2. Go to /affiliate/test for automated testing');
    console.log('3. Login with affiliate accounts to check dashboard');
    console.log('4. Monitor real-time stats and conversions');

  } catch (error) {
    console.error('❌ Error checking affiliates:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 MongoDB connection closed');
  }
};

// Run the script
checkApprovedAffiliates();
