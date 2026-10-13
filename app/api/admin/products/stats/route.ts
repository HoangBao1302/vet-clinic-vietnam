import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import User from "@/lib/models/User";
import { getRequestToken, requireAdmin } from "@/lib/requestAuth";
import { verifyToken } from "@/lib/auth";


// Helper function to verify admin access
async function verifyAdminAccess(request: NextRequest) {
  try {
    const token = getRequestToken(request);

    if (!token) {
      return { authorized: false, user: null };
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return { authorized: false, user: null };
    }
    await dbConnect();
    const user = await User.findById(decoded.userId);

    if (!user || user.role !== "admin") {
      return { authorized: false, user: null };
    }

    return { authorized: true, user };
  } catch (error) {
    return { authorized: false, user: null };
  }
}

// GET: Fetch product statistics
export async function GET(request: NextRequest) {
  const auth = requireAdmin(request);
  if (!auth.authorized) return auth.response;

  try {
    const { authorized } = await verifyAdminAccess(request);
    if (!authorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const [
      totalProducts,
      activeProducts,
      totalRevenue,
      totalSales,
      mt4Products,
      mt5Products,
    ] = await Promise.all([
      Product.countDocuments({}),
      Product.countDocuments({ status: "active" }),
      Product.aggregate([
        { $group: { _id: null, total: { $sum: { $ifNull: ["$metadata.totalRevenue", 0] } } } }
      ]),
      Product.aggregate([
        { $group: { _id: null, total: { $sum: { $ifNull: ["$metadata.totalSales", 0] } } } }
      ]),
      Product.countDocuments({ platform: "MT4" }),
      Product.countDocuments({ platform: "MT5" }),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        total: totalProducts,
        active: activeProducts,
        totalRevenue: totalRevenue[0]?.total || 0,
        totalSales: totalSales[0]?.total || 0,
        mt4Products,
        mt5Products,
      },
    });
  } catch (error: any) {
    console.error("Error fetching product stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats", message: error.message },
      { status: 500 }
    );
  }
}

