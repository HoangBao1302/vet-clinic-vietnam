import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import { fulfillPaidPayPalOrder } from "@/lib/paypalFulfill";
import { isCryptoPaidStatus, nowPaymentsRequest, type NowPayment } from "@/lib/nowpayments";

export async function GET(request: NextRequest) {
  const orderId = request.nextUrl.searchParams.get("orderId")?.trim();
  if (!orderId) {
    return NextResponse.json({ success: false, error: "Missing order ID" }, { status: 400 });
  }

  try {
    await connectDB();
    const order = await Order.findOne({ orderId });
    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    if (order.status === "paid") {
      return NextResponse.json({
        success: true,
        paid: true,
        status: "paid",
        orderId,
        productId: order.productId,
      });
    }

    if (order.cryptoPaymentId) {
      try {
        const payment = await nowPaymentsRequest<NowPayment>(`/payment/${order.cryptoPaymentId}`);
        if (isCryptoPaidStatus(payment.payment_status)) {
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
          return NextResponse.json({
            success: true,
            paid: true,
            status: payment.payment_status,
            orderId,
            productId: order.productId,
          });
        }
        return NextResponse.json({
          success: true,
          paid: false,
          status: payment.payment_status || order.status,
          orderId,
        });
      } catch (error) {
        console.error("NOWPayments status lookup failed:", error);
      }
    }

    return NextResponse.json({
      success: true,
      paid: false,
      status: order.status,
      orderId,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Status check failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
