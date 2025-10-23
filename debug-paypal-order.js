// PayPal Order Debug Script
// Test với order ID từ PayPal sandbox

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_MODE = process.env.PAYPAL_MODE || 'sandbox';

async function getPayPalAccessToken() {
  try {
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64");
    
    const response = await fetch(
      `https://api-m.${PAYPAL_MODE === 'live' ? '' : 'sandbox.'}paypal.com/v1/oauth2/token`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      console.error("PayPal auth failed:", data);
      return null;
    }

    return data.access_token;
  } catch (error) {
    console.error("PayPal access token error:", error);
    return null;
  }
}

async function debugPayPalOrder(orderId) {
  console.log(`🔍 Debugging PayPal Order: ${orderId}`);
  console.log(`🌍 PayPal Mode: ${PAYPAL_MODE}`);
  
  // Step 1: Get access token
  console.log("\n1️⃣ Getting PayPal access token...");
  const accessToken = await getPayPalAccessToken();
  
  if (!accessToken) {
    console.error("❌ Failed to get PayPal access token");
    return;
  }
  
  console.log("✅ Access token obtained");
  
  // Step 2: Fetch order details
  console.log("\n2️⃣ Fetching order details...");
  try {
    const response = await fetch(
      `https://api-m.${PAYPAL_MODE === 'live' ? '' : 'sandbox.'}paypal.com/v2/checkout/orders/${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const orderData = await response.json();
    
    console.log(`📊 Response Status: ${response.status}`);
    console.log(`📋 Order Data:`, JSON.stringify(orderData, null, 2));
    
    if (response.ok) {
      console.log(`\n✅ Order Status: ${orderData.status}`);
      console.log(`🆔 Order ID: ${orderData.id}`);
      
      if (orderData.purchase_units && orderData.purchase_units.length > 0) {
        const purchaseUnit = orderData.purchase_units[0];
        console.log(`📦 Purchase Unit:`, JSON.stringify(purchaseUnit, null, 2));
        console.log(`🔗 Reference ID: ${purchaseUnit.reference_id}`);
      }
      
      if (orderData.status === "COMPLETED") {
        console.log("\n🎉 Order is COMPLETED - Should allow download!");
      } else {
        console.log(`\n⚠️ Order status is ${orderData.status} - May not allow download`);
      }
    } else {
      console.error("❌ Failed to fetch order:", orderData);
    }
    
  } catch (error) {
    console.error("❌ Error fetching order:", error);
  }
}

// Test với order ID từ PayPal sandbox
// Thay thế bằng order ID thực tế từ PayPal
const testOrderId = "YOUR_PAYPAL_ORDER_ID_HERE";

if (testOrderId === "YOUR_PAYPAL_ORDER_ID_HERE") {
  console.log("⚠️ Please replace testOrderId with your actual PayPal order ID");
  console.log("📝 Usage: node debug-paypal-order.js");
} else {
  debugPayPalOrder(testOrderId);
}

module.exports = { debugPayPalOrder, getPayPalAccessToken };
