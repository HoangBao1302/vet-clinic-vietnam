// Test script to fix kietdangtong's commission
const fetch = require('node-fetch');

async function fixCommission() {
  try {
    console.log('🔧 Fixing kietdangtong\'s commission...\n');

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/admin/fix-commission`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        affiliateUsername: 'kietdangtong',
        customerUsername: 'haidangtong',
        products: ['ea-full', 'ea-pro-source'] // Assuming these are the products haidangtong bought
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Commission fixed successfully!');
      console.log('\n📊 Results:');
      console.log(`   Affiliate: ${data.data.affiliate.username}`);
      console.log(`   Affiliate Code: ${data.data.affiliate.affiliateCode}`);
      console.log(`   Total Commission Earned: ${data.data.affiliate.totalCommissionEarned.toLocaleString('vi-VN')}đ`);
      console.log(`   Customer: ${data.data.customer.username}`);
      console.log(`   Total Commission Fixed: ${data.data.totalCommission.toLocaleString('vi-VN')}đ`);
      
      console.log('\n📦 Commission Records:');
      data.data.commissionRecords.forEach((record, index) => {
        console.log(`   ${index + 1}. ${record.productName}`);
        console.log(`      Price: ${record.price.toLocaleString('vi-VN')}đ`);
        console.log(`      Commission Rate: ${record.commissionRate}%`);
        console.log(`      Commission: ${record.commissionAmount.toLocaleString('vi-VN')}đ`);
      });
      
    } else {
      const errorData = await response.json();
      console.log('❌ Failed to fix commission:', errorData);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the fix
fixCommission();

