import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import FeaturedAccount from "@/lib/models/FeaturedAccount";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    await dbConnect();

    const accounts = await FeaturedAccount.find({ active: true })
      .sort({ order: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      accounts
    });
  } catch (error: any) {
    console.error("Error fetching featured accounts:", error);
    return NextResponse.json(
      { error: "Failed to fetch featured accounts", message: error.message },
      { status: 500 }
    );
  }
}
