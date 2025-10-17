const mongoose = require('mongoose');

// Connect to MongoDB
const connectDB = async () => {
  try {
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
  password: String,
  affiliateStatus: String,
  affiliateCode: String,
  membershipTier: String,
  isPaid: Boolean,
  createdAt: Date,
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

// Check specific users
const checkSpecificUsers = async () => {
  try {
    await connectDB();

    console.log('🔍 Checking specific affiliate users...\n');

    const emails = [
      'hoangkim.helen@gmail.com',
      'phamthithuanyen93@gmail.com'
    ];

    for (const email of emails) {
      console.log(`📧 Checking: ${email}`);
      
      const user = await User.findOne({ email }).select('username email affiliateStatus affiliateCode membershipTier isPaid createdAt');
      
      if (!user) {
        console.log('❌ User not found in database');
        console.log('');
        continue;
      }

      console.log('✅ User found:');
      console.log(`   Username: ${user.username}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Affiliate Status: ${user.affiliateStatus}`);
      console.log(`   Affiliate Code: ${user.affiliateCode || 'NOT SET'}`);
      console.log(`   Membership: ${user.membershipTier}`);
      console.log(`   Is Paid: ${user.isPaid}`);
      console.log(`   Created: ${user.createdAt?.toLocaleDateString()}`);
      
      // Check if user can access affiliate dashboard
      if (user.affiliateStatus === 'approved' && user.affiliateCode) {
        console.log('✅ Can access affiliate dashboard');
        
        // Generate sample tracking links
        console.log('🔗 Sample tracking links:');
        const products = [
          { id: 'ea-full', name: 'EA Full Version' },
          { id: 'ea-pro-source', name: 'EA Pro + Source' },
          { id: 'indicator-pro', name: 'Multi-Indicator Pack' }
        ];
        
        products.forEach(product => {
          const link = `https://thebenchmarktrader.com?affiliate=${user.affiliateCode}&product=${product.id}`;
          console.log(`   ${product.name}: ${link}`);
        });
      } else {
        console.log('❌ Cannot access affiliate dashboard:');
        if (user.affiliateStatus !== 'approved') {
          console.log(`   - Status is "${user.affiliateStatus}", not "approved"`);
        }
        if (!user.affiliateCode) {
          console.log('   - No affiliate code assigned');
        }
      }
      
      console.log('');
    }

    // Check all users with affiliate status
    console.log('📊 All users with affiliate status:');
    const allAffiliateUsers = await User.find({
      affiliateStatus: { $exists: true, $ne: 'none' }
    }).select('username email affiliateStatus affiliateCode');

    console.log(`Found ${allAffiliateUsers.length} users with affiliate status:`);
    allAffiliateUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.username} (${user.email}) - ${user.affiliateStatus} - ${user.affiliateCode || 'NO CODE'}`);
    });

  } catch (error) {
    console.error('❌ Error checking users:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 MongoDB connection closed');
  }
};

// Run the script
checkSpecificUsers();
