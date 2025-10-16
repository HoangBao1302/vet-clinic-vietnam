"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CreditCard, Lock, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const itemId = searchParams.get("item") || "";
  const itemName = searchParams.get("name") || "";
  const itemPrice = parseInt(searchParams.get("price") || "0");
  const paymentMethod = searchParams.get("method") as "stripe" | "paypal" || "stripe";

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
          customerInfo: formData
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
          <Link href="/downloads" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8">
            <ArrowLeft size={20} />
            <span>Quay lại Downloads</span>
          </Link>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-6">
                Thanh toán
              </h1>

              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">
                  Đơn hàng
                </h2>

                <div className="space-y-3 pb-4 border-b border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sản phẩm:</span>
                    <span className="font-semibold text-gray-800">{itemName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Giá:</span>
                    <span className="font-semibold text-gray-800">
                      {itemPrice.toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                </div>

                <div className="pt-4">
                  <div className="flex justify-between text-xl">
                    <span className="font-bold text-gray-800">Tổng cộng:</span>
                    <span className="font-bold text-blue-600">
                      {itemPrice.toLocaleString("vi-VN")}đ
                    </span>
                  </div>
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
                      {paymentMethod === "stripe" ? "Stripe" : "PayPal"}
                    </div>
                    <div className="text-sm text-gray-600">
                      {paymentMethod === "stripe" 
                        ? "Card • Apple Pay • Google Pay" 
                        : "PayPal Balance • Card • Bank"}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <Lock size={16} className="mt-0.5 flex-shrink-0" />
                  <span>
                    Thanh toán được mã hóa SSL. Thông tin của bạn an toàn 100%.
                  </span>
                </div>
              </div>

              {/* What you get */}
              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-green-600 mt-0.5" />
                  <div>
                    <div className="font-semibold text-gray-800">Download ngay</div>
                    <div className="text-sm text-gray-600">Sau khi thanh toán thành công</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-green-600 mt-0.5" />
                  <div>
                    <div className="font-semibold text-gray-800">License trọn đời</div>
                    <div className="text-sm text-gray-600">Sử dụng không giới hạn thời gian</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-green-600 mt-0.5" />
                  <div>
                    <div className="font-semibold text-gray-800">Full support</div>
                    <div className="text-sm text-gray-600">Hỗ trợ cài đặt và sử dụng</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Checkout Form */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Thông tin khách hàng
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nguyễn Văn A"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="email@example.com"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Link download sẽ được gửi qua email này
                  </p>
                  {formData.email.includes('business.example.com') && (
                    <p className="text-xs text-orange-600 mt-1 font-medium">
                      ⚠️ PayPal sandbox có thể không chấp nhận business email. Hãy dùng email cá nhân hoặc thử Stripe.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0765452515"
                  />
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{error}</p>
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
                      <span>Đang xử lý...</span>
                    </>
                  ) : (
                    <>
                      <Lock size={20} />
                      <span>Thanh toán {itemPrice.toLocaleString("vi-VN")}đ</span>
                    </>
                  )}
                </button>

                <p className="text-xs text-center text-gray-500">
                  Bằng cách thanh toán, bạn đồng ý với{" "}
                  <a href="#" className="text-blue-600 hover:underline">Điều khoản dịch vụ</a>
                  {" "}và{" "}
                  <a href="#" className="text-blue-600 hover:underline">Chính sách hoàn tiền</a>
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

