import Order from "@/lib/models/Order";
import connectDB from "@/lib/mongodb";
import { fulfillPaidPayPalOrder } from "@/lib/paypalFulfill";
import { nowPaymentsRequest, shouldFulfillCryptoPayment, type NowPayment } from "@/lib/nowpayments";

function paymentIdOf(payment: NowPayment) {
  return String(payment.payment_id || "").trim();
}

function orderIdOf(payment: NowPayment) {
  return String(payment.order_id || "").trim();
}

function listedUsd(payment: NowPayment) {
  const listed = Number(payment.price_amount || payment.pay_amount || 0);
  return Number.isFinite(listed) && listed > 0 ? listed : 0;
}

function inferredProductId(payment: NowPayment, fallback?: string) {
  const description = String(payment.order_description || "").toLowerCase();
  if (description.includes("mt5") && description.includes("full")) return "ea-full-mt5";
  if (description.includes("mt4") && description.includes("full")) return "ea-full-mt4";
  if (description.includes("pro source") && description.includes("mt5")) return "ea-pro-source-mt5";
  if (description.includes("pro source") && description.includes("mt4")) return "ea-pro-source-mt4";
  if (description.includes("mt5")) return "indicator-pro-mt5";
  if (description.includes("mt4")) return "indicator-pro-mt4";
  return fallback || "indicator-pro-mt5";
}

/** Mark the exact NOWPayments order paid when status is finished or fee-short partially_paid. */
export async function fulfillCryptoNowPayment(payment: NowPayment) {
  await connectDB();

  const paymentId = paymentIdOf(payment);
  let hydrated = payment;
  if (paymentId) {
    try {
      hydrated = { ...payment, ...(await nowPaymentsRequest<NowPayment>(`/payment/${paymentId}`)) };
    } catch {
      hydrated = payment;
    }
  }

  const orderId = orderIdOf(hydrated);
  const matched = orderId
    ? await Order.findOne({ orderId })
    : paymentId
      ? await Order.findOne({ cryptoPaymentId: paymentId })
      : null;

  const expectedUsd = matched?.amount ? matched.amount / 100 : listedUsd(hydrated);
  if (!shouldFulfillCryptoPayment(hydrated, expectedUsd || listedUsd(hydrated))) {
    return { fulfilled: "", skipped: `not payable (${hydrated.payment_status || "unknown"})` };
  }

  const targetOrderId = matched?.orderId || orderId;
  if (!targetOrderId) {
    return { fulfilled: "", skipped: "missing order id" };
  }
  if (matched?.status === "paid") {
    return { fulfilled: targetOrderId, skipped: "already paid" };
  }

  await fulfillPaidPayPalOrder({
    orderId: targetOrderId,
    productId: matched?.productId || inferredProductId(hydrated),
    customerEmail: matched?.customerEmail || "",
    customerName: matched?.customerName || "Customer",
    customerPhone: matched?.customerPhone || "",
    amountUsd: expectedUsd || listedUsd(hydrated),
    broker: matched?.broker,
    accountId: matched?.accountId,
    server: matched?.server,
    paymentMethod: "crypto",
    cryptoPaymentId: paymentId || undefined,
  });

  return { fulfilled: targetOrderId, skipped: "" };
}
