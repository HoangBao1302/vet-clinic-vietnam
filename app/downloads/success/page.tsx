"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle, Download, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useLocale } from "@/lib/i18n/LocaleContext";

function SuccessContent() {
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const [orderInfo, setOrderInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const sessionId = searchParams.get("session_id");
  const paypalToken =
    searchParams.get("token") ||
    searchParams.get("order") ||
    (typeof window !== "undefined" ? localStorage.getItem("paypalOrderId") : null);
  const paypalProductId =
    searchParams.get("productId") ||
    (typeof window !== "undefined" ? localStorage.getItem("paypalProductId") : null);
  const paymentMethod = searchParams.get("payment_method") || (sessionId ? "stripe" : "paypal");

  useEffect(() => {
    const verifyPayment = async () => {
      if (paymentMethod === "crypto") {
        setOrderInfo({
          orderId: searchParams.get("order") || "",
          status: "paid",
          paymentMethod: "crypto",
          productId: searchParams.get("productId") || "",
          emailed: true,
        });
        setLoading(false);
        return;
      }

      if (sessionId && paymentMethod === "stripe") {
        try {
          const res = await fetch(`/api/get-order?session_id=${sessionId}`);
          const data = await res.json();
          setOrderInfo({ ...data, paymentMethod: "stripe" });
        } catch (err) {
          console.error("Stripe verification error:", err);
        }
        setLoading(false);
        return;
      }

      if (paypalToken) {
        try {
          const res = await fetch("/api/paypal/capture-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: paypalToken,
              productId: paypalProductId,
              customerInfo: {
                email: searchParams.get("email") || "",
                name: searchParams.get("name") || "",
                phone: searchParams.get("phone") || "",
              },
            }),
          });
          const data = await res.json();
          setOrderInfo({
            orderId: paypalToken,
            status: data.success ? "paid" : "pending",
            paymentMethod: "paypal",
            productId: data.productId || paypalProductId,
            productName: data.productName,
            emailed: data.emailed,
            error: data.success ? undefined : data.error,
          });
        } catch (error) {
          console.error("PayPal capture error:", error);
          setOrderInfo({
            orderId: paypalToken,
            status: "pending",
            paymentMethod: "paypal",
            error: t("downloads.success.paypalFailed"),
          });
        }
        setLoading(false);
        return;
      }

      setLoading(false);
    };

    verifyPayment();
  }, [sessionId, paypalToken, paypalProductId, paymentMethod, searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-20 pb-20">
          <div className="container-custom max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">{t("downloads.success.verifying")}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20 pb-20">
        <div className="container-custom max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-green-600" size={48} />
            </div>

            {/* Success Message */}
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              {t("downloads.success.title")}
            </h1>
            
            <p className="text-xl text-gray-600 mb-8">
              {t("downloads.success.thanks")}
            </p>

            {/* Order Code */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
              <div className="text-sm text-gray-600 mb-2">{t("downloads.success.orderCode")}</div>
              <div className="bg-white border border-blue-200 rounded-lg p-4 mb-3">
                <div className="text-sm font-mono text-blue-600 break-all leading-relaxed">
                  {orderInfo?.orderId || sessionId || paypalToken || t("downloads.success.processing")}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <p className="text-sm text-gray-500">
                  {t("downloads.success.paymentMethod")} <span className="font-bold text-gray-700">{orderInfo?.paymentMethod === "crypto" ? t("downloads.success.methodCrypto") : orderInfo?.paymentMethod === "stripe" ? t("downloads.success.methodStripe") : t("downloads.success.methodPaypal")}</span>
                </p>
                <p className="text-xs text-gray-400">
                  {t("downloads.success.saveCode")}
                </p>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
              <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Mail className="text-blue-600" size={20} />
                {t("downloads.success.nextSteps")}
              </h2>
              <ol className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                  <span>
                    {orderInfo?.emailed
                      ? t("downloads.success.emailSent")
                      : t("downloads.success.checkEmail")}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                  <span>{t("downloads.success.useCode")}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                  <span>{t("downloads.success.watchGuide")}</span>
                </li>
              </ol>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {orderInfo?.error && (
                <p className="text-sm text-red-600 mb-4">{orderInfo.error}</p>
              )}
              <Link
                href={`/downloads${orderInfo?.orderId ? `?order=${encodeURIComponent(orderInfo.orderId)}${orderInfo?.productId ? `&productId=${encodeURIComponent(orderInfo.productId)}` : ""}` : ""}`}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors"
              >
                <Download size={24} />
                <span>{t("downloads.success.downloadNow")}</span>
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg font-bold text-lg hover:bg-blue-50 transition-colors"
              >
                <ArrowRight size={24} />
                <span>{t("downloads.success.viewGuide")}</span>
              </Link>
            </div>

            {/* Support */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-gray-600 mb-4">
                {t("downloads.success.needHelp")}
              </p>
              <div className="flex flex-wrap gap-4 justify-center text-sm">
                <a href="https://t.me/+0ETUdIuYUzdhZWQ1" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  📱 Telegram Group
                </a>
                <span className="text-gray-300">•</span>
                <a href="mailto:support@thebenchmarktrader.com" className="text-blue-600 hover:underline">
                  📧 Email
                </a>
                <span className="text-gray-300">•</span>
                <a href="tel:+1925 582 0779" className="text-blue-600 hover:underline">
                  📞 Hotline
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function SuccessPage() {
  const { t } = useLocale();
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{t("downloads.success.processing")}</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}

