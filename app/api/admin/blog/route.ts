import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import BlogPost from "@/lib/models/BlogPost";

const AUTOMATION_API_KEY = process.env.AUTOMATION_BLOG_API_KEY || "";

const VALID_CATEGORIES = ["news", "education", "ea-leopard"] as const;
type ValidCategory = (typeof VALID_CATEGORIES)[number];

function mapCategory(raw: string | undefined): ValidCategory {
  if (!raw) return "news";
  const lower = raw.toLowerCase();
  if (VALID_CATEGORIES.includes(lower as ValidCategory)) return lower as ValidCategory;
  if (lower.includes("edu") || lower.includes("learn") || lower.includes("guide")) return "education";
  if (lower.includes("ea") || lower.includes("leopard") || lower.includes("robot")) return "ea-leopard";
  return "news";
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function autoExcerpt(content: string, maxLen = 200): string {
  const stripped = content.replace(/^#+\s.*$/gm, "").replace(/[*_`#>\[\]]/g, "").trim();
  const first = stripped.split("\n").find((l) => l.trim().length > 20) || stripped;
  return first.trim().slice(0, maxLen);
}

function pickCoverImage(raw: unknown): string {
  const fallback = "/vet-images/1.png";
  if (typeof raw !== "string") return fallback;
  const image = raw.trim();
  if (!image || image.length > 500) return fallback;
  if (image.startsWith("/vet-images/") && !image.includes("..")) return image;
  if (image.startsWith("https://") && !image.includes(" ")) return image;
  return fallback;
}

// POST: Automation endpoint — publish a blog post via API key
export async function POST(request: NextRequest) {
  // Verify API key
  const apiKey =
    request.headers.get("x-admin-api-key") ||
    request.headers.get("authorization")?.replace(/^bearer\s+/i, "");

  if (!AUTOMATION_API_KEY) {
    return NextResponse.json(
      { error: "AUTOMATION_BLOG_API_KEY is not configured on this server" },
      { status: 503 }
    );
  }

  if (!apiKey || apiKey !== AUTOMATION_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();

    const body = await request.json();
    const {
      title,
      content,
      author: rawAuthor,
      date,
      category: rawCategory,
      tags,
      excerpt: rawExcerpt,
      status,
      slug: rawSlug,
      source,
      filePath,
      image: rawImage,
    } = body;

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json({ error: "Missing required fields: title, content" }, { status: 400 });
    }

    const slug = rawSlug || generateSlug(title);
    const category = mapCategory(rawCategory);
    const excerpt = rawExcerpt || autoExcerpt(content);
    const authorName = typeof rawAuthor === "string" ? rawAuthor : rawAuthor?.name || "Automation";

    // Duplicate check: by slug or title
    const existing = await BlogPost.findOne({
      $or: [{ slug }, { title }],
    });

    if (existing) {
      // Daily automation may re-run the same slug — update in place
      existing.title = title;
      existing.excerpt = excerpt.slice(0, 490);
      existing.content = content;
      existing.category = category;
      existing.tags = Array.isArray(tags) ? tags.slice(0, 10) : [];
      existing.author = {
        id: "automation",
        name: authorName,
        email: "automation@thebenchmarktrader.com",
      };
      existing.status = status === "published" ? "published" : existing.status;
      if (status === "published") {
        existing.publishedAt = new Date(date || Date.now());
      }
      await existing.save();

      return NextResponse.json({
        success: true,
        updated: true,
        message: "Blog post updated",
        post: {
          id: existing._id,
          slug: existing.slug,
          title: existing.title,
          status: existing.status,
        },
      });
    }

    const post = new BlogPost({
      title,
      slug,
      excerpt: excerpt.slice(0, 490),
      content,
      author: {
        id: "automation",
        name: authorName,
        email: "automation@thebenchmarktrader.com",
      },
      category,
      tags: Array.isArray(tags) ? tags.slice(0, 10) : [],
      image: pickCoverImage(rawImage),
      featured: false,
      isPremium: false,
      status: status === "published" ? "published" : "draft",
      publishedAt: status === "published" ? new Date(date || Date.now()) : undefined,
      source: source || "github-pr-automation",
      filePath: filePath || undefined,
    });

    await post.save();

    return NextResponse.json({
      success: true,
      message: "Blog post published",
      post: {
        id: post._id,
        slug: post.slug,
        title: post.title,
        status: post.status,
      },
    });
  } catch (error: any) {
    console.error("Automation blog publish error:", error);
    return NextResponse.json(
      { error: "Failed to publish blog post", message: error.message },
      { status: 500 }
    );
  }
}
