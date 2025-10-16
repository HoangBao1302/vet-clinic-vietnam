import { NextRequest, NextResponse } from "next/server";

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

      return NextResponse.json({
        success: true,
        orderId: session.id,
        status: session.payment_status,
        customerEmail: session.customer_email,
        amount: session.amount_total,
        productId: session.metadata?.productId,
        customerName: session.metadata?.customerName,
        customerPhone: session.metadata?.customerPhone,
        createdAt: new Date(session.created * 1000).toISOString(),
      });
    } catch (stripeError: any) {
      console.error("Stripe error:", stripeError);
      return NextResponse.json(
        { success: false, error: `Stripe error: ${stripeError.message}` },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Get order error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}