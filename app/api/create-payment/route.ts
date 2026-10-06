import { NextRequest, NextResponse } from "next/server";
import { getPayPalSiteUrl, isPayPalConfigured } from "@/lib/paypal";
import { detectCustomerCountry } from "@/lib/customerLocale";

// Note: Install dependencies first: npm install stripe @paypal/checkout-server-sdk

export async function POST(request: NextRequest) {
  try {
    const { productId, productName, amount, method, customerInfo, affiliateCode } = await request.json();

    // Validate input
    if (!productId || !productName || !amount || !method || !customerInfo) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (method === "stripe") {
      return NextResponse.json(
        { success: false, error: "Stripe is unavailable. Please pay with PayPal." },
        { status: 503 }
      );
    }

    if (method === "paypal") {
      // Check if PayPal is configured
      if (!isPayPalConfigured()) {
        return NextResponse.json(
          { success: false, error: "PayPal not configured" },
          { status: 503 }
        );
      }

      try {
        const customerCountry = await detectCustomerCountry(request);
        const response = await fetch(`${getPayPalSiteUrl()}/api/paypal/create-order`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId,
            productName,
            amount,
            customerInfo,
            affiliateCode,
            customerCountry,
          }),
        });

        const result = await response.json();

        if (result.success) {
          return NextResponse.json({
            success: true,
            paymentUrl: result.approvalUrl,
            orderId: result.orderId,
          });
        } else {
          return NextResponse.json(
            { success: false, error: result.error || "PayPal error" },
            { status: 500 }
          );
        }
      } catch (paypalError: any) {
        console.error("PayPal error:", paypalError);
        return NextResponse.json(
          { success: false, error: `PayPal error: ${paypalError.message}` },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { success: false, error: "Invalid payment method" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Payment creation error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

