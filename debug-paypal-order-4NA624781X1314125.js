// Debug PayPal order 4NA624781X1314125
const orderId = "4NA624781X1314125";

// Test với different productIds để xem mismatch
const testProductIds = [
  "ea-full-mt5",      // MT5 Full Version
  "ea-full-mt4",      // MT4 Full Version  
  "ea-full",          // Legacy Full Version
  "ea-pro-source-mt5", // MT5 Pro Source
  "ea-pro-source-mt4", // MT4 Pro Source
  "indicator-pro-mt5", // MT5 Indicators
  "indicator-pro-mt4"  // MT4 Indicators
];

async function testPayPalOrderWithDifferentProductIds() {
  console.log(`🔍 Testing PayPal Order: ${orderId}`);
  console.log(`🧪 Testing with different productIds...\n`);
  
  for (const productId of testProductIds) {
    console.log(`\n📦 Testing with productId: ${productId}`);
    
    try {
      const response = await fetch('/api/verify-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          orderId: orderId,
          productId: productId 
        })
      });
      
      const result = await response.json();
      
      console.log(`📊 Response Status: ${response.status}`);
      console.log(`📋 Result:`, JSON.stringify(result, null, 2));
      
      if (result.verified) {
        console.log(`✅ SUCCESS! Order verified with productId: ${productId}`);
        console.log(`🔗 Download URL: ${result.downloadUrl}`);
        break;
      } else {
        console.log(`❌ Failed: ${result.error}`);
      }
      
    } catch (error) {
      console.error(`❌ Error testing ${productId}:`, error.message);
    }
  }
}

// Test với debug API
async function testDebugAPI() {
  console.log(`\n🔧 Testing Debug API...`);
  
  try {
    const response = await fetch('/api/debug-paypal-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderId })
    });
    
    const result = await response.json();
    
    console.log(`📊 Debug Response:`, JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log(`✅ Debug successful!`);
      console.log(`📦 PayPal Product ID: ${result.debug.productId}`);
      console.log(`💰 Amount: ${JSON.stringify(result.debug.amount, null, 2)}`);
      console.log(`👤 Payer: ${JSON.stringify(result.debug.payer, null, 2)}`);
    } else {
      console.log(`❌ Debug failed: ${result.error}`);
    }
    
  } catch (error) {
    console.error(`❌ Debug API error:`, error.message);
  }
}

// Run tests
async function runTests() {
  await testDebugAPI();
  await testPayPalOrderWithDifferentProductIds();
}

runTests();
