"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Building2, CheckCircle, ArrowLeft, Upload, AlertCircle, Clock, Image } from "lucide-react";
import Link from "next/link";

function BankTransferContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  
  const itemId = searchParams.get("item") || "";
  const itemName = searchParams.get("name") || "";
  const itemPrice = parseInt(searchParams.get("price") || "0");
  const affiliateCode = searchParams.get("affiliate") || "";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    broker: "",
    accountId: "",
    server: "",
  });

  const [transferProof, setTransferProof] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError("Vui lòng chọn file ảnh (JPG, PNG, GIF)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File ảnh không được vượt quá 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setTransferProof(base64String);
      setImagePreview(base64String);
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!transferProof) {
      setError("Vui lòng upload ảnh chứng từ chuyển khoản");
      setLoading(false);
      return;
    }

    try {
      // Get enhanced tracking data from localStorage
      const affiliateSession = localStorage.getItem('affiliate_session');
      let enhancedTrackingData = {};
      
      if (affiliateSession) {
        try {
          const sessionData = JSON.parse(affiliateSession);
          enhancedTrackingData = {
            sessionId: sessionData.sessionId,
            ipAddress: '',
            fingerprint: '',
            trackingMethod: 'enhanced',
            timestamp: sessionData.timestamp
          };
        } catch (error) {
          console.log('Could not parse affiliate session data');
        }
      }

      // Create bank transfer order
      const response = await fetch("/api/bank-transfer/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: itemId,
          productName: itemName,
          amount: itemPrice,
          customerInfo: {
            ...formData,
            ...enhancedTrackingData
          },
          affiliateCode: affiliateCode,
          transferProof: transferProof
        }),
      });

      const result = await response.json();

      if (result.success && result.orderId) {
        setSuccess(true);
        setOrderId(result.orderId);
        setTransferProof("");
        setImagePreview("");
      } else {
        setError(result.error || "Không thể tạo đơn hàng. Vui lòng thử lại.");
        setLoading(false);
      }
    } catch (err) {
      setError("Lỗi kết nối. Vui lòng thử lại sau.");
      setLoading(false);
    }
  };

  // Bank account information
  const bankInfo = {
    bankName: "Vietcombank",
    accountNumber: "10200123456789",
    accountHolder: "NGUYEN VAN A",
    branch: "Chi nhánh TP.HCM"
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

          {success ? (
            /* Success Screen */
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                  <CheckCircle className="text-green-600" size={40} />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                  ✅ Đơn hàng đã được tạo thành công!
                </h1>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                  <p className="text-lg text-gray-800 mb-2">
                    Mã đơn hàng của bạn:
                  </p>
                  <p className="text-2xl font-bold text-blue-600 font-mono">
                    {orderId}
                  </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
                  <div className="flex items-start gap-3">
                    <Clock className="text-yellow-600 mt-0.5" size={24} />
                    <div className="text-left">
                      <p className="font-semibold text-gray-800 mb-2">
                        ⏳ Đang chờ xác nhận
                      </p>
                      <p className="text-sm text-gray-600">
                        Đơn hàng của bạn đang được xem xét. Chúng tôi sẽ xác nhận trong vòng 1-2 giờ làm việc.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-left bg-gray-50 rounded-lg p-6 mb-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={20} className="text-green-600" />
                    <span className="text-gray-700">Email xác nhận đã được gửi đến {formData.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={20} className="text-green-600" />
                    <span className="text-gray-700">Bạn sẽ nhận được email khi đơn hàng được duyệt</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={20} className="text-green-600" />
                    <span className="text-gray-700">Sử dụng mã đơn hàng để download sau khi được duyệt</span>
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <Link href="/downloads" className="btn-secondary">
                    Quay lại trang Downloads
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            /* Checkout Form */
            <>
              {/* Order Summary */}
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                  Thanh toán chuyển khoản ngân hàng
                </h1>

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
                    <span className="font-bold text-green-600">
                      {itemPrice.toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                </div>
              </div>

              {/* Bank Account Information */}
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl shadow-lg p-8 mb-6 border-2 border-green-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-green-600 rounded-lg">
                    <Building2 className="text-white" size={32} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Thông tin chuyển khoản
                    </h2>
                    <p className="text-sm text-gray-600">Vui lòng chuyển khoản đúng số tiền vào tài khoản sau</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ngân hàng
                      </label>
                      <p className="text-lg font-semibold text-gray-900">{bankInfo.bankName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Chi nhánh
                      </label>
                      <p className="text-lg font-semibold text-gray-900">{bankInfo.branch}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Số tài khoản
                      </label>
                      <div className="flex items-center gap-2">
                        <p className="text-lg font-bold text-blue-600 font-mono">{bankInfo.accountNumber}</p>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(bankInfo.accountNumber);
                            alert('Đã sao chép số tài khoản!');
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          📋
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Chủ tài khoản
                      </label>
                      <p className="text-lg font-semibold text-gray-900">{bankInfo.accountHolder}</p>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="text-yellow-600 mt-0.5" size={20} />
                      <div>
                        <p className="font-semibold text-yellow-800 mb-1">Lưu ý quan trọng</p>
                        <p className="text-sm text-yellow-700">
                          Vui lòng chuyển khoản <strong>chính xác {itemPrice.toLocaleString("vi-VN")}đ</strong> và 
                          ghi nội dung: <strong>{itemId}</strong>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Form */}
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
                      Link download sẽ được gửi qua email này sau khi duyệt
                    </p>
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

                  {/* Broker Information */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-blue-800 mb-3">
                      📊 Thông tin Broker
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Broker
                        </label>
                        <input
                          type="text"
                          name="broker"
                          value={formData.broker}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Ví dụ: Tickmill"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Account ID
                        </label>
                        <input
                          type="text"
                          name="accountId"
                          value={formData.accountId}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Ví dụ: 123456"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Server
                        </label>
                        <input
                          type="text"
                          name="server"
                          value={formData.server}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Ví dụ: Tickmill-Live8"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-blue-700 mt-2">
                      💡 Vui lòng điền thông tin broker để chúng tôi hỗ trợ tốt hơn
                    </p>
                  </div>

                  {/* Upload Transfer Proof */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <label className="block text-sm font-semibold text-gray-800 mb-3">
                      <Upload className="inline mr-2" size={18} />
                      Upload ảnh chứng từ chuyển khoản *
                    </label>
                    
                    {!imagePreview ? (
                      <div className="space-y-3">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        <p className="text-xs text-gray-500">
                          Chọn file ảnh chứng từ chuyển khoản (JPG, PNG, GIF - tối đa 5MB)
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="relative inline-block">
                          <img
                            src={imagePreview}
                            alt="Transfer proof preview"
                            className="max-w-full h-64 object-contain border border-gray-300 rounded-lg"
                          />
                        </div>
                        <div className="flex gap-2">
                          <label className="flex-1 cursor-pointer">
                            <span className="inline-flex items-center justify-center w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors">
                              <Image size={18} className="mr-2" />
                              Thay đổi ảnh
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    )}
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || !transferProof}
                    className="w-full py-4 bg-green-600 text-white rounded-lg font-bold text-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Đang xử lý...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle size={20} />
                        <span>Xác nhận đã chuyển khoản</span>
                      </>
                    )}
                  </button>

                  <p className="text-xs text-center text-gray-500">
                    Bằng cách xác nhận, bạn đảm bảo đã chuyển khoản đúng số tiền và upload ảnh chứng từ thật
                  </p>
                </form>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function BankTransferCheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    }>
      <BankTransferContent />
    </Suspense>
  );
}

