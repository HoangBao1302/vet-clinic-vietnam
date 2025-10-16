import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

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

    // First check local orders.json file
    try {
      const ordersPath = path.join(process.cwd(), "data", "orders.json");
      if (fs.existsSync(ordersPath)) {
        const data = fs.readFileSync(ordersPath, "utf8");
        const orders = JSON.parse(data);
        
        const order = orders.find((o: any) => o.orderId === orderId);
        if (order && order.status === "paid") {
          const item = getProductById(productId);
          return NextResponse.json({
            verified: true,
            orderId: orderId,
            downloadUrl: item?.downloadUrl,
            productId: order.productId,
          });
        }
      }
    } catch (fileError) {
      console.error("Error reading orders file:", fileError);
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
        const item = getProductById(productId);
        return NextResponse.json({
          verified: true,
          orderId: orderId,
          downloadUrl: item?.downloadUrl,
          productId: orderData.purchase_units[0]?.reference_id,
        });
      }
    } catch (paypalError) {
      // Order not found or invalid
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

  return products[productId as keyof typeof products];
}