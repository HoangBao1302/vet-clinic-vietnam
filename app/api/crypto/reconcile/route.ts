import { NextResponse } from "next/server";
import { reconcilePendingCryptoOrders } from "@/lib/cryptoReconcile";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await reconcilePendingCryptoOrders();
    return NextResponse.json({ success: true, ...result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Reconcile failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
