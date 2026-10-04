import { NextRequest, NextResponse } from "next/server";
import {
  getPayPalAccessToken,
  getPayPalApiBase,
  isPayPalConfigured,
} from "@/lib/paypal";
import { fulfillPaidPayPalOrder, parsePayPalCustomId } from "@/lib/paypalFulfill";

export async function POST(request: NextRequest) {
  if (!isPayPalConfigured()) {
    return NextResponse.json({ success: false, error: "PayPal not configured" }, { status: 503 });
  }

  try {
    const { orderId } = await request.json();
    if (!orderId || typeof orderId !== "string") {
      return NextResponse.json({ success: false, error: "Missing order ID" }, { status: 400 });
    }

    const accessToken = await getPayPalAccessToken();
    if (!accessToken) {
      return NextResponse.json({ success: false, error: "PayPal auth failed" }, { status: 500 });
    }

    const response = await fetch(`${getPayPalApiBase()}/v2/checkout/orders/${orderId.trim()}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    const paypalOrder = await response.json();

    if (!response.ok || paypalOrder.status !== "COMPLETED") {
      return NextResponse.json(
        {
          success: false,
          error: paypalOrder.message || paypalOrder.status || "Order is not completed on PayPal",
          status: paypalOrder.status,
        },
        { status: 400 }
      );
    }

    const unit = paypalOrder.purchase_units?.[0];
    const custom = parsePayPalCustomId(unit?.custom_id);
    const productId = unit?.reference_id || custom.productId;
    const email =
      custom.email || paypalOrder.payer?.email_address || paypalOrder.payment_source?.paypal?.email_address;
    const name =
      custom.name ||
      `${paypalOrder.payer?.name?.given_name || ""} ${paypalOrder.payer?.name?.surname || ""}`.trim();
    const amountUsd = parseFloat(
      unit?.payments?.captures?.[0]?.amount?.value || unit?.amount?.value || "0"
    );

    if (!productId || !email) {
      return NextResponse.json(
        { success: false, error: "Missing product or email on PayPal order" },
        { status: 400 }
      );
    }

    const fulfillment = await fulfillPaidPayPalOrder({
      orderId: paypalOrder.id,
      productId,
      customerEmail: email,
      customerName: name,
      customerPhone: custom.phone,
      amountUsd,
      broker: custom.broker,
      accountId: custom.accountId,
      server: custom.server,
      skipEmail: true,
    });

    return NextResponse.json({
      success: true,
      orderId: paypalOrder.id,
      ...fulfillment,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Import failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
