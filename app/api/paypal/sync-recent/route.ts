import { NextResponse } from "next/server";
import { isPayPalConfigured } from "@/lib/paypal";
import { syncRecentPayPalPayments } from "@/lib/paypalSync";

export async function POST() {
  if (!isPayPalConfigured()) {
    return NextResponse.json(
      { success: false, error: "PayPal not configured" },
      { status: 503 }
    );
  }

  try {
    const result = await syncRecentPayPalPayments(72);
    return NextResponse.json(result, { status: result.success ? 200 : 500 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "PayPal sync failed";
    console.error("PayPal sync error:", error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
