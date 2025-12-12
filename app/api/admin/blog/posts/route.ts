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

// GET: Fetch all blog posts (with filters)
export async function GET(request: NextRequest) {
  try {
    const { authorized } = await verifyAdminAccess(request);
    if (!authorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    // Build query
    const query: any = {};
    if (category && category !== "all") query.category = category;
    if (status && status !== "all") query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
        { "author.name": { $regex: search, $options: "i" } },
      ];
    }

    // Fetch posts with pagination
    const posts = await BlogPost.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await BlogPost.countDocuments(query);

    return NextResponse.json({
      success: true,
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts", message: error.message },
      { status: 500 }
    );
  }
}

// POST: Create new blog post
export async function POST(request: NextRequest) {
  try {
    const { authorized, user } = await verifyAdminAccess(request);
    if (!authorized || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const body = await request.json();
    const {
      title,
      title_en,
      slug,
      excerpt,
      excerpt_en,
      content,
      content_en,
      category,
      tags,
      image,
      featured,
      isPremium,
      status,
    } = body;

    // Validate required fields
    if (!title || !excerpt || !content || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    if (slug) {
      const existingPost = await BlogPost.findOne({ slug });
      if (existingPost) {
        return NextResponse.json(
          { error: "Slug already exists" },
          { status: 400 }
        );
      }
    }

    // Create new blog post
    const newPost = new BlogPost({
      title,
      title_en: title_en || undefined,
      slug: slug || undefined, // Let pre-save hook generate if not provided
      excerpt,
      excerpt_en: excerpt_en || undefined,
      content,
      content_en: content_en || undefined,
      author: {
        id: user._id.toString(),
        name: user.name || user.email,
        email: user.email,
      },
      category,
      tags: tags || [],
      image: image || "/vet-images/1.png",
      featured: featured || false,
      isPremium: isPremium || false,
      status: status || "draft",
      views: 0,
    });

    await newPost.save();

    return NextResponse.json({
      success: true,
      message: "Blog post created successfully",
      post: newPost,
    });
  } catch (error: any) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      { error: "Failed to create blog post", message: error.message },
      { status: 500 }
    );
  }
}

