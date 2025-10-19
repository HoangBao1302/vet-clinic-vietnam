require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// User Schema
const userSchema = new mongoose.Schema({
  email: String,
  affiliateStatus: String,
  affiliateCode: String,
  totalCommissionEarned: Number,
  totalCommissionPaid: Number
});

// AffiliateClick Schema
const affiliateClickSchema = new mongoose.Schema({
  affiliateCode: String,
  commissionAmount: Number,
  status: String,
  clickedAt: Date
});

const User = mongoose.model('User', userSchema);
const AffiliateClick = mongoose.model('AffiliateClick', affiliateClickSchema);

async function debugCommissionData() {
  await connectDB();
  
  console.log('\n=== DEBUG COMMISSION DATA ===\n');
  
  // Check specific users
  const users = ['hoangkim', 'thuanyen', 'kietdangtong'];
  
  for (const email of users) {
    console.log(`\n--- User: ${email} ---`);
    
    // Get user data
    const user = await User.findOne({ email: email + '@gmail.com' });
    if (!user) {
      console.log('User not found');
      continue;
    }
    
    console.log('User Document:');
    console.log('- affiliateStatus:', user.affiliateStatus);
    console.log('- affiliateCode:', user.affiliateCode);
    console.log('- totalCommissionEarned:', user.totalCommissionEarned);
    console.log('- totalCommissionPaid:', user.totalCommissionPaid);
    
    if (user.affiliateCode) {
      // Get affiliate clicks
      const clicks = await AffiliateClick.find({ affiliateCode: user.affiliateCode });
      console.log('\nAffiliate Clicks:');
      console.log('- Total clicks:', clicks.length);
      
      if (clicks.length > 0) {
        const totalEarned = clicks.reduce((sum, click) => sum + (click.commissionAmount || 0), 0);
        const totalPaid = clicks.filter(click => click.status === 'paid').reduce((sum, click) => sum + (click.commissionAmount || 0), 0);
        
        console.log('- Total commission earned:', totalEarned);
        console.log('- Total commission paid:', totalPaid);
        
        console.log('\nClick Details:');
        clicks.forEach((click, index) => {
          console.log(`  ${index + 1}. Amount: ${click.commissionAmount}, Status: ${click.status}, Date: ${click.clickedAt}`);
        });
      }
    }
  }
  
  // Check all affiliate clicks
  console.log('\n--- ALL AFFILIATE CLICKS ---');
  const allClicks = await AffiliateClick.find({});
  console.log('Total affiliate clicks in database:', allClicks.length);
  
  if (allClicks.length > 0) {
    console.log('\nAll clicks:');
    allClicks.forEach((click, index) => {
      console.log(`${index + 1}. Code: ${click.affiliateCode}, Amount: ${click.commissionAmount}, Status: ${click.status}`);
    });
  }
  
  await mongoose.disconnect();
  console.log('\nDisconnected from MongoDB');
}

debugCommissionData().catch(console.error);
