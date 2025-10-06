"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      setError("Vui lòng nhập email hợp lệ");
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Có lỗi xảy ra");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="py-20">
        <div className="container-custom max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Quên Mật Khẩu?
              </h1>
              <p className="text-gray-600">
                Nhập email để nhận link đặt lại mật khẩu
              </p>
            </div>

            {!success ? (
              <>
                {/* Error Message */}
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-red-800">{error}</div>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email đã đăng ký
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setError("");
                        }}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Đang gửi..." : "Gửi Link Đặt Lại"}
                  </button>
                </form>

                {/* Back to Login */}
                <div className="mt-6 text-center">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium"
                  >
                    <ArrowLeft size={16} />
                    Quay lại đăng nhập
                  </Link>
                </div>
              </>
            ) : (
              <>
                {/* Success Message */}
                <div className="mb-6 p-6 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-3 mb-4">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-lg font-semibold text-green-800 mb-1">
                        Email đã được gửi!
                      </h3>
                      <p className="text-sm text-green-700">
                        Chúng tôi đã gửi link đặt lại mật khẩu đến email:
                      </p>
                      <p className="text-sm font-semibold text-green-800 mt-1">
                        {email}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 space-y-2 text-sm text-gray-700">
                    <p className="font-medium">📧 Hướng dẫn:</p>
                    <ol className="list-decimal list-inside space-y-1 ml-2">
                      <li>Kiểm tra hộp thư đến (inbox)</li>
                      <li>Nếu không thấy, kiểm tra spam/junk</li>
                      <li>Click vào link trong email (có hiệu lực 1 giờ)</li>
                      <li>Nhập mật khẩu mới</li>
                    </ol>
                  </div>
                </div>

                {/* Resend */}
                <div className="text-center mb-6">
                  <p className="text-sm text-gray-600 mb-2">Không nhận được email?</p>
                  <button
                    onClick={() => {
                      setSuccess(false);
                      setEmail("");
                    }}
                    className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                  >
                    Gửi lại
                  </button>
                </div>

                {/* Back to Login */}
                <div className="text-center">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium text-sm"
                  >
                    <ArrowLeft size={16} />
                    Quay lại đăng nhập
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Help Text */}
          {!success && (
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>Cần hỗ trợ? Liên hệ: support@thebenchmarktrader.com</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

