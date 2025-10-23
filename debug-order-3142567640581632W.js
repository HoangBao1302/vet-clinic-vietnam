// Debug PayPal order 3142567640581632W
const orderId = "3142567640581632W";

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
      
      // Check if productId matches expected MT5 Full Version
      const expectedProductId = "ea-full-mt5";
      console.log(`\n🔍 Expected Product ID: ${expectedProductId}`);
      console.log(`📦 Actual Product ID: ${result.debug.productId}`);
      console.log(`✅ Match: ${result.debug.productId === expectedProductId}`);
      
      if (result.debug.productId !== expectedProductId) {
        console.log(`❌ MISMATCH! PayPal order has wrong productId`);
        console.log(`Expected: ${expectedProductId}`);
        console.log(`Actual: ${result.debug.productId}`);
      }
    } else {
      console.log('❌ Error:', result.error);
    }
  } catch (error) {
    console.error('❌ Debug Error:', error);
  }
  
  // Test verification
  console.log(`\n🧪 Testing verification...`);
  
  try {
    const response = await fetch('/api/verify-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        orderId: orderId,
        productId: "ea-full-mt5" // Expected productId
      })
    });
    
    const result = await response.json();
    
    console.log(`📊 Verification Result:`, JSON.stringify(result, null, 2));
    
    if (result.verified) {
      console.log(`✅ SUCCESS! Order verified`);
      console.log(`🔗 Download URL: ${result.downloadUrl}`);
      console.log(`📦 Final Product ID: ${result.productId}`);
    } else {
      console.log(`❌ Verification failed: ${result.error}`);
    }
    
  } catch (error) {
    console.error(`❌ Verification error:`, error.message);
  }
}

debugPayPalOrder();
