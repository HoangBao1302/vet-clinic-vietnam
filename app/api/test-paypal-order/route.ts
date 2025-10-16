import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { productId, productName, amount, customerInfo } = await request.json();

    console.log("PayPal test order creation:", {
      productId,
      productName,
      amount,
      customerInfo: {
        name: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone
      },
      mode: process.env.PAYPAL_MODE,
      hasClientId: !!process.env.PAYPAL_CLIENT_ID,
      hasClientSecret: !!process.env.PAYPAL_CLIENT_SECRET,
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL
    });

    // Check if PayPal is configured
    if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
      return NextResponse.json({
        success: false,
        error: "PayPal not configured",
        details: {
          hasClientId: !!process.env.PAYPAL_CLIENT_ID,
          hasClientSecret: !!process.env.PAYPAL_CLIENT_SECRET,
          mode: process.env.PAYPAL_MODE
        }
      });
    }

    // Test access token
    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
    ).toString("base64");

    const baseUrl = process.env.PAYPAL_MODE === 'live' 
      ? 'https://api-m.paypal.com' 
      : 'https://api-m.sandbox.paypal.com';

    console.log("Testing PayPal auth:", {
      baseUrl,
      mode: process.env.PAYPAL_MODE,
      clientIdPrefix: process.env.PAYPAL_CLIENT_ID?.substring(0, 10) + "..."
    });

    const authResponse = await fetch(`${baseUrl}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    const authData = await authResponse.json();

    if (!authResponse.ok) {
      return NextResponse.json({
        success: false,
        error: "PayPal authentication failed",
        details: {
          status: authResponse.status,
          statusText: authResponse.statusText,
          data: authData,
          baseUrl,
          mode: process.env.PAYPAL_MODE
        }
      });
    }

    // Test order creation
    const orderData = {
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: productId,
          amount: {
            currency_code: "VND",
            value: (amount / 100).toFixed(2),
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

    // Add payer info for live mode
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

    const orderResponse = await fetch(
      `${baseUrl}/v2/checkout/orders`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authData.access_token}`,
          "PayPal-Request-Id": `${productId}-${Date.now()}`,
        },
        body: JSON.stringify(orderData),
      }
    );

    const orderResult = await orderResponse.json();

    return NextResponse.json({
      success: orderResponse.ok,
      authTest: {
        success: true,
        tokenLength: authData.access_token?.length
      },
      orderTest: {
        success: orderResponse.ok,
        status: orderResponse.status,
        statusText: orderResponse.statusText,
        orderId: orderResult.id,
        approvalUrl: orderResult.links?.find((link: any) => link.rel === "approve")?.href,
        error: orderResponse.ok ? null : orderResult
      },
      configuration: {
        mode: process.env.PAYPAL_MODE,
        baseUrl,
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL
      }
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
}
