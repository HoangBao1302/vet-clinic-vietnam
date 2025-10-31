import mongoose, { Schema, Model } from "mongoose";
import { IProduct } from "@/types/product";

const ProductSchema = new Schema<IProduct>(
  {
    // Basic Info
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    platform: { type: String, enum: ["MT4", "MT5"], required: true },
    category: {
      type: String,
      enum: ["indicator", "ea-full", "ea-pro-source"],
      required: true,
    },
    
    // Pricing
    price: { type: Number, required: true },
    originalPrice: Number,
    currency: { type: String, default: "VND" },
    
    // Product Info
    version: String,
    size: String,
    icon: String,
    
    // Download
    downloadUrl: String,
    downloadInstructions: String,
    
    // Features
    features: [String],
    includes: [String],
    
    // Status
    status: {
      type: String,
      enum: ["active", "inactive", "coming-soon"],
      default: "active",
    },
    featured: { type: Boolean, default: false },
    
    // Images
    thumbnail: String,
    gallery: [String],
    
    // Commission Rates
    commissionRates: {
      paidAffiliate: { type: Number, default: 0.35 },
      freeAffiliate: { type: Number, default: 0.30 },
    },
    
    // Metadata
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    metadata: {
      totalSales: { type: Number, default: 0 },
      totalRevenue: { type: Number, default: 0 },
      lastSold: Date,
    },
  },
  { timestamps: true }
);

// Pre-save hook to update updatedAt
ProductSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Indexes for faster queries
ProductSchema.index({ id: 1 });
ProductSchema.index({ platform: 1, category: 1 });
ProductSchema.index({ status: 1 });

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;

