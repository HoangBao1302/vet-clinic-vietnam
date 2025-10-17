const mongoose = require('mongoose');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://thebenchmarktrader_user:QyP69n73WYWJOUGy@cluster0.gghymaa.mongodb.net/thebenchmarktrader?retryWrites=true&w=majority&appName=Cluster0';
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
  password: String,
  role: String,
  affiliateStatus: String,
  affiliateCode: String,
  membershipTier: String,
  isPaid: Boolean,
  createdAt: Date,
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

// Find admin accounts
const findAdminAccounts = async () => {
  try {
    await connectDB();

    console.log('🔍 Searching for admin accounts...\n');

    // Find all admin users
    const adminUsers = await User.find({ role: 'admin' }).select('username email role createdAt');

    if (adminUsers.length === 0) {
      console.log('❌ No admin accounts found');
      console.log('\n💡 You need to create an admin account first');
      console.log('   Run: node scripts/make-admin.js');
    } else {
      console.log(`✅ Found ${adminUsers.length} admin account(s):\n`);
      
      adminUsers.forEach((admin, index) => {
        console.log(`👑 Admin #${index + 1}:`);
        console.log(`   Username: ${admin.username}`);
        console.log(`   Email: ${admin.email}`);
        console.log(`   Role: ${admin.role}`);
        console.log(`   Created: ${admin.createdAt?.toLocaleDateString()}`);
        console.log('');
      });

      console.log('🔑 Login Instructions:');
      console.log('1. Go to /login');
      console.log(`2. Use email: ${adminUsers[0].email}`);
      console.log('3. Use your admin password');
      console.log('4. Go to /admin/conversions');
    }

    // Also check if there are any users with admin-like emails
    console.log('\n🔍 Checking for potential admin emails...');
    const potentialAdmins = await User.find({
      $or: [
        { email: { $regex: 'admin', $options: 'i' } },
        { email: { $regex: 'support', $options: 'i' } },
        { email: { $regex: 'baotong', $options: 'i' } },
        { username: { $regex: 'admin', $options: 'i' } }
      ]
    }).select('username email role');

    if (potentialAdmins.length > 0) {
      console.log(`Found ${potentialAdmins.length} potential admin accounts:`);
      potentialAdmins.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.username} (${user.email}) - Role: ${user.role}`);
      });
    }

  } catch (error) {
    console.error('❌ Error finding admin accounts:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 MongoDB connection closed');
  }
};

// Run the script
findAdminAccounts();
