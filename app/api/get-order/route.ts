import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json({ error: "No session ID" }, { status: 400 });
    }

    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
    }

    // Retrieve Stripe session
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-12-18.acacia" as any,
    });

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return NextResponse.json({
      orderId: session.id,
      productId: session.metadata?.productId,
      customerEmail: session.customer_email,
      amount: session.amount_total,
      status: session.payment_status,
    });
  } catch (error: any) {
    console.error("Get order error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

