import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import License from "@/lib/models/License";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    const accountNumber = searchParams.get("accountNumber");

    let query: any = {};
    
    if (productId) {
      query.productId = productId;
    }
    
    if (accountNumber) {
      const accNum = Number(accountNumber);
      query.$or = [
        { accountNumber: accNum },
        { accountNumbers: { $in: [accNum] } }
      ];
    }

    const licenses = await License.find(query)
      .sort({ updatedAt: -1 })
      .limit(productId || accountNumber ? 200 : 50)
      .lean();

    return NextResponse.json({
      success: true,
      licenses: JSON.parse(JSON.stringify(licenses))
    });
  } catch (error: any) {
    console.error("List licenses error:", error);
    return NextResponse.json(
      { success: false, error: error.message, licenses: [] },
      { status: 500 }
    );
  }
}

