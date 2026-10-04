import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import { fulfillPaidPayPalOrder } from "@/lib/paypalFulfill";
import { nowPaymentsRequest, shouldFulfillCryptoPayment, type NowPayment } from "@/lib/nowpayments";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const pending = await Order.find({
      paymentMethod: "crypto",
      status: { $ne: "paid" },
      createdAt: { $gte: since },
      cryptoPaymentId: { $exists: true, $ne: "" },
    }).limit(50);

    const fulfilled: string[] = [];
    const skipped: Array<{ orderId: string; status?: string; reason: string }> = [];
    for (const order of pending) {
      try {
        const payment = await nowPaymentsRequest<NowPayment>(`/payment/${order.cryptoPaymentId}`);
        const expectedUsd = (order.amount || 0) / 100;
        if (!shouldFulfillCryptoPayment(payment, expectedUsd)) {
          skipped.push({
            orderId: order.orderId,
            status: payment.payment_status,
            reason: `not payable yet (expected ${expectedUsd}, actually_paid ${payment.actually_paid ?? ""})`,
          });
          continue;
        }
        await fulfillPaidPayPalOrder({
          orderId: order.orderId,
          productId: order.productId,
          customerEmail: order.customerEmail,
          customerName: order.customerName,
          customerPhone: order.customerPhone,
          amountUsd: expectedUsd,
          broker: order.broker,
          accountId: order.accountId,
          server: order.server,
          paymentMethod: "crypto",
        });
        fulfilled.push(order.orderId);
      } catch (error) {
        const message = error instanceof Error ? error.message : "lookup failed";
        skipped.push({ orderId: order.orderId, reason: message });
      }
    }

    return NextResponse.json({ success: true, checked: pending.length, fulfilled, skipped });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Reconcile failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
