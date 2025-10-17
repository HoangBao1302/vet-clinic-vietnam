/**
 * Script to check PayPal orders in database
 * Usage: node scripts/check-paypal-orders.js
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

// Import models
const Order = require('../lib/models/Order').default;
const AffiliateClick = require('../lib/models/AffiliateClick').default;
const User = require('../lib/models/User').default;

async function checkDatabase() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check PayPal Orders
    console.log('📦 Checking PayPal Orders...');
    const paypalOrders = await Order.find({ paymentMethod: 'paypal' }).sort({ createdAt: -1 });
    
    console.log(`Found ${paypalOrders.length} PayPal orders\n`);
    
    if (paypalOrders.length > 0) {
      console.log('📋 PayPal Orders List:');
      console.log('─'.repeat(100));
      
      for (const order of paypalOrders) {
        console.log(`Order ID: ${order.orderId}`);
        console.log(`  Product: ${order.productName || order.productId}`);
        console.log(`  Amount: ${(order.amount / 100).toLocaleString('vi-VN')}đ`);
        console.log(`  Customer: ${order.customerName} (${order.customerEmail})`);
        console.log(`  Date: ${order.createdAt}`);
        console.log('─'.repeat(100));
      }
    } else {
      console.log('⚠️ No PayPal orders found in database');
      console.log('💡 PayPal orders might only be in logs, not saved to DB');
    }

    // Check Affiliate Clicks
    console.log('\n📊 Checking Affiliate Clicks...');
    const totalClicks = await AffiliateClick.countDocuments();
    const convertedClicks = await AffiliateClick.countDocuments({ status: 'converted' });
    const clickedClicks = await AffiliateClick.countDocuments({ status: 'clicked' });
    
    console.log(`Total Affiliate Clicks: ${totalClicks}`);
    console.log(`  - Converted: ${convertedClicks}`);
    console.log(`  - Clicked (not converted): ${clickedClicks}`);

    // Check Affiliate Clicks by affiliate code
    console.log('\n👥 Affiliate Clicks Breakdown:');
    const clicksByAffiliate = await AffiliateClick.aggregate([
      {
        $group: {
          _id: '$affiliateCode',
          totalClicks: { $sum: 1 },
          converted: {
            $sum: { $cond: [{ $eq: ['$status', 'converted'] }, 1, 0] }
          },
          totalCommission: { $sum: '$commissionAmount' }
        }
      },
      { $sort: { totalClicks: -1 } }
    ]);

    if (clicksByAffiliate.length > 0) {
      console.log('─'.repeat(100));
      for (const affiliate of clicksByAffiliate) {
        const user = await User.findOne({ affiliateCode: affiliate._id });
        console.log(`Affiliate: ${affiliate._id} (${user ? user.username : 'Unknown'})`);
        console.log(`  Clicks: ${affiliate.totalClicks}`);
        console.log(`  Converted: ${affiliate.converted}`);
        console.log(`  Total Commission: ${(affiliate.totalCommission || 0).toLocaleString('vi-VN')}đ`);
        
        if (user) {
          console.log(`  User Commission Earned: ${(user.totalCommissionEarned || 0).toLocaleString('vi-VN')}đ`);
          console.log(`  User Commission Paid: ${(user.totalCommissionPaid || 0).toLocaleString('vi-VN')}đ`);
        }
        console.log('─'.repeat(100));
      }
    } else {
      console.log('⚠️ No affiliate clicks found');
    }

    // Check for clicks without conversion
    console.log('\n🔍 Looking for potential missing conversions...');
    const unconvertedClicks = await AffiliateClick.find({ 
      status: 'clicked',
      clickedAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } // older than 24 hours
    }).sort({ clickedAt: -1 });

    if (unconvertedClicks.length > 0) {
      console.log(`Found ${unconvertedClicks.length} clicks older than 24h that haven't converted:`);
      console.log('─'.repeat(100));
      for (const click of unconvertedClicks) {
        console.log(`Affiliate: ${click.affiliateCode}`);
        console.log(`  Product: ${click.productName || click.productId || 'N/A'}`);
        console.log(`  Clicked: ${click.clickedAt}`);
        console.log(`  IP: ${click.ipAddress}`);
        console.log('─'.repeat(100));
      }
    } else {
      console.log('✅ No old unconverted clicks found');
    }

    // Summary
    console.log('\n📊 Summary:');
    console.log(`Total PayPal Orders in DB: ${paypalOrders.length}`);
    console.log(`Total Affiliate Clicks: ${totalClicks}`);
    console.log(`Converted: ${convertedClicks}`);
    console.log(`Not Converted: ${clickedClicks}`);
    console.log(`Conversion Rate: ${totalClicks > 0 ? ((convertedClicks / totalClicks) * 100).toFixed(2) : 0}%`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

// Run the check
checkDatabase();

