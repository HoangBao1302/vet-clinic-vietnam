import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import User from "@/lib/models/User";

const PROMOTE_STAFF_SECRET = process.env.PROMOTE_STAFF_SECRET || "PROMOTE_STAFF_2024";

// POST: Promote user to Staff role
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, secretKey } = body;

    // Verify secret key
    if (secretKey !== PROMOTE_STAFF_SECRET) {
      return NextResponse.json(
        { error: "Invalid secret key" },
        { status: 403 }
      );
    }

    // Validate email
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if already staff or admin
    if (user.role === "staff" || user.role === "admin") {
      return NextResponse.json(
        { 
          success: true, 
          message: `User is already ${user.role}`,
          user: {
            email: user.email,
            role: user.role,
            name: user.name,
          }
        },
        { status: 200 }
      );
    }

    // Promote to staff
    user.role = "staff";
    await user.save();

    return NextResponse.json({
      success: true,
      message: "User promoted to Staff successfully",
      user: {
        email: user.email,
        role: user.role,
        name: user.name,
      },
    });
  } catch (error: any) {
    console.error("Error promoting user:", error);
    return NextResponse.json(
      { error: "Failed to promote user", message: error.message },
      { status: 500 }
    );
  }
}
