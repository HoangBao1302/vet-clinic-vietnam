"use client";

import { useState } from "react";
import { Phone, Mail, Clock, MessageCircle, Send, AlertCircle } from "lucide-react";
import HoneypotField from "@/components/HoneypotField";

// Client-side email validation (simplified version)
function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email) && email.length <= 254 && !email.includes('..');
}

export default function ForexContact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    topic: "demo", // demo, purchase, support, custom
    message: "",
  });
  const [honeypot, setHoneypot] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Validate email in real-time
    if (name === 'email') {
      if (value && !isValidEmail(value.trim())) {
        setEmailError('Email không đúng định dạng');
      } else {
        setEmailError('');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Honeypot check
    if (honeypot && honeypot.trim() !== '') {
      console.warn('Bot detected via honeypot');
      return; // Silent fail
    }
    
    // Email validation
    const trimmedEmail = formData.email.trim();
    if (!isValidEmail(trimmedEmail)) {
      setEmailError('Email không đúng định dạng. Vui lòng nhập email hợp lệ.');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitMessage("");
    setEmailError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          honeypot: honeypot,
        }),
      });

      const result = await response.json();

      if (result.ok) {
        setSubmitMessage("Cảm ơn bạn! Chúng tôi sẽ liên hệ với bạn trong vòng 24 giờ.");
        setFormData({ name: "", email: "", topic: "demo", message: "" });
        setHoneypot("");
      } else {
        const errorMsg = result.error || "Xin lỗi, đã xảy ra lỗi. Vui lòng thử lại hoặc liên hệ trực tiếp qua email.";
        setSubmitMessage(errorMsg);
        // If email validation error, highlight email field
        if (errorMsg.toLowerCase().includes('email')) {
          setEmailError(errorMsg);
        }
      }
    } catch {
      setSubmitMessage("Xin lỗi, đã xảy ra lỗi. Vui lòng thử lại hoặc liên hệ trực tiếp qua email.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Liên hệ & Hỗ trợ
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Cần hỗ trợ về EA ThebenchmarkTrader? Chúng tôi luôn sẵn sàng giúp đỡ bạn
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Contact Form */}
          <div className="order-2 lg:order-1">
            <div className="bg-gray-50 p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Gửi tin nhắn cho chúng tôi</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và Tên *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Nhập họ và tên của bạn"
                    suppressHydrationWarning={true}
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      emailError ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Nhập địa chỉ email của bạn"
                    suppressHydrationWarning={true}
                  />
                  {emailError && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {emailError}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
                    Nhu cầu *
                  </label>
                  <select
                    id="topic"
                    name="topic"
                    required
                    value={formData.topic}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    suppressHydrationWarning={true}
                  >
                    <option value="demo">Tải Demo miễn phí</option>
                    <option value="purchase">Mua EA đầy đủ</option>
                    <option value="support">Hỗ trợ kỹ thuật</option>
                    <option value="custom">Tùy chỉnh EA</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Tin nhắn
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Mô tả chi tiết nhu cầu của bạn..."
                    suppressHydrationWarning={true}
                  />
                </div>

                {/* Honeypot Field - Hidden from users, visible to bots */}
                <HoneypotField 
                  value={honeypot}
                  onChange={setHoneypot}
                  name="website"
                />
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  suppressHydrationWarning={true}
                >
                  <Send size={18} />
                  <span>{isSubmitting ? "Đang gửi..." : "Gửi tin nhắn"}</span>
                </button>
              </form>
              
              {submitMessage && (
                <div className={`mt-4 p-4 rounded-lg text-sm ${
                  submitMessage.includes("Cảm ơn") 
                    ? "bg-green-100 text-green-700" 
                    : "bg-red-100 text-red-700"
                }`}>
                  {submitMessage}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Contact Info */}
          <div className="order-1 lg:order-2 space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Thông tin liên hệ</h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary-100 p-3 rounded-lg">
                    <Phone className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Hotline hỗ trợ</h4>
                    <p className="text-gray-600">+84 765 452 515</p>
                    <p className="text-sm text-gray-500">Thứ 2 - Thứ 6: 9:00 - 18:00</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-primary-100 p-3 rounded-lg">
                    <Mail className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Email hỗ trợ</h4>
                    <p className="text-gray-600">support@thebenchmarktrader.com</p>
                    <p className="text-sm text-gray-500">Phản hồi trong vòng 24 giờ</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-primary-100 p-3 rounded-lg">
                    <MessageCircle className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Telegram</h4>
                    <p className="text-gray-600">Telegram Group Support</p>
                    <a href="https://t.me/+0ETUdIuYUzdhZWQ1" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">Join Group</a>
                    <p className="text-sm text-gray-500">Chat trực tiếp với team hỗ trợ</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-primary-100 p-3 rounded-lg">
                    <Clock className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Giờ hỗ trợ</h4>
                    <div className="text-gray-600 space-y-1">
                      <p>Thứ Hai - Thứ Sáu: 9:00 - 18:00</p>
                      <p>Thứ Bảy: 9:00 - 12:00</p>
                      <p className="text-sm text-primary-600 font-medium">
                        Hỗ trợ khẩn cấp qua Telegram 24/7
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-8">
              <h4 className="font-semibold text-gray-800 mb-4">Cam kết hỗ trợ</h4>
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-700">
                    <strong>📞 Hỗ trợ cài đặt:</strong> Miễn phí hướng dẫn cài đặt EA qua TeamViewer
                  </p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-700">
                    <strong>🔧 Tùy chỉnh tham số:</strong> Hỗ trợ tối ưu tham số theo tài khoản
                  </p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="text-purple-700">
                    <strong>📈 Báo cáo hiệu suất:</strong> Gửi báo cáo backtest chi tiết theo yêu cầu
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


