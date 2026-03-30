import mongoose, { Schema, Document } from "mongoose";

export interface IFeaturedAccount extends Document {
  id: string;
  name: string;
  platform: string;
  broker: string;
  gain: string;
  drawdown: string;
  days: string;
  link: string;
  copyable: boolean;
  active: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const FeaturedAccountSchema: Schema = new Schema(
  {
    id: {
      type: String,
      required: [true, "Featured account ID is required"],
      unique: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    platform: {
      type: String,
      required: [true, "Platform is required"],
      trim: true,
    },
    broker: {
      type: String,
      required: [true, "Broker name is required"],
      trim: true,
    },
    gain: {
      type: String,
      required: [true, "Gain is required"],
      trim: true,
    },
    drawdown: {
      type: String,
      required: [true, "Drawdown is required"],
      trim: true,
    },
    days: {
      type: String,
      required: [true, "Days is required"],
      trim: true,
    },
    link: {
      type: String,
      required: [true, "Link is required"],
      trim: true,
    },
    copyable: {
      type: Boolean,
      default: false,
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
FeaturedAccountSchema.index({ order: 1, platform: 1 });

const FeaturedAccount = mongoose.models.FeaturedAccount || mongoose.model<IFeaturedAccount>("FeaturedAccount", FeaturedAccountSchema);

export default FeaturedAccount;
