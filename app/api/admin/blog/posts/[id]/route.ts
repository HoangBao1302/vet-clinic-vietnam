import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import BlogPost from "@/lib/models/BlogPost";
import User from "@/lib/models/User";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Helper function to verify admin/staff access
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

    if (!user || (user.role !== "admin" && user.role !== "staff")) {
      return { authorized: false, user: null };
    }

    return { authorized: true, user };
  } catch (error) {
    return { authorized: false, user: null };
  }
}

// GET: Fetch single blog post
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

    const post = await BlogPost.findById(id).lean();
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, post });
  } catch (error: any) {
    console.error("Error fetching blog post:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog post", message: error.message },
      { status: 500 }
    );
  }
}

// PATCH: Update blog post
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

    const post = await BlogPost.findById(id);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Update fields
    Object.keys(body).forEach((key) => {
      if (body[key] !== undefined) {
        (post as any)[key] = body[key];
      }
    });

    await post.save();

    return NextResponse.json({
      success: true,
      message: "Blog post updated successfully",
      post,
    });
  } catch (error: any) {
    console.error("Error updating blog post:", error);
    return NextResponse.json(
      { error: "Failed to update blog post", message: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Delete blog post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { authorized, user } = await verifyAdminAccess(request);
    if (!authorized || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admins can delete posts
    if (user.role !== "admin") {
      return NextResponse.json(
        { error: "Only admins can delete posts" },
        { status: 403 }
      );
    }

    await dbConnect();
    const { id } = await params;

    const post = await BlogPost.findByIdAndDelete(id);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Blog post deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json(
      { error: "Failed to delete blog post", message: error.message },
      { status: 500 }
    );
  }
}

