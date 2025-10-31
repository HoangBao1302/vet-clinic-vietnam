import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBlogCategory extends Document {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  order: number;
  isActive: boolean;
  postCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const BlogCategorySchema: Schema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Tên danh mục là bắt buộc"],
      trim: true,
      maxlength: [100, "Tên danh mục không được vượt quá 100 ký tự"],
    },
    slug: {
      type: String,
      required: [true, "Slug là bắt buộc"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, "Mô tả là bắt buộc"],
      trim: true,
      maxlength: [500, "Mô tả không được vượt quá 500 ký tự"],
    },
    icon: {
      type: String,
      default: "📚",
    },
    order: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    postCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for sorting
BlogCategorySchema.index({ order: 1, name: 1 });

const BlogCategory: Model<IBlogCategory> =
  mongoose.models.BlogCategory || mongoose.model<IBlogCategory>("BlogCategory", BlogCategorySchema);

export default BlogCategory;

