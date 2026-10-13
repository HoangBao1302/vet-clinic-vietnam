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

// GET: Fetch all products
export async function GET(request: NextRequest) {
  const auth = requireAdmin(request);
  if (!auth.authorized) return auth.response;

  try {
    const { authorized } = await verifyAdminAccess(request);
    if (!authorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const products = await Product.find({}).sort({ platform: 1, category: 1, createdAt: -1 }).lean();

    return NextResponse.json({
      success: true,
      products,
      total: products.length,
    });
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products", message: error.message },
      { status: 500 }
    );
  }
}

// POST: Create new product
export async function POST(request: NextRequest) {
  const auth = requireAdmin(request);
  if (!auth.authorized) return auth.response;

  try {
    const { authorized, user } = await verifyAdminAccess(request);
    if (!authorized || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();

    // Validate required fields
    if (!body.id || !body.name || !body.price || !body.platform || !body.category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if product ID already exists
    const existing = await Product.findOne({ id: body.id });
    if (existing) {
      return NextResponse.json(
        { error: "Product ID already exists" },
        { status: 400 }
      );
    }

    const product = await Product.create(body);

    return NextResponse.json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error: any) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product", message: error.message },
      { status: 500 }
    );
  }
}

