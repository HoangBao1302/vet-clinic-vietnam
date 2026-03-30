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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { authorized } = await verifyAdminAccess(request);
    if (!authorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;

    const account = await FeaturedAccount.findOne({ id }).lean();
    if (!account) {
      return NextResponse.json({ error: "Featured account not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, account });
  } catch (error: any) {
    console.error("Error fetching featured account:", error);
    return NextResponse.json(
      { error: "Failed to fetch featured account", message: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { authorized, user } = await verifyAdminAccess(request);
    if (!authorized || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    const account = await FeaturedAccount.findOne({ id });
    if (!account) {
      return NextResponse.json({ error: "Featured account not found" }, { status: 404 });
    }

    Object.keys(body).forEach((key) => {
      if (body[key] !== undefined && key !== 'id') {
        (account as any)[key] = body[key];
      }
    });

    await account.save();

    return NextResponse.json({
      success: true,
      message: "Featured account updated successfully",
      account,
    });
  } catch (error: any) {
    console.error("Error updating featured account:", error);
    return NextResponse.json(
      { error: "Failed to update featured account", message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { authorized, user } = await verifyAdminAccess(request);
    if (!authorized || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;

    const account = await FeaturedAccount.findOneAndDelete({ id });
    if (!account) {
      return NextResponse.json({ error: "Featured account not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Featured account deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting featured account:", error);
    return NextResponse.json(
      { error: "Failed to delete featured account", message: error.message },
      { status: 500 }
    );
  }
}
