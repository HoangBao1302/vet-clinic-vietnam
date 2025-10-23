// Test PayPal order directly
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
        console.log(`💰 Amount: ${JSON.stringify(purchaseUnit.amount, null, 2)}`);
      }
      
      if (orderData.status === "COMPLETED") {
        console.log("\n🎉 Order is COMPLETED - Should allow download!");
        
        // Check product mapping
        const referenceId = orderData.purchase_units[0]?.reference_id;
        console.log(`\n🔍 Product ID from PayPal: ${referenceId}`);
        
        // Check if this productId exists in our mapping
        const products = {
          "indicator-pro-mt4": { downloadUrl: "/downloads/files/Indicator-Pro-Pack-MT4.zip" },
          "ea-full-mt4": { downloadUrl: "/downloads/files/ThebenchmarkTrader-Full-MT4.ex4" },
          "ea-pro-source-mt4": { downloadUrl: "/downloads/files/ThebenchmarkTrader-Pro-Source-MT4.zip" },
          "indicator-pro-mt5": { downloadUrl: "/downloads/files/Indicator-Pro-Pack-MT5.zip" },
          "ea-full-mt5": { downloadUrl: "/downloads/files/ThebenchmarkTrader-Full-MT5.ex5" },
          "ea-pro-source-mt5": { downloadUrl: "/downloads/files/ThebenchmarkTrader-Pro-Source-MT5.zip" },
          "indicator-pro": { downloadUrl: "/downloads/files/Indicator-Pro-Pack.zip" },
          "ea-full": { downloadUrl: "/downloads/files/ThebenchmarkTrader-Full.ex4" },
          "ea-pro-source": { downloadUrl: "/downloads/files/ThebenchmarkTrader-Pro-Source.zip" }
        };
        
        if (products[referenceId]) {
          console.log(`✅ Product found in mapping: ${products[referenceId].downloadUrl}`);
        } else {
          console.log(`❌ Product NOT found in mapping: ${referenceId}`);
          console.log(`📋 Available products:`, Object.keys(products));
        }
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

// Test với order ID từ PayPal
const testOrderId = "0S801728PV956722L";
debugPayPalOrder(testOrderId);
