// Script to fix affiliate commission for kietdangtong and haidangtong
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function fixAffiliateCommission() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Import models
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    const AffiliateClick = mongoose.model('AffiliateClick', new mongoose.Schema({}, { strict: false }));

    // 1. Check kietdangtong user
    console.log('\n📊 Checking kietdangtong user...');
    const kietdangtong = await User.findOne({ username: 'kietdangtong' });
    
    if (!kietdangtong) {
      console.log('❌ kietdangtong user not found');
      return;
    }

    console.log('✅ kietdangtong found:', {
      email: kietdangtong.email,
      affiliateStatus: kietdangtong.affiliateStatus,
      affiliateCode: kietdangtong.affiliateCode,
      totalCommissionEarned: kietdangtong.totalCommissionEarned || 0,
      isPaid: kietdangtong.isPaid
    });

    // 2. Check haidangtong user
    console.log('\n📊 Checking haidangtong user...');
    const haidangtong = await User.findOne({ username: 'haidangtong' });
    
    if (!haidangtong) {
      console.log('❌ haidangtong user not found');
      return;
    }

    console.log('✅ haidangtong found:', {
      email: haidangtong.email,
      purchasedProducts: haidangtong.purchasedProducts || []
    });

    // 3. Check if kietdangtong is approved affiliate
    if (kietdangtong.affiliateStatus !== 'approved' || !kietdangtong.affiliateCode) {
      console.log('\n⚠️ kietdangtong is not an approved affiliate');
      console.log('🔧 Approving kietdangtong as affiliate...');
      
      kietdangtong.affiliateStatus = 'approved';
      if (!kietdangtong.affiliateCode) {
        kietdangtong.affiliateCode = `AFF-KIETDANGTONG-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      }
      await kietdangtong.save();
      console.log('✅ kietdangtong approved as affiliate with code:', kietdangtong.affiliateCode);
    }

    // 4. Check existing affiliate clicks
    console.log('\n📊 Checking existing affiliate clicks...');
    const existingClicks = await AffiliateClick.find({ 
      affiliateCode: kietdangtong.affiliateCode 
    });
    
    console.log(`📈 Found ${existingClicks.length} existing clicks`);

    // 5. Calculate commission for haidangtong's purchases
    console.log('\n💰 Calculating commission for haidangtong\'s purchases...');
    
    const products = haidangtong.purchasedProducts || [];
    let totalCommission = 0;
    
    for (const productId of products) {
      // Commission rates
      const commissionRates = {
        'ea-full': kietdangtong.isPaid ? 0.35 : 0.30,
        'ea-pro-source': kietdangtong.isPaid ? 0.35 : 0.30,
        'indicator-pro': kietdangtong.isPaid ? 0.35 : 0.30,
        'course': 0.25,
        'social-copy': 0.10,
      };

      // Product prices (in VND)
      const productPrices = {
        'ea-full': 7900000,
        'ea-pro-source': 14900000,
        'indicator-pro': 1990000,
        'course': 5000000,
        'social-copy': 2000000,
      };

      const commissionRate = commissionRates[productId] || 0.30;
      const productPrice = productPrices[productId] || 0;
      const commissionAmount = Math.round(productPrice * commissionRate);

      if (commissionAmount > 0) {
        totalCommission += commissionAmount;
        
        console.log(`📦 Product: ${productId}`);
        console.log(`   Price: ${productPrice.toLocaleString('vi-VN')}đ`);
        console.log(`   Commission Rate: ${(commissionRate * 100).toFixed(1)}%`);
        console.log(`   Commission: ${commissionAmount.toLocaleString('vi-VN')}đ`);
        
        // Create affiliate click record for this purchase
        const clickRecord = new AffiliateClick({
          affiliateCode: kietdangtong.affiliateCode,
          clickedAt: new Date(),
          ipAddress: 'manual-fix',
          userAgent: 'manual-fix-script',
          referrer: 'manual-fix',
          convertedAt: new Date(),
          orderId: `manual-fix-${Date.now()}`,
          commissionAmount: commissionAmount,
          productId: productId,
          productName: `Product ${productId}`,
          customerEmail: haidangtong.email,
          customerName: haidangtong.username,
          status: 'converted'
        });
        
        await clickRecord.save();
        console.log(`   ✅ Created commission record`);
      }
    }

    // 6. Update kietdangtong's total commission
    if (totalCommission > 0) {
      console.log(`\n💰 Total commission calculated: ${totalCommission.toLocaleString('vi-VN')}đ`);
      
      kietdangtong.totalCommissionEarned = (kietdangtong.totalCommissionEarned || 0) + totalCommission;
      await kietdangtong.save();
      
      console.log(`✅ Updated kietdangtong's total commission to: ${kietdangtong.totalCommissionEarned.toLocaleString('vi-VN')}đ`);
    } else {
      console.log('\n⚠️ No commission calculated - check product IDs');
    }

    // 7. Verify the fix
    console.log('\n🔍 Verifying the fix...');
    const updatedKietdangtong = await User.findOne({ username: 'kietdangtong' });
    const updatedClicks = await AffiliateClick.find({ 
      affiliateCode: kietdangtong.affiliateCode,
      status: 'converted'
    });
    
    console.log('✅ Final verification:');
    console.log(`   Total Commission Earned: ${updatedKietdangtong.totalCommissionEarned.toLocaleString('vi-VN')}đ`);
    console.log(`   Converted Clicks: ${updatedClicks.length}`);
    console.log(`   Total Commission from Clicks: ${updatedClicks.reduce((sum, click) => sum + (click.commissionAmount || 0), 0).toLocaleString('vi-VN')}đ`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the fix
fixAffiliateCommission();

