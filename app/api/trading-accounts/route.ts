import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import TradingAccount from "@/lib/models/TradingAccount";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    await dbConnect();

    const accounts = await TradingAccount.find({ active: true })
      .sort({ order: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      accounts
    });
  } catch (error: any) {
    console.error("Error fetching trading accounts:", error);
    return NextResponse.json(
      { error: "Failed to fetch trading accounts", message: error.message },
      { status: 500 }
    );
  }
}
