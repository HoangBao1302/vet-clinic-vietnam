"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function TestEmailPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/test-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: email,
          message: message,
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: "Network error: " + error,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20">
        <div className="container-custom py-20">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                🧪 Test Email System
              </h1>
              
              <form onSubmit={handleTestEmail} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email nhận test:
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your-email@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tin nhắn tùy chỉnh (tùy chọn):
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Nhập tin nhắn tùy chỉnh..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? "Đang gửi..." : "Gửi Test Email"}
                </button>
              </form>
              
              {result && (
                <div className={`mt-8 p-6 rounded-lg ${
                  result.success 
                    ? "bg-green-50 border border-green-200" 
                    : "bg-red-50 border border-red-200"
                }`}>
                  <h3 className={`text-lg font-semibold mb-4 ${
                    result.success ? "text-green-800" : "text-red-800"
                  }`}>
                    {result.success ? "✅ Thành công!" : "❌ Lỗi!"}
                  </h3>
                  
                  <div className="space-y-2">
                    <p className={`text-sm ${
                      result.success ? "text-green-700" : "text-red-700"
                    }`}>
                      {result.success ? result.message : result.error}
                    </p>
                    
                    {result.messageId && (
                      <p className="text-xs text-gray-600">
                        Message ID: {result.messageId}
                      </p>
                    )}
                    
                    {result.debug && (
                      <div className="mt-4 p-4 bg-gray-100 rounded">
                        <h4 className="font-semibold text-gray-800 mb-2">Debug Info:</h4>
                        <ul className="text-xs text-gray-600 space-y-1">
                          <li>SMTP User: {result.debug.smtpUser}</li>
                          <li>SMTP Host: {result.debug.smtpHost}</li>
                          <li>SMTP Port: {result.debug.smtpPort}</li>
                          <li>SMTP Pass Length: {result.debug.smtpPassLength}</li>
                          <li>SMTP From: {result.debug.smtpFrom}</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                  🔧 Hướng dẫn sửa lỗi:
                </h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>1. Kiểm tra SMTP_PASS trong .env.local</li>
                  <li>2. Đảm bảo sử dụng Gmail App Password (không phải password thường)</li>
                  <li>3. Kiểm tra 2FA đã bật trên Gmail</li>
                  <li>4. Kiểm tra firewall/antivirus có chặn port 587 không</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
