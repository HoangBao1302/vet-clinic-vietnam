import { NextRequest, NextResponse } from "next/server";

// Note: Install dependencies first: npm install stripe @paypal/checkout-server-sdk

export async function POST(request: NextRequest) {
  try {
    const { productId, productName, amount, method, customerInfo } = await request.json();

    // Validate input
    if (!productId || !productName || !amount || !method || !customerInfo) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (method === "stripe") {
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

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [
            {
              price_data: {
                currency: "vnd",
                product_data: {
                  name: productName,
                  description: `Product ID: ${productId}`,
                },
                unit_amount: amount,
              },
              quantity: 1,
            },
          ],
          mode: "payment",
          success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://leopardsmart.com'}/downloads/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://leopardsmart.com'}/downloads?cancelled=true`,
          customer_email: customerInfo.email,
          metadata: {
            productId,
            customerName: customerInfo.name,
            customerPhone: customerInfo.phone,
          },
        });

        return NextResponse.json({
          success: true,
          paymentUrl: session.url,
          sessionId: session.id,
        });
      } catch (stripeError: any) {
        console.error("Stripe error:", stripeError);
        return NextResponse.json(
          { success: false, error: `Stripe error: ${stripeError.message}` },
          { status: 500 }
        );
      }
    } else if (method === "paypal") {
      // Check if PayPal is configured
      if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
        return NextResponse.json(
          { success: false, error: "PayPal not configured" },
          { status: 503 }
        );
      }
      
      try {
        // TODO: Update to use @paypal/paypal-js instead of deprecated checkout-server-sdk
        // For now, return error to avoid build failure
        return NextResponse.json(
          { success: false, error: "PayPal integration temporarily disabled. Please use Stripe." },
          { status: 503 }
        );
        
        /* Commented out deprecated PayPal SDK code
        const paypal = await import("@paypal/checkout-server-sdk");
        
        const environment = process.env.PAYPAL_MODE === "live"
          ? new paypal.core.LiveEnvironment(
              process.env.PAYPAL_CLIENT_ID,
              process.env.PAYPAL_CLIENT_SECRET
            )
          : new paypal.core.SandboxEnvironment(
              process.env.PAYPAL_CLIENT_ID,
              process.env.PAYPAL_CLIENT_SECRET
            );

        const client = new paypal.core.PayPalHttpClient(environment);
        const request = new paypal.orders.OrdersCreateRequest();
        
        request.prefer("return=representation");
        request.requestBody({
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: {
                currency_code: "USD",
                value: (amount / 25000).toFixed(2), // VND to USD conversion (adjust rate as needed)
              },
              description: productName,
              custom_id: productId,
            },
          ],
          application_context: {
            brand_name: "EA LeopardSmart",
            landing_page: "NO_PREFERENCE",
            user_action: "PAY_NOW",
            return_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://leopardsmart.com'}/downloads/success?paypal=true&order_id={order_id}`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://leopardsmart.com'}/downloads?cancelled=true`,
          },
        });

        const order = await client.execute(request);
        const approveUrl = order.result.links.find((link: any) => link.rel === "approve")?.href;

        return NextResponse.json({
          success: true,
          paymentUrl: approveUrl,
          orderId: order.result.id,
        });
        */
      } catch (paypalError: any) {
        console.error("PayPal error:", paypalError);
        return NextResponse.json(
          { success: false, error: `PayPal error: ${paypalError.message}` },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { success: false, error: "Invalid payment method" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Payment creation error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

