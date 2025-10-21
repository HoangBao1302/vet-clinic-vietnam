// Check current status of Kiet Dang Tong's clicks
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function checkCurrentClickStatus() {
  try {
    console.log('🔍 CHECKING CURRENT CLICK STATUS');
    console.log('='.repeat(60));
    
    const baseUrl = 'https://thebenchmarktrader.com';
    const affiliateCode = 'AFF-KIET DANG TONG-15B161';
    
    console.log('\n📊 FETCHING CURRENT CLICKS:');
    console.log('-'.repeat(40));
    
    const clicksResponse = await fetch(`${baseUrl}/api/affiliate/track?affiliateCode=${encodeURIComponent(affiliateCode)}`, {
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
        console.log(`      Customer Name: ${click.customerName || 'None'}`);
        console.log(`      IP Address: ${click.ipAddress || 'None'}`);
        console.log(`      Converted At: ${click.convertedAt || 'None'}`);
      });
      
      // Check for any converted clicks
      const convertedClicks = clicks.filter(click => click.status === 'converted');
      const unconvertedClicks = clicks.filter(click => click.status === 'clicked');
      
      console.log('\n📊 STATUS SUMMARY:');
      console.log('-'.repeat(40));
      console.log(`   Total Clicks: ${clicks.length}`);
      console.log(`   Converted: ${convertedClicks.length}`);
      console.log(`   Unconverted: ${unconvertedClicks.length}`);
      
      if (convertedClicks.length > 0) {
        console.log('\n✅ CONVERTED CLICKS:');
        convertedClicks.forEach((click, index) => {
          console.log(`   ${index + 1}. ${click.productId} - ${click.commissionAmount.toLocaleString('vi-VN')}đ`);
          console.log(`      Order: ${click.orderId}`);
          console.log(`      Customer: ${click.customerName} (${click.customerEmail})`);
          console.log(`      Converted: ${click.convertedAt}`);
        });
      }
      
      if (unconvertedClicks.length > 0) {
        console.log('\n⏳ UNCONVERTED CLICKS:');
        unconvertedClicks.forEach((click, index) => {
          console.log(`   ${index + 1}. ${click.productId} - ${click.commissionAmount}đ`);
          console.log(`      Clicked: ${click.clickedAt}`);
          console.log(`      IP: ${click.ipAddress}`);
        });
      }
      
      // Check if manual conversion already happened
      console.log('\n🔍 MANUAL CONVERSION CHECK:');
      console.log('-'.repeat(40));
      
      const haiTongClick = clicks.find(click => 
        click.customerEmail === 'haidangtong2612@gmail.com' || 
        click.orderId === '9FX639758F5890021'
      );
      
      const anhKimClick = clicks.find(click => 
        click.customerEmail === 'anhkim.230923@gmail.com' || 
        click.orderId === '1AL59204G4941441N'
      );
      
      if (haiTongClick) {
        console.log(`✅ Hai Tong's order already processed:`);
        console.log(`   Status: ${haiTongClick.status}`);
        console.log(`   Commission: ${haiTongClick.commissionAmount.toLocaleString('vi-VN')}đ`);
        console.log(`   Order ID: ${haiTongClick.orderId}`);
      } else {
        console.log(`❌ Hai Tong's order not found`);
      }
      
      if (anhKimClick) {
        console.log(`✅ Anh Kim's order already processed:`);
        console.log(`   Status: ${anhKimClick.status}`);
        console.log(`   Commission: ${anhKimClick.commissionAmount.toLocaleString('vi-VN')}đ`);
        console.log(`   Order ID: ${anhKimClick.orderId}`);
      } else {
        console.log(`❌ Anh Kim's order not found`);
      }
      
      // Calculate total commission
      const totalCommission = convertedClicks.reduce((sum, click) => sum + click.commissionAmount, 0);
      
      console.log('\n💰 COMMISSION SUMMARY:');
      console.log('-'.repeat(40));
      console.log(`   Total Commission Earned: ${totalCommission.toLocaleString('vi-VN')}đ`);
      console.log(`   Conversion Rate: ${clicks.length > 0 ? ((convertedClicks.length / clicks.length) * 100).toFixed(1) : 0}%`);
      
      if (totalCommission > 0) {
        console.log('\n🎉 SUCCESS! Manual conversion already worked!');
        console.log('   Kiet Dang Tong\'s dashboard should show:');
        console.log(`   • Total Clicks: ${clicks.length}`);
        console.log(`   • Conversions: ${convertedClicks.length}`);
        console.log(`   • Conversion Rate: ${((convertedClicks.length / clicks.length) * 100).toFixed(1)}%`);
        console.log(`   • Total Commission: ${totalCommission.toLocaleString('vi-VN')}đ`);
      } else {
        console.log('\n⚠️ No conversions found. Manual conversion needed.');
      }
      
    } else {
      console.log(`❌ Failed to fetch clicks: ${clicksResponse.status}`);
      const error = await clicksResponse.text();
      console.log(`Error: ${error}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the check
checkCurrentClickStatus();
