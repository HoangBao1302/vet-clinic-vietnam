import mongoose, { Schema, Document } from "mongoose";

export interface ITradingAccount extends Document {
  id: string;
  broker: string;
  account: string;
  gain: string;
  balance: string;
  maxDrawdown: string;
  monthlyProfit: string;
  verified: boolean;
  status: string;
  active: boolean;
  order: number;
  broker_en?: string;
  status_en?: string;
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
    broker: {
      type: String,
      required: [true, "Broker name is required"],
      trim: true,
    },
    broker_en: {
      type: String,
      trim: true,
    },
    account: {
      type: String,
      required: [true, "Account number is required"],
      trim: true,
    },
    gain: {
      type: String,
      required: [true, "Gain is required"],
      trim: true,
    },
    balance: {
      type: String,
      required: [true, "Balance is required"],
      trim: true,
    },
    maxDrawdown: {
      type: String,
      required: [true, "Max drawdown is required"],
      trim: true,
    },
    monthlyProfit: {
      type: String,
      required: [true, "Monthly profit is required"],
      trim: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      trim: true,
    },
    status_en: {
      type: String,
      trim: true,
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
TradingAccountSchema.index({ order: 1, broker: 1 });

const TradingAccount = mongoose.models.TradingAccount || mongoose.model<ITradingAccount>("TradingAccount", TradingAccountSchema);

export default TradingAccount;
