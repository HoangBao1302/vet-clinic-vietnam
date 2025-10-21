// Debug script to check why URL parameter fallback is not working
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function debugUrlParameterFallback() {
  try {
    console.log('🔍 DEBUGGING URL PARAMETER FALLBACK ISSUE');
    console.log('='.repeat(60));
    
    const baseUrl = 'https://thebenchmarktrader.com';
    
    // Check recent orders
    console.log('\n📊 CHECKING RECENT ORDERS:');
    console.log('-'.repeat(40));
    
    // Check Hai Tong's order
    console.log('\n🔍 Hai Tong Order Analysis:');
    console.log('   Order ID: 9FX639758F5890021');
    console.log('   Customer Email: haidangtong2612@gmail.com');
    console.log('   Product: ea-full');
    console.log('   Amount: 7,900,000đ');
    console.log('   Paid At: 2025-10-21T04:27:30.666+00:00');
    
    // Check Anh Kim's order
    console.log('\n🔍 Anh Kim Order Analysis:');
    console.log('   Order ID: 1AL59204G4941441N');
    console.log('   Customer Email: anhkim.230923@gmail.com');
    console.log('   Product: ea-full');
    console.log('   Amount: 7,900,000đ');
    console.log('   Paid At: 2025-10-21T04:30:23.934+00:00');
    
    // Check Kiet Dang Tong's clicks
    console.log('\n📊 CHECKING KIET DANG TONG\'S CLICKS:');
    console.log('-'.repeat(40));
    
    const kietDangTongCode = 'AFF-KIET DANG TONG-15B161';
    
    const clicksResponse = await fetch(`${baseUrl}/api/affiliate/track?affiliateCode=${encodeURIComponent(kietDangTongCode)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (clicksResponse.ok) {
      const clicksData = await clicksResponse.json();
      const clicks = clicksData.clicks || [];
      
      console.log(`📈 Found ${clicks.length} clicks for Kiet Dang Tong:`);
      
      clicks.forEach((click, index) => {
        console.log(`\n   Click ${index + 1}:`);
        console.log(`      Click ID: ${click._id}`);
        console.log(`      Status: ${click.status}`);
        console.log(`      Product: ${click.productId}`);
        console.log(`      Commission: ${click.commissionAmount}đ`);
        console.log(`      Clicked At: ${click.clickedAt}`);
        console.log(`      Order ID: ${click.orderId || 'None'}`);
        console.log(`      Customer Email: ${click.customerEmail || 'None'}`);
      });
    }
    
    // Test URL parameter fallback for Hai Tong
    console.log('\n🧪 TESTING URL PARAMETER FALLBACK FOR HAI TONG:');
    console.log('-'.repeat(40));
    
    const fallbackResponse = await fetch(`${baseUrl}/api/test-url-fallback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerEmail: 'haidangtong2612@gmail.com',
        productId: 'ea-full',
        orderId: '9FX639758F5890021'
      })
    });
    
    if (fallbackResponse.ok) {
      const fallbackData = await fallbackResponse.json();
      console.log(`📊 Fallback Test Results:`);
      console.log(`   Total Clicks: ${fallbackData.totalClicks}`);
      console.log(`   Convertible Clicks: ${fallbackData.convertibleClicks}`);
      console.log(`   Message: ${fallbackData.message}`);
      
      if (fallbackData.results && fallbackData.results.length > 0) {
        console.log(`\n💰 Commission Details:`);
        fallbackData.results.forEach((result, index) => {
          console.log(`   ${index + 1}. Affiliate: ${result.affiliateName} (${result.affiliateCode})`);
          console.log(`      Commission: ${result.commissionAmount.toLocaleString('vi-VN')}đ`);
          console.log(`      Can Convert: ${result.canConvert ? '✅' : '❌'}`);
        });
      }
    } else {
      console.log(`   ❌ Fallback test failed: ${fallbackResponse.status}`);
    }
    
    // Test URL parameter fallback for Anh Kim
    console.log('\n🧪 TESTING URL PARAMETER FALLBACK FOR ANH KIM:');
    console.log('-'.repeat(40));
    
    const fallbackResponse2 = await fetch(`${baseUrl}/api/test-url-fallback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerEmail: 'anhkim.230923@gmail.com',
        productId: 'ea-full',
        orderId: '1AL59204G4941441N'
      })
    });
    
    if (fallbackResponse2.ok) {
      const fallbackData2 = await fallbackResponse2.json();
      console.log(`📊 Fallback Test Results:`);
      console.log(`   Total Clicks: ${fallbackData2.totalClicks}`);
      console.log(`   Convertible Clicks: ${fallbackData2.convertibleClicks}`);
      console.log(`   Message: ${fallbackData2.message}`);
      
      if (fallbackData2.results && fallbackData2.results.length > 0) {
        console.log(`\n💰 Commission Details:`);
        fallbackData2.results.forEach((result, index) => {
          console.log(`   ${index + 1}. Affiliate: ${result.affiliateName} (${result.affiliateCode})`);
          console.log(`      Commission: ${result.commissionAmount.toLocaleString('vi-VN')}đ`);
          console.log(`      Can Convert: ${result.canConvert ? '✅' : '❌'}`);
        });
      }
    } else {
      console.log(`   ❌ Fallback test failed: ${fallbackResponse2.status}`);
    }
    
    console.log('\n🔍 POTENTIAL ISSUES:');
    console.log('-'.repeat(40));
    
    console.log('\n❌ Possible Reasons Why Fallback Not Working:');
    console.log('   1. Customer emails in orders don\'t match emails in affiliate clicks');
    console.log('   2. Affiliate clicks don\'t have customerEmail field populated');
    console.log('   3. Webhook not triggered or not processing fallback logic');
    console.log('   4. Time window mismatch (orders vs clicks)');
    console.log('   5. Product ID mismatch between clicks and orders');
    
    console.log('\n🔧 DEBUGGING STEPS:');
    console.log('   1. Check if affiliate clicks have customerEmail field');
    console.log('   2. Verify webhook logs for fallback processing');
    console.log('   3. Check if orders have affiliateCode in metadata');
    console.log('   4. Verify time correlation between clicks and orders');
    console.log('   5. Test manual conversion process');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the debug
debugUrlParameterFallback();
