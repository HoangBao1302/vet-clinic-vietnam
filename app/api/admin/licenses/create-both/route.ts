import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import License from "@/lib/models/License";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { productId, accountNumber, days = 60, note = "" } = await request.json();

    if (!productId || !accountNumber) {
      return NextResponse.json(
        { success: false, error: "Missing productId or accountNumber" },
        { status: 400 }
      );
    }

    const now = new Date();
    const expireAt = new Date(now.getTime() + Number(days) * 86400 * 1000);

    const license = await License.create({
      productId,
      accountNumber: Number(accountNumber),
      accountNumbers: [Number(accountNumber)],
      mode: "BOTH",
      plan: "DEMO",
      maxAccounts: 1,
      startAt: now,
      expireAt,
      isActive: true,
      note,
      createdBy: "admin_page"
    });

    return NextResponse.json({
      success: true,
      license: JSON.parse(JSON.stringify(license))
    });
  } catch (error: any) {
    console.error("Create BOTH license error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

