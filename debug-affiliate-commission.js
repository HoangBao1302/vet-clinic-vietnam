const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// Import models
const User = require('./lib/models/User');
const AffiliateClick = require('./lib/models/AffiliateClick');

async function debugAffiliateCommission() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // 1. Check kietdangtong user data
    console.log('\n📊 Checking kietdangtong user data...');
    const kietdangtong = await User.findOne({ username: 'kietdangtong' });
    if (kietdangtong) {
      console.log('✅ kietdangtong found:', {
        email: kietdangtong.email,
        affiliateStatus: kietdangtong.affiliateStatus,
        affiliateCode: kietdangtong.affiliateCode,
        totalCommissionEarned: kietdangtong.totalCommissionEarned,
        totalCommissionPaid: kietdangtong.totalCommissionPaid,
        isPaid: kietdangtong.isPaid,
        membershipTier: kietdangtong.membershipTier
      });
    } else {
      console.log('❌ kietdangtong not found');
    }

    // 2. Check haidangtong user data
    console.log('\n📊 Checking haidangtong user data...');
    const haidangtong = await User.findOne({ username: 'haidangtong' });
    if (haidangtong) {
      console.log('✅ haidangtong found:', {
        email: haidangtong.email,
        affiliateStatus: haidangtong.affiliateStatus,
        affiliateCode: haidangtong.affiliateCode,
        totalCommissionEarned: haidangtong.totalCommissionEarned,
        totalCommissionPaid: haidangtong.totalCommissionPaid,
        isPaid: haidangtong.isPaid,
        membershipTier: haidangtong.membershipTier,
        purchasedProducts: haidangtong.purchasedProducts
      });
    } else {
      console.log('❌ haidangtong not found');
    }

    // 3. Check affiliate clicks for kietdangtong
    if (kietdangtong?.affiliateCode) {
      console.log('\n📊 Checking affiliate clicks for kietdangtong...');
      const clicks = await AffiliateClick.find({ 
        affiliateCode: kietdangtong.affiliateCode 
      }).sort({ clickedAt: -1 });
      
      console.log(`📈 Total clicks: ${clicks.length}`);
      clicks.forEach((click, index) => {
        console.log(`Click ${index + 1}:`, {
          clickedAt: click.clickedAt,
          status: click.status,
          productId: click.productId,
          productName: click.productName,
          customerEmail: click.customerEmail,
          customerName: click.customerName,
          commissionAmount: click.commissionAmount,
          orderId: click.orderId,
          convertedAt: click.convertedAt
        });
      });
    }

    // 4. Check all affiliate clicks (recent)
    console.log('\n📊 Checking recent affiliate clicks (all)...');
    const recentClicks = await AffiliateClick.find()
      .sort({ clickedAt: -1 })
      .limit(10);
    
    console.log(`📈 Recent clicks (last 10):`);
    recentClicks.forEach((click, index) => {
      console.log(`Click ${index + 1}:`, {
        affiliateCode: click.affiliateCode,
        clickedAt: click.clickedAt,
        status: click.status,
        productId: click.productId,
        customerEmail: click.customerEmail,
        commissionAmount: click.commissionAmount,
        orderId: click.orderId
      });
    });

    // 5. Check all users with affiliate status
    console.log('\n📊 Checking all affiliate users...');
    const affiliateUsers = await User.find({ 
      affiliateStatus: { $in: ['pending', 'approved', 'rejected'] } 
    }).select('username email affiliateStatus affiliateCode totalCommissionEarned totalCommissionPaid');
    
    console.log(`📈 Affiliate users (${affiliateUsers.length}):`);
    affiliateUsers.forEach((user, index) => {
      console.log(`User ${index + 1}:`, {
        username: user.username,
        email: user.email,
        affiliateStatus: user.affiliateStatus,
        affiliateCode: user.affiliateCode,
        totalCommissionEarned: user.totalCommissionEarned,
        totalCommissionPaid: user.totalCommissionPaid
      });
    });

    // 6. Check for any orders with affiliate codes
    console.log('\n📊 Checking for orders with affiliate codes...');
    const ordersWithAffiliate = await AffiliateClick.find({
      status: 'converted',
      orderId: { $exists: true }
    }).sort({ convertedAt: -1 });
    
    console.log(`📈 Converted orders (${ordersWithAffiliate.length}):`);
    ordersWithAffiliate.forEach((order, index) => {
      console.log(`Order ${index + 1}:`, {
        affiliateCode: order.affiliateCode,
        orderId: order.orderId,
        convertedAt: order.convertedAt,
        productId: order.productId,
        productName: order.productName,
        customerEmail: order.customerEmail,
        commissionAmount: order.commissionAmount
      });
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the debug
debugAffiliateCommission();
