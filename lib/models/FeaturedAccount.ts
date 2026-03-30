import mongoose, { Schema, Document } from "mongoose";

export interface IFeaturedAccount extends Document {
  id: string;
  broker: string;
  accountNumber: string;
  startBalance: string;
  currentBalance: string;
  totalProfit: string;
  gain: string;
  monthlyReturn: string;
  maxDrawdown: string;
  verified: boolean;
  year: number;
  active: boolean;
  order: number;
  broker_en?: string;
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
    broker: {
      type: String,
      required: [true, "Broker name is required"],
      trim: true,
    },
    broker_en: {
      type: String,
      trim: true,
    },
    accountNumber: {
      type: String,
      required: [true, "Account number is required"],
      trim: true,
    },
    startBalance: {
      type: String,
      required: [true, "Start balance is required"],
      trim: true,
    },
    currentBalance: {
      type: String,
      required: [true, "Current balance is required"],
      trim: true,
    },
    totalProfit: {
      type: String,
      required: [true, "Total profit is required"],
      trim: true,
    },
    gain: {
      type: String,
      required: [true, "Gain is required"],
      trim: true,
    },
    monthlyReturn: {
      type: String,
      required: [true, "Monthly return is required"],
      trim: true,
    },
    maxDrawdown: {
      type: String,
      required: [true, "Max drawdown is required"],
      trim: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    year: {
      type: Number,
      required: [true, "Year is required"],
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
FeaturedAccountSchema.index({ order: 1, year: -1, broker: 1 });

const FeaturedAccount = mongoose.models.FeaturedAccount || mongoose.model<IFeaturedAccount>("FeaturedAccount", FeaturedAccountSchema);

export default FeaturedAccount;
