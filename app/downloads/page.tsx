"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyCallToAction from "@/components/StickyCallToAction";
import { FileText, Download, Lock, CheckCircle, Gift, ShieldCheck, CreditCard } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/authContext";

interface DownloadItem {
  id: string;
  name: string;
  description: string;
  version: string;
  size: string;
  type: "pdf" | "indicator" | "ea";
  free: boolean;
  downloadUrl?: string;
  requiresPayment?: boolean;
  price?: number;
}

const downloads: DownloadItem[] = [
  // Section 1: Hướng dẫn PDF
  {
    id: "guide-installation",
    name: "Hướng dẫn cài đặt EA ThebenchmarkTrader",
    description: "PDF chi tiết từng bước cài đặt EA trên MT4/MT5, cấu hình tham số và troubleshooting",
    version: "v2.0",
    size: "5.2 MB",
    type: "pdf",
    free: true,
    downloadUrl: "/downloads/files/Installation-Guide.pdf"
  },
  {
    id: "guide-parameters",
    name: "Hướng dẫn tối ưu tham số EA",
    description: "Cách điều chỉnh Risk%, Lot Size, Max Positions cho từng loại tài khoản",
    version: "v1.5",
    size: "3.8 MB",
    type: "pdf",
    free: true,
    downloadUrl: "/downloads/files/Parameter-Guide.pdf"
  },
  {
    id: "guide-broker",
    name: "Hướng dẫn chọn và setup broker",
    description: "So sánh broker, mở tài khoản, verify và deposit. Kèm checklist đầy đủ",
    version: "v1.0",
    size: "4.5 MB",
    type: "pdf",
    free: true,
    downloadUrl: "/downloads/files/Broker-Setup-Guide.pdf"
  },

  // Section 2: Free Indicator & EA
  {
    id: "indicator-support-resistance",
    name: "Support & Resistance Indicator (Free)",
    description: "Indicator tự động vẽ vùng hỗ trợ kháng cự trên mọi timeframe. Hoàn toàn miễn phí cho cộng đồng.",
    version: "v3.2",
    size: "120 KB",
    type: "indicator",
    free: true,
    downloadUrl: "/downloads/files/SR-Indicator-Free.ex4"
  },
  {
    id: "indicator-trend-lines",
    name: "Auto Trend Lines Indicator (Free)",
    description: "Tự động vẽ đường xu hướng (trendlines) chính xác. Compatible MT4/MT5.",
    version: "v2.1",
    size: "95 KB",
    type: "indicator",
    free: true,
    downloadUrl: "/downloads/files/TrendLines-Free.ex4"
  },
  {
    id: "ea-demo",
    name: "EA ThebenchmarkTrader Demo (Free)",
    description: "Phiên bản demo đầy đủ tính năng, chỉ chạy trên tài khoản demo. Không giới hạn thời gian.",
    version: "v2.0 Demo",
    size: "450 KB",
    type: "ea",
    free: true,
    downloadUrl: "/downloads/files/ThebenchmarkTrader-Demo.ex5"
  },

  // Section 3: Paid Products
  {
    id: "indicator-pro",
    name: "Multi-Indicator Pro Pack",
    description: "Bộ 10 indicators chuyên nghiệp: SR, Trend, Momentum, Volume, Fibonacci auto và nhiều hơn.",
    version: "v5.0 Pro",
    size: "2.8 MB",
    type: "indicator",
    free: false,
    requiresPayment: true,
    price: 1990000,
    downloadUrl: "/downloads/files/Indicator-Pro-Pack.zip"
  },
  {
    id: "ea-full",
    name: "EA ThebenchmarkTrader Full Version",
    description: "Phiên bản đầy đủ cho tài khoản thực. License 3 tài khoản, cập nhật miễn phí 1 năm.",
    version: "v2.0 Full",
    size: "680 KB",
    type: "ea",
    free: false,
    requiresPayment: true,
    price: 7900000,
    downloadUrl: "/downloads/files/ThebenchmarkTrader-Full.ex4"
  },
  {
    id: "ea-pro-source",
    name: "EA ThebenchmarkTrader Pro + Source Code",
    description: "Phiên bản Pro với source code đầy đủ. Unlimited accounts, cập nhật trọn đời, hỗ trợ VIP.",
    version: "v2.0 Pro",
    size: "1.2 MB",
    type: "ea",
    free: false,
    requiresPayment: true,
    price: 14900000,
    downloadUrl: "/downloads/files/ThebenchmarkTrader-Pro-Source.zip"
  }
];

export default function DownloadsPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [verifyingOrder, setVerifyingOrder] = useState<string | null>(null);
  const [orderCode, setOrderCode] = useState("");
  const [verifyMessage, setVerifyMessage] = useState("");

  // Check authentication with mobile-friendly delay
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      console.log('Auth check:', { hasToken: !!token, hasUser: !!user, isAuthenticated, isMobile });
      
      // Only redirect if we're sure there's no authentication data
      if (!token && !user && !isAuthenticated) {
        console.log('No auth data found, redirecting to login');
        router.push('/login?redirect=/downloads');
        return;
      }
      
      // For mobile, wait longer for AuthContext to initialize
      if (!isAuthenticated && (token || user)) {
        const delay = isMobile ? 1000 : 500;
        console.log('Auth not ready, retrying in:', delay, 'ms');
        setTimeout(checkAuth, delay);
      } else if (isAuthenticated) {
        console.log('Authentication successful');
      }
    };
    
    // Initial check with mobile-specific delay
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const initialDelay = isMobile ? 300 : 100;
    
    setTimeout(checkAuth, initialDelay);
  }, [isAuthenticated, router]);

  // Show loading if not authenticated yet, but only if we have auth data
  const hasAuthData = typeof window !== 'undefined' && (localStorage.getItem('token') || localStorage.getItem('user'));
  
  if (!isAuthenticated && hasAuthData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }
  
  // If no auth data at all, let the useEffect handle the redirect
  if (!isAuthenticated && !hasAuthData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang chuyển hướng...</p>
        </div>
      </div>
    );
  }

  const handleFreeDownload = (item: DownloadItem) => {
    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      router.push('/login?redirect=/downloads');
      return;
    }
    
    // If logged in, proceed with download (will be tracked via API)
    if (item.downloadUrl) {
      window.open(item.downloadUrl, "_blank");
    }
  };

  const handlePurchase = (item: DownloadItem, method: "stripe" | "paypal") => {
    // Redirect to payment page with item info
    const params = new URLSearchParams({
      item: item.id,
      name: item.name,
      price: item.price?.toString() || "0",
      method: method
    });
    window.location.href = `/checkout?${params.toString()}`;
  };

  const handleVerifyOrder = async (itemId: string) => {
    if (!orderCode.trim()) {
      setVerifyMessage("Vui lòng nhập mã đơn hàng");
      return;
    }

    setVerifyingOrder(itemId);
    setVerifyMessage("");

    try {
      const response = await fetch("/api/verify-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: orderCode,
          productId: itemId
        }),
      });

      const result = await response.json();

      if (result.verified) {
        setVerifyMessage("✅ Xác thực thành công! Đang tải file...");
        
        // Download file after verification
        setTimeout(() => {
          const item = downloads.find(d => d.id === itemId);
          if (item?.downloadUrl) {
            window.open(result.downloadUrl || item.downloadUrl, "_blank");
          }
          setVerifyingOrder(null);
          setOrderCode("");
        }, 1500);
      } else {
        setVerifyMessage("❌ " + (result.error || "Mã đơn hàng không hợp lệ hoặc chưa thanh toán"));
      }
    } catch (error) {
      setVerifyMessage("❌ Lỗi kết nối. Vui lòng thử lại.");
    } finally {
      setTimeout(() => {
        if (verifyMessage.includes("❌")) {
          setVerifyingOrder(null);
        }
      }, 3000);
    }
  };

  const pdfGuides = downloads.filter(d => d.type === "pdf");
  const freeItems = downloads.filter(d => d.type !== "pdf" && d.free);
  const paidItems = downloads.filter(d => !d.free && d.requiresPayment);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 text-white">
          <div className="container-custom text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Downloads & Tài Nguyên
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Hướng dẫn, indicators miễn phí và EA chuyên nghiệp
            </p>
          </div>
        </section>

        {/* Section 1: PDF Guides */}
        <section className="py-20 bg-white">
          <div className="container-custom">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full mb-4">
                <FileText size={20} />
                <span className="font-semibold">Tài liệu hướng dẫn</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Hướng Dẫn PDF Miễn Phí
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Download tất cả tài liệu hướng dẫn chi tiết, hoàn toàn miễn phí
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {pdfGuides.map((item) => (
                <div key={item.id} className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-xl transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <FileText className="text-blue-600" size={24} />
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                      MIỄN PHÍ
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {item.name}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>{item.version}</span>
                    <span>{item.size}</span>
                  </div>

                  <button
                    onClick={() => {
                      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
                      if (!token) {
                        window.location.href = `/login?redirect=/downloads`;
                      } else {
                        handleFreeDownload(item);
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    <Download size={18} />
                    <span>Tải xuống</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 2: Free Indicators & EA */}
        <section className="py-20 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full mb-4">
                <Gift size={20} />
                <span className="font-semibold">Miễn phí cho cộng đồng</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Indicators & EA Miễn Phí
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Tools hữu ích cho mọi trader, hoàn toàn miễn phí và không giới hạn
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {freeItems.map((item) => (
                <div key={item.id} className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-green-500 hover:shadow-xl transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <CheckCircle className="text-green-600" size={24} />
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                      FREE
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {item.name}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>{item.version}</span>
                    <span>{item.size}</span>
                  </div>

                  <button
                    onClick={() => handleFreeDownload(item)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    <Download size={18} />
                    <span>Tải miễn phí</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: Paid Products */}
        <section className="py-20 bg-white">
          <div className="container-custom">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-800 rounded-full mb-4">
                <ShieldCheck size={20} />
                <span className="font-semibold">Sản phẩm bản quyền</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Indicators & EA Chuyên Nghiệp
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
                Sản phẩm premium với full support và cập nhật thường xuyên
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-2">
                  <CreditCard size={16} />
                  Thanh toán: Stripe • PayPal
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {paidItems.map((item) => (
                <div key={item.id} className="bg-white border-2 border-purple-200 rounded-xl p-6 hover:border-purple-500 hover:shadow-2xl transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Lock className="text-purple-600" size={24} />
                    </div>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                      PRO
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {item.name}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>{item.version}</span>
                    <span>{item.size}</span>
                  </div>

                  <div className="mb-4 p-4 bg-purple-50 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600 mb-1">
                      {item.price?.toLocaleString("vi-VN")}đ
                    </div>
                    <div className="text-xs text-gray-600">
                      Mua 1 lần, sử dụng trọn đời
                    </div>
                  </div>

                  {/* Purchase Buttons */}
                  <div className="space-y-2 mb-4">
                    <button
                      onClick={() => handlePurchase(item, "stripe")}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      <CreditCard size={18} />
                      <span>Mua với Stripe</span>
                    </button>
                    <button
                      onClick={() => handlePurchase(item, "paypal")}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
                    >
                      <CreditCard size={18} />
                      <span>Mua với PayPal</span>
                    </button>
                  </div>

                  {/* Or Verify Order */}
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-600 mb-2 text-center">
                      Đã thanh toán? Nhập mã để tải:
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Mã đơn hàng"
                        value={verifyingOrder === item.id ? orderCode : ""}
                        onChange={(e) => setOrderCode(e.target.value)}
                        onFocus={() => setVerifyingOrder(item.id)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <button
                        onClick={() => handleVerifyOrder(item.id)}
                        disabled={verifyingOrder === item.id && orderCode.trim() === ""}
                        className="px-4 py-2 bg-gray-800 text-white rounded text-sm font-medium hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Xác thực
                      </button>
                    </div>
                    {verifyingOrder === item.id && verifyMessage && (
                      <p className={`text-xs mt-2 ${
                        verifyMessage.includes("✅") ? "text-green-600" : "text-red-600"
                      }`}>
                        {verifyMessage}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Support Section */}
        <section className="py-20 bg-blue-50">
          <div className="container-custom text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Cần hỗ trợ?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Gặp vấn đề khi download hoặc cài đặt? Team support sẵn sàng giúp đỡ
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/pricing#contact" className="btn-primary">
                Liên hệ hỗ trợ
              </Link>
              <a href="https://t.me/+0ETUdIuYUzdhZWQ1" target="_blank" rel="noopener noreferrer" className="btn-secondary">
                Chat Telegram
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <StickyCallToAction />
    </div>
  );
}

