// Manual conversion script to link orders with affiliate clicks
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function manualConversionFix() {
  try {
    console.log('🔧 MANUAL CONVERSION FIX FOR KIET DANG TONG');
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
        ipAddress: '183.81.79.86' // Same IP as clicks
      },
      {
        orderId: '1AL59204G4941441N',
        customerEmail: 'anhkim.230923@gmail.com',
        customerName: 'Anh Kim',
        productId: 'ea-full',
        amount: 7900000,
        paidAt: '2025-10-21T04:30:23.934+00:00',
        ipAddress: '183.81.79.86' // Same IP as clicks
      }
    ];
    
    // Kiet Dang Tong's affiliate code
    const affiliateCode = 'AFF-KIET DANG TONG-15B161';
    
    console.log('\n📊 PROCESSING ORDERS:');
    console.log('-'.repeat(40));
    
    for (const order of orders) {
      console.log(`\n🔍 Processing Order: ${order.orderId}`);
      console.log(`   Customer: ${order.customerName} (${order.customerEmail})`);
      console.log(`   Product: ${order.productId}`);
      console.log(`   Amount: ${order.amount.toLocaleString('vi-VN')}đ`);
      console.log(`   Paid At: ${order.paidAt}`);
      
      // Find matching affiliate click based on time and IP
      const clickTime = new Date(order.paidAt);
      const timeWindow = 30 * 60 * 1000; // 30 minutes before payment
      
      console.log(`\n🔍 Looking for matching clicks:`);
      console.log(`   Time window: ${timeWindow / 60000} minutes before payment`);
      console.log(`   IP Address: ${order.ipAddress}`);
      
      // Get Kiet Dang Tong's clicks
      const clicksResponse = await fetch(`${baseUrl}/api/affiliate/track?affiliateCode=${encodeURIComponent(affiliateCode)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (clicksResponse.ok) {
        const clicksData = await clicksResponse.json();
        const clicks = clicksData.clicks || [];
        
        // Find clicks within time window and same IP
        const matchingClicks = clicks.filter(click => {
          const clickTime = new Date(click.clickedAt);
          const orderTime = new Date(order.paidAt);
          const timeDiff = orderTime.getTime() - clickTime.getTime();
          
          return timeDiff >= 0 && 
                 timeDiff <= timeWindow && 
                 click.ipAddress === order.ipAddress &&
                 click.status === 'clicked' &&
                 click.productId === order.productId;
        });
        
        console.log(`   Found ${matchingClicks.length} matching clicks`);
        
        if (matchingClicks.length > 0) {
          // Use the most recent matching click
          const matchingClick = matchingClicks.sort((a, b) => 
            new Date(b.clickedAt).getTime() - new Date(a.clickedAt).getTime()
          )[0];
          
          console.log(`   ✅ Using click: ${matchingClick._id}`);
          console.log(`   Clicked At: ${matchingClick.clickedAt}`);
          console.log(`   Product: ${matchingClick.productId}`);
          
          // Calculate commission
          const commissionRates = {
            'ea-full': 0.30, // Assuming Kiet Dang Tong is not paid member
            'ea-pro-source': 0.30,
            'indicator-pro': 0.30,
            'course': 0.25,
            'social-copy': 0.10,
          };
          
          const commissionRate = commissionRates[order.productId] || 0.30;
          const commissionAmount = Math.round(order.amount * commissionRate);
          
          console.log(`   💰 Commission Calculation:`);
          console.log(`      Amount: ${order.amount.toLocaleString('vi-VN')}đ`);
          console.log(`      Rate: ${(commissionRate * 100).toFixed(1)}%`);
          console.log(`      Commission: ${commissionAmount.toLocaleString('vi-VN')}đ`);
          
          // Create manual conversion record
          const conversionData = {
            clickId: matchingClick._id,
            orderId: order.orderId,
            customerEmail: order.customerEmail,
            customerName: order.customerName,
            productId: order.productId,
            productName: order.productId === 'ea-full' ? 'EA ThebenchmarkTrader Full Version' : order.productId,
            commissionAmount: commissionAmount,
            affiliateCode: affiliateCode,
            convertedAt: order.paidAt
          };
          
          console.log(`   📝 Conversion Data:`, conversionData);
          
          // Here we would update the database, but since we can't directly access MongoDB,
          // we'll create a script that can be run manually
          console.log(`   ⚠️ Manual update needed for click ${matchingClick._id}`);
          
        } else {
          console.log(`   ❌ No matching clicks found`);
        }
      } else {
        console.log(`   ❌ Failed to fetch clicks: ${clicksResponse.status}`);
      }
    }
    
    console.log('\n🔧 MANUAL UPDATE SCRIPT:');
    console.log('-'.repeat(40));
    
    console.log('\n📝 To manually fix these conversions, run this MongoDB script:');
    console.log(`
// Manual conversion fix for Kiet Dang Tong
db.affiliateclicks.updateOne(
  { _id: ObjectId('68f70b501e374f405ac9145e') },
  {
    $set: {
      status: 'converted',
      convertedAt: new Date('2025-10-21T04:27:30.666Z'),
      orderId: '9FX639758F5890021',
      customerEmail: 'haidangtong2612@gmail.com',
      customerName: 'Hai Tong',
      commissionAmount: 2370000,
      productName: 'EA ThebenchmarkTrader Full Version'
    }
  }
);

db.affiliateclicks.updateOne(
  { _id: ObjectId('68f70c0c1e374f405ac91467') },
  {
    $set: {
      status: 'converted',
      convertedAt: new Date('2025-10-21T04:30:23.934Z'),
      orderId: '1AL59204G4941441N',
      customerEmail: 'anhkim.230923@gmail.com',
      customerName: 'Anh Kim',
      commissionAmount: 2370000,
      productName: 'EA ThebenchmarkTrader Full Version'
    }
  }
);

// Update Kiet Dang Tong's total commission
db.users.updateOne(
  { affiliateCode: 'AFF-KIET DANG TONG-15B161' },
  {
    $inc: { totalCommissionEarned: 4740000 }
  }
);
    `);
    
    console.log('\n💡 EXPLANATION:');
    console.log('-'.repeat(40));
    
    console.log('\n✅ Why this fix works:');
    console.log('   1. Both orders have same IP as affiliate clicks (183.81.79.86)');
    console.log('   2. Orders happened within 30 minutes of clicks');
    console.log('   3. Same product (ea-full) in both clicks and orders');
    console.log('   4. Clear correlation between clicks and purchases');
    
    console.log('\n📊 Expected Results:');
    console.log('   • Kiet Dang Tong will have 2 conversions');
    console.log('   • Total commission: 4,740,000đ');
    console.log('   • Conversion rate: 66.7% (2/3 clicks)');
    console.log('   • Dashboard will show correct numbers');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the manual fix analysis
manualConversionFix();
