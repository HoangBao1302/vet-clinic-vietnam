import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import { PRODUCT_PRICES_USD } from "@/config/productPrices";
import { getPayPalProductName } from "@/lib/paypalProducts";
import {
  isNowPaymentsConfigured,
  getNowPaymentsIpnUrl,
  nowPaymentsRequest,
  NOWPAYMENTS_PAY_CURRENCY,
  type NowPayment,
} from "@/lib/nowpayments";

export async function POST(request: NextRequest) {
  try {
    if (!isNowPaymentsConfigured()) {
      return NextResponse.json(
        { success: false, error: "Crypto payment is not configured yet. Add NOWPAYMENTS_API_KEY on Vercel." },
        { status: 503 }
      );
    }

    const { productId, productName, amount, customerInfo } = await request.json();
    const email = String(customerInfo?.email || "").trim().toLowerCase();
    const name = String(customerInfo?.name || "").trim();

    if (!productId || !email || !name) {
      return NextResponse.json({ success: false, error: "Missing product or customer info" }, { status: 400 });
    }

    const expectedUsd = PRODUCT_PRICES_USD[productId];
    if (!expectedUsd) {
      return NextResponse.json({ success: false, error: "Unknown product" }, { status: 400 });
    }

    const requested = Number(amount);
    if (!Number.isFinite(requested) || Math.abs(requested - expectedUsd) > 0.05) {
      return NextResponse.json({ success: false, error: "Invalid product price" }, { status: 400 });
    }

    const orderId = `NP${crypto.randomBytes(8).toString("hex").toUpperCase()}`;
    const description = getPayPalProductName(productId) || productName || "ThebenchmarkTrader software";

    await connectDB();
    await Order.create({
      orderId,
      productId,
      productName: description,
      status: "pending",
      customerEmail: email,
      customerName: name,
      customerPhone: customerInfo.phone || "",
      amount: Math.round(expectedUsd * 100),
      paymentMethod: "crypto",
      createdAt: new Date(),
      emailSent: false,
      broker: customerInfo.broker || "",
      accountId: customerInfo.accountId || "",
      server: customerInfo.server || "",
    });

    const payment = await nowPaymentsRequest<NowPayment>("/payment", {
      method: "POST",
      body: JSON.stringify({
        price_amount: expectedUsd,
        price_currency: "usd",
        pay_currency: NOWPAYMENTS_PAY_CURRENCY,
        order_id: orderId,
        order_description: description,
        ipn_callback_url: getNowPaymentsIpnUrl(),
      }),
    });

    if (!payment.pay_address || !payment.payment_id || payment.pay_amount == null) {
      return NextResponse.json(
        { success: false, error: "NOWPayments did not return a deposit address" },
        { status: 502 }
      );
    }

    await Order.updateOne(
      { orderId },
      { $set: { cryptoPaymentId: String(payment.payment_id) } }
    );

    return NextResponse.json({
      success: true,
      orderId,
      payment_id: payment.payment_id,
      pay_address: payment.pay_address,
      pay_amount: payment.pay_amount,
      pay_currency: payment.pay_currency || NOWPAYMENTS_PAY_CURRENCY,
      payment_status: payment.payment_status || "waiting",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Cannot create crypto payment";
    console.error("Crypto create-order error:", error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
