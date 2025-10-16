"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle, Download, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";

function SuccessContent() {
  const searchParams = useSearchParams();
  const [orderInfo, setOrderInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const sessionId = searchParams.get("session_id");
  const orderId = searchParams.get("order") || searchParams.get("token") || searchParams.get("PayerID");
  const paymentMethod = searchParams.get("payment_method") || "stripe";

  useEffect(() => {
    const verifyPayment = async () => {
      // Debug: log all search params
      const allParams: { [key: string]: string | null } = {};
      searchParams.forEach((value, key) => {
        allParams[key] = value;
      });
      console.log("All search params:", allParams);
      console.log("Payment verification:", { sessionId, orderId, paymentMethod });
      
      if (sessionId && paymentMethod === "stripe") {
        // Fetch order info from Stripe session
        try {
          const res = await fetch(`/api/get-order?session_id=${sessionId}`);
          const data = await res.json();
          setOrderInfo({ ...data, paymentMethod: "stripe" });
        } catch (err) {
          console.error("Stripe verification error:", err);
        }
      } else if (orderId) {
        // For PayPal, save order and send email
        console.log("PayPal order approved:", orderId);
        
        // Get customer info from localStorage or URL params
        const customerEmail = searchParams.get("email") || "hoangkim.helen@gmail.com";
        const customerName = searchParams.get("name") || "Hoang Kim";
        const customerPhone = searchParams.get("phone") || "0900000000";
        
        // Save order to database
        try {
          const saveResponse = await fetch("/api/save-order", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              orderId: orderId,
              productId: "ea-full", // Default product ID
              productName: "EA ThebenchmarkTrader Full Version",
              amount: 7900000, // Default amount
              customerInfo: {
                email: customerEmail,
                name: customerName,
                phone: customerPhone
              },
              paymentMethod: "paypal",
            }),
          });
          
          if (saveResponse.ok) {
            console.log("Order saved successfully");
            
            // Send email notification
            try {
              const emailResponse = await fetch("/api/send-order-email", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  orderId: orderId,
                  customerEmail: customerEmail,
                  customerName: customerName,
                  productName: "EA ThebenchmarkTrader Full Version",
                  amount: 7900000,
                  paymentMethod: "paypal"
                }),
              });
              
              if (emailResponse.ok) {
                console.log("Email sent successfully");
              }
            } catch (emailError) {
              console.error("Error sending email:", emailError);
            }
          }
        } catch (saveError) {
          console.error("Error saving order:", saveError);
        }
        
        setOrderInfo({
          orderId: orderId,
          status: "paid",
          paymentMethod: "paypal",
        });
      } else if (sessionId || orderId) {
        // Fallback for direct order ID
        setOrderInfo({
          orderId: orderId || sessionId,
          status: "paid",
          paymentMethod: paymentMethod,
        });
      }
      setLoading(false);
    };

    verifyPayment();
  }, [sessionId, orderId, paymentMethod, searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-20 pb-20">
          <div className="container-custom max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Đang xác minh thanh toán...</p>
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
              Thanh toán thành công! 🎉
            </h1>
            
            <p className="text-xl text-gray-600 mb-8">
              Cảm ơn bạn đã mua hàng. Mã đơn hàng của bạn là:
            </p>

            {/* Order Code */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
              <div className="text-sm text-gray-600 mb-2">Mã đơn hàng:</div>
              <div className="bg-white border border-blue-200 rounded-lg p-4 mb-3">
                <div className="text-sm font-mono text-blue-600 break-all leading-relaxed">
                  {orderInfo?.orderId || sessionId || orderId || "Loading..."}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <p className="text-sm text-gray-500">
                  Phương thức: <span className="font-bold text-gray-700">{orderInfo?.paymentMethod === "stripe" ? "Stripe" : "PayPal"}</span>
                </p>
                <p className="text-xs text-gray-400">
                  Lưu mã này để tải lại sau
                </p>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
              <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Mail className="text-blue-600" size={20} />
                Bước tiếp theo:
              </h2>
              <ol className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                  <span>Kiểm tra email để nhận link download trực tiếp</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                  <span>Hoặc sử dụng mã đơn hàng ở trên tại trang Downloads</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                  <span>Xem video hướng dẫn cài đặt trước khi sử dụng</span>
                </li>
              </ol>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/downloads"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors"
              >
                <Download size={24} />
                <span>Tải xuống ngay</span>
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg font-bold text-lg hover:bg-blue-50 transition-colors"
              >
                <ArrowRight size={24} />
                <span>Xem hướng dẫn cài đặt</span>
              </Link>
            </div>

            {/* Support */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-gray-600 mb-4">
                Cần hỗ trợ cài đặt? Team support sẵn sàng giúp đỡ:
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
                <a href="tel:+84765452515" className="text-blue-600 hover:underline">
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
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang xử lý...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}

