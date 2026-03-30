import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Partner from "@/lib/models/Partner";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    await dbConnect();

    const partners = await Partner.find({ active: true })
      .sort({ order: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      partners
    });
  } catch (error: any) {
    console.error("Error fetching partners:", error);
    return NextResponse.json(
      { error: "Failed to fetch partners", message: error.message },
      { status: 500 }
    );
  }
}
