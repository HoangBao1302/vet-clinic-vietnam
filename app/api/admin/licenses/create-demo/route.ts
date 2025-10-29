import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import License from "@/lib/models/License";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { productId, accountNumber, accountNumbers, note = "" } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { success: false, error: "Missing productId" },
        { status: 400 }
      );
    }

    // Support both single accountNumber and multiple accountNumbers
    const accounts = accountNumbers || (accountNumber ? [Number(accountNumber)] : []);
    
    if (accounts.length === 0) {
      return NextResponse.json(
        { success: false, error: "Missing accountNumber(s)" },
        { status: 400 }
      );
    }

    const now = new Date();
    const expireAt = new Date(now.getTime() + 60 * 86400 * 1000); // 60 days

    const license = await License.create({
      productId,
      accountNumber: accounts[0], // For backward compatibility
      accountNumbers: accounts,
      mode: "BOTH",
      plan: "DEMO",
      maxAccounts: accounts.length,
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
    console.error("Create demo license error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

