const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  membershipTier: {
    type: String,
    enum: ['free', 'paid'],
    default: 'free',
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  affiliateStatus: {
    type: String,
    enum: ['none', 'pending', 'approved', 'rejected'],
    default: 'none',
  },
  affiliateCode: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

// Create admin account
const createAdminAccount = async () => {
  try {
    await connectDB();

    console.log('🆕 Creating admin account...\n');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    
    if (existingAdmin) {
      console.log('✅ Admin account already exists:');
      console.log(`   Username: ${existingAdmin.username}`);
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Role: ${existingAdmin.role}`);
      console.log('\n🔑 Login Instructions:');
      console.log('1. Go to /login');
      console.log(`2. Use email: ${existingAdmin.email}`);
      console.log('3. Use your admin password');
      console.log('4. Go to /admin/conversions');
      return;
    }

    // Create new admin account
    const adminUser = new User({
      username: 'admin',
      email: 'admin@thebenchmarktrader.com',
      password: 'admin123', // Will be hashed automatically
      role: 'admin',
      membershipTier: 'paid',
      isPaid: true,
      affiliateStatus: 'none',
    });

    await adminUser.save();
    console.log('✅ Admin account created successfully!');
    console.log('\n📋 Admin Account Details:');
    console.log('Username: admin');
    console.log('Email: admin@thebenchmarktrader.com');
    console.log('Password: admin123');
    console.log('Role: admin');
    
    console.log('\n🔑 Login Instructions:');
    console.log('1. Go to /login');
    console.log('2. Use email: admin@thebenchmarktrader.com');
    console.log('3. Use password: admin123');
    console.log('4. Go to /admin/conversions');
    
    console.log('\n⚠️  IMPORTANT: Change the password after first login!');

  } catch (error) {
    console.error('❌ Error creating admin account:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 MongoDB connection closed');
  }
};

// Run the script
createAdminAccount();
