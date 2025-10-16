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
      return NextResponse.json(
        { success: false, error: "PayPal not configured" },
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

    // Create PayPal order
    const orderData = {
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
      payer: {
        name: {
          given_name: customerInfo.name,
        },
        email_address: customerInfo.email,
        phone: {
          phone_number: {
            national_number: customerInfo.phone,
          },
        },
      },
    };

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
      console.error("PayPal order creation failed:", order);
      return NextResponse.json(
        { success: false, error: `PayPal error: ${order.message || "Unknown error"}` },
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
