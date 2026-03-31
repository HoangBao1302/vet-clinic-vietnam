"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyCallToAction from "@/components/StickyCallToAction";
import { FileText, Download, Lock, CheckCircle, Gift, ShieldCheck, CreditCard } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/authContext";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { PAYMENT_METHODS, isPaymentMethodEnabled, type PaymentMethodType } from "@/config/paymentMethods";
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

export default function DownloadsPage() {
  const { user, isAuthenticated } = useAuth();
  const { t, locale } = useLocale();
  const router = useRouter();
  const [verifyingOrder, setVerifyingOrder] = useState<string | null>(null);
  const [orderCode, setOrderCode] = useState("");
  const [verifyMessage, setVerifyMessage] = useState("");
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Simplified authentication check - only redirect if definitely not authenticated
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Map MongoDB Products to DownloadItem format
  const mapProductToDownloadItem = (product: IProduct): DownloadItem => {
    const isFree = product.price === 0 || product.id.includes('demo') || product.id.includes('free');
    const typeMap: { [key: string]: "pdf" | "indicator" | "ea" } = {
      'indicator': 'indicator',
      'ea-full': 'ea',
      'ea-pro-source': 'ea'
    };

    return {
      id: product.id,
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
      price: 1990000,
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
      price: 7900000,
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
      price: 14900000,
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
      price: 1990000,
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
      price: 7900000,
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
      price: 14900000,
      downloadUrl: "/downloads/files/ThebenchmarkTrader-Pro-Source-MT5.zip",
      platform: "MT5"
    }
  ];

  // Combine PDF guides (static) + Products from MongoDB (or fallback if empty)
  const productItems = products.length > 0 
    ? products.map(mapProductToDownloadItem)
    : fallbackProducts;
    
  const allDownloads: DownloadItem[] = [
    ...pdfGuides,
    ...productItems
  ];

  // Simplified authentication check - only redirect if definitely not authenticated
  useEffect(() => {
    // Only check once when component mounts, with longer delay for context
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      console.log('Downloads auth check:', { 
        hasToken: !!token, 
        hasUser: !!user, 
        isAuthenticated,
        contextReady: typeof isAuthenticated !== 'undefined'
      });
      
      // If we have auth data in localStorage, wait longer for context to initialize
      if (token && user && !isAuthenticated) {
        console.log('Auth data exists, waiting for context...');
        return; // Don't redirect, let context handle it
      }
      
      // Only redirect if we have NO auth data AND context is ready and says not authenticated
      if (!token && !user && isAuthenticated === false) {
        console.log('No auth data found and context confirmed not authenticated, redirecting to login');
        router.push('/login?redirect=/downloads');
      }
    };
    
    // Check after a longer delay to allow context to fully initialize
    const timeoutId = setTimeout(checkAuth, 2000); // Increased delay
    
    return () => clearTimeout(timeoutId);
  }, []); // Only run once on mount

  // Show loading if not authenticated yet, but only if we have auth data
  const hasAuthData = typeof window !== 'undefined' && (localStorage.getItem('token') || localStorage.getItem('user'));
  
  // If we have auth data but context is not ready, show loading
  if (!isAuthenticated && hasAuthData) {
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
  
  // If no auth data and context confirmed not authenticated, show redirect message
  if (!isAuthenticated && !hasAuthData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('downloads.auth.redirecting')}</p>
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

  const handlePurchase = (item: DownloadItem, method: "stripe" | "paypal" | "bank") => {
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

  const handleVerifyOrder = async (itemId: string) => {
    if (!orderCode.trim()) {
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
          orderId: orderCode,
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
          const actualProduct = downloads.find(d => d.id === result.actualProductId);
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

  const pdfGuides = allDownloads.filter(d => d.type === "pdf");
  const freeItems = allDownloads.filter(d => d.type !== "pdf" && d.free);
  const paidItems = allDownloads.filter(d => !d.free && d.requiresPayment);

  // Helper function to render paid product card
  const renderPaidProductCard = (item: DownloadItem) => {
    const translatedName = locale === 'en' && t(`downloads.paidSection.items.${item.id}.name`) !== `downloads.paidSection.items.${item.id}.name`
      ? t(`downloads.paidSection.items.${item.id}.name`)
      : item.name.replace(" (MT4)", "").replace(" (MT5)", "");
    const translatedDesc = locale === 'en' && t(`downloads.paidSection.items.${item.id}.description`) !== `downloads.paidSection.items.${item.id}.description`
      ? t(`downloads.paidSection.items.${item.id}.description`)
      : item.description;

    return (
      <div key={item.id} className="bg-white border-2 border-purple-200 rounded-xl p-6 hover:border-purple-500 hover:shadow-2xl transition-all">
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

        <div className="mb-4 p-4 bg-purple-50 rounded-lg">
          <div className="text-3xl font-bold text-purple-600 mb-1">
            {item.price?.toLocaleString("vi-VN")}đ
          </div>
          <div className="text-xs text-gray-600">
            {t('downloads.paidSection.oneTimePurchase')}
          </div>
          <div className="text-xs text-blue-600 mt-1">
            PayPal: ${((item.price || 0) / 24000).toFixed(2)} USD
            <span className="text-orange-600 ml-1">(Sandbox)</span>
          </div>
        </div>

        {/* Purchase Buttons */}
        <div className="space-y-2 mb-4">
          {/* Stripe Button */}
          <button
            onClick={() => isPaymentMethodEnabled('stripe') && handlePurchase(item, "stripe")}
            disabled={!isPaymentMethodEnabled('stripe')}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-colors ${
              isPaymentMethodEnabled('stripe')
                ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60'
            }`}
            title={!isPaymentMethodEnabled('stripe') ? (locale === 'en' ? PAYMENT_METHODS.stripe.disabledMessageEn : PAYMENT_METHODS.stripe.disabledMessage) : ''}
          >
            <CreditCard size={18} />
            <span>{t('downloads.buttons.buyStripe')}</span>
            {!isPaymentMethodEnabled('stripe') && (
              <span className="text-xs ml-2">({locale === 'en' ? PAYMENT_METHODS.stripe.disabledMessageEn : PAYMENT_METHODS.stripe.disabledMessage})</span>
            )}
          </button>

          {/* PayPal Button */}
          <button
            onClick={() => isPaymentMethodEnabled('paypal') && handlePurchase(item, "paypal")}
            disabled={!isPaymentMethodEnabled('paypal')}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-colors ${
              isPaymentMethodEnabled('paypal')
                ? 'bg-yellow-500 text-white hover:bg-yellow-600 cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60'
            }`}
            title={!isPaymentMethodEnabled('paypal') ? (locale === 'en' ? PAYMENT_METHODS.paypal.disabledMessageEn : PAYMENT_METHODS.paypal.disabledMessage) : ''}
          >
            <CreditCard size={18} />
            <span>{t('downloads.buttons.buyPaypal')}</span>
            {!isPaymentMethodEnabled('paypal') && (
              <span className="text-xs ml-2">({locale === 'en' ? PAYMENT_METHODS.paypal.disabledMessageEn : PAYMENT_METHODS.paypal.disabledMessage})</span>
            )}
          </button>

          {/* Bank Transfer Button */}
          <button
            onClick={() => isPaymentMethodEnabled('bank') && handlePurchase(item, "bank")}
            disabled={!isPaymentMethodEnabled('bank')}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-colors ${
              isPaymentMethodEnabled('bank')
                ? 'bg-green-600 text-white hover:bg-green-700 cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60'
            }`}
            title={!isPaymentMethodEnabled('bank') ? (locale === 'en' ? PAYMENT_METHODS.bank.disabledMessageEn : PAYMENT_METHODS.bank.disabledMessage) : ''}
          >
            <CreditCard size={18} />
            <span>{t('downloads.buttons.buyBank')}</span>
            {!isPaymentMethodEnabled('bank') && (
              <span className="text-xs ml-2">({locale === 'en' ? PAYMENT_METHODS.bank.disabledMessageEn : PAYMENT_METHODS.bank.disabledMessage})</span>
            )}
          </button>
        </div>

        {/* Or Verify Order */}
        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-600 mb-2 text-center">
            {t('downloads.verification.alreadyPaid')}
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={t('downloads.verification.orderCode')}
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
              {pdfGuides.map((item) => {
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
        <section className="py-20 bg-gray-50">
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
        <section className="py-20 bg-white">
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
                  <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {paidItems.filter(item => item.platform === "MT4").map(renderPaidProductCard)}
                  </div>
                </div>

                {/* MT5 Products */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    {t('downloads.paidSection.mt5Title')}
                  </h3>
                  <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
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

