import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import { fulfillPaidPayPalOrder } from "@/lib/paypalFulfill";
import { isCryptoPaidStatus, verifyNowPaymentsSignature } from "@/lib/nowpayments";

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get("x-nowpayments-sig");
    const body = await request.json();

    if (!verifyNowPaymentsSignature(body, signature)) {
      console.error("NOWPayments IPN signature mismatch");
      return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 401 });
    }

    const paymentStatus = String(body.payment_status || "");
    const orderId = String(body.order_id || "").trim();
    const paymentId = body.payment_id ? String(body.payment_id) : "";

    console.log("NOWPayments IPN received:", { orderId, paymentId, paymentStatus });

    if (!orderId || !isCryptoPaidStatus(paymentStatus)) {
      return NextResponse.json({ success: true, message: "Webhook received" });
    }

    await connectDB();
    const order = await Order.findOne({ orderId });
    if (!order) {
      console.error("NOWPayments IPN order not found:", orderId);
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    await fulfillPaidPayPalOrder({
      orderId,
      productId: order.productId,
      customerEmail: order.customerEmail,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      amountUsd: (order.amount || 0) / 100,
      broker: order.broker,
      accountId: order.accountId,
      server: order.server,
      paymentMethod: "crypto",
    });

    return NextResponse.json({ success: true, message: "Order processed" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Crypto webhook error";
    console.error("NOWPayments webhook error:", error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
