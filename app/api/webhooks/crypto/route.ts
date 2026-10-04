import { NextRequest, NextResponse } from "next/server";
import { fulfillCryptoNowPayment } from "@/lib/cryptoFulfill";
import {
  nowPaymentsRequest,
  shouldFulfillCryptoPayment,
  verifyNowPaymentsSignature,
  type NowPayment,
} from "@/lib/nowpayments";

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get("x-nowpayments-sig");
    const body = (await request.json()) as NowPayment;
    const paymentId = String(body.payment_id || "").trim();

    let payment = body;
    let fromApi = false;
    if (paymentId) {
      try {
        payment = { ...body, ...(await nowPaymentsRequest<NowPayment>(`/payment/${paymentId}`)) };
        fromApi = true;
      } catch (error) {
        console.error("NOWPayments IPN lookup failed:", error);
      }
    }

    if (!fromApi && !verifyNowPaymentsSignature(body, signature)) {
      console.error("NOWPayments IPN signature mismatch");
      return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 401 });
    }

    const expectedUsd = Number(payment.price_amount || payment.pay_amount || 0);
    console.log("NOWPayments IPN received:", {
      orderId: payment.order_id,
      paymentId: payment.payment_id,
      paymentStatus: payment.payment_status,
    });

    if (!shouldFulfillCryptoPayment(payment, expectedUsd || 16)) {
      return NextResponse.json({ success: true, message: "Webhook received" });
    }

    const result = await fulfillCryptoNowPayment(payment);
    if (!result.fulfilled) {
      return NextResponse.json({ success: true, message: result.skipped || "Webhook received" });
    }

    return NextResponse.json({ success: true, message: "Order processed", orderId: result.fulfilled });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Crypto webhook error";
    console.error("NOWPayments webhook error:", error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
