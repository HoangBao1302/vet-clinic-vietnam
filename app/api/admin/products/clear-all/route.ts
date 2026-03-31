import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import { verifyAdminAccess } from "@/lib/auth";

export async function DELETE(request: NextRequest) {
  try {
    // Verify admin access
    const authError = await verifyAdminAccess(request);
    if (authError) {
      return authError;
    }

    await dbConnect();

    // Delete all products
    const deletedProducts = await Product.deleteMany({});

    return NextResponse.json({
      success: true,
      message: "All products cleared successfully",
      deleted: deletedProducts.deletedCount
    });

  } catch (error: any) {
    console.error("Error clearing products:", error);
    return NextResponse.json(
      { error: "Failed to clear products", message: error.message },
      { status: 500 }
    );
  }
}
