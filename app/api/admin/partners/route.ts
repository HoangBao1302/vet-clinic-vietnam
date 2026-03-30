import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Partner from "@/lib/models/Partner";
import User from "@/lib/models/User";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

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

// GET: Fetch all partners
export async function GET(request: NextRequest) {
  try {
    const { authorized } = await verifyAdminAccess(request);
    if (!authorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const active = searchParams.get("active");

    // Build query
    const query: any = {};
    if (active !== null && active !== "all") {
      query.active = active === "true";
    }

    // Fetch partners sorted by order
    const partners = await Partner.find(query)
      .sort({ order: 1, name: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      partners,
    });
  } catch (error: any) {
    console.error("Error fetching partners:", error);
    return NextResponse.json(
      { error: "Failed to fetch partners", message: error.message },
      { status: 500 }
    );
  }
}

// POST: Create new partner
export async function POST(request: NextRequest) {
  try {
    const { authorized, user } = await verifyAdminAccess(request);
    if (!authorized || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const body = await request.json();
    const {
      id,
      name,
      logo,
      website,
      spread,
      spread_en,
      license,
      license_en,
      deposit,
      deposit_en,
      support,
      support_en,
      notes,
      notes_en,
      rating,
      active,
      order,
    } = body;

    // Validate required fields
    if (!id || !name || !website || rating === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: id, name, website, rating" },
        { status: 400 }
      );
    }

    // Check if ID already exists
    const existingPartner = await Partner.findOne({ id });
    if (existingPartner) {
      return NextResponse.json(
        { error: "Partner ID already exists" },
        { status: 400 }
      );
    }

    // Create new partner
    const newPartner = new Partner({
      id,
      name,
      logo,
      website,
      spread: spread || [],
      spread_en: spread_en || [],
      license: license || [],
      license_en: license_en || [],
      deposit: deposit || [],
      deposit_en: deposit_en || [],
      support: support || [],
      support_en: support_en || [],
      notes: notes || [],
      notes_en: notes_en || [],
      rating: rating || 0,
      active: active !== undefined ? active : true,
      order: order !== undefined ? order : 999,
    });

    await newPartner.save();

    return NextResponse.json({
      success: true,
      message: "Partner created successfully",
      partner: newPartner,
    });
  } catch (error: any) {
    console.error("Error creating partner:", error);
    return NextResponse.json(
      { error: "Failed to create partner", message: error.message },
      { status: 500 }
    );
  }
}
