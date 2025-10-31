/**
 * Script to migrate 6 products to MongoDB
 * 
 * Usage:
 * node run-product-migration.js
 */

import mongoose from "mongoose";
import Product from "../lib/models/Product";
import { dbConnect } from "../lib/mongodb";

const products = [
  // MT4 Products
  {
    id: "indicator-pro-mt4",
    name: "Multi-Indicator Pro Pack (MT4)",
    description: "Bộ 10 indicators chuyên nghiệp: SR, Trend, Momentum, Volume, Fibonacci auto và nhiều hơn.",
    platform: "MT4",
    category: "indicator",
    price: 1990000,
    version: "v5.0 Pro",
    size: "2.8 MB",
    icon: "📊",
    downloadUrl: "/downloads/files/Indicator-Pro-Pack-MT4.zip",
    downloadInstructions: "Giải nén file .zip và copy các file .ex4 vào thư mục MT4/MQL4/Indicators",
    features: [
      "Support & Resistance Levels tự động",
      "Trend Detection với nhiều timeframe",
      "Momentum Oscillators",
      "Volume Analysis",
      "Fibonacci Auto-Drawing",
      "Multi-Timeframe Signals",
    ],
    includes: [
      "10 Indicators chuyên nghiệp",
      "File .ex4 và .mq4",
      "Hướng dẫn sử dụng",
      "Video tutorial",
    ],
    status: "active",
    featured: false,
    commissionRates: {
      paidAffiliate: 0.35,
      freeAffiliate: 0.30,
    },
  },
  {
    id: "ea-full-mt4",
    name: "EA ThebenchmarkTrader Full Version (MT4)",
    description: "Phiên bản đầy đủ cho tài khoản thực. License 3 tài khoản, cập nhật miễn phí 1 năm.",
    platform: "MT4",
    category: "ea-full",
    price: 7900000,
    version: "v2.0 Full",
    size: "680 KB",
    icon: "🤖",
    downloadUrl: "/downloads/files/ThebenchmarkTrader-Full-MT4.ex4",
    downloadInstructions: "Copy file .ex4 vào thư mục MT4/MQL4/Experts. Restart MT4 và drag EA lên chart.",
    features: [
      "AI-enhanced entry logic",
      "Adaptive trailing stop",
      "News filter auto",
      "Multi-timeframe analysis",
      "Risk management 1-2% per trade",
      "Support 24/7",
    ],
    includes: [
      "EA ThebenchmarkTrader Full .ex4",
      "License 3 tài khoản",
      "Hướng dẫn cài đặt chi tiết",
      "Cập nhật miễn phí 1 năm",
      "Support qua Telegram",
    ],
    status: "active",
    featured: true,
    commissionRates: {
      paidAffiliate: 0.35,
      freeAffiliate: 0.30,
    },
  },
  {
    id: "ea-pro-source-mt4",
    name: "EA ThebenchmarkTrader Pro + Source Code (MT4)",
    description: "Phiên bản Pro với source code đầy đủ. Unlimited accounts, cập nhật trọn đời, hỗ trợ VIP.",
    platform: "MT4",
    category: "ea-pro-source",
    price: 14900000,
    version: "v2.0 Pro",
    size: "197 KB",
    icon: "💎",
    downloadUrl: "/downloads/files/ThebenchmarkTrader-Pro-Source-MT4.zip",
    downloadInstructions: "Giải nén file .zip. Copy file .ex4 vào MT4/MQL4/Experts. Copy file .mq4 vào MT4/MQL4/Experts/Scripts nếu muốn chỉnh sửa.",
    features: [
      "Tất cả tính năng Full Version",
      "Source code đầy đủ (.mq4)",
      "Không giới hạn số tài khoản",
      "Cập nhật trọn đời",
      "Support VIP 24/7",
      "Tùy chỉnh logic giao dịch",
    ],
    includes: [
      "EA ThebenchmarkTrader Pro .ex4",
      "Source code .mq4 đầy đủ",
      "License không giới hạn",
      "Hướng dẫn chi tiết",
      "Cập nhật trọn đời",
      "Support VIP qua Telegram/TeamViewer",
      "Đào tạo 1-1 nếu cần",
    ],
    status: "active",
    featured: false,
    commissionRates: {
      paidAffiliate: 0.35,
      freeAffiliate: 0.30,
    },
  },

  // MT5 Products
  {
    id: "indicator-pro-mt5",
    name: "Multi-Indicator Pro Pack (MT5)",
    description: "Bộ 10 indicators chuyên nghiệp: SR, Trend, Momentum, Volume, Fibonacci auto và nhiều hơn.",
    platform: "MT5",
    category: "indicator",
    price: 1990000,
    version: "v5.0 Pro",
    size: "2.8 MB",
    icon: "📊",
    downloadUrl: "/downloads/files/Indicator-Pro-Pack-MT5.zip",
    downloadInstructions: "Giải nén file .zip và copy các file .ex5 vào thư mục MT5/MQL5/Indicators",
    features: [
      "Support & Resistance Levels tự động",
      "Trend Detection với nhiều timeframe",
      "Momentum Oscillators",
      "Volume Analysis",
      "Fibonacci Auto-Drawing",
      "Multi-Timeframe Signals",
    ],
    includes: [
      "10 Indicators chuyên nghiệp",
      "File .ex5 và .mq5",
      "Hướng dẫn sử dụng",
      "Video tutorial",
    ],
    status: "active",
    featured: false,
    commissionRates: {
      paidAffiliate: 0.35,
      freeAffiliate: 0.30,
    },
  },
  {
    id: "ea-full-mt5",
    name: "EA ThebenchmarkTrader Full Version (MT5)",
    description: "Phiên bản đầy đủ cho tài khoản thực. License 3 tài khoản, cập nhật miễn phí 1 năm.",
    platform: "MT5",
    category: "ea-full",
    price: 7900000,
    version: "v2.0 Full",
    size: "680 KB",
    icon: "🤖",
    downloadUrl: "/downloads/files/ThebenchmarkTrader-Full-MT5.ex5",
    downloadInstructions: "Copy file .ex5 vào thư mục MT5/MQL5/Experts. Restart MT5 và drag EA lên chart.",
    features: [
      "AI-enhanced entry logic",
      "Adaptive trailing stop",
      "News filter auto",
      "Multi-timeframe analysis",
      "Risk management 1-2% per trade",
      "Support 24/7",
    ],
    includes: [
      "EA ThebenchmarkTrader Full .ex5",
      "License 3 tài khoản",
      "Hướng dẫn cài đặt chi tiết",
      "Cập nhật miễn phí 1 năm",
      "Support qua Telegram",
    ],
    status: "active",
    featured: true,
    commissionRates: {
      paidAffiliate: 0.35,
      freeAffiliate: 0.30,
    },
  },
  {
    id: "ea-pro-source-mt5",
    name: "EA ThebenchmarkTrader Pro + Source Code (MT5)",
    description: "Phiên bản Pro với source code đầy đủ. Unlimited accounts, cập nhật trọn đời, hỗ trợ VIP.",
    platform: "MT5",
    category: "ea-pro-source",
    price: 14900000,
    version: "v2.0 Pro",
    size: "197 KB",
    icon: "💎",
    downloadUrl: "/downloads/files/ThebenchmarkTrader-Pro-Source-MT5.zip",
    downloadInstructions: "Giải nén file .zip. Copy file .ex5 vào MT5/MQL5/Experts. Copy file .mq5 vào MT5/MQL5/Experts/Scripts nếu muốn chỉnh sửa.",
    features: [
      "Tất cả tính năng Full Version",
      "Source code đầy đủ (.mq5)",
      "Không giới hạn số tài khoản",
      "Cập nhật trọn đời",
      "Support VIP 24/7",
      "Tùy chỉnh logic giao dịch",
    ],
    includes: [
      "EA ThebenchmarkTrader Pro .ex5",
      "Source code .mq5 đầy đủ",
      "License không giới hạn",
      "Hướng dẫn chi tiết",
      "Cập nhật trọn đời",
      "Support VIP qua Telegram/TeamViewer",
      "Đào tạo 1-1 nếu cần",
    ],
    status: "active",
    featured: false,
    commissionRates: {
      paidAffiliate: 0.35,
      freeAffiliate: 0.30,
    },
  },
];

async function migrateProducts() {
  try {
    console.log("🚀 Starting Product Migration...\n");

    // Connect to MongoDB
    await dbConnect();
    console.log("✅ Connected to MongoDB\n");

    // Check if products already exist
    const existingCount = await Product.countDocuments();
    console.log(`📊 Existing products in database: ${existingCount}`);

    if (existingCount > 0) {
      console.log("⚠️  Products already exist. Skipping migration.");
      console.log("💡 To re-migrate, delete products from MongoDB first.\n");
      process.exit(0);
    }

    // Insert products
    console.log("📦 Inserting products...\n");
    let successCount = 0;
    let errorCount = 0;

    for (const productData of products) {
      try {
        const product = await Product.create(productData);
        successCount++;
        console.log(`✅ Created: ${product.name} (${product.id})`);
      } catch (error: any) {
        errorCount++;
        console.error(`❌ Error creating ${productData.id}:`, error.message);
      }
    }

    console.log("\n" + "=".repeat(60));
    console.log("📈 Migration Summary:");
    console.log(`✅ Successfully created: ${successCount} products`);
    console.log(`❌ Failed: ${errorCount} products`);
    console.log("=".repeat(60) + "\n");

    // Close connection
    await mongoose.connection.close();
    console.log("✅ Migration completed successfully!");
    process.exit(0);
  } catch (error: any) {
    console.error("❌ Migration error:", error.message);
    process.exit(1);
  }
}

// Run migration
migrateProducts();
