import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import License from "@/lib/models/License";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { productId, accountNumber } = await request.json();

    if (!productId || !accountNumber) {
      return NextResponse.json(
        { success: false, error: "Missing productId or accountNumber" },
        { status: 400 }
      );
    }

    const accNum = Number(accountNumber);

    const license = await License.findOne({
      productId,
      $or: [
        { accountNumber: accNum },
        { accountNumbers: { $in: [accNum] } }
      ]
    });

    if (!license) {
      return NextResponse.json(
        { success: false, error: "License not found" },
        { status: 404 }
      );
    }

    // Delete license completely
    await License.deleteOne({ _id: license._id });

    return NextResponse.json({
      success: true,
      message: `License deleted for productId: ${productId}, accountNumber: ${accountNumber}`,
      deletedLicense: {
        productId: license.productId,
        accountNumber: license.accountNumber,
        accountNumbers: license.accountNumbers,
        mode: license.mode,
        plan: license.plan,
        note: license.note
      }
    });
  } catch (error: any) {
    console.error("Delete license error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

