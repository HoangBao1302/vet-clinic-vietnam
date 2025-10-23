// Debug PayPal order 6HK52704AS9405445
const orderId = "6HK52704AS9405445";

async function debugPayPalOrder() {
  console.log(`🔍 Debugging PayPal Order: ${orderId}`);
  
  // Test với debug API
  try {
    const response = await fetch('/api/debug-paypal-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderId })
    });
    
    const result = await response.json();
    
    console.log('📊 Debug Result:', JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log('✅ PayPal Order Found');
      console.log('📦 Product ID from PayPal:', result.debug.productId);
      console.log('💰 Amount:', result.debug.amount);
      console.log('👤 Payer:', result.debug.payer);
      console.log('📋 Status:', result.debug.orderStatus);
    } else {
      console.log('❌ Error:', result.error);
    }
  } catch (error) {
    console.error('❌ Debug Error:', error);
  }
  
  // Test với different productIds để tìm match
  const testProductIds = [
    "ea-full-mt5",      // MT5 Full Version (most likely based on amount 79,000₫)
    "ea-full-mt4",      // MT4 Full Version  
    "ea-full",          // Legacy Full Version
    "ea-pro-source-mt5", // MT5 Pro Source
    "ea-pro-source-mt4", // MT4 Pro Source
    "indicator-pro-mt5", // MT5 Indicators
    "indicator-pro-mt4"  // MT4 Indicators
  ];
  
  console.log(`\n🧪 Testing with different productIds...`);
  
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
        console.log(`📦 Final Product ID: ${result.productId}`);
        if (result.debug?.fallbackUsed) {
          console.log(`🔄 Fallback mechanism was used`);
        }
        break;
      } else {
        console.log(`❌ Failed: ${result.error}`);
      }
      
    } catch (error) {
      console.error(`❌ Error testing ${productId}:`, error.message);
    }
  }
}

debugPayPalOrder();
