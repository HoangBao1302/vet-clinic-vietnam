import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import { fulfillCryptoNowPayment } from "@/lib/cryptoFulfill";
import { nowPaymentsRequest, type NowPayment } from "@/lib/nowpayments";

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

    let payment: NowPayment | undefined;
    if (order.cryptoPaymentId) {
      try {
        payment = await nowPaymentsRequest<NowPayment>(`/payment/${order.cryptoPaymentId}`);
      } catch {
        try {
          payment = await nowPaymentsRequest<NowPayment>(`/invoice/${order.cryptoPaymentId}`);
        } catch {
          payment = undefined;
        }
      }
    }

    if (payment) {
      const result = await fulfillCryptoNowPayment({
        ...payment,
        order_id: payment.order_id || orderId,
      });
      if (result.fulfilled) {
        return NextResponse.json({
          success: true,
          paid: true,
          status: payment.payment_status || "paid",
          orderId: result.fulfilled,
          productId: order.productId,
        });
      }
      return NextResponse.json({
        success: true,
        paid: false,
        status: payment.payment_status || order.status,
        orderId,
      });
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
