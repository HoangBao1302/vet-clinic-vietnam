"use client";

import { useState } from "react";
import { useAuth } from "@/lib/authContext";
import { Mail, Send, CheckCircle, Star, TrendingUp, Users } from "lucide-react";

interface NewsletterProps {
  variant?: 'hero' | 'sidebar' | 'footer';
}

export default function Newsletter({ variant = 'hero' }: NewsletterProps) {
  const { user, isAuthenticated } = useAuth();
  const [email, setEmail] = useState(user?.email || "");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubscribed(true);
        setMessage("Đăng ký newsletter thành công! 🎉");
      } else {
        setMessage(data.message || "Có lỗi xảy ra, vui lòng thử lại.");
      }
    } catch (error) {
      setMessage("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (variant === 'hero') {
    return (
      <section className="py-16 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Mail className="w-8 h-8 text-yellow-300" />
              <h2 className="text-3xl md:text-4xl font-bold">
                Newsletter Premium
              </h2>
              <Star className="w-8 h-8 text-yellow-300" />
            </div>
            
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Nhận phân tích thị trường độc quyền, tín hiệu trading và cập nhật EA mới nhất mỗi tuần
            </p>

            {/* Benefits */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <TrendingUp className="w-12 h-12 text-yellow-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Market Analysis</h3>
                <p className="text-blue-100 text-sm">
                  Phân tích xu hướng thị trường hàng tuần từ các chuyên gia
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <Star className="w-12 h-12 text-yellow-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Trading Signals</h3>
                <p className="text-blue-100 text-sm">
                  Tín hiệu entry/exit chất lượng cao cho các cặp tiền chính
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <Users className="w-12 h-12 text-yellow-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Community Access</h3>
                <p className="text-blue-100 text-sm">
                  Tham gia group VIP và nhận hỗ trợ 24/7 từ team
                </p>
              </div>
            </div>

            {!isSubscribed ? (
              <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
                <div className="flex gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Nhập email của bạn"
                    className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                    required
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-xl font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send size={18} />
                        Đăng ký
                      </>
                    )}
                  </button>
                </div>
                {message && (
                  <p className={`mt-3 text-sm ${message.includes('thành công') ? 'text-green-300' : 'text-red-300'}`}>
                    {message}
                  </p>
                )}
              </form>
            ) : (
              <div className="bg-green-500/20 border border-green-400/30 rounded-xl p-6 max-w-md mx-auto">
                <CheckCircle className="w-12 h-12 text-green-300 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-green-300 mb-2">
                  Đăng ký thành công!
                </h3>
                <p className="text-green-100">
                  Bạn sẽ nhận được newsletter premium vào email {email}
                </p>
              </div>
            )}

            <p className="text-blue-200 text-sm mt-6">
              Chỉ dành cho thành viên premium • Hủy đăng ký bất kỳ lúc nào
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (variant === 'sidebar') {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center gap-2 mb-4">
          <Mail className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-800">Newsletter Premium</h3>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          Nhận phân tích thị trường và tín hiệu trading hàng tuần
        </p>

        {!isSubscribed ? (
          <form onSubmit={handleSubscribe}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email của bạn"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send size={14} />
                  Đăng ký
                </>
              )}
            </button>
            {message && (
              <p className={`mt-2 text-xs ${message.includes('thành công') ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </p>
            )}
          </form>
        ) : (
          <div className="text-center">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-sm text-green-600 font-medium">
              Đã đăng ký thành công!
            </p>
          </div>
        )}
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className="text-center">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center justify-center gap-2">
          <Mail size={20} />
          Newsletter Premium
        </h3>
        <p className="text-blue-200 text-sm mb-4">
          Nhận phân tích thị trường độc quyền mỗi tuần
        </p>
        
        {!isSubscribed ? (
          <form onSubmit={handleSubscribe} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email của bạn"
              className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-300 text-sm"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send size={16} />
              )}
            </button>
          </form>
        ) : (
          <div className="text-green-300 text-sm">
            <CheckCircle className="w-5 h-5 inline mr-1" />
            Đã đăng ký thành công!
          </div>
        )}
        
        {message && (
          <p className={`mt-2 text-xs ${message.includes('thành công') ? 'text-green-300' : 'text-red-300'}`}>
            {message}
          </p>
        )}
      </div>
    );
  }

  return null;
}
