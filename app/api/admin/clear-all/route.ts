import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Partner from "@/lib/models/Partner";
import TradingAccount from "@/lib/models/TradingAccount";
import FeaturedAccount from "@/lib/models/FeaturedAccount";
import User from "@/lib/models/User";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

async function verifyAdminAccess(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { authorized: false, user: null };
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
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

export async function DELETE(request: NextRequest) {
  try {
    const { authorized } = await verifyAdminAccess(request);
    if (!authorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const deletedPartners = await Partner.deleteMany({});
    const deletedTradingAccounts = await TradingAccount.deleteMany({});
    const deletedFeaturedAccounts = await FeaturedAccount.deleteMany({});

    return NextResponse.json({
      success: true,
      message: "All content data cleared successfully",
      deleted: {
        partners: deletedPartners.deletedCount,
        tradingAccounts: deletedTradingAccounts.deletedCount,
        featuredAccounts: deletedFeaturedAccounts.deletedCount
      }
    });
  } catch (error: any) {
    console.error("Error clearing data:", error);
    return NextResponse.json(
      { error: "Failed to clear data", message: error.message },
      { status: 500 }
    );
  }
}
