import Order from "@/lib/models/Order";
import connectDB from "@/lib/mongodb";
import { fulfillPaidPayPalOrder } from "@/lib/paypalFulfill";
import { nowPaymentsRequest, shouldFulfillCryptoPayment, type NowPayment } from "@/lib/nowpayments";

const KNOWN_PAYMENT_IDS = ["4720536001", "5903550041", "4890503610"];
const INDICATOR_IDS = ["indicator-pro-mt4", "indicator-pro-mt5"];

function paymentIdOf(payment: NowPayment) {
  return String(payment.payment_id || "").trim();
}

function orderIdOf(payment: NowPayment) {
  return String(payment.order_id || "").trim();
}

function inferredProductId(payment: NowPayment, fallback?: string) {
  const description = String(payment.order_description || "").toLowerCase();
  if (description.includes("mt5")) return "indicator-pro-mt5";
  if (description.includes("mt4")) return "indicator-pro-mt4";
  return fallback || "indicator-pro-mt5";
}

function listedUsd(payment: NowPayment) {
  const listed = Number(payment.price_amount || payment.pay_amount || 0);
  return Number.isFinite(listed) && listed > 0 ? listed : 16;
}

async function hydratePayment(payment: NowPayment): Promise<NowPayment> {
  const status = String(payment.payment_status || "").toLowerCase();
  const id = paymentIdOf(payment);
  if (status && orderIdOf(payment)) return payment;
  if (!id) return payment;
  try {
    return { ...payment, ...(await nowPaymentsRequest<NowPayment>(`/payment/${id}`)) };
  } catch {
    return payment;
  }
}

async function findCryptoOrderForPayment(payment: NowPayment) {
  const listedOrderId = orderIdOf(payment);
  const paymentId = paymentIdOf(payment);

  if (listedOrderId) {
    const exact = await Order.findOne({ orderId: listedOrderId });
    if (exact) return exact;
  }
  if (paymentId) {
    const byPayment = await Order.findOne({ cryptoPaymentId: paymentId });
    if (byPayment) return byPayment;
  }

  const price = listedUsd(payment);
  const cents = Math.round(price * 100);
  return Order.findOne({
    paymentMethod: "crypto",
    status: { $ne: "paid" },
    $or: [
      { amount: { $in: [price, cents, 16, 1600, 10, 1000, 3, 300] } },
      { productId: { $in: INDICATOR_IDS } },
    ],
  }).sort({ createdAt: -1 });
}

export async function fulfillCryptoNowPayment(payment: NowPayment) {
  const hydrated = await hydratePayment(payment);
  const expectedUsd = listedUsd(hydrated);
  if (!shouldFulfillCryptoPayment(hydrated, expectedUsd)) {
    return { fulfilled: "", skipped: `not payable (${hydrated.payment_status || "unknown"})` };
  }

  const matched = await findCryptoOrderForPayment(hydrated);
  if (matched && ["ea-full-mt4", "ea-full-mt5", "ea-pro-source-mt4", "ea-pro-source-mt5"].includes(matched.productId)) {
    return { fulfilled: "", skipped: `refusing to attach to ${matched.productId}` };
  }
  if (matched?.status === "paid") {
    return { fulfilled: "", skipped: "already paid" };
  }

  const donor =
    matched ||
    (await Order.findOne({
      paymentMethod: "crypto",
      productId: { $in: INDICATOR_IDS },
      customerEmail: { $nin: [null, ""] },
    }).sort({ createdAt: -1 }));

  const targetOrderId = matched?.orderId || orderIdOf(hydrated);
  if (!targetOrderId) {
    return { fulfilled: "", skipped: "missing order id" };
  }

  await fulfillPaidPayPalOrder({
    orderId: targetOrderId,
    productId: inferredProductId(hydrated, matched?.productId || donor?.productId),
    customerEmail: matched?.customerEmail || donor?.customerEmail || "",
    customerName: matched?.customerName || donor?.customerName || "Customer",
    customerPhone: matched?.customerPhone || donor?.customerPhone || "",
    amountUsd: matched?.amount ? matched.amount / 100 : expectedUsd,
    broker: matched?.broker || donor?.broker,
    accountId: matched?.accountId || donor?.accountId,
    server: matched?.server || donor?.server,
    paymentMethod: "crypto",
    cryptoPaymentId: paymentIdOf(hydrated) || undefined,
  });

  return { fulfilled: targetOrderId, skipped: "" };
}

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
  const listedOrderIds = [...new Set(listedPayments.map(orderIdOf).filter(Boolean))];

  for (const payment of listedPayments) {
    try {
      const result = await fulfillCryptoNowPayment(payment);
      if (result.fulfilled) {
        fulfilled.push(result.fulfilled);
      } else if (result.skipped && result.skipped !== "already paid") {
        skipped.push({
          orderId: orderIdOf(payment) || paymentIdOf(payment) || "listed",
          status: payment.payment_status,
          reason: result.skipped,
        });
      }
    } catch (error) {
      skipped.push({
        orderId: orderIdOf(payment) || paymentIdOf(payment) || "listed",
        reason: error instanceof Error ? error.message : "listed fulfill failed",
      });
    }
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
        payment = listedPayments.find((item) => orderIdOf(item) === order.orderId);
      }
      if (!payment) {
        skipped.push({ orderId: order.orderId, reason: "Payment not found" });
        continue;
      }

      const result = await fulfillCryptoNowPayment(payment);
      if (result.fulfilled) {
        fulfilled.push(result.fulfilled);
      } else {
        skipped.push({
          orderId: order.orderId,
          status: payment.payment_status,
          reason: result.skipped || `not payable yet (expected ${((order.amount || 0) / 100)}, actually_paid ${payment.actually_paid ?? ""})`,
        });
      }
    } catch (error) {
      skipped.push({
        orderId: order.orderId,
        reason: error instanceof Error ? error.message : "lookup failed",
      });
    }
  }

  return {
    checked: pending.length,
    fulfilled: [...new Set(fulfilled)],
    skipped,
    listedOrderIds,
    pendingOrderIds: pending.map((order) => order.orderId),
  };
}
