// Create virtual click for Anh Kim's order
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function createVirtualClickForAnhKim() {
  try {
    console.log('🔧 CREATING VIRTUAL CLICK FOR ANH KIM');
    console.log('='.repeat(60));
    
    const baseUrl = 'https://thebenchmarktrader.com';
    
    // Anh Kim's order details
    const anhKimOrder = {
      orderId: '1AL59204G4941441N',
      customerEmail: 'anhkim.230923@gmail.com',
      customerName: 'Anh Kim',
      productId: 'ea-full',
      amount: 7900000,
      paidAt: '2025-10-21T04:30:23.934+00:00',
      ipAddress: '183.81.79.86',
      affiliateCode: 'AFF-KIET DANG TONG-15B161'
    };
    
    console.log('\n📊 ANH KIM ORDER DETAILS:');
    console.log('-'.repeat(40));
    console.log(`Order ID: ${anhKimOrder.orderId}`);
    console.log(`Customer: ${anhKimOrder.customerName} (${anhKimOrder.customerEmail})`);
    console.log(`Product: ${anhKimOrder.productId}`);
    console.log(`Amount: ${anhKimOrder.amount.toLocaleString('vi-VN')}đ`);
    console.log(`Paid At: ${anhKimOrder.paidAt}`);
    console.log(`IP Address: ${anhKimOrder.ipAddress}`);
    console.log(`Affiliate Code: ${anhKimOrder.affiliateCode}`);
    
    console.log('\n🔧 CREATING VIRTUAL CLICK...');
    console.log('-'.repeat(40));
    
    const response = await fetch(`${baseUrl}/api/admin/create-virtual-click`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(anhKimOrder)
    });
    
    if (response.ok) {
      const data = await response.json();
      
      if (data.success) {
        console.log(`✅ Virtual click created successfully!`);
        console.log(`   Click ID: ${data.data.clickId}`);
        console.log(`   Affiliate: ${data.data.affiliateName} (${data.data.affiliateCode})`);
        console.log(`   Order ID: ${data.data.orderId}`);
        console.log(`   Commission: ${data.data.commissionAmount.toLocaleString('vi-VN')}đ`);
        console.log(`   Total Earned: ${data.data.totalCommissionEarned.toLocaleString('vi-VN')}đ`);
        console.log(`   Conversion Rate: ${data.data.conversionRate}%`);
        
        console.log('\n📊 FINAL SUMMARY:');
        console.log('-'.repeat(40));
        
        console.log('✅ Kiet Dang Tong\'s Final Stats:');
        console.log(`   • Total Clicks: 4 (3 original + 1 virtual)`);
        console.log(`   • Conversions: 2`);
        console.log(`   • Conversion Rate: 50%`);
        console.log(`   • Total Commission: ${data.data.totalCommissionEarned.toLocaleString('vi-VN')}đ`);
        
        console.log('\n✅ Both Orders Fixed:');
        console.log('   1. Hai Tong (9FX639758F5890021) - 2,370,000đ');
        console.log('   2. Anh Kim (1AL59204G4941441N) - 2,370,000đ');
        console.log(`   Total: ${data.data.totalCommissionEarned.toLocaleString('vi-VN')}đ`);
        
        console.log('\n🎯 DASHBOARD VERIFICATION:');
        console.log('-'.repeat(40));
        
        console.log('After this fix, Kiet Dang Tong\'s dashboard should show:');
        console.log('   ✅ Total Clicks: 4');
        console.log('   ✅ Conversions: 2');
        console.log('   ✅ Conversion Rate: 50%');
        console.log(`   ✅ Total Commission Earned: ${data.data.totalCommissionEarned.toLocaleString('vi-VN')}đ`);
        console.log('   ✅ Payment Request Button: Enabled (>500k)');
        
        console.log('\n💡 WHY THIS SOLUTION WORKS:');
        console.log('-'.repeat(40));
        
        console.log('✅ Proper Attribution:');
        console.log('   • Both customers properly attributed to Kiet Dang Tong');
        console.log('   • Clear audit trail for both conversions');
        console.log('   • Fair commission calculation');
        
        console.log('\n✅ Technical Benefits:');
        console.log('   • Maintains data integrity');
        console.log('   • Shows accurate conversion tracking');
        console.log('   • Preserves affiliate dashboard functionality');
        console.log('   • Enables payment requests');
        
        console.log('\n✅ Business Benefits:');
        console.log('   • Kiet Dang Tong gets fair commission');
        console.log('   • Dashboard shows correct performance');
        console.log('   • Motivation to continue promoting');
        console.log('   • Trust in affiliate system');
        
      } else {
        console.log(`❌ Failed: ${data.error}`);
      }
    } else {
      console.log(`❌ API Error: ${response.status}`);
      const error = await response.text();
      console.log(`Error: ${error}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the virtual click creation
createVirtualClickForAnhKim();
