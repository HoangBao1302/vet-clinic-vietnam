const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
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
  affiliateCode: {
    type: String,
  },
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

// Create test affiliate user
const createTestAffiliate = async () => {
  try {
    await connectDB();

    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'affiliate@test.com' });
    
    if (existingUser) {
      console.log('🔄 Updating existing test affiliate user...');
      
      // Update to approved affiliate
      existingUser.affiliateStatus = 'approved';
      existingUser.affiliateCode = 'AFF-TEST-ABC123';
      existingUser.membershipTier = 'free';
      existingUser.isPaid = false;
      
      await existingUser.save();
      console.log('✅ Test affiliate user updated successfully!');
    } else {
      console.log('🆕 Creating new test affiliate user...');
      
      // Create new test user
      const testUser = new User({
        username: 'testaffiliate',
        email: 'affiliate@test.com',
        password: '123456', // Will be hashed automatically
        role: 'user',
        membershipTier: 'free',
        isPaid: false,
        affiliateStatus: 'approved',
        affiliateCode: 'AFF-TEST-ABC123',
      });

      await testUser.save();
      console.log('✅ Test affiliate user created successfully!');
    }

    // Display user info
    const user = await User.findOne({ email: 'affiliate@test.com' });
    console.log('\n📋 Test Affiliate User Info:');
    console.log('Username:', user.username);
    console.log('Email:', user.email);
    console.log('Password: 123456');
    console.log('Affiliate Code:', user.affiliateCode);
    console.log('Status:', user.affiliateStatus);
    console.log('Membership:', user.membershipTier);
    
    console.log('\n🔗 Test Tracking Links:');
    console.log('EA Full: https://thebenchmarktrader.com?affiliate=AFF-TEST-ABC123&product=ea-full');
    console.log('EA Pro: https://thebenchmarktrader.com?affiliate=AFF-TEST-ABC123&product=ea-pro-source');
    console.log('Indicators: https://thebenchmarktrader.com?affiliate=AFF-TEST-ABC123&product=indicator-pro');
    
    console.log('\n🧪 Test Instructions:');
    console.log('1. Login with: affiliate@test.com / 123456');
    console.log('2. Go to: /affiliate/dashboard');
    console.log('3. Go to: /affiliate/test');
    console.log('4. Test the tracking links above');

  } catch (error) {
    console.error('❌ Error creating test affiliate:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 MongoDB connection closed');
  }
};

// Run the script
createTestAffiliate();
