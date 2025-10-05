// Script to promote a user to admin
// Usage: node scripts/make-admin.js <email>

const mongoose = require('mongoose');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://leopardsmart_user:QyP69n73WYWJOUGy@cluster0.gghymaa.mongodb.net/leopardsmart?retryWrites=true&w=majority&appName=Cluster0';

// User schema (simplified)
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  // ... other fields
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function makeAdmin(email) {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log(`🔍 Finding user with email: ${email}`);
    const user = await User.findOne({ email });

    if (!user) {
      console.error('❌ User not found!');
      process.exit(1);
    }

    console.log(`👤 Found user: ${user.username} (${user.email})`);
    console.log(`📋 Current role: ${user.role}`);

    if (user.role === 'admin') {
      console.log('✅ User is already an admin!');
      process.exit(0);
    }

    user.role = 'admin';
    await user.save();

    console.log('✅ User promoted to admin successfully!');
    console.log(`👨‍💼 ${user.username} is now an admin!`);

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Get email from command line argument
const email = process.argv[2];

if (!email) {
  console.error('❌ Please provide an email address');
  console.log('Usage: node scripts/make-admin.js <email>');
  console.log('Example: node scripts/make-admin.js truong.cdk0405@gmail.com');
  process.exit(1);
}

makeAdmin(email);
