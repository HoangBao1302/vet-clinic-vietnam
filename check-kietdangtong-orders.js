// Script to check orders related to Kiet Dang Tong affiliate
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function checkRelatedOrders() {
  try {
    console.log('🔍 Checking orders related to Kiet Dang Tong affiliate...');
    
    const baseUrl = 'https://thebenchmarktrader.com';
    const affiliateCode = 'AFF-KIET DANG TONG-15B161';
    
    // 1. Check all orders to see if any have this affiliate code
    console.log('\n📊 Checking all orders for affiliate code...');
    
    // We'll check the debug endpoint to see all orders
    const debugResponse = await fetch(`${baseUrl}/api/debug-affiliate-data`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (debugResponse.ok) {
      const debugData = await debugResponse.json();
      console.log('📈 Debug data:', JSON.stringify(debugData, null, 2));
    }
    
    // 2. Check if there are any Stripe orders
    console.log('\n📊 Checking Stripe orders...');
    
    // Try to get orders from a different endpoint
    const ordersResponse = await fetch(`${baseUrl}/api/admin/monitor-affiliates`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (ordersResponse.ok) {
      const ordersData = await ordersResponse.json();
      console.log('📈 Orders data:', JSON.stringify(ordersData, null, 2));
    }
    
    // 3. Check specific affiliate clicks details
    console.log('\n📊 Checking detailed click information...');
    
    const clickDetailsResponse = await fetch(`${baseUrl}/api/affiliate/track?affiliateCode=${encodeURIComponent(affiliateCode)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (clickDetailsResponse.ok) {
      const clickDetails = await clickDetailsResponse.json();
      console.log('📈 Detailed click info:', JSON.stringify(clickDetails, null, 2));
      
      // Check if there's any order information in the click
      if (clickDetails.clicks && clickDetails.clicks.length > 0) {
        const click = clickDetails.clicks[0];
        console.log('\n🔍 Click details:');
        console.log(`   Click ID: ${click._id}`);
        console.log(`   Status: ${click.status}`);
        console.log(`   Commission Amount: ${click.commissionAmount}`);
        console.log(`   Order ID: ${click.orderId || 'None'}`);
        console.log(`   Customer Email: ${click.customerEmail || 'None'}`);
        console.log(`   Product ID: ${click.productId || 'None'}`);
        console.log(`   Clicked At: ${click.clickedAt}`);
        console.log(`   Converted At: ${click.convertedAt || 'Not converted'}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the check
checkRelatedOrders();
