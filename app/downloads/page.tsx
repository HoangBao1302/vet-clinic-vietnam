"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyCallToAction from "@/components/StickyCallToAction";
import { FileText, Download, Lock, CheckCircle, Gift, ShieldCheck, CreditCard } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/authContext";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { PAYMENT_METHODS, isPaymentMethodEnabled, type PaymentMethodType } from "@/config/paymentMethods";
import { formatUsd } from "@/config/productPrices";
import { IProduct } from "@/types/product";

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
  platform?: "MT4" | "MT5";
}

// Static PDF guides (không phải products, luôn free)
const pdfGuides: DownloadItem[] = [
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
  }
];

// Fallback hardcoded products (used if MongoDB is empty)
const fallbackProducts: DownloadItem[] = [
  // Free Indicators & EA
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
  // Paid MT4 Products
  {
    id: "indicator-pro-mt4",
    name: "Multi-Indicator Pro Pack (MT4)",
    description: "Bộ 10 indicators chuyên nghiệp: SR, Trend, Momentum, Volume, Fibonacci auto và nhiều hơn.",
    version: "v5.0 Pro",
    size: "2.8 MB",
    type: "indicator",
    free: false,
    requiresPayment: true,
    price: 10,
    downloadUrl: "/downloads/files/Indicator-Pro-Pack-MT4.zip",
    platform: "MT4"
  },
  {
    id: "ea-full-mt4",
    name: "EA ThebenchmarkTrader Full Version (MT4)",
    description: "Phiên bản đầy đủ cho tài khoản thực. License 3 tài khoản, cập nhật miễn phí 1 năm.",
    version: "v2.0 Full",
    size: "680 KB",
    type: "ea",
    free: false,
    requiresPayment: true,
    price: 329,
    downloadUrl: "/downloads/files/ThebenchmarkTrader-Full-MT4.ex4",
    platform: "MT4"
  },
  {
    id: "ea-pro-source-mt4",
    name: "EA ThebenchmarkTrader Pro + Source Code (MT4)",
    description: "Phiên bản Pro với source code đầy đủ. Unlimited accounts, cập nhật trọn đời, hỗ trợ VIP.",
    version: "v2.0 Pro",
    size: "197 KB",
    type: "ea",
    free: false,
    requiresPayment: true,
    price: 621,
    downloadUrl: "/downloads/files/ThebenchmarkTrader-Pro-Source-MT4.zip",
    platform: "MT4"
  },
  // Paid MT5 Products
  {
    id: "indicator-pro-mt5",
    name: "Multi-Indicator Pro Pack (MT5)",
    description: "Bộ 10 indicators chuyên nghiệp: SR, Trend, Momentum, Volume, Fibonacci auto và nhiều hơn.",
    version: "v5.0 Pro",
    size: "2.8 MB",
    type: "indicator",
    free: false,
    requiresPayment: true,
    price: 10,
    downloadUrl: "/downloads/files/Indicator-Pro-Pack-MT5.zip",
    platform: "MT5"
  },
  {
    id: "ea-full-mt5",
    name: "EA ThebenchmarkTrader Full Version (MT5)",
    description: "Phiên bản đầy đủ cho tài khoản thực. License 3 tài khoản, cập nhật miễn phí 1 năm.",
    version: "v2.0 Full",
    size: "680 KB",
    type: "ea",
    free: false,
    requiresPayment: true,
    price: 329,
    downloadUrl: "/downloads/files/ThebenchmarkTrader-Full-MT5.ex5",
    platform: "MT5"
  },
  {
    id: "ea-pro-source-mt5",
    name: "EA ThebenchmarkTrader Pro + Source Code (MT5)",
    description: "Phiên bản Pro với source code đầy đủ. Unlimited accounts, cập nhật trọn đời, hỗ trợ VIP.",
    version: "v2.0 Pro",
    size: "197 KB",
    type: "ea",
    free: false,
    requiresPayment: true,
    price: 621,
    downloadUrl: "/downloads/files/ThebenchmarkTrader-Pro-Source-MT5.zip",
    platform: "MT5"
  }
];

export default function DownloadsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { t, locale } = useLocale();
  const router = useRouter();
  const [verifyingOrder, setVerifyingOrder] = useState<string | null>(null);
  const [orderCode, setOrderCode] = useState("");
  const [verifyMessage, setVerifyMessage] = useState("");
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [urlOrderCode, setUrlOrderCode] = useState("");
  const autoVerifiedRef = useRef(false);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(Array.isArray(data.products) ? data.products : []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Map MongoDB Products to DownloadItem format
  const mapProductToDownloadItem = (product: IProduct): DownloadItem => {
    const productId = product?.id || "";
    const isFree = product.price === 0 || productId.includes('demo') || productId.includes('free');
    const typeMap: { [key: string]: "pdf" | "indicator" | "ea" } = {
      'indicator': 'indicator',
      'ea-full': 'ea',
      'ea-pro-source': 'ea'
    };

    return {
      id: productId || String(product._id || ""),
      name: product.name,
      description: product.description,
      version: product.version || "v1.0",
      size: product.size || "N/A",
      type: typeMap[product.category] || 'ea',
      free: isFree,
      downloadUrl: product.downloadUrl,
      requiresPayment: !isFree,
      price: product.price,
      platform: product.platform
    };
  };

  // Combine PDF guides (static) + Products from MongoDB (or fallback if empty)
  const productItems = products.length > 0 
    ? products.filter((p) => p && (p.id || p._id)).map(mapProductToDownloadItem)
    : fallbackProducts;
    
  const allDownloads: DownloadItem[] = [
    ...pdfGuides,
    ...productItems
  ];

  // Filter downloads by type - MUST be before early returns
  const pdfGuidesFiltered = allDownloads.filter(d => d.type === "pdf");
  const freeItems = allDownloads.filter(d => d.type !== "pdf" && d.free);
  const paidItems = allDownloads.filter(d => !d.free && d.requiresPayment);

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

  const handlePurchase = (item: DownloadItem, method: "stripe" | "paypal" | "bank" | "crypto") => {
    // Redirect to payment page with item info
    const params = new URLSearchParams({
      item: item.id,
      name: item.name,
      price: item.price?.toString() || "0",
      method: method
    });
    
    if (method === "bank") {
      window.location.href = `/checkout-bank-transfer?${params.toString()}`;
    } else {
      window.location.href = `/checkout?${params.toString()}`;
    }
  };

  const handleVerifyOrder = async (itemId: string, orderIdOverride?: string) => {
    const codeToVerify = (orderIdOverride || orderCode).trim();
    if (!codeToVerify) {
      setVerifyMessage(t('downloads.verification.enterCode'));
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
          orderId: codeToVerify,
          productId: itemId,
          strictMatch: true // Enable strict matching to prevent wrong product downloads
        }),
      });

      const result = await response.json();

      if (result.verified) {
        setVerifyMessage(t('downloads.verification.success'));
        
        // Download file after verification - use downloadUrl from API (source of truth)
        setTimeout(() => {
          if (result.downloadUrl) {
            window.open(result.downloadUrl, "_blank");
          }
          setVerifyingOrder(null);
          setOrderCode("");
          setVerifyMessage("");
        }, 1500);
      } else {
        // Show detailed error message
        let errorMsg = result.error || t('downloads.verification.invalidCode');
        
        // If product mismatch, show which product the order is for
        if (result.actualProductId && result.requestedProductId) {
          const actualProduct = allDownloads.find(d => d.id === result.actualProductId);
          if (actualProduct) {
            const productName = locale === 'en' ? actualProduct.name.replace(' (MT4)', '').replace(' (MT5)', '') : actualProduct.name;
            errorMsg += ` ${t('downloads.verification.wrongProduct')}: ${productName}`;
          }
        }
        
        setVerifyMessage("❌ " + errorMsg);
      }
    } catch (error) {
      setVerifyMessage("❌ " + t('downloads.verification.error'));
    } finally {
      setTimeout(() => {
        if (verifyMessage.includes("❌")) {
          setVerifyingOrder(null);
        }
      }, 5000); // Increased timeout to read error message
    }
  };

  useEffect(() => {
    if (
      autoVerifiedRef.current ||
      !isAuthenticated ||
      loadingProducts ||
      typeof window === "undefined"
    ) {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const orderFromUrl = params.get("order");
    const productFromUrl = params.get("productId");
    if (!orderFromUrl || !productFromUrl) {
      return;
    }

    autoVerifiedRef.current = true;
    setOrderCode(orderFromUrl);
    setVerifyingOrder(productFromUrl);
    void handleVerifyOrder(productFromUrl, orderFromUrl);
  }, [isAuthenticated, loadingProducts]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const orderFromUrl = params.get("order");
    const productFromUrl = params.get("productId");
    if (orderFromUrl) {
      setOrderCode(orderFromUrl);
      setUrlOrderCode(orderFromUrl);
      if (productFromUrl) {
        setVerifyingOrder(productFromUrl);
      }
    }

    void fetchProducts();
  }, []);

  useEffect(() => {
    if (isLoading || isAuthenticated) return;
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    const search = typeof window !== "undefined" ? window.location.search : "";
    const dest = `/downloads${search}${hash}`;
    window.location.assign(`/login?redirect=${encodeURIComponent(dest)}`);
  }, [isLoading, isAuthenticated]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('downloads.auth.checking')}</p>
          <p className="text-xs text-gray-500 mt-2">{t('downloads.auth.refreshHint')}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('downloads.auth.redirecting')}</p>
        </div>
      </div>
    );
  }

  // Helper function to render paid product card
  const renderPaidProductCard = (item: DownloadItem) => {
    const translatedName = locale === 'en' && t(`downloads.paidSection.items.${item.id}.name`) !== `downloads.paidSection.items.${item.id}.name`
      ? t(`downloads.paidSection.items.${item.id}.name`)
      : item.name.replace(" (MT4)", "").replace(" (MT5)", "");
    const translatedDesc = locale === 'en' && t(`downloads.paidSection.items.${item.id}.description`) !== `downloads.paidSection.items.${item.id}.description`
      ? t(`downloads.paidSection.items.${item.id}.description`)
      : item.description;

    return (
      <div key={item.id} className="bg-white border-2 border-purple-200 rounded-xl p-5 sm:p-6 hover:border-purple-500 hover:shadow-2xl transition-all flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-purple-100 rounded-lg">
            <Lock className="text-purple-600" size={24} />
          </div>
          <div className="flex flex-col gap-1">
            <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
              {t('downloads.badges.pro')}
            </span>
            <span className={`px-2 py-1 ${item.platform === 'MT4' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'} text-xs font-semibold rounded-full text-center`}>
              {item.platform}
            </span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-2">
          {translatedName}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          {translatedDesc}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <span>{item.version}</span>
          <span>{item.size}</span>
        </div>

        <div className="mt-auto">
          <div className="rounded-xl bg-purple-50 p-4 mb-4">
            <div className="mb-3">
              <div className="text-2xl sm:text-3xl font-bold text-purple-600 leading-none">
                {formatUsd(item.price || 0)}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {t('downloads.paidSection.oneTimePurchase')}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {isPaymentMethodEnabled('paypal') && (
                <button
                  onClick={() => handlePurchase(item, "paypal")}
                  className="w-full min-h-12 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#FFC439] text-[#003087] font-bold hover:bg-[#f5b82e] transition-colors shadow-sm"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" aria-hidden="true">
                    <path fill="#003087" d="M7.2 21H4.7c-.4 0-.7-.3-.8-.7L2 3.7C1.9 3.3 2.2 3 2.6 3h7.3c2.5 0 4.3.5 5.3 1.6.9 1 1.2 2.4.9 4.1-.7 3.6-3.1 5.4-7.1 5.4H7.4l-.8 5.2c-.1.4-.4.7-.8.7z"/>
                    <path fill="#009CDE" d="M19.2 7.2c0 .2 0 .4-.1.6-.9 4.5-3.8 6.2-8.4 6.2H8.6l-1 6.3c-.1.4-.4.7-.8.7H4.4l.3-2h1.4c.4 0 .8-.3.8-.8l1.2-7.6.1-.4c0-.4.4-.7.8-.7h2.2c3.3 0 5.8-.7 6.8-4.1.1-.3.2-.6.2-.9 1.1.7 1.6 1.8 1.6 3.7z"/>
                  </svg>
                  <span className="whitespace-nowrap">{t('downloads.buttons.buyPaypal')}</span>
                </button>
              )}

              {isPaymentMethodEnabled('bank') && (
                <button
                  onClick={() => handlePurchase(item, "bank")}
                  className="w-full min-h-12 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
                >
                  <CreditCard size={18} />
                  <span className="whitespace-nowrap">{t('downloads.buttons.buyBank')}</span>
                </button>
              )}

              {isPaymentMethodEnabled('crypto') && (
                <button
                  onClick={() => handlePurchase(item, "crypto")}
                  className="w-full min-h-12 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-emerald-700">₮</span>
                  <span className="whitespace-nowrap">{t('downloads.buttons.buyCrypto')}</span>
                </button>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-600 mb-2 text-center">
              {t('downloads.verification.alreadyPaid')}
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder={t('downloads.verification.orderCode')}
                value={verifyingOrder === item.id ? orderCode : ""}
                onChange={(e) => setOrderCode(e.target.value)}
                onFocus={() => setVerifyingOrder(item.id)}
                className="w-full sm:flex-1 min-h-11 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                onClick={() => handleVerifyOrder(item.id)}
                disabled={verifyingOrder === item.id && orderCode.trim() === ""}
                className="w-full sm:w-auto min-h-11 px-4 py-2.5 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                {t('downloads.verification.verify')}
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
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 text-white">
          <div className="container-custom text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t('downloads.hero.title')}
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              {t('downloads.hero.subtitle')}
            </p>
          </div>
        </section>

        {/* Section 1: PDF Guides */}
        <section className="py-20 bg-white">
          <div className="container-custom">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full mb-4">
                <FileText size={20} />
                <span className="font-semibold">{t('downloads.pdfSection.badge')}</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                {t('downloads.pdfSection.title')}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {t('downloads.pdfSection.description')}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {pdfGuidesFiltered.map((item) => {
                const translatedName = locale === 'en' && t(`downloads.pdfSection.items.${item.id}.name`) !== `downloads.pdfSection.items.${item.id}.name` 
                  ? t(`downloads.pdfSection.items.${item.id}.name`)
                  : item.name;
                const translatedDesc = locale === 'en' && t(`downloads.pdfSection.items.${item.id}.description`) !== `downloads.pdfSection.items.${item.id}.description`
                  ? t(`downloads.pdfSection.items.${item.id}.description`)
                  : item.description;
                
                return (
                  <div key={item.id} className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-xl transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <FileText className="text-blue-600" size={24} />
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                        {t('downloads.badges.free')}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {translatedName}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {translatedDesc}
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
                      <span>{t('downloads.buttons.download')}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Section 2: Free Indicators & EA */}
        <section id="free" className="py-20 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full mb-4">
                <Gift size={20} />
                <span className="font-semibold">{t('downloads.freeSection.badge')}</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                {t('downloads.freeSection.title')}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {t('downloads.freeSection.description')}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {freeItems.map((item) => {
                const translatedName = locale === 'en' && t(`downloads.freeSection.items.${item.id}.name`) !== `downloads.freeSection.items.${item.id}.name`
                  ? t(`downloads.freeSection.items.${item.id}.name`)
                  : item.name;
                const translatedDesc = locale === 'en' && t(`downloads.freeSection.items.${item.id}.description`) !== `downloads.freeSection.items.${item.id}.description`
                  ? t(`downloads.freeSection.items.${item.id}.description`)
                  : item.description;
                
                return (
                  <div key={item.id} className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-green-500 hover:shadow-xl transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <CheckCircle className="text-green-600" size={24} />
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                        {t('downloads.badges.free')}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {translatedName}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {translatedDesc}
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
                      <span>{t('downloads.buttons.downloadFree')}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Section 3: Paid Products */}
        <section id="paid" className="py-20 bg-white">
          <div className="container-custom">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-800 rounded-full mb-4">
                <ShieldCheck size={20} />
                <span className="font-semibold">{t('downloads.paidSection.badge')}</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                {t('downloads.paidSection.title')}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
                {t('downloads.paidSection.description')}
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-2">
                  <CreditCard size={16} />
                  {t('downloads.paidSection.paymentMethods')}
                </span>
              </div>
              {urlOrderCode && (
                <div className="mt-6 max-w-2xl mx-auto bg-blue-50 border border-blue-200 rounded-xl p-4 text-left">
                  <p className="text-sm text-blue-800 font-medium mb-1">Mã đơn hàng từ email / thanh toán:</p>
                  <p className="font-mono text-sm text-blue-700 break-all">{urlOrderCode}</p>
                  <p className="text-xs text-blue-600 mt-2">Dán mã này vào đúng sản phẩm đã mua rồi bấm Xác Nhận.</p>
                </div>
              )}
            </div>

            {loadingProducts ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                <p className="mt-4 text-gray-600">Đang tải sản phẩm từ MongoDB...</p>
              </div>
            ) : (
              <>
                {/* MT4 Products */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    {t('downloads.paidSection.mt4Title')}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 max-w-6xl mx-auto items-stretch">
                    {paidItems.filter(item => item.platform === "MT4").map(renderPaidProductCard)}
                  </div>
                </div>

                {/* MT5 Products */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    {t('downloads.paidSection.mt5Title')}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 max-w-6xl mx-auto items-stretch">
                    {paidItems.filter(item => item.platform === "MT5").map(renderPaidProductCard)}
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
        <section className="py-20 bg-blue-50">
          <div className="container-custom text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {t('downloads.support.title')}
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              {t('downloads.support.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/pricing#contact" className="btn-primary">
                {t('downloads.support.contactButton')}
              </Link>
              <a href="https://t.me/+0ETUdIuYUzdhZWQ1" target="_blank" rel="noopener noreferrer" className="btn-secondary">
                {t('downloads.support.telegramButton')}
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

