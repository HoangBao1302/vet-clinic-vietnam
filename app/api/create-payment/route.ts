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
      // PayPal integration temporarily disabled
      // TODO: Implement using @paypal/paypal-js instead of deprecated checkout-server-sdk
      return NextResponse.json(
        { success: false, error: "PayPal integration temporarily disabled. Please use Stripe." },
        { status: 503 }
      );
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

