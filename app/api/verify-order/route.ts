import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/lib/models/Order";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: "Missing session ID" },
        { status: 400 }
      );
    }

    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { success: false, error: "Stripe not configured" },
        { status: 503 }
      );
    }

    try {
      const Stripe = (await import("stripe")).default;
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: "2024-12-18.acacia" as any,
      });

      const session = await stripe.checkout.sessions.retrieve(sessionId);

      if (session.payment_status === "paid") {
        return NextResponse.json({
          success: true,
          orderId: session.id,
          status: "paid",
          customerEmail: session.customer_email,
          amount: session.amount_total,
          productId: session.metadata?.productId,
        });
      } else {
        return NextResponse.json(
          { success: false, error: "Payment not completed" },
          { status: 400 }
        );
      }
    } catch (stripeError: any) {
      console.error("Stripe verification error:", stripeError);
      return NextResponse.json(
        { success: false, error: `Stripe error: ${stripeError.message}` },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Order verification error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { orderId, productId } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "Missing order ID" },
        { status: 400 }
      );
    }

    // First check MongoDB
    try {
      const db = await connectDB();
    
    if (!db) {
      return NextResponse.json(
        { success: false, message: 'Database không khả dụng' },
        { status: 503 }
      );
    }
      const order = await Order.findOne({ orderId });
      
      if (order && order.status === "paid") {
        // CRITICAL: Verify that the requested productId matches the purchased productId
        const requestedProductId = productId || order.productId;
        if (requestedProductId !== order.productId) {
          return NextResponse.json(
            { verified: false, error: "Order is for a different product" },
            { status: 403 }
          );
        }
        
        const item = getProductById(order.productId);
        return NextResponse.json({
          verified: true,
          orderId: orderId,
          downloadUrl: item?.downloadUrl,
          productId: order.productId,
          order: order
        });
      }
    } catch (dbError) {
      console.error("Error checking MongoDB:", dbError);
    }

    // Try to verify as Stripe session first
    if (orderId.startsWith("cs_")) {
      try {
        const Stripe = (await import("stripe")).default;
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
          apiVersion: "2024-12-18.acacia" as any,
        });

        const session = await stripe.checkout.sessions.retrieve(orderId);

        if (session.payment_status === "paid") {
          const item = getProductById(productId);
          return NextResponse.json({
            verified: true,
            orderId: session.id,
            downloadUrl: item?.downloadUrl,
            productId: session.metadata?.productId,
          });
        }
      } catch (stripeError) {
        // Continue to PayPal verification
      }
    }

    // Try to verify as PayPal order
    if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
      return NextResponse.json(
        { success: false, error: "Payment verification not configured" },
        { status: 503 }
      );
    }

    const accessToken = await getPayPalAccessToken();
    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: "Failed to get PayPal access token" },
        { status: 500 }
      );
    }

    try {
      const response = await fetch(
        `https://api-m.${process.env.PAYPAL_MODE === 'live' ? '' : 'sandbox.'}paypal.com/v2/checkout/orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const orderData = await response.json();

      if (response.ok && orderData.status === "COMPLETED") {
        // Get productId from PayPal order reference_id
        const paypalProductId = orderData.purchase_units[0]?.reference_id;
        
        console.log("PayPal Order Debug:", {
          orderId,
          paypalProductId,
          frontendProductId: productId,
          orderData: orderData
        });
        
        // Try different productId combinations with more variations
        const possibleProductIds = [
          paypalProductId,           // Use PayPal reference_id first
          productId,                 // Then frontend productId
          // Try common variations
          paypalProductId?.replace('-mt5', '').replace('-mt4', ''),
          productId?.replace('-mt5', '').replace('-mt4', ''),
          // Try legacy versions
          paypalProductId?.replace('-mt5', '').replace('-mt4', '') || productId?.replace('-mt5', '').replace('-mt4', ''),
          // Try adding platform suffixes
          paypalProductId ? `${paypalProductId}-mt5` : null,
          paypalProductId ? `${paypalProductId}-mt4` : null,
          productId ? `${productId}-mt5` : null,
          productId ? `${productId}-mt4` : null,
          // Try removing platform suffixes and adding different ones
          paypalProductId?.replace('-mt5', '-mt4'),
          paypalProductId?.replace('-mt4', '-mt5'),
          productId?.replace('-mt5', '-mt4'),
          productId?.replace('-mt4', '-mt5')
        ].filter(Boolean); // Remove undefined/null values
        
        console.log("Trying productIds:", possibleProductIds);
        
        // Try each productId until we find one that works
        for (const testProductId of possibleProductIds) {
          const item = getProductById(testProductId);
          
          if (item) {
            console.log(`✅ Found product with ID: ${testProductId}`);
            return NextResponse.json({
              verified: true,
              orderId: orderId,
              downloadUrl: item.downloadUrl,
              productId: testProductId,
              paypalOrderData: orderData,
              debug: {
                paypalProductId,
                frontendProductId: productId,
                finalProductId: testProductId
              }
            });
          }
        }
        
        // If no product found, try to determine the correct productId from order amount
        console.error("Product not found with any ID:", {
          paypalProductId,
          frontendProductId: productId,
          possibleProductIds,
          orderAmount: orderData.purchase_units?.[0]?.amount?.value
        });
        
        // Fallback: Try to determine product from amount
        const orderAmountUSD = parseFloat(orderData.purchase_units?.[0]?.amount?.value || '0');
        const orderAmountVND = orderAmountUSD * 24000; // Convert USD to VND
        
        console.log("Trying amount-based fallback:", {
          orderAmountUSD,
          orderAmountVND,
          possibleAmounts: {
            "indicator-pro": 1990000,
            "ea-full": 7900000,
            "ea-pro-source": 14900000
          }
        });
        
        // Try to match by amount
        let fallbackProductId = null;
        if (Math.abs(orderAmountVND - 1990000) < 100000) {
          fallbackProductId = 'indicator-pro-mt5'; // Default to MT5 for new orders
        } else if (Math.abs(orderAmountVND - 7900000) < 100000) {
          fallbackProductId = 'ea-full-mt5'; // Default to MT5 for new orders
        } else if (Math.abs(orderAmountVND - 14900000) < 100000) {
          fallbackProductId = 'ea-pro-source-mt5'; // Default to MT5 for new orders
        }
        
        if (fallbackProductId) {
          const fallbackItem = getProductById(fallbackProductId);
          if (fallbackItem) {
            console.log(`✅ Found product by amount fallback: ${fallbackProductId}`);
            return NextResponse.json({
              verified: true,
              orderId: orderId,
              downloadUrl: fallbackItem.downloadUrl,
              productId: fallbackProductId,
              paypalOrderData: orderData,
              debug: {
                paypalProductId,
                frontendProductId: productId,
                finalProductId: fallbackProductId,
                fallbackUsed: true,
                orderAmount: orderAmountVND
              }
            });
          }
        }
        
        return NextResponse.json(
          { verified: false, error: `Product not found. PayPal ID: ${paypalProductId}, Frontend ID: ${productId}, Amount: ${orderAmountVND}đ` },
          { status: 404 }
        );
      }
    } catch (paypalError) {
      console.error("PayPal verification error:", paypalError);
      // Continue to return error below
    }

    return NextResponse.json(
      { verified: false, error: "Order not found or payment not completed" },
      { status: 404 }
    );
  } catch (error: any) {
    console.error("Order verification error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

async function getPayPalAccessToken(): Promise<string | null> {
  try {
    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
    ).toString("base64");

    const response = await fetch(
      `https://api-m.${process.env.PAYPAL_MODE === 'live' ? '' : 'sandbox.'}paypal.com/v1/oauth2/token`,
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

function getProductById(productId: string) {
  // This should match the downloads array in the frontend
  const products = {
    // MT4 Products
    "indicator-pro-mt4": {
      downloadUrl: "/downloads/files/Indicator-Pro-Pack-MT4.zip"
    },
    "ea-full-mt4": {
      downloadUrl: "/downloads/files/ThebenchmarkTrader-Full-MT4.ex4"
    },
    "ea-pro-source-mt4": {
      downloadUrl: "/downloads/files/ThebenchmarkTrader-Pro-Source-MT4.zip"
    },
    // MT5 Products
    "indicator-pro-mt5": {
      downloadUrl: "/downloads/files/Indicator-Pro-Pack-MT5.zip"
    },
    "ea-full-mt5": {
      downloadUrl: "/downloads/files/ThebenchmarkTrader-Full-MT5.ex5"
    },
    "ea-pro-source-mt5": {
      downloadUrl: "/downloads/files/ThebenchmarkTrader-Pro-Source-MT5.zip"
    },
    // Legacy products (for backward compatibility)
    "indicator-pro": {
      downloadUrl: "/downloads/files/Indicator-Pro-Pack.zip"
    },
    "ea-full": {
      downloadUrl: "/downloads/files/ThebenchmarkTrader-Full.ex4"
    },
    "ea-pro-source": {
      downloadUrl: "/downloads/files/ThebenchmarkTrader-Pro-Source.zip"
    }
  };

  console.log("getProductById called:", {
    productId,
    found: !!products[productId as keyof typeof products],
    availableProducts: Object.keys(products)
  });

  return products[productId as keyof typeof products];
}