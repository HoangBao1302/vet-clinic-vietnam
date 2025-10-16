import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { productId, productName, amount, customerInfo } = await request.json();

    // Validate input
    if (!productId || !productName || !amount || !customerInfo) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if PayPal is configured
    if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
      console.error("PayPal not configured on server:", {
        hasClientId: !!process.env.PAYPAL_CLIENT_ID,
        hasClientSecret: !!process.env.PAYPAL_CLIENT_SECRET,
        mode: process.env.PAYPAL_MODE
      });
      return NextResponse.json(
        { success: false, error: "PayPal payment is temporarily unavailable. Please try Stripe instead." },
        { status: 503 }
      );
    }

    const accessToken = await getPayPalAccessToken();
    if (!accessToken) {
      console.error("Failed to get PayPal access token - check credentials and mode");
      return NextResponse.json(
        { success: false, error: "PayPal authentication failed. Please check your PayPal configuration or try Stripe instead." },
        { status: 500 }
      );
    }

    // Create PayPal order
    const orderData: any = {
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: productId,
          amount: {
            currency_code: "VND",
            value: (amount / 100).toFixed(2), // Convert from cents to VND
          },
          description: productName,
          custom_id: productId,
        },
      ],
      application_context: {
        brand_name: "ThebenchmarkTrader",
        landing_page: "NO_PREFERENCE",
        user_action: "PAY_NOW",
        return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/downloads/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/downloads?cancelled=true`,
      },
    };

    // Only add payer info for live mode, sandbox doesn't need it
    if (process.env.PAYPAL_MODE === 'live') {
      orderData.payer = {
        name: {
          given_name: customerInfo.name,
        },
        email_address: customerInfo.email,
        phone: {
          phone_number: {
            national_number: customerInfo.phone,
          },
        },
      };
    }

    const response = await fetch(
      `https://api-m.${process.env.PAYPAL_MODE === 'live' ? '' : 'sandbox.'}paypal.com/v2/checkout/orders`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "PayPal-Request-Id": `${productId}-${Date.now()}`,
        },
        body: JSON.stringify(orderData),
      }
    );

    const order = await response.json();

    if (!response.ok) {
      console.error("PayPal order creation failed:", {
        status: response.status,
        statusText: response.statusText,
        order: order,
        mode: process.env.PAYPAL_MODE,
        baseUrl: `https://api-m.${process.env.PAYPAL_MODE === 'live' ? '' : 'sandbox.'}paypal.com`
      });
      
      // Better error messages for common issues
      let errorMessage = "PayPal payment is temporarily unavailable. Please try Stripe instead.";
      
      if (response.status === 400) {
        if (order.message?.includes("business validation")) {
          errorMessage = "PayPal sandbox không chấp nhận email này. Vui lòng dùng email cá nhân hoặc thử Stripe.";
        } else if (order.message?.includes("semantically incorrect")) {
          errorMessage = "Thông tin thanh toán không hợp lệ. Vui lòng kiểm tra lại hoặc thử Stripe.";
        } else {
          errorMessage = "Thông tin thanh toán không đúng. Vui lòng thử Stripe.";
        }
      } else if (response.status === 401) {
        errorMessage = "PayPal credentials không hợp lệ. Vui lòng thử Stripe.";
      } else if (response.status === 403) {
        errorMessage = "PayPal không cho phép thanh toán này. Vui lòng thử Stripe.";
      }
      
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 500 }
      );
    }

    // Store order data in metadata for webhook processing
    const orderId = order.id;
    
    return NextResponse.json({
      success: true,
      orderId: orderId,
      approvalUrl: order.links.find((link: any) => link.rel === "approve")?.href,
    });
  } catch (error: any) {
    console.error("PayPal order creation error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

async function getPayPalAccessToken(): Promise<string | null> {
  try {
    // Check if environment variables are set
    if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
      console.error("PayPal credentials not configured:", {
        hasClientId: !!process.env.PAYPAL_CLIENT_ID,
        hasClientSecret: !!process.env.PAYPAL_CLIENT_SECRET,
        mode: process.env.PAYPAL_MODE
      });
      return null;
    }

    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
    ).toString("base64");

    const baseUrl = process.env.PAYPAL_MODE === 'live' 
      ? 'https://api-m.paypal.com' 
      : 'https://api-m.sandbox.paypal.com';

    console.log("PayPal auth request:", {
      baseUrl,
      mode: process.env.PAYPAL_MODE,
      clientIdLength: process.env.PAYPAL_CLIENT_ID?.length,
      clientIdPrefix: process.env.PAYPAL_CLIENT_ID?.substring(0, 10) + "...",
      isLiveMode: process.env.PAYPAL_MODE === 'live'
    });

    const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("PayPal auth failed:", {
        status: response.status,
        statusText: response.statusText,
        data: data,
        baseUrl,
        mode: process.env.PAYPAL_MODE,
        clientIdPrefix: process.env.PAYPAL_CLIENT_ID?.substring(0, 10) + "..."
      });
      return null;
    }

    console.log("PayPal auth successful:", {
      mode: process.env.PAYPAL_MODE,
      baseUrl,
      tokenLength: data.access_token?.length
    });
    return data.access_token;
  } catch (error) {
    console.error("PayPal access token error:", error);
    return null;
  }
}
