const mongoose = require('mongoose');

// Connect to MongoDB Atlas
const MONGODB_URI = 'mongodb+srv://baotong130277:baotong130277@cluster0.8qgqj.mongodb.net/vet-clinic-vietnam?retryWrites=true&w=majority';

async function checkHoangkimStatus() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Define User schema
    const userSchema = new mongoose.Schema({
      username: String,
      email: String,
      password: String,
      role: { type: String, default: 'user' },
      isPaid: { type: Boolean, default: false },
      membershipTier: { type: String, default: 'free' },
      affiliateStatus: { type: String, default: 'none' },
      affiliateCode: String,
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    });

    const User = mongoose.model('User', userSchema);

    // Find hoangkim user
    const hoangkim = await User.findOne({ email: 'hoangkim.helen@gmail.com' });
    
    if (hoangkim) {
      console.log('\n🔍 HOANGKIM USER DATA:');
      console.log('========================');
      console.log('ID:', hoangkim._id);
      console.log('Username:', hoangkim.username);
      console.log('Email:', hoangkim.email);
      console.log('Role:', hoangkim.role);
      console.log('isPaid:', hoangkim.isPaid);
      console.log('membershipTier:', hoangkim.membershipTier);
      console.log('affiliateStatus:', hoangkim.affiliateStatus);
      console.log('affiliateCode:', hoangkim.affiliateCode);
      console.log('Created:', hoangkim.createdAt);
      console.log('Updated:', hoangkim.updatedAt);
      
      // Check if affiliateStatus needs to be updated
      if (hoangkim.affiliateStatus === 'none') {
        console.log('\n⚠️  ISSUE FOUND: affiliateStatus is "none"');
        console.log('This should be "approved" for hoangkim to access affiliate dashboard');
      } else {
        console.log('\n✅ affiliateStatus is correct:', hoangkim.affiliateStatus);
      }
    } else {
      console.log('❌ User hoangkim not found in database');
    }

    // Also check all users with affiliateStatus = 'approved'
    const approvedAffiliates = await User.find({ affiliateStatus: 'approved' });
    console.log('\n📊 ALL APPROVED AFFILIATES:');
    console.log('============================');
    approvedAffiliates.forEach((user, index) => {
      console.log(`${index + 1}. ${user.username} (${user.email}) - ${user.affiliateCode}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

checkHoangkimStatus();
