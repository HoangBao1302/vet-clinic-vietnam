import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
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

export async function GET(request: NextRequest) {
  try {
    const { authorized } = await verifyAdminAccess(request);
    if (!authorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const active = searchParams.get("active");

    const query: any = {};
    if (active !== null && active !== "all") {
      query.active = active === "true";
    }

    const accounts = await FeaturedAccount.find(query)
      .sort({ order: 1, year: -1, broker: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      accounts,
    });
  } catch (error: any) {
    console.error("Error fetching featured accounts:", error);
    return NextResponse.json(
      { error: "Failed to fetch featured accounts", message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { authorized, user } = await verifyAdminAccess(request);
    if (!authorized || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const body = await request.json();

    if (body.id) {
      const existing = await FeaturedAccount.findOne({ id: body.id });
      if (existing) {
        return NextResponse.json(
          { error: "Featured account ID already exists" },
          { status: 400 }
        );
      }
    }

    const newAccount = new FeaturedAccount({
      ...body,
      active: body.active !== undefined ? body.active : true,
      order: body.order !== undefined ? body.order : 999,
    });

    await newAccount.save();

    return NextResponse.json({
      success: true,
      message: "Featured account created successfully",
      account: newAccount,
    });
  } catch (error: any) {
    console.error("Error creating featured account:", error);
    return NextResponse.json(
      { error: "Failed to create featured account", message: error.message },
      { status: 500 }
    );
  }
}
