import { NextResponse } from "next/server";
import { verifyAdminAccess } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    const authError = await verifyAdminAccess(request);
    if (authError) {
      return authError;
    }

    // Hardcoded products data from Downloads page
    const products = [
      // Free Indicators & EA
      {
        id: "indicator-support-resistance",
        name: "Support & Resistance Indicator (Free)",
        description: "Indicator tự động vẽ vùng hỗ trợ kháng cự trên mọi timeframe. Hoàn toàn miễn phí cho cộng đồng.",
        version: "v3.2",
        size: "120 KB",
        category: "indicator",
        platform: "MT4",
        price: 0,
        status: "active",
        downloadUrl: "/downloads/files/SR-Indicator-Free.ex4",
        features: [
          "Tự động vẽ vùng S/R chính xác",
          "Hoạt động trên mọi timeframe",
          "Cảnh báo khi giá chạm vùng quan trọng",
          "Compatible MT4/MT5"
        ]
      },
      {
        id: "indicator-trend-lines",
        name: "Auto Trend Lines Indicator (Free)",
        description: "Tự động vẽ đường xu hướng (trendlines) chính xác. Compatible MT4/MT5.",
        version: "v2.1",
        size: "95 KB",
        category: "indicator",
        platform: "MT5",
        price: 0,
        status: "active",
        downloadUrl: "/downloads/files/TrendLines-Free.ex4",
        features: [
          "Vẽ trendlines tự động",
          "Nhận diện xu hướng chính xác",
          "Cảnh báo break trendline",
          "Multi-timeframe support"
        ]
      },
      {
        id: "ea-demo",
        name: "EA ThebenchmarkTrader Demo (Free)",
        description: "Phiên bản demo đầy đủ tính năng, chỉ chạy trên tài khoản demo. Không giới hạn thời gian.",
        version: "v2.0 Demo",
        size: "450 KB",
        category: "ea-full",
        platform: "MT4",
        price: 0,
        status: "active",
        downloadUrl: "/downloads/files/ThebenchmarkTrader-Demo.ex5",
        features: [
          "Đầy đủ tính năng như bản Full",
          "Chỉ chạy trên tài khoản demo",
          "Không giới hạn thời gian",
          "Test không mất phí"
        ]
      },
      // Paid MT4 Products
      {
        id: "indicator-pro-mt4",
        name: "Multi-Indicator Pro Pack (MT4)",
        description: "Bộ 10 indicators chuyên nghiệp: SR, Trend, Momentum, Volume, Fibonacci auto và nhiều hơn.",
        version: "v5.0 Pro",
        size: "2.8 MB",
        category: "indicator",
        platform: "MT4",
        price: 1990000,
        status: "active",
        downloadUrl: "/downloads/files/Indicator-Pro-Pack-MT4.zip",
        features: [
          "10 indicators chuyên nghiệp",
          "Support & Resistance auto",
          "Trend detection",
          "Momentum & Volume analysis",
          "Fibonacci auto zones",
          "Multi-timeframe dashboard",
          "Cập nhật miễn phí 1 năm",
          "Hỗ trợ kỹ thuật priority"
        ]
      },
      {
        id: "ea-full-mt4",
        name: "EA ThebenchmarkTrader Full Version (MT4)",
        description: "Phiên bản đầy đủ cho tài khoản thực. License 3 tài khoản, cập nhật miễn phí 1 năm.",
        version: "v2.0 Full",
        size: "680 KB",
        category: "ea-full",
        platform: "MT4",
        price: 7900000,
        status: "active",
        downloadUrl: "/downloads/files/ThebenchmarkTrader-Full-MT4.ex4",
        features: [
          "Chạy trên tài khoản thực",
          "License 3 tài khoản đồng thời",
          "Multi-strategy trading",
          "Risk management tự động",
          "Trailing stop & breakeven",
          "News filter",
          "Telegram notifications",
          "Cập nhật miễn phí 1 năm",
          "Hỗ trợ kỹ thuật 24/7"
        ]
      },
      {
        id: "ea-pro-source-mt4",
        name: "EA ThebenchmarkTrader Pro + Source Code (MT4)",
        description: "Phiên bản Pro với source code đầy đủ. Unlimited accounts, cập nhật trọn đời, hỗ trợ VIP.",
        version: "v2.0 Pro",
        size: "197 KB",
        category: "ea-pro-source",
        platform: "MT4",
        price: 14900000,
        status: "active",
        downloadUrl: "/downloads/files/ThebenchmarkTrader-Pro-Source-MT4.zip",
        features: [
          "Full source code (.mq4)",
          "Unlimited accounts",
          "Customize toàn bộ logic",
          "Private strategy modifications",
          "Cập nhật trọn đời",
          "Hỗ trợ VIP 1-on-1",
          "Tư vấn chiến lược",
          "Priority support",
          "Exclusive Telegram group"
        ]
      },
      // Paid MT5 Products
      {
        id: "indicator-pro-mt5",
        name: "Multi-Indicator Pro Pack (MT5)",
        description: "Bộ 10 indicators chuyên nghiệp: SR, Trend, Momentum, Volume, Fibonacci auto và nhiều hơn.",
        version: "v5.0 Pro",
        size: "2.8 MB",
        category: "indicator",
        platform: "MT5",
        price: 1990000,
        status: "active",
        downloadUrl: "/downloads/files/Indicator-Pro-Pack-MT5.zip",
        features: [
          "10 indicators chuyên nghiệp",
          "Support & Resistance auto",
          "Trend detection",
          "Momentum & Volume analysis",
          "Fibonacci auto zones",
          "Multi-timeframe dashboard",
          "Cập nhật miễn phí 1 năm",
          "Hỗ trợ kỹ thuật priority"
        ]
      },
      {
        id: "ea-full-mt5",
        name: "EA ThebenchmarkTrader Full Version (MT5)",
        description: "Phiên bản đầy đủ cho tài khoản thực. License 3 tài khoản, cập nhật miễn phí 1 năm.",
        version: "v2.0 Full",
        size: "680 KB",
        category: "ea-full",
        platform: "MT5",
        price: 7900000,
        status: "active",
        downloadUrl: "/downloads/files/ThebenchmarkTrader-Full-MT5.ex5",
        features: [
          "Chạy trên tài khoản thực",
          "License 3 tài khoản đồng thời",
          "Multi-strategy trading",
          "Risk management tự động",
          "Trailing stop & breakeven",
          "News filter",
          "Telegram notifications",
          "Cập nhật miễn phí 1 năm",
          "Hỗ trợ kỹ thuật 24/7"
        ]
      },
      {
        id: "ea-pro-source-mt5",
        name: "EA ThebenchmarkTrader Pro + Source Code (MT5)",
        description: "Phiên bản Pro với source code đầy đủ. Unlimited accounts, cập nhật trọn đời, hỗ trợ VIP.",
        version: "v2.0 Pro",
        size: "197 KB",
        category: "ea-pro-source",
        platform: "MT5",
        price: 14900000,
        status: "active",
        downloadUrl: "/downloads/files/ThebenchmarkTrader-Pro-Source-MT5.zip",
        features: [
          "Full source code (.mq5)",
          "Unlimited accounts",
          "Customize toàn bộ logic",
          "Private strategy modifications",
          "Cập nhật trọn đời",
          "Hỗ trợ VIP 1-on-1",
          "Tư vấn chiến lược",
          "Priority support",
          "Exclusive Telegram group"
        ]
      }
    ];

    return NextResponse.json({
      success: true,
      data: { products },
      counts: {
        products: products.length
      }
    });

  } catch (error: any) {
    console.error("Error preparing products import:", error);
    return NextResponse.json(
      { error: "Failed to prepare products data", message: error.message },
      { status: 500 }
    );
  }
}
