import { NextRequest, NextResponse } from "next/server";
import {
  getPayPalAccessToken,
  getPayPalApiBase,
  isPayPalConfigured,
} from "@/lib/paypal";
import { fulfillPaidPayPalOrder, parsePayPalCustomId } from "@/lib/paypalFulfill";

async function fetchPayPalOrder(orderId: string, accessToken: string) {
  const response = await fetch(`${getPayPalApiBase()}/v2/checkout/orders/${orderId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return response.json();
}

export async function POST(request: NextRequest) {
  try {
    const { orderId, productId, productName, amount, customerInfo } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "Missing order ID" },
        { status: 400 }
      );
    }

    if (!isPayPalConfigured()) {
      return NextResponse.json(
        { success: false, error: "PayPal not configured" },
        { status: 503 }
      );
    }

    const accessToken = await getPayPalAccessToken();
    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: "Failed to get PayPal access token" },
        { status: 500 }
      );
    }

    const captureResponse = await fetch(
      `${getPayPalApiBase()}/v2/checkout/orders/${orderId}/capture`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "PayPal-Request-Id": `capture-${orderId}-${Date.now()}`,
        },
        body: JSON.stringify({}),
      }
    );

    let paypalOrder = await captureResponse.json();

    if (!captureResponse.ok) {
      const issue = paypalOrder?.details?.[0]?.issue;
      if (issue === "ORDER_ALREADY_CAPTURED" || paypalOrder?.name === "UNPROCESSABLE_ENTITY") {
        paypalOrder = await fetchPayPalOrder(orderId, accessToken);
      } else {
        console.error("PayPal capture failed:", paypalOrder);
        return NextResponse.json(
          { success: false, error: paypalOrder.message || "PayPal capture error" },
          { status: 500 }
        );
      }
    }

    if (paypalOrder.status !== "COMPLETED") {
      return NextResponse.json(
        { success: false, error: "Payment not completed" },
        { status: 400 }
      );
    }

    const unit = paypalOrder.purchase_units?.[0];
    const custom = parsePayPalCustomId(unit?.custom_id);
    const resolvedProductId = productId || unit?.reference_id || custom.productId;
    const capturedValue = parseFloat(
      unit?.payments?.captures?.[0]?.amount?.value || unit?.amount?.value || amount || "0"
    );
    const payerEmail = paypalOrder.payer?.email_address || "";
    const payerName = `${paypalOrder.payer?.name?.given_name || ""} ${paypalOrder.payer?.name?.surname || ""}`.trim();
    // Checkout form / PayPal payer win. URL or logged-in admin email must not override the buyer.
    const email = custom.email || payerEmail || customerInfo?.email;

    if (!resolvedProductId || !email) {
      return NextResponse.json(
        { success: false, error: "Missing product or customer email after capture" },
        { status: 400 }
      );
    }

    const fulfillment = await fulfillPaidPayPalOrder({
      orderId,
      productId: resolvedProductId,
      customerEmail: email,
      customerName: custom.name || payerName || customerInfo?.name,
      customerPhone: custom.phone || customerInfo?.phone || "",
      amountUsd: capturedValue,
      broker: customerInfo?.broker || custom.broker,
      accountId: customerInfo?.accountId || custom.accountId,
      server: customerInfo?.server || custom.server,
    });

    return NextResponse.json({
      success: true,
      orderId,
      status: "completed",
      paymentMethod: "paypal",
      productId: fulfillment.productId,
      productName: fulfillment.productName,
      emailed: fulfillment.emailed,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "PayPal capture error";
    console.error("PayPal capture error:", error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
