import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  category: "news" | "education" | "ea-leopard";
  tags: string[];
  image: string;
  featured: boolean;
  isPremium: boolean;
  status: "draft" | "published" | "archived";
  views: number;
  readTime: string;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Tiêu đề bài viết là bắt buộc"],
      trim: true,
      maxlength: [200, "Tiêu đề không được vượt quá 200 ký tự"],
    },
    slug: {
      type: String,
      required: [true, "Slug là bắt buộc"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    excerpt: {
      type: String,
      required: [true, "Mô tả ngắn là bắt buộc"],
      trim: true,
      maxlength: [500, "Mô tả ngắn không được vượt quá 500 ký tự"],
    },
    content: {
      type: String,
      required: [true, "Nội dung bài viết là bắt buộc"],
    },
    author: {
      id: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
    },
    category: {
      type: String,
      required: [true, "Danh mục là bắt buộc"],
      enum: {
        values: ["news", "education", "ea-leopard"],
        message: "Danh mục không hợp lệ",
      },
      index: true,
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: function (v: string[]) {
          return v.length <= 10;
        },
        message: "Không được có quá 10 tags",
      },
    },
    image: {
      type: String,
      required: [true, "Hình ảnh là bắt buộc"],
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    isPremium: {
      type: Boolean,
      default: false,
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: ["draft", "published", "archived"],
        message: "Trạng thái không hợp lệ",
      },
      default: "draft",
      index: true,
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
    readTime: {
      type: String,
      default: "5 phút đọc",
    },
    publishedAt: {
      type: Date,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
BlogPostSchema.index({ status: 1, publishedAt: -1 });
BlogPostSchema.index({ category: 1, status: 1, publishedAt: -1 });
BlogPostSchema.index({ featured: 1, status: 1, publishedAt: -1 });
BlogPostSchema.index({ views: -1 });
BlogPostSchema.index({ createdAt: -1 });

// Auto-generate slug from title if not provided
BlogPostSchema.pre("save", function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }
  next();
});

// Auto-set publishedAt when status changes to published
BlogPostSchema.pre("save", function (next) {
  if (this.isModified("status") && this.status === "published" && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Auto-calculate read time based on content length
BlogPostSchema.pre("save", function (next) {
  if (this.isModified("content")) {
    const wordsPerMinute = 200;
    const textLength = this.content.replace(/<[^>]*>/g, "").split(/\s+/).length;
    const minutes = Math.ceil(textLength / wordsPerMinute);
    this.readTime = `${minutes} phút đọc`;
  }
  next();
});

// Prevent multiple models from being compiled
const BlogPost: Model<IBlogPost> =
  mongoose.models.BlogPost || mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);

export default BlogPost;

