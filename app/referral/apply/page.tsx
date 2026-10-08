"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { UserPlus, Mail, Phone, Building, MessageSquare, AlertCircle, CheckCircle, Loader } from "lucide-react";

export default function AffiliateApplyPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    company: "",
    website: "",
    experience: "",
    audience: "",
    promochannel: "",
    reason: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Only check authentication once when component mounts
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      console.log('Affiliate apply auth check:', { 
        hasToken: !!token, 
        hasUser: !!userData, 
        isAuthenticated,
        contextReady: typeof isAuthenticated !== 'undefined'
      });
      
      // If we have auth data in localStorage, wait for context to initialize
      if (token && userData && !isAuthenticated) {
        console.log('Auth data exists, waiting for context...');
        return; // Don't redirect, let context handle it
      }
      
      // Only redirect if we have NO auth data AND context is ready and says not authenticated
      if (!token && !userData && isAuthenticated === false) {
        console.log('No auth data found and context confirmed not authenticated, redirecting to login');
        router.push('/login?redirect=/referral/apply');
        return;
      }
      
      // If authenticated, check affiliate status
      if (isAuthenticated && user) {
        if (user.affiliateStatus && user.affiliateStatus !== 'none') {
          console.log('User already applied for affiliate:', user.affiliateStatus);
          setChecking(false);
          return;
        }
        console.log('User can apply for affiliate');
        setChecking(false);
      }
    };
    
    // Check after a delay to allow context to fully initialize
    const timeoutId = setTimeout(checkAuth, 1000);
    
    return () => clearTimeout(timeoutId);
  }, [isAuthenticated, user, router]); // Only run when these values change

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.phone || !formData.reason) {
      setError("Vui lòng điền đầy đủ các trường bắt buộc");
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem('token');
      const response = await fetch("/api/affiliate/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Đăng ký thất bại");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Show loading if not authenticated yet, but only if we have auth data
  const hasAuthData = typeof window !== 'undefined' && (localStorage.getItem('token') || localStorage.getItem('user'));
  
  // Debug info (remove in production)
  if (process.env.NODE_ENV === 'development') {
    console.log('Affiliate Apply Debug:', {
      isAuthenticated,
      hasUser: !!user,
      userAffiliateStatus: user?.affiliateStatus,
      checking,
      hasAuthData,
      token: typeof window !== 'undefined' ? localStorage.getItem('token')?.substring(0, 10) + '...' : 'N/A'
    });
  }
  
  // If we have auth data but context is not ready, show loading
  if (!isAuthenticated && hasAuthData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="py-20">
          <div className="container-custom text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang kiểm tra quyền truy cập...</p>
            <p className="text-xs text-gray-500 mt-2">Nếu chờ quá lâu, hãy refresh trang</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // If no auth data and context confirmed not authenticated, show redirect message
  if (!isAuthenticated && !hasAuthData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="py-20">
          <div className="container-custom text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang chuyển hướng đến trang đăng nhập...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // If already applied
  if (user?.affiliateStatus === 'pending') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="py-20">
          <div className="container-custom max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader className="w-8 h-8 text-yellow-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                Đơn Đang Chờ Duyệt
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Đơn đăng ký affiliate của bạn đang được xem xét. Chúng tôi sẽ phản hồi trong vòng 1-2 ngày làm việc.
              </p>
              <button
                onClick={() => router.push('/')}
                className="btn-primary"
              >
                Quay về trang chủ
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (user?.affiliateStatus === 'approved') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="py-20">
          <div className="container-custom max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                Bạn Đã Là Affiliate!
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Chúc mừng! Bạn đã là thành viên affiliate của chúng tôi.
              </p>
              <button
                onClick={() => router.push('/affiliate/dashboard')}
                className="btn-primary"
              >
                Xem Dashboard
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (user?.affiliateStatus === 'rejected') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="py-20">
          <div className="container-custom max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                Đơn Không Được Chấp Nhận
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Rất tiếc, đơn đăng ký affiliate của bạn không được chấp nhận lúc này. Bạn có thể nộp đơn mới sau 30 ngày.
              </p>
              <button
                onClick={() => router.push('/')}
                className="btn-secondary"
              >
                Quay về trang chủ
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="py-20">
          <div className="container-custom max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                Đăng Ký Thành Công!
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Cảm ơn bạn đã đăng ký. Chúng tôi sẽ xem xét đơn và phản hồi trong vòng 1-2 ngày làm việc.
              </p>
              <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
                <p className="text-sm font-semibold text-gray-800 mb-2">📧 Bước tiếp theo:</p>
                <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                  <li>Kiểm tra email để nhận thông báo</li>
                  <li>Chuẩn bị tài liệu (nếu cần)</li>
                  <li>Chờ admin liên hệ</li>
                </ol>
              </div>
              <button
                onClick={() => router.push('/')}
                className="btn-primary"
              >
                Quay về trang chủ
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="py-20">
        <div className="container-custom max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
                Đăng Ký Affiliate
              </h1>
              <p className="text-lg text-gray-600">
                Điền form dưới đây để trở thành đối tác affiliate
              </p>
            </div>

            {/* Commission Info */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 mb-8 text-white">
              <h3 className="text-xl font-bold mb-3">💰 Cơ Hội Kiếm Tiền</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="text-3xl font-bold">30%</div>
                  <div className="text-sm opacity-90">Bán EA</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">25%</div>
                  <div className="text-sm opacity-90">Khóa Học</div>
                </div>
              </div>
              <p className="text-sm opacity-90 mt-4">
                * Paid members nhận thêm 5% commission
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-800">{error}</div>
              </div>
            )}

            {/* Application Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nguyễn Văn A"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0765452515"
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Công ty/Tổ chức (nếu có)
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="ABC Company"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website/Blog/Social
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kinh nghiệm Forex/Trading
                </label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Chọn mức độ</option>
                  <option value="beginner">Mới bắt đầu (&lt; 1 năm)</option>
                  <option value="intermediate">Trung cấp (1-3 năm)</option>
                  <option value="advanced">Nâng cao (3-5 năm)</option>
                  <option value="expert">Chuyên gia (&gt; 5 năm)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Đối tượng khách hàng mục tiêu
                </label>
                <input
                  type="text"
                  name="audience"
                  value={formData.audience}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="VD: Trader mới, nhà đầu tư chứng khoán..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kênh quảng bá chủ yếu
                </label>
                <select
                  name="promochannel"
                  value={formData.promochannel}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Chọn kênh</option>
                  <option value="facebook">Facebook</option>
                  <option value="youtube">YouTube</option>
                  <option value="telegram">Telegram</option>
                  <option value="website">Website/Blog</option>
                  <option value="tiktok">TikTok</option>
                  <option value="instagram">Instagram</option>
                  <option value="other">Khác</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lý do muốn trở thành affiliate <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Chia sẻ lý do và kế hoạch quảng bá của bạn..."
                />
              </div>

              <div className="flex items-start gap-2">
                <input 
                  type="checkbox" 
                  id="terms" 
                  required
                  className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  Tôi đồng ý với{" "}
                  <a href="/affiliate-terms" className="text-blue-600 hover:underline">
                    Điều khoản Affiliate
                  </a>
                  {" và cam kết quảng bá sản phẩm một cách trung thực."}
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Đang gửi..." : "Gửi Đơn Đăng Ký"}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

