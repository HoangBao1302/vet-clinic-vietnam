import mongoose, { Schema, Document } from "mongoose";

export interface ITradingAccount extends Document {
  id: string;
  platform: string;
  accountName: string;
  accountNumber: string;
  broker: string;
  verified: boolean;
  stats: {
    gain: string;
    drawdown: string;
    winRate: string;
    profitFactor: string;
    tradingDays: string;
  };
  links: {
    profile?: string;
    copyTrade?: string;
    youtube?: string;
  };
  description: string;
  description_en: string;
  highlights: string[];
  highlights_en: string[];
  badge?: string;
  badge_en?: string;
  active: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const TradingAccountSchema: Schema = new Schema(
  {
    id: {
      type: String,
      required: [true, "Account ID is required"],
      unique: true,
      trim: true,
      index: true,
    },
    platform: {
      type: String,
      required: [true, "Platform is required"],
      trim: true,
    },
    accountName: {
      type: String,
      required: [true, "Account name is required"],
      trim: true,
    },
    accountNumber: {
      type: String,
      required: [true, "Account number is required"],
      trim: true,
    },
    broker: {
      type: String,
      required: [true, "Broker name is required"],
      trim: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    stats: {
      gain: { type: String, required: true },
      drawdown: { type: String, required: true },
      winRate: { type: String, required: true },
      profitFactor: { type: String, required: true },
      tradingDays: { type: String, required: true },
    },
    links: {
      profile: { type: String },
      copyTrade: { type: String },
      youtube: { type: String },
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    description_en: {
      type: String,
      required: [true, "English description is required"],
    },
    highlights: {
      type: [String],
      default: [],
    },
    highlights_en: {
      type: [String],
      default: [],
    },
    badge: {
      type: String,
    },
    badge_en: {
      type: String,
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
TradingAccountSchema.index({ order: 1, platform: 1 });

const TradingAccount = mongoose.models.TradingAccount || mongoose.model<ITradingAccount>("TradingAccount", TradingAccountSchema);

export default TradingAccount;
