// Script to check if Hai Tong's order came from Kiet Dang Tong's affiliate link
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function checkHaiTongOrder() {
  try {
    console.log('🔍 Checking if Hai Tong\'s order came from Kiet Dang Tong\'s affiliate link...');
    
    const baseUrl = 'https://thebenchmarktrader.com';
    
    // Hai Tong's order details from the image
    const haiTongOrder = {
      orderId: "9GH52985019985411",
      customerEmail: "haidangtong2612@gmail.com",
      customerName: "Hai Tong",
      productId: "ea-full",
      amount: 7900000,
      paidAt: "2025-10-20T04:09:30.962+00:00"
    };
    
    console.log('\n📊 Hai Tong\'s Order Details:');
    console.log(`   Order ID: ${haiTongOrder.orderId}`);
    console.log(`   Customer Email: ${haiTongOrder.customerEmail}`);
    console.log(`   Customer Name: ${haiTongOrder.customerName}`);
    console.log(`   Product: ${haiTongOrder.productId}`);
    console.log(`   Amount: ${haiTongOrder.amount.toLocaleString('vi-VN')}đ`);
    console.log(`   Paid At: ${haiTongOrder.paidAt}`);
    
    // Kiet Dang Tong's affiliate code
    const kietDangTongCode = "AFF-KIET DANG TONG-15B161";
    
    console.log(`\n🔍 Checking affiliate clicks for: ${kietDangTongCode}`);
    
    // Get all clicks for Kiet Dang Tong
    const clicksResponse = await fetch(`${baseUrl}/api/affiliate/track?affiliateCode=${encodeURIComponent(kietDangTongCode)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!clicksResponse.ok) {
      throw new Error(`Failed to fetch clicks: ${clicksResponse.status}`);
    }
    
    const clicksData = await clicksResponse.json();
    const clicks = clicksData.clicks || [];
    
    console.log(`\n📈 Found ${clicks.length} clicks for Kiet Dang Tong:`);
    
    // Check each click to see if it matches Hai Tong's order
    let foundMatch = false;
    
    clicks.forEach((click, index) => {
      console.log(`\n   Click ${index + 1}:`);
      console.log(`      Click ID: ${click._id}`);
      console.log(`      Status: ${click.status}`);
      console.log(`      Order ID: ${click.orderId || 'None'}`);
      console.log(`      Customer Email: ${click.customerEmail || 'None'}`);
      console.log(`      Product ID: ${click.productId || 'None'}`);
      console.log(`      Commission Amount: ${click.commissionAmount || 0}đ`);
      console.log(`      Clicked At: ${click.clickedAt}`);
      console.log(`      Converted At: ${click.convertedAt || 'Not converted'}`);
      
      // Check if this click matches Hai Tong's order
      if (click.orderId === haiTongOrder.orderId || 
          click.customerEmail === haiTongOrder.customerEmail) {
        foundMatch = true;
        console.log(`      ✅ MATCH FOUND! This click is linked to Hai Tong's order`);
      }
    });
    
    // Summary
    console.log('\n🎯 ANALYSIS RESULT:');
    console.log('='.repeat(50));
    
    if (foundMatch) {
      console.log('✅ YES - Hai Tong\'s order came from Kiet Dang Tong\'s affiliate link!');
      console.log('   This means Kiet Dang Tong should receive commission for this sale.');
    } else {
      console.log('❌ NO - Hai Tong\'s order did NOT come from Kiet Dang Tong\'s affiliate link.');
      console.log('   The order was made independently, not through affiliate tracking.');
    }
    
    // Additional analysis
    console.log('\n📊 ADDITIONAL ANALYSIS:');
    console.log(`   Total clicks for Kiet Dang Tong: ${clicks.length}`);
    console.log(`   Converted clicks: ${clicks.filter(c => c.status === 'converted').length}`);
    console.log(`   Total commission earned: ${clicks.reduce((sum, c) => sum + (c.commissionAmount || 0), 0).toLocaleString('vi-VN')}đ`);
    
    // Check if there are any unconverted clicks that might be Hai Tong
    const unconvertedClicks = clicks.filter(c => c.status === 'clicked');
    if (unconvertedClicks.length > 0) {
      console.log(`\n⚠️ Found ${unconvertedClicks.length} unconverted clicks:`);
      unconvertedClicks.forEach((click, index) => {
        console.log(`   ${index + 1}. Clicked at: ${click.clickedAt}`);
        console.log(`      Product: ${click.productId || 'Unknown'}`);
        console.log(`      Referrer: ${click.referrer || 'Unknown'}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the check
checkHaiTongOrder();
