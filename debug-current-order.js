// Debug script for PayPal order
const orderId = "0S801728PV956722L";

async function debugPayPalOrder() {
  try {
    console.log(`🔍 Debugging PayPal Order: ${orderId}`);
    
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
      console.log('📦 Product ID:', result.debug.productId);
      console.log('💰 Amount:', result.debug.amount);
      console.log('👤 Payer:', result.debug.payer);
      console.log('📋 Status:', result.debug.orderStatus);
    } else {
      console.log('❌ Error:', result.error);
    }
  } catch (error) {
    console.error('❌ Debug Error:', error);
  }
}

debugPayPalOrder();
