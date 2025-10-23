import mongoose, { Schema, models, model } from "mongoose";

const LicenseSchema = new Schema(
  {
    productId: { type: String, index: true, required: true },

    // Giữ cho tương thích ngược (1 account/1 license)
    accountNumber: { type: Number, index: true, required: false },

    // Mới: nhiều account/1 license
    accountNumbers: { type: [Number], index: true, default: [] },

    broker: { type: String, default: "" }, // không dùng ràng buộc broker ở hệ thống hiện tại
    mode: { type: String, enum: ["REAL", "DEMO", "BOTH"], default: "BOTH" },
    plan: { type: String, enum: ["PAID", "DEMO", "TRIAL"], default: "DEMO" },

    startAt: { type: Date, required: true },
    expireAt: { type: Date, required: true },
    isActive: { type: Boolean, default: true },

    // Giới hạn tối đa số account (tuỳ gói)
    maxAccounts: { type: Number, default: 1 },

    note: { type: String, default: "" },
    createdBy: { type: String, default: "" },

    usage: {
      lastSeenAt: Date,
      lastIP: String,
      lastVersion: String,
      heartbeats: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
);

export default models.License || model("License", LicenseSchema);
