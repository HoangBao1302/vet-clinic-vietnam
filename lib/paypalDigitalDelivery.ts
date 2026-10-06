import crypto from "crypto";
import connectDB from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import { getPayPalAccessToken, getPayPalApiBase } from "@/lib/paypal";

type TrackerResult = {
  ok: boolean;
  status: number;
  body: unknown;
};

/**
 * Tell PayPal a paid digital download was delivered.
 * Uses POST /v1/shipping/trackers with status DELIVERED.
 * shipment_direction DIGITAL is sent first, as requested. PayPal's published
 * enum only allows FORWARD or RETURN, so a validation rejection is retried
 * with FORWARD while keeping DELIVERED.
 */
export async function sendPayPalDigitalDeliveryTracker(input: {
  transactionId: string;
  orderId: string;
  shipmentDate?: Date;
}): Promise<TrackerResult> {
  const accessToken = await getPayPalAccessToken();
  if (!accessToken) {
    return { ok: false, status: 0, body: { error: "PayPal is not configured" } };
  }

  const transactionId = input.transactionId.replace(/[^a-zA-Z0-9]/g, "").slice(0, 50);
  const orderKey = input.orderId.replace(/[^A-Za-z0-9-]/g, "").slice(0, 50);
  if (!transactionId || !orderKey) {
    return { ok: false, status: 0, body: { error: "Missing PayPal transaction id or order id" } };
  }

  const shipmentDate = (input.shipmentDate || new Date()).toISOString().slice(0, 10);
  const tracker = {
    transaction_id: transactionId,
    tracking_number: `ORDER-${orderKey}`.slice(0, 64),
    status: "DELIVERED",
    carrier: "OTHER",
    carrier_name_other: "Digital Download Delivery",
    postage_payment_id: `DLV${crypto.randomBytes(8).toString("hex")}`.toUpperCase().slice(0, 64),
    shipment_direction: "DIGITAL",
    shipment_date: shipmentDate,
    delivery_status: "COMPLETED",
    notify_buyer: true,
  };

  const first = await postTrackers(accessToken, tracker);
  if (first.ok || !isDirectionRejected(first)) return first;

  const official = {
    transaction_id: tracker.transaction_id,
    tracking_number: tracker.tracking_number,
    status: "DELIVERED",
    carrier: "OTHER",
    carrier_name_other: "Digital Download Delivery",
    postage_payment_id: tracker.postage_payment_id,
    shipment_direction: "FORWARD",
    shipment_date: tracker.shipment_date,
    notify_buyer: true,
  };
  return postTrackers(accessToken, official);
}

/** Report delivery once, after a PayPal buyer successfully downloads. */
export async function reportDownloadDeliveredToPayPal(orderId: string, knownCaptureId = "") {
  await connectDB();
  const order = await Order.findOne({ orderId });
  if (order?.paypalTrackingSent) return;
  if (order?.paymentMethod && order.paymentMethod !== "paypal") return;

  const transactionId =
    order?.paypalCaptureId || knownCaptureId || (await lookupCaptureId(order?.orderId || orderId));
  if (!transactionId) {
    console.error("PayPal digital delivery skipped: no capture id", orderId);
    return;
  }

  const result = await sendPayPalDigitalDeliveryTracker({
    transactionId,
    orderId: order?.orderId || orderId,
  });

  if (!result.ok) {
    console.error("PayPal digital delivery failed:", {
      orderId,
      status: result.status,
      body: result.body,
    });
    return;
  }

  await Order.updateOne(
    { orderId: order?.orderId || orderId },
    {
      $set: {
        paypalCaptureId: transactionId,
        paypalTrackingSent: true,
        paypalTrackingSentAt: new Date(),
      },
    }
  );
}

async function lookupCaptureId(paypalOrderId: string) {
  const accessToken = await getPayPalAccessToken();
  if (!accessToken) return "";
  const response = await fetch(`${getPayPalApiBase()}/v2/checkout/orders/${paypalOrderId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) return "";
  const data = await response.json();
  return String(data?.purchase_units?.[0]?.payments?.captures?.[0]?.id || "");
}

async function postTrackers(
  accessToken: string,
  tracker: Record<string, unknown>
): Promise<TrackerResult> {
  const wrapped = await postJson(accessToken, { trackers: [tracker] });
  if (wrapped.ok) return wrapped;
  const text = JSON.stringify(wrapped.body).toLowerCase();
  const wrapperRejected =
    wrapped.status === 400 && (text.includes("trackers") || text.includes("malformed"));
  if (!wrapperRejected) return wrapped;
  return postJson(accessToken, tracker);
}

async function postJson(accessToken: string, payload: unknown): Promise<TrackerResult> {
  const response = await fetch(`${getPayPalApiBase()}/v1/shipping/trackers`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const body = await response.json().catch(() => ({}));
  return { ok: response.ok, status: response.status, body };
}

function isDirectionRejected(result: TrackerResult) {
  if (result.status !== 400) return false;
  const text = JSON.stringify(result.body).toLowerCase();
  return text.includes("shipment_direction") || text.includes("delivery_status");
}
