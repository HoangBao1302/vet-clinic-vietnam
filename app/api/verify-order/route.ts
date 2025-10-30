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
    const { orderId, productId, strictMatch } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "Missing order ID" },
        { status: 400 }
      );
    }

    console.log("Order verification request:", {
      orderId,
      frontendProductId: productId,
      strictMatch,
      note: strictMatch ? "Strict matching enabled - must match exact product" : "Flexible matching - use database productId"
    });

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
        // STRICT MATCHING: If strictMatch is true, verify productId matches
        if (strictMatch && productId && productId !== order.productId) {
          console.warn("⚠️ Product mismatch detected:", {
            orderId: order.orderId,
            requestedProductId: productId,
            actualProductId: order.productId,
            customerEmail: order.customerEmail
          });
          
          return NextResponse.json(
            { 
              verified: false, 
              error: `Mã đơn hàng này dành cho sản phẩm khác. Vui lòng nhập mã vào đúng sản phẩm bạn đã mua.`,
              actualProductId: order.productId,
              requestedProductId: productId
            },
            { status: 403 }
          );
        }
        
        // Use productId from database (source of truth)
        console.log("✅ Order found in MongoDB:", {
          orderId: order.orderId,
          productId: order.productId,
          customerEmail: order.customerEmail,
          frontendProductId: productId,
          strictMatch,
          note: strictMatch ? "Strict match passed" : "Using database productId"
        });
        
        const item = getProductById(order.productId);
        
        if (!item) {
          console.error("❌ Product not found for productId:", order.productId);
          return NextResponse.json(
            { verified: false, error: `Lỗi cấu hình sản phẩm: ${order.productId}. Vui lòng liên hệ support.` },
            { status: 500 }
          );
        }
        
        return NextResponse.json({
          verified: true,
          orderId: orderId,
          downloadUrl: item.downloadUrl,
          productId: order.productId, // Return the actual product they paid for
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
          orderData: orderData,
          note: "Ignoring frontend productId - determining from PayPal order only"
        });
        
        // Determine product from PayPal order only (ignore frontend productId)
        const orderAmountUSD = parseFloat(orderData.purchase_units?.[0]?.amount?.value || '0');
        const orderAmountVND = orderAmountUSD * 24000; // Convert USD to VND
        
        console.log("Determining product from PayPal order:", {
          paypalProductId,
          orderAmountUSD,
          orderAmountVND
        });
        
        // Try different productId combinations based on PayPal order
        const possibleProductIds = [
          paypalProductId,           // Use PayPal reference_id first
          // Try common variations
          paypalProductId?.replace('-mt5', '').replace('-mt4', ''),
          // Try adding platform suffixes
          paypalProductId ? `${paypalProductId}-mt5` : null,
          paypalProductId ? `${paypalProductId}-mt4` : null,
          // Try removing platform suffixes and adding different ones
          paypalProductId?.replace('-mt5', '-mt4'),
          paypalProductId?.replace('-mt4', '-mt5')
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
        
        // Fallback: Try to determine product from amount (already calculated above)
        
        console.log("Trying amount-based fallback:", {
          orderAmountUSD,
          orderAmountVND,
          possibleAmounts: {
            "indicator-pro": 1990000,
            "ea-full": 7900000,
            "ea-pro-source": 14900000
          }
        });
        
        // COMPREHENSIVE amount matching system for ALL scenarios
        let fallbackProductId = null;
        const tolerance = 1000000; // 1M VND tolerance for all edge cases
        
        // Try to detect platform from paypalProductId first
        const isMT5 = paypalProductId?.includes('mt5') || paypalProductId?.includes('MT5');
        const isMT4 = paypalProductId?.includes('mt4') || paypalProductId?.includes('MT4');
        
        console.log("Platform detection from PayPal:", {
          paypalProductId,
          isMT5,
          isMT4,
          detectedPlatform: isMT5 ? 'MT5' : isMT4 ? 'MT4' : 'Unknown'
        });
        
        // COMPREHENSIVE amount matching with multiple strategies and conversion rates
        const conversionRates = [24000, 25000, 23000, 22000]; // Multiple possible rates
        const amountStrategies = [];
        
        // Strategy 1: Direct amount match with standard products
        amountStrategies.push(
          { amount: 1990000, name: 'indicator-pro', type: 'direct' },
          { amount: 7900000, name: 'ea-full', type: 'direct' },
          { amount: 14900000, name: 'ea-pro-source', type: 'direct' }
        );
        
        // Strategy 2: Multiple conversion rates
        conversionRates.forEach(rate => {
          const convertedAmount = orderAmountUSD * rate;
          amountStrategies.push(
            { amount: convertedAmount, name: 'usd-converted', type: 'conversion', rate },
            { amount: convertedAmount, name: 'indicator-pro', type: 'conversion', rate },
            { amount: convertedAmount, name: 'ea-full', type: 'conversion', rate },
            { amount: convertedAmount, name: 'ea-pro-source', type: 'conversion', rate }
          );
        });
        
        // Strategy 3: Amount range detection
        amountStrategies.push(
          { amount: orderAmountVND, name: 'range-detection', type: 'range' }
        );
        
        console.log("Comprehensive amount matching strategies:", {
          orderAmountVND,
          orderAmountUSD,
          conversionRates,
          totalStrategies: amountStrategies.length,
          strategies: amountStrategies.slice(0, 10).map(s => ({
            amount: Math.round(s.amount),
            name: s.name,
            type: s.type,
            difference: Math.abs(orderAmountVND - s.amount)
          }))
        });
        
        // Try each strategy with comprehensive matching
        for (const strategy of amountStrategies) {
          const difference = Math.abs(orderAmountVND - strategy.amount);
          
          if (difference < tolerance) {
            console.log(`✅ Amount match found with strategy: ${strategy.name} (${strategy.type})`);
            
            // Determine product based on strategy
            if (strategy.name === 'indicator-pro') {
              fallbackProductId = isMT4 ? 'indicator-pro-mt4' : isMT5 ? 'indicator-pro-mt5' : 'indicator-pro-mt5';
            } else if (strategy.name === 'ea-full') {
              fallbackProductId = isMT4 ? 'ea-full-mt4' : isMT5 ? 'ea-full-mt5' : 'ea-full-mt5';
            } else if (strategy.name === 'ea-pro-source') {
              fallbackProductId = isMT4 ? 'ea-pro-source-mt4' : isMT5 ? 'ea-pro-source-mt5' : 'ea-pro-source-mt5';
            } else if (strategy.name === 'range-detection') {
              // Smart range detection for unknown amounts
              if (orderAmountVND < 3000000) {
                fallbackProductId = isMT4 ? 'indicator-pro-mt4' : isMT5 ? 'indicator-pro-mt5' : 'indicator-pro-mt5';
              } else if (orderAmountVND < 12000000) {
                fallbackProductId = isMT4 ? 'ea-full-mt4' : isMT5 ? 'ea-full-mt5' : 'ea-full-mt5';
              } else {
                fallbackProductId = isMT4 ? 'ea-pro-source-mt4' : isMT5 ? 'ea-pro-source-mt5' : 'ea-pro-source-mt5';
              }
            } else if (strategy.name === 'usd-converted') {
              // For USD conversion issues, use range detection
              if (orderAmountVND < 3000000) {
                fallbackProductId = isMT4 ? 'indicator-pro-mt4' : isMT5 ? 'indicator-pro-mt5' : 'indicator-pro-mt5';
              } else if (orderAmountVND < 12000000) {
                fallbackProductId = isMT4 ? 'ea-full-mt4' : isMT5 ? 'ea-full-mt5' : 'ea-full-mt5';
              } else {
                fallbackProductId = isMT4 ? 'ea-pro-source-mt4' : isMT5 ? 'ea-pro-source-mt5' : 'ea-pro-source-mt5';
              }
            }
            
            if (fallbackProductId) {
              console.log(`✅ Fallback product determined: ${fallbackProductId} (strategy: ${strategy.name})`);
              break;
            }
          }
        }
        
        // FINAL FALLBACK: If no amount match, use smart detection
        if (!fallbackProductId) {
          console.log("⚠️ No amount match found, using smart detection fallback");
          
          // Try to detect from PayPal description or other fields
          const description = orderData.purchase_units?.[0]?.description || '';
          const customId = orderData.purchase_units?.[0]?.custom_id || '';
          
          console.log("Smart detection data:", {
            description,
            customId,
            paypalProductId,
            orderAmountVND
          });
          
          // Smart detection based on amount ranges
          if (orderAmountVND < 3000000) {
            fallbackProductId = isMT4 ? 'indicator-pro-mt4' : isMT5 ? 'indicator-pro-mt5' : 'indicator-pro-mt5';
          } else if (orderAmountVND < 12000000) {
            fallbackProductId = isMT4 ? 'ea-full-mt4' : isMT5 ? 'ea-full-mt5' : 'ea-full-mt5';
          } else {
            fallbackProductId = isMT4 ? 'ea-pro-source-mt4' : isMT5 ? 'ea-pro-source-mt5' : 'ea-pro-source-mt5';
          }
          
          console.log(`✅ Smart detection fallback: ${fallbackProductId}`);
        }
        
        console.log("Amount-based fallback result:", {
          orderAmountVND,
          fallbackProductId,
          tolerance,
          matches: {
            indicator: Math.abs(orderAmountVND - 1990000) < tolerance,
            full: Math.abs(orderAmountVND - 7900000) < tolerance,
            proSource: Math.abs(orderAmountVND - 14900000) < tolerance
          }
        });
        
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