// Script to run manual conversion fix for Kiet Dang Tong
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function runManualConversionFix() {
  try {
    console.log('🔧 RUNNING MANUAL CONVERSION FIX');
    console.log('='.repeat(60));
    
    const baseUrl = 'https://thebenchmarktrader.com';
    
    // Orders to process
    const orders = [
      {
        orderId: '9FX639758F5890021',
        customerEmail: 'haidangtong2612@gmail.com',
        customerName: 'Hai Tong',
        productId: 'ea-full',
        amount: 7900000,
        paidAt: '2025-10-21T04:27:30.666+00:00',
        ipAddress: '183.81.79.86'
      },
      {
        orderId: '1AL59204G4941441N',
        customerEmail: 'anhkim.230923@gmail.com',
        customerName: 'Anh Kim',
        productId: 'ea-full',
        amount: 7900000,
        paidAt: '2025-10-21T04:30:23.934+00:00',
        ipAddress: '183.81.79.86'
      }
    ];
    
    console.log('\n📊 PROCESSING ORDERS:');
    console.log('-'.repeat(40));
    
    let totalCommission = 0;
    const results = [];
    
    for (const order of orders) {
      console.log(`\n🔍 Processing Order: ${order.orderId}`);
      console.log(`   Customer: ${order.customerName} (${order.customerEmail})`);
      console.log(`   Product: ${order.productId}`);
      console.log(`   Amount: ${order.amount.toLocaleString('vi-VN')}đ`);
      
      const response = await fetch(`${baseUrl}/api/admin/manual-conversion-fix`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order)
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.success) {
          console.log(`   ✅ Conversion fixed successfully!`);
          console.log(`   Affiliate: ${data.data.affiliateName} (${data.data.affiliateCode})`);
          console.log(`   Commission: ${data.data.commissionAmount.toLocaleString('vi-VN')}đ`);
          console.log(`   Total Earned: ${data.data.totalCommissionEarned.toLocaleString('vi-VN')}đ`);
          
          totalCommission += data.data.commissionAmount;
          results.push(data.data);
        } else {
          console.log(`   ❌ Failed: ${data.error}`);
        }
      } else {
        console.log(`   ❌ API Error: ${response.status}`);
        const error = await response.text();
        console.log(`   Error: ${error}`);
      }
    }
    
    console.log('\n📊 SUMMARY:');
    console.log('-'.repeat(40));
    
    console.log(`✅ Total Conversions Fixed: ${results.length}`);
    console.log(`💰 Total Commission: ${totalCommission.toLocaleString('vi-VN')}đ`);
    
    if (results.length > 0) {
      const affiliate = results[0];
      console.log(`📈 Affiliate: ${affiliate.affiliateName} (${affiliate.affiliateCode})`);
      console.log(`💵 Final Total Commission: ${affiliate.totalCommissionEarned.toLocaleString('vi-VN')}đ`);
    }
    
    console.log('\n🎯 EXPECTED DASHBOARD CHANGES:');
    console.log('-'.repeat(40));
    
    console.log('After this fix, Kiet Dang Tong\'s dashboard should show:');
    console.log(`   • Total Clicks: 3`);
    console.log(`   • Conversions: ${results.length}`);
    console.log(`   • Conversion Rate: ${((results.length / 3) * 100).toFixed(1)}%`);
    console.log(`   • Total Commission Earned: ${totalCommission.toLocaleString('vi-VN')}đ`);
    
    console.log('\n🔍 VERIFICATION STEPS:');
    console.log('-'.repeat(40));
    
    console.log('1. Check Kiet Dang Tong\'s affiliate dashboard');
    console.log('2. Verify commission numbers are updated');
    console.log('3. Check that conversions show correctly');
    console.log('4. Confirm payment request button is enabled (if >500k)');
    
    console.log('\n💡 WHY THIS WORKS:');
    console.log('-'.repeat(40));
    
    console.log('✅ Clear correlation between clicks and orders:');
    console.log('   • Same IP address (183.81.79.86)');
    console.log('   • Orders within 30 minutes of clicks');
    console.log('   • Same product (ea-full)');
    console.log('   • Logical sequence: click → browse → purchase');
    
    console.log('\n✅ URL Parameter Fallback Issue Identified:');
    console.log('   • Affiliate clicks don\'t have customerEmail field');
    console.log('   • Fallback needs customerEmail to work');
    console.log('   • Manual correlation needed for incognito mode');
    
    console.log('\n✅ Future Prevention:');
    console.log('   • Improve affiliate link tracking');
    console.log('   • Add session-based tracking');
    console.log('   • Implement better fallback mechanisms');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the manual conversion fix
runManualConversionFix();
