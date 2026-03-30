import mongoose, { Schema, Document } from "mongoose";

export interface IPartner extends Document {
  id: string;
  name: string;
  logo?: string;
  website: string;
  spread: string[];
  spread_en?: string[];
  license: string[];
  license_en?: string[];
  deposit: string[];
  deposit_en?: string[];
  support: string[];
  support_en?: string[];
  notes: string[];
  notes_en?: string[];
  rating: number;
  active: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const PartnerSchema: Schema = new Schema(
  {
    id: {
      type: String,
      required: [true, "Partner ID is required"],
      unique: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Partner name is required"],
      trim: true,
    },
    logo: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      required: [true, "Website is required"],
      trim: true,
    },
    spread: {
      type: [String],
      default: [],
    },
    spread_en: {
      type: [String],
      default: [],
    },
    license: {
      type: [String],
      default: [],
    },
    license_en: {
      type: [String],
      default: [],
    },
    deposit: {
      type: [String],
      default: [],
    },
    deposit_en: {
      type: [String],
      default: [],
    },
    support: {
      type: [String],
      default: [],
    },
    support_en: {
      type: [String],
      default: [],
    },
    notes: {
      type: [String],
      default: [],
    },
    notes_en: {
      type: [String],
      default: [],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [0, "Rating must be at least 0"],
      max: [5, "Rating cannot exceed 5"],
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
      index: true,
    },
    order: {
      type: Number,
      required: [true, "Order is required"],
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Create index for sorting
PartnerSchema.index({ order: 1, name: 1 });

const Partner = mongoose.models.Partner || mongoose.model<IPartner>("Partner", PartnerSchema);

export default Partner;
