import Order from "@/lib/models/Order";
import connectDB from "@/lib/mongodb";
import { fulfillPaidPayPalOrder } from "@/lib/paypalFulfill";
import { nowPaymentsRequest, shouldFulfillCryptoPayment, type NowPayment } from "@/lib/nowpayments";

const KNOWN_PAYMENT_IDS = ["4720536001", "5903550041", "4890503610"];

export async function reconcilePendingCryptoOrders() {
  await connectDB();
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const pending = await Order.find({
    paymentMethod: "crypto",
    status: { $ne: "paid" },
    createdAt: { $gte: since },
  }).limit(80);

  const listedPayments: NowPayment[] = [];
  try {
    const listed = await nowPaymentsRequest<{ data?: NowPayment[] } | NowPayment[]>(
      "/payment/?limit=20&page=0&sortBy=created_at&orderBy=desc"
    );
    listedPayments.push(...(Array.isArray(listed) ? listed : listed.data || []));
  } catch (error) {
    console.error("NOWPayments payment list failed:", error);
  }

  for (const paymentId of KNOWN_PAYMENT_IDS) {
    try {
      listedPayments.push(await nowPaymentsRequest<NowPayment>(`/payment/${paymentId}`));
    } catch {
      // Ignore stale dashboard ids.
    }
  }

  const fulfilled: string[] = [];
  const skipped: Array<{ orderId: string; status?: string; reason: string }> = [];
  const listedOrderIds = listedPayments
    .map((item) => String(item.order_id || ""))
    .filter(Boolean);

  for (const payment of listedPayments) {
    const listedOrderId = String(payment.order_id || "").trim();
    if (!listedOrderId) continue;
    const listedOrder = await Order.findOne({ orderId: listedOrderId, status: { $ne: "paid" } });
    if (!listedOrder) continue;
    const expectedUsd = (listedOrder.amount || 0) / 100;
    if (!shouldFulfillCryptoPayment(payment, expectedUsd)) continue;
    await fulfillPaidPayPalOrder({
      orderId: listedOrder.orderId,
      productId: listedOrder.productId,
      customerEmail: listedOrder.customerEmail,
      customerName: listedOrder.customerName,
      customerPhone: listedOrder.customerPhone,
      amountUsd: expectedUsd,
      broker: listedOrder.broker,
      accountId: listedOrder.accountId,
      server: listedOrder.server,
      paymentMethod: "crypto",
    });
    fulfilled.push(listedOrder.orderId);
  }

  for (const order of pending) {
    if (fulfilled.includes(order.orderId)) continue;
    try {
      let payment: NowPayment | undefined;
      if (order.cryptoPaymentId) {
        try {
          payment = await nowPaymentsRequest<NowPayment>(`/payment/${order.cryptoPaymentId}`);
        } catch {
          payment = undefined;
        }
      }
      if (!payment) {
        payment = listedPayments.find((item) => String(item.order_id || "") === order.orderId);
      }
      if (!payment) {
        skipped.push({ orderId: order.orderId, reason: "Payment not found" });
        continue;
      }

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
      skipped.push({
        orderId: order.orderId,
        reason: error instanceof Error ? error.message : "lookup failed",
      });
    }
  }

  return { checked: pending.length, fulfilled: [...new Set(fulfilled)], skipped, listedOrderIds };
}
