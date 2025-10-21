// Comprehensive analysis of affiliate tracking issues
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function comprehensiveAffiliateAnalysis() {
  try {
    console.log('🔍 COMPREHENSIVE AFFILIATE TRACKING ANALYSIS');
    console.log('='.repeat(60));
    
    const baseUrl = 'https://thebenchmarktrader.com';
    const affiliateCode = 'AFF-KIET DANG TONG-15B161';
    
    console.log('\n📊 CURRENT SITUATION:');
    console.log('-'.repeat(40));
    console.log('✅ Orders Found:');
    console.log('   1. Pham Thi Thuan Yen (phamthithuanyen93@gmail.com)');
    console.log('      Order ID: 10U263026W384614C');
    console.log('      Amount: 7,900,000đ');
    console.log('      Paid At: 2025-10-21T05:20:34.446+00:00');
    console.log('');
    console.log('   2. Hai Tong (haidangtong2612@gmail.com)');
    console.log('      Order ID: 6L147960UK7315704');
    console.log('      Amount: 7,900,000đ');
    console.log('      Paid At: 2025-10-21T05:27:10.120+00:00');
    console.log('');
    console.log('❌ Dashboard Shows:');
    console.log('   • Total Clicks: 0');
    console.log('   • Conversions: 0');
    console.log('   • Conversion Rate: 0%');
    console.log('   • Total Commission: 4,740,000đ (from manual fix)');
    
    console.log('\n🔍 ROOT CAUSE ANALYSIS:');
    console.log('-'.repeat(40));
    
    console.log('\n❌ PROBLEM 1: Enhanced Tracking Not Active');
    console.log('   • New tracking system deployed but not used');
    console.log('   • Frontend still uses old tracking method');
    console.log('   • No session IDs generated for new orders');
    
    console.log('\n❌ PROBLEM 2: Webhook Fallback Not Working');
    console.log('   • Multi-layer correlation not triggered');
    console.log('   • Orders don\'t have enhanced metadata');
    console.log('   • Fallback system relies on old data structure');
    
    console.log('\n❌ PROBLEM 3: Frontend Integration Missing');
    console.log('   • useEnhancedAffiliateTracking hook not integrated');
    console.log('   • Checkout process not using enhanced data');
    console.log('   • Session management not implemented');
    
    console.log('\n🔧 COMPREHENSIVE SOLUTION:');
    console.log('-'.repeat(40));
    
    console.log('\n✅ STEP 1: Immediate Fix for Existing Orders');
    console.log('   • Create virtual clicks for both orders');
    console.log('   • Link orders to Kiet Dang Tong');
    console.log('   • Credit proper commission');
    
    console.log('\n✅ STEP 2: Frontend Integration');
    console.log('   • Integrate enhanced tracking hook');
    console.log('   • Update checkout process');
    console.log('   • Add session management');
    
    console.log('\n✅ STEP 3: Backend Enhancement');
    console.log('   • Improve webhook correlation');
    console.log('   • Add real-time monitoring');
    console.log('   • Implement automated alerts');
    
    // Check current clicks
    console.log('\n📊 CHECKING CURRENT CLICKS:');
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
        console.log(`      Session ID: ${click.sessionId || 'None'}`);
      });
      
      // Check for new orders that need correlation
      console.log('\n🔍 CHECKING FOR MISSING CORRELATIONS:');
      console.log('-'.repeat(40));
      
      const newOrders = [
        {
          orderId: '10U263026W384614C',
          customerEmail: 'phamthithuanyen93@gmail.com',
          customerName: 'Pham Thi Thuan Yen',
          productId: 'ea-full',
          amount: 7900000,
          paidAt: '2025-10-21T05:20:34.446+00:00'
        },
        {
          orderId: '6L147960UK7315704',
          customerEmail: 'haidangtong2612@gmail.com',
          customerName: 'Hai Tong',
          productId: 'ea-full',
          amount: 7900000,
          paidAt: '2025-10-21T05:27:10.120+00:00'
        }
      ];
      
      for (const order of newOrders) {
        const existingClick = clicks.find(click => 
          click.orderId === order.orderId || 
          click.customerEmail === order.customerEmail
        );
        
        if (!existingClick) {
          console.log(`\n❌ Missing correlation for order: ${order.orderId}`);
          console.log(`   Customer: ${order.customerName} (${order.customerEmail})`);
          console.log(`   Product: ${order.productId}`);
          console.log(`   Amount: ${order.amount.toLocaleString('vi-VN')}đ`);
          console.log(`   Action needed: Create virtual click`);
        } else {
          console.log(`\n✅ Correlation exists for order: ${order.orderId}`);
        }
      }
      
    } else {
      console.log(`❌ Failed to fetch clicks: ${clicksResponse.status}`);
    }
    
    console.log('\n🎯 IMMEDIATE ACTION PLAN:');
    console.log('-'.repeat(40));
    
    console.log('\n1️⃣ Create Virtual Clicks for New Orders');
    console.log('   • Order 1: Pham Thi Thuan Yen');
    console.log('   • Order 2: Hai Tong');
    console.log('   • Expected commission: 4,740,000đ');
    
    console.log('\n2️⃣ Update Dashboard Display');
    console.log('   • Total Clicks: 6 (4 existing + 2 new)');
    console.log('   • Conversions: 4 (2 existing + 2 new)');
    console.log('   • Conversion Rate: 66.7%');
    console.log('   • Total Commission: 9,480,000đ');
    
    console.log('\n3️⃣ Implement Frontend Integration');
    console.log('   • Add enhanced tracking to all pages');
    console.log('   • Update checkout process');
    console.log('   • Add session management');
    
    console.log('\n4️⃣ Monitor and Verify');
    console.log('   • Test new tracking system');
    console.log('   • Verify commission calculations');
    console.log('   • Monitor dashboard updates');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run comprehensive analysis
comprehensiveAffiliateAnalysis();
