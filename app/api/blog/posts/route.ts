import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import BlogPost from "@/lib/models/BlogPost";

// GET: Fetch published blog posts (public endpoint)
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const limit = parseInt(searchParams.get("limit") || "50");
    const page = parseInt(searchParams.get("page") || "1");

    // Build query - only show published posts
    const query: any = { status: "published" };
    
    if (category && category !== "all") {
      query.category = category;
    }
    
    if (featured === "true") {
      query.featured = true;
    }

    // Fetch posts
    const posts = await BlogPost.find(query)
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select("-content") // Exclude full content for listing
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

