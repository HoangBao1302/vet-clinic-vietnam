/**
 * Quick check for specific affiliate conversions
 * Usage: node scripts/check-hoangkim-conversions.js
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

// Define schemas
const AffiliateClickSchema = new mongoose.Schema({
  affiliateCode: String,
  clickedAt: Date,
  ipAddress: String,
  convertedAt: Date,
  orderId: String,
  commissionAmount: Number,
  productId: String,
  productName: String,
  customerEmail: String,
  status: String
}, { timestamps: true });

const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  affiliateCode: String,
  totalCommissionEarned: Number,
  totalCommissionPaid: Number,
  isPaid: Boolean
});

const AffiliateClick = mongoose.models.AffiliateClick || mongoose.model('AffiliateClick', AffiliateClickSchema);
const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function checkConversions() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected\n');

    // Find HOANGKIM affiliate
    const affiliate = await User.findOne({ 
      affiliateCode: { $regex: /HOANGKIM/i }
    });

    if (!affiliate) {
      console.log('❌ Không tìm thấy affiliate HOANGKIM');
      return;
    }

    console.log('👤 Affiliate User:');
    console.log(`   Username: ${affiliate.username}`);
    console.log(`   Email: ${affiliate.email}`);
    console.log(`   Affiliate Code: ${affiliate.affiliateCode}`);
    console.log(`   Total Commission Earned: ${(affiliate.totalCommissionEarned || 0).toLocaleString('vi-VN')}đ`);
    console.log(`   Total Commission Paid: ${(affiliate.totalCommissionPaid || 0).toLocaleString('vi-VN')}đ`);
    console.log(`   Available: ${((affiliate.totalCommissionEarned || 0) - (affiliate.totalCommissionPaid || 0)).toLocaleString('vi-VN')}đ\n`);

    // Get all clicks for this affiliate
    const clicks = await AffiliateClick.find({ 
      affiliateCode: affiliate.affiliateCode 
    }).sort({ clickedAt: -1 });

    console.log('📊 All Clicks:');
    console.log('═'.repeat(100));
    
    let totalClicks = 0;
    let totalConverted = 0;
    let totalCommission = 0;

    for (const click of clicks) {
      totalClicks++;
      
      console.log(`\n${totalClicks}. Click ID: ${click._id}`);
      console.log(`   Status: ${click.status === 'converted' ? '✅ CONVERTED' : '⏳ CLICKED'}`);
      console.log(`   Clicked At: ${click.clickedAt}`);
      console.log(`   IP Address: ${click.ipAddress}`);
      
      if (click.status === 'converted') {
        totalConverted++;
        totalCommission += (click.commissionAmount || 0);
        
        console.log(`   Converted At: ${click.convertedAt}`);
        console.log(`   Order ID: ${click.orderId}`);
        console.log(`   Product: ${click.productName || click.productId}`);
        console.log(`   Commission: ${(click.commissionAmount || 0).toLocaleString('vi-VN')}đ`);
        console.log(`   Customer: ${click.customerEmail || 'N/A'}`);
      }
    }

    console.log('\n' + '═'.repeat(100));
    console.log('📈 SUMMARY:');
    console.log('═'.repeat(100));
    console.log(`Total Clicks: ${totalClicks}`);
    console.log(`Converted: ${totalConverted}`);
    console.log(`Not Converted: ${totalClicks - totalConverted}`);
    console.log(`Conversion Rate: ${totalClicks > 0 ? ((totalConverted / totalClicks) * 100).toFixed(2) : 0}%`);
    console.log(`Total Commission (from clicks): ${totalCommission.toLocaleString('vi-VN')}đ`);
    console.log(`Total Commission (in User): ${(affiliate.totalCommissionEarned || 0).toLocaleString('vi-VN')}đ`);
    
    if (totalCommission !== (affiliate.totalCommissionEarned || 0)) {
      console.log(`\n⚠️ MISMATCH DETECTED!`);
      console.log(`   Difference: ${(totalCommission - (affiliate.totalCommissionEarned || 0)).toLocaleString('vi-VN')}đ`);
      console.log(`   User model needs update!`);
    } else {
      console.log(`\n✅ Commission matches!`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Disconnected');
  }
}

checkConversions();

