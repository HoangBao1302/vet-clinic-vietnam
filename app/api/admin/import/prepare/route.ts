import { NextRequest, NextResponse } from "next/server";
import { partners } from "@/data/partners";
import { tradingAccounts } from "@/data/tradingAccounts";
import { featuredAccounts } from "@/data/featuredAccounts";
import User from "@/lib/models/User";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { dbConnect } from "@/lib/mongodb";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Helper function to verify admin access
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

// GET: Fetch data from files for import
export async function GET(request: NextRequest) {
  try {
    const { authorized } = await verifyAdminAccess(request);
    if (!authorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Return data from files
    return NextResponse.json({
      success: true,
      data: {
        partners: partners,
        tradingAccounts: tradingAccounts,
        featuredAccounts: featuredAccounts
      },
      counts: {
        partners: partners.length,
        tradingAccounts: tradingAccounts.length,
        featuredAccounts: featuredAccounts.length
      }
    });
  } catch (error: any) {
    console.error("Error fetching import data:", error);
    return NextResponse.json(
      { error: "Failed to fetch import data", message: error.message },
      { status: 500 }
    );
  }
}
