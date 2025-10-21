// Debug why Anh Kim's order wasn't fixed
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function debugAnhKimOrder() {
  try {
    console.log('🔍 DEBUGGING ANH KIM ORDER ISSUE');
    console.log('='.repeat(60));
    
    const baseUrl = 'https://thebenchmarktrader.com';
    const affiliateCode = 'AFF-KIET DANG TONG-15B161';
    
    // Anh Kim's order details
    const anhKimOrder = {
      orderId: '1AL59204G4941441N',
      customerEmail: 'anhkim.230923@gmail.com',
      customerName: 'Anh Kim',
      productId: 'ea-full',
      amount: 7900000,
      paidAt: '2025-10-21T04:30:23.934+00:00',
      ipAddress: '183.81.79.86'
    };
    
    console.log('\n📊 ANH KIM ORDER DETAILS:');
    console.log('-'.repeat(40));
    console.log(`Order ID: ${anhKimOrder.orderId}`);
    console.log(`Customer: ${anhKimOrder.customerName} (${anhKimOrder.customerEmail})`);
    console.log(`Product: ${anhKimOrder.productId}`);
    console.log(`Amount: ${anhKimOrder.amount.toLocaleString('vi-VN')}đ`);
    console.log(`Paid At: ${anhKimOrder.paidAt}`);
    console.log(`IP Address: ${anhKimOrder.ipAddress}`);
    
    // Get all clicks for Kiet Dang Tong
    console.log('\n📊 CHECKING ALL CLICKS:');
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
      
      console.log(`📈 Found ${clicks.length} total clicks:`);
      
      clicks.forEach((click, index) => {
        console.log(`\n   Click ${index + 1}:`);
        console.log(`      Click ID: ${click._id}`);
        console.log(`      Status: ${click.status}`);
        console.log(`      Product: ${click.productId}`);
        console.log(`      Commission: ${click.commissionAmount}đ`);
        console.log(`      Clicked At: ${click.clickedAt}`);
        console.log(`      Order ID: ${click.orderId || 'None'}`);
        console.log(`      Customer Email: ${click.customerEmail || 'None'}`);
        console.log(`      IP Address: ${click.ipAddress || 'None'}`);
      });
      
      // Check which clicks match Anh Kim's criteria
      console.log('\n🔍 MATCHING ANALYSIS:');
      console.log('-'.repeat(40));
      
      const orderTime = new Date(anhKimOrder.paidAt);
      const timeWindow = 30 * 60 * 1000; // 30 minutes
      
      clicks.forEach((click, index) => {
        const clickTime = new Date(click.clickedAt);
        const timeDiff = orderTime.getTime() - clickTime.getTime();
        const timeDiffMinutes = timeDiff / (1000 * 60);
        
        console.log(`\n   Click ${index + 1} Analysis:`);
        console.log(`      Click Time: ${click.clickedAt}`);
        console.log(`      Order Time: ${anhKimOrder.paidAt}`);
        console.log(`      Time Diff: ${timeDiffMinutes.toFixed(1)} minutes`);
        console.log(`      IP Match: ${click.ipAddress === anhKimOrder.ipAddress ? '✅' : '❌'}`);
        console.log(`      Product Match: ${click.productId === anhKimOrder.productId ? '✅' : '❌'}`);
        console.log(`      Status: ${click.status}`);
        console.log(`      Within Window: ${timeDiff >= 0 && timeDiff <= timeWindow ? '✅' : '❌'}`);
        
        // Check if this click would match
        const wouldMatch = timeDiff >= 0 && 
                          timeDiff <= timeWindow && 
                          click.ipAddress === anhKimOrder.ipAddress &&
                          click.status === 'clicked' &&
                          click.productId === anhKimOrder.productId;
        
        console.log(`      Would Match: ${wouldMatch ? '✅ YES' : '❌ NO'}`);
      });
      
    } else {
      console.log(`❌ Failed to fetch clicks: ${clicksResponse.status}`);
    }
    
    console.log('\n💡 POSSIBLE REASONS:');
    console.log('-'.repeat(40));
    
    console.log('\n❌ Why Anh Kim\'s order wasn\'t fixed:');
    console.log('   1. Click already converted (status != "clicked")');
    console.log('   2. Time window mismatch (order too far from click)');
    console.log('   3. IP address mismatch');
    console.log('   4. Product ID mismatch');
    console.log('   5. Click was used for Hai Tong\'s order');
    
    console.log('\n🔧 NEXT STEPS:');
    console.log('-'.repeat(40));
    
    console.log('1. Check if there\'s another click that matches Anh Kim');
    console.log('2. Consider expanding time window if needed');
    console.log('3. Check if click was already converted');
    console.log('4. Verify IP and product matching');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the debug
debugAnhKimOrder();
