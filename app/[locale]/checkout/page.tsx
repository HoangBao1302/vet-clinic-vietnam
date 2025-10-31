"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CreditCard, Lock, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useLocale, useTranslations } from 'next-intl';

function CheckoutContent() {
  const locale = useLocale();
  const t = useTranslations('checkout');
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const itemId = searchParams.get("item") || "";
  const itemName = searchParams.get("name") || "";
  const itemPrice = parseInt(searchParams.get("price") || "0");
  const paymentMethod = searchParams.get("method") as "stripe" | "paypal" || "stripe";
  const affiliateCode = searchParams.get("affiliate") || "";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Get enhanced tracking data from localStorage
      const affiliateSession = localStorage.getItem('affiliate_session');
      let enhancedTrackingData = {};
      
      if (affiliateSession) {
        try {
          const sessionData = JSON.parse(affiliateSession);
          enhancedTrackingData = {
            sessionId: sessionData.sessionId,
            ipAddress: '', // Will be set by server
            fingerprint: '', // Will be set by server
            trackingMethod: 'enhanced',
            timestamp: sessionData.timestamp
          };
          console.log('✅ Using enhanced tracking data:', sessionData);
        } catch (error) {
          console.log('⚠️ Could not parse affiliate session data');
        }
      }

      // Create order and get payment URL
      const response = await fetch("/api/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: itemId,
          productName: itemName,
          amount: itemPrice,
          method: paymentMethod,
          customerInfo: {
            ...formData,
            ...enhancedTrackingData
          },
          affiliateCode: affiliateCode // Add affiliate tracking
        }),
      });

      const result = await response.json();

      if (result.success && result.paymentUrl) {
        // For PayPal, store orderId in localStorage for success page
        if (paymentMethod === "paypal" && result.orderId) {
          localStorage.setItem("paypalOrderId", result.orderId);
        }
        
        // Redirect to payment gateway
        window.location.href = result.paymentUrl;
      } else {
        setError(result.error || "Không thể tạo thanh toán. Vui lòng thử lại.");
        setLoading(false);
      }
    } catch (err) {
      setError("Lỗi kết nối. Vui lòng thử lại sau.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20 pb-20">
        <div className="container-custom max-w-4xl mx-auto">
          {/* Back button */}
          <Link href={`/${locale}/downloads`} className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8">
            <ArrowLeft size={20} />
            <span>{t('backToDownloads')}</span>
          </Link>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-6">
                {t('title')}
              </h1>

              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">
                  {t('order')}
                </h2>

                <div className="space-y-3 pb-4 border-b border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('product')}</span>
                    <span className="font-semibold text-gray-800">{itemName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('price')}</span>
                    <span className="font-semibold text-gray-800">
                      {itemPrice.toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                </div>

                <div className="pt-4">
                  <div className="flex justify-between text-xl">
                    <span className="font-bold text-gray-800">{t('total')}</span>
                    <span className="font-bold text-blue-600">
                      {itemPrice.toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                  {paymentMethod === "paypal" && (
                    <div className="text-sm text-gray-600 mt-1 text-right">
                      {t('usdApprox', { amount: (itemPrice / 24000).toFixed(2) })}
                      <span className="text-orange-600 ml-1">{t('sandbox')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-blue-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    {paymentMethod === "stripe" ? (
                      <CreditCard className="text-blue-600" size={24} />
                    ) : (
                      <CreditCard className="text-yellow-600" size={24} />
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">
                      {paymentMethod === "stripe" ? t('paymentMethod.stripe') : t('paymentMethod.paypal')}
                    </div>
                    <div className="text-sm text-gray-600">
                      {paymentMethod === "stripe" 
                        ? t('paymentMethod.stripeMethods')
                        : t('paymentMethod.paypalMethods')}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <Lock size={16} className="mt-0.5 flex-shrink-0" />
                  <span>
                    {t('paymentMethod.secure')}
                  </span>
                </div>
              </div>

              {/* What you get */}
              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-green-600 mt-0.5" />
                  <div>
                    <div className="font-semibold text-gray-800">{t('benefits.downloadNow.title')}</div>
                    <div className="text-sm text-gray-600">{t('benefits.downloadNow.description')}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-green-600 mt-0.5" />
                  <div>
                    <div className="font-semibold text-gray-800">{t('benefits.lifetimeLicense.title')}</div>
                    <div className="text-sm text-gray-600">{t('benefits.lifetimeLicense.description')}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-green-600 mt-0.5" />
                  <div>
                    <div className="font-semibold text-gray-800">{t('benefits.fullSupport.title')}</div>
                    <div className="text-sm text-gray-600">{t('benefits.fullSupport.description')}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Checkout Form */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                {t('customerInfo.title')}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('customerInfo.name')}
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t('customerInfo.namePlaceholder')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('customerInfo.email')}
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t('customerInfo.emailPlaceholder')}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {t('customerInfo.emailHint')}
                  </p>
                  {formData.email.includes('business.example.com') && (
                    <p className="text-xs text-orange-600 mt-1 font-medium">
                      {t('customerInfo.emailWarning')}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('customerInfo.phone')}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t('customerInfo.phonePlaceholder')}
                  />
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{error || t('error')}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-blue-600 text-white rounded-lg font-bold text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>{t('customerInfo.processing')}</span>
                    </>
                  ) : (
                    <>
                      <Lock size={20} />
                      <span>{t('customerInfo.submit', { amount: itemPrice.toLocaleString("vi-VN") + 'đ' })}</span>
                    </>
                  )}
                </button>

                <p className="text-xs text-center text-gray-500">
                  {t('customerInfo.terms')}{" "}
                  <a href="#" className="text-blue-600 hover:underline">{t('customerInfo.termsLink')}</a>
                  {" "}{t('customerInfo.and')}{" "}
                  <a href="#" className="text-blue-600 hover:underline">{t('customerInfo.refundLink')}</a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}

