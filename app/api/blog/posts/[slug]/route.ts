import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import BlogPost from "@/lib/models/BlogPost";

// GET: Fetch single blog post by slug (public endpoint)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect();
    const { slug } = await params;

    // Find post and increment views
    const post = await BlogPost.findOneAndUpdate(
      { slug, status: "published" },
      { $inc: { views: 1 } },
      { new: true }
    ).lean();

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Get related posts (same category, exclude current post)
    const relatedPosts = await BlogPost.find({
      category: post.category,
      status: "published",
      _id: { $ne: post._id },
    })
      .sort({ views: -1, publishedAt: -1 })
      .limit(3)
      .select("-content")
      .lean();

    return NextResponse.json({
      success: true,
      post,
      relatedPosts,
    });
  } catch (error: any) {
    console.error("Error fetching blog post:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog post", message: error.message },
      { status: 500 }
    );
  }
}

