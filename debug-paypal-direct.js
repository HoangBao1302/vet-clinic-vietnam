// Debug PayPal order 3142567640581632W directly with PayPal API
const orderId = "3142567640581632W";

async function debugPayPalOrderDirect() {
  console.log(`🔍 Debugging PayPal Order: ${orderId}`);
  
  // PayPal API credentials (from environment)
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const mode = process.env.PAYPAL_MODE || 'sandbox';
  
  console.log('PayPal Config:', {
    clientId: clientId ? 'SET' : 'NOT SET',
    clientSecret: clientSecret ? 'SET' : 'NOT SET',
    mode: mode
  });
  
  if (!clientId || !clientSecret) {
    console.log('❌ PayPal credentials not set in environment');
    return;
  }
  
  try {
    // Get access token
    const tokenResponse = await fetch(`https://api-m.${mode === 'live' ? '' : 'sandbox.'}paypal.com/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-Language': 'en_US',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });
    
    const tokenData = await tokenResponse.json();
    
    if (!tokenData.access_token) {
      console.log('❌ Failed to get PayPal access token:', tokenData);
      return;
    }
    
    console.log('✅ Got PayPal access token');
    
    // Get order details
    const orderResponse = await fetch(`https://api-m.${mode === 'live' ? '' : 'sandbox.'}paypal.com/v2/checkout/orders/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const orderData = await orderResponse.json();
    
    console.log('📊 PayPal Order Data:', JSON.stringify(orderData, null, 2));
    
    if (orderData.status === 'COMPLETED') {
      const paypalProductId = orderData.purchase_units[0]?.reference_id;
      const amount = orderData.purchase_units[0]?.amount?.value;
      const currency = orderData.purchase_units[0]?.amount?.currency_code;
      
      console.log('\n🔍 Order Analysis:');
      console.log(`📦 Product ID from PayPal: ${paypalProductId}`);
      console.log(`💰 Amount: ${amount} ${currency}`);
      console.log(`📋 Status: ${orderData.status}`);
      
      // Check if this matches expected MT5 Full Version
      const expectedProductId = "ea-full-mt5";
      const expectedAmountUSD = "3.29"; // 79,000 VND / 24,000 = 3.29 USD
      
      console.log(`\n🎯 Expected Values:`);
      console.log(`📦 Expected Product ID: ${expectedProductId}`);
      console.log(`💰 Expected Amount: ${expectedAmountUSD} USD`);
      
      console.log(`\n✅ Analysis:`);
      console.log(`Product ID Match: ${paypalProductId === expectedProductId ? '✅ YES' : '❌ NO'}`);
      console.log(`Amount Match: ${amount === expectedAmountUSD ? '✅ YES' : '❌ NO'}`);
      
      if (paypalProductId !== expectedProductId) {
        console.log(`\n❌ PROBLEM FOUND!`);
        console.log(`PayPal order has wrong productId:`);
        console.log(`Expected: ${expectedProductId}`);
        console.log(`Actual: ${paypalProductId}`);
        console.log(`\nThis explains why verification fails!`);
      }
      
    } else {
      console.log(`❌ Order not completed. Status: ${orderData.status}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

debugPayPalOrderDirect();
