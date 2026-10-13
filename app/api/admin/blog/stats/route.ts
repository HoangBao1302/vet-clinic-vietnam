import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import BlogPost from "@/lib/models/BlogPost";
import User from "@/lib/models/User";
import { getRequestToken, requireAdminOrStaff } from "@/lib/requestAuth";
import { verifyToken } from "@/lib/auth";


// Helper function to verify admin/staff access
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

    if (!user || (user.role !== "admin" && user.role !== "staff")) {
      return { authorized: false, user: null };
    }

    return { authorized: true, user };
  } catch (error) {
    return { authorized: false, user: null };
  }
}

// GET: Fetch blog statistics
export async function GET(request: NextRequest) {
  const auth = requireAdminOrStaff(request);
  if (!auth.authorized) return auth.response;

  try {
    const { authorized } = await verifyAdminAccess(request);
    if (!authorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Get counts
    const total = await BlogPost.countDocuments();
    const published = await BlogPost.countDocuments({ status: "published" });
    const draft = await BlogPost.countDocuments({ status: "draft" });
    const archived = await BlogPost.countDocuments({ status: "archived" });

    // Get total views
    const viewsResult = await BlogPost.aggregate([
      { $group: { _id: null, totalViews: { $sum: "$views" } } },
    ]);
    const views = viewsResult.length > 0 ? viewsResult[0].totalViews : 0;

    // Get category stats
    const categoryStats = await BlogPost.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    // Get trending posts (top 5 by views)
    const trendingPosts = await BlogPost.find({ status: "published" })
      .sort({ views: -1 })
      .limit(5)
      .select("title slug views")
      .lean();

    // Get recent posts
    const recentPosts = await BlogPost.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title slug status createdAt")
      .lean();

    return NextResponse.json({
      total,
      published,
      draft,
      archived,
      views,
      categoryStats,
      trendingPosts,
      recentPosts,
    });
  } catch (error: any) {
    console.error("Error fetching blog stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog stats", message: error.message },
      { status: 500 }
    );
  }
}

