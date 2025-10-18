"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  TrendingUp, Users, DollarSign, MousePointer, 
  Copy, ExternalLink, BarChart3, Calendar,
  CheckCircle, Clock, AlertCircle
} from "lucide-react";

interface AffiliateStats {
  totalClicks: number;
  conversions: number;
  conversionRate: number;
  totalCommission: number;
  totalCommissionPaid: number;
  availableBalance: number;
  breakdown: Array<{
    _id: string;
    count: number;
    totalCommission: number;
  }>;
}

interface TrackingProduct {
  id: string;
  name: string;
  price: number;
  commissionRate: number;
  description: string;
  trackingLink: string;
  estimatedCommission: number;
}

export default function AffiliateDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [trackingLinks, setTrackingLinks] = useState<TrackingProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  // Simplified loading logic
  useEffect(() => {
    const initializeDashboard = async () => {
      console.log('🚀 Initializing Affiliate Dashboard...');
      
      // Wait for auth to be ready
      if (isLoading) {
        console.log('⏳ Auth still loading...');
        return;
      }

      // Check authentication
      if (!isAuthenticated) {
        console.log('❌ Not authenticated, redirecting to login');
        router.push('/login?redirect=/affiliate/dashboard');
        return;
      }

      // Check user data
      if (!user) {
        console.log('⏳ User data still loading...');
        return;
      }

      // Check affiliate status
      if (user.affiliateStatus !== 'approved') {
        console.log('❌ Affiliate not approved, redirecting to referral');
        router.push('/referral');
        return;
      }

      console.log('✅ All checks passed, loading dashboard data...');
      await loadDashboardData();
    };

    initializeDashboard();
  }, [isLoading, isAuthenticated, user, router]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('📊 Loading dashboard data...');

      // Load data in parallel
      const [statsResponse, linksResponse, userStatsResponse] = await Promise.all([
        fetch(`/api/affiliate/track?affiliateCode=${user?.affiliateCode}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('/api/affiliate/links', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('/api/user/stats', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      // Process stats
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        console.log('📈 Stats loaded:', statsData);
        
        // Process user stats for commission paid
        let totalCommissionPaid = 0;
        if (userStatsResponse.ok) {
          const userStatsData = await userStatsResponse.json();
          totalCommissionPaid = userStatsData.stats?.totalCommissionPaid || 0;
        }

        const totalCommission = statsData.stats.totalCommission || 0;
        setStats({
          ...statsData.stats,
          totalCommissionPaid,
          availableBalance: totalCommission - totalCommissionPaid
        });
      } else {
        throw new Error('Failed to load affiliate stats');
      }

      // Process tracking links
      if (linksResponse.ok) {
        const linksData = await linksResponse.json();
        setTrackingLinks(linksData.products || []);
      } else {
        console.warn('Failed to load tracking links');
      }

      console.log('✅ Dashboard data loaded successfully');
      
    } catch (err: any) {
      console.error('❌ Error loading dashboard:', err);
      setError(err.message);
      
      // Retry logic
      if (retryCount < 3) {
        console.log(`🔄 Retrying... (${retryCount + 1}/3)`);
        setRetryCount(prev => prev + 1);
        setTimeout(() => {
          loadDashboardData();
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  // Loading state
  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-20">
          <div className="container-custom py-20 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">
              {isLoading ? 'Loading authentication...' : 'Loading dashboard...'}
            </p>
            {retryCount > 0 && (
              <p className="text-sm text-yellow-600 mt-2">
                Retrying... ({retryCount}/3)
              </p>
            )}
            <div className="mt-4">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                🔄 Refresh Page
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-20">
          <div className="container-custom py-20 text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <AlertCircle className="text-red-600 mx-auto mb-4" size={48} />
              <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Dashboard</h2>
              <p className="text-red-600 mb-4">{error}</p>
              <div className="space-y-2">
                <button
                  onClick={loadDashboardData}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  🔄 Retry
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  🔄 Refresh Page
                </button>
              </div>
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
      
      <main className="pt-20">
        {/* Header */}
        <section className="py-8 bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <div className="container-custom">
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <TrendingUp size={40} />
              Affiliate Dashboard
            </h1>
            <p className="text-green-100 mt-2">
              Mã affiliate: <span className="font-mono font-bold">{user?.affiliateCode}</span>
            </p>
            <p className="text-green-100 text-sm mt-1">
              Status: <span className="font-bold">{user?.affiliateStatus}</span> | 
              Membership: <span className="font-bold">{user?.membershipTier}</span>
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="py-8">
          <div className="container-custom">
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <MousePointer className="text-blue-600" size={32} />
                </div>
                <p className="text-3xl font-bold text-gray-800">{stats?.totalClicks || 0}</p>
                <p className="text-sm text-gray-600">Total Clicks</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle className="text-green-600" size={32} />
                </div>
                <p className="text-3xl font-bold text-gray-800">{stats?.conversions || 0}</p>
                <p className="text-sm text-gray-600">Conversions</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <BarChart3 className="text-purple-600" size={32} />
                </div>
                <p className="text-3xl font-bold text-gray-800">{stats?.conversionRate || 0}%</p>
                <p className="text-sm text-gray-600">Conversion Rate</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="text-yellow-600" size={32} />
                </div>
                <p className="text-3xl font-bold text-gray-800">
                  {(stats?.totalCommission || 0).toLocaleString('vi-VN')}đ
                </p>
                <p className="text-sm text-gray-600">Total Commission Earned</p>
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-500">Đã rút: {(stats?.totalCommissionPaid || 0).toLocaleString('vi-VN')}đ</p>
                  <p className="text-xs text-green-600 font-semibold">Khả dụng: {(stats?.availableBalance || 0).toLocaleString('vi-VN')}đ</p>
                </div>
              </div>
            </div>

            {/* Tracking Links */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <ExternalLink size={24} />
                Tracking Links
              </h2>

              <div className="space-y-4">
                {trackingLinks.map((product) => (
                  <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Giá: {product.price.toLocaleString('vi-VN')}đ</span>
                          <span>Hoa hồng: {product.commissionRate}%</span>
                          <span className="text-green-600 font-semibold">
                            Ước tính: {product.estimatedCommission.toLocaleString('vi-VN')}đ
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={product.trackingLink}
                        readOnly
                        className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm bg-gray-50"
                      />
                      <button
                        onClick={() => copyToClipboard(product.trackingLink)}
                        className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 flex items-center gap-2"
                      >
                        <Copy size={16} />
                        Copy
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Commission Info */}
            <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">💰 Thông tin hoa hồng</h3>
              
              {/* Commission Summary */}
              <div className="bg-white rounded-lg p-4 mb-4 border-l-4 border-green-600">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{(stats?.totalCommission || 0).toLocaleString('vi-VN')}đ</p>
                    <p className="text-xs text-gray-600">Tổng kiếm được</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-600">-{(stats?.totalCommissionPaid || 0).toLocaleString('vi-VN')}đ</p>
                    <p className="text-xs text-gray-600">Đã rút</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">{(stats?.availableBalance || 0).toLocaleString('vi-VN')}đ</p>
                    <p className="text-xs text-gray-600">Khả dụng</p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <p className="font-semibold text-gray-700">Tỷ lệ hoa hồng:</p>
                  <ul className="text-gray-600 mt-1 space-y-1">
                    <li>• EA & Indicators: {user?.isPaid ? '35%' : '30%'}</li>
                    <li>• Khóa học: 25%</li>
                    <li>• Copy Social: 10% (recurring)</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-gray-700">Thanh toán:</p>
                  <ul className="text-gray-600 mt-1 space-y-1">
                    <li>• Cuối mỗi tháng</li>
                    <li>• Tối thiểu: 500.000đ</li>
                    <li>• Qua chuyển khoản ngân hàng hoặc PayPal</li>
                  </ul>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200 space-y-2">
                {(stats?.availableBalance || 0) >= 500000 ? (
                  <>
                    <button
                      onClick={() => router.push('/affiliate/payment-request')}
                      className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <DollarSign size={20} />
                      Yêu Cầu Thanh Toán
                    </button>
                    <p className="text-xs text-center text-gray-500">
                      💡 Số dư khả dụng: {(stats?.availableBalance || 0).toLocaleString('vi-VN')}đ
                    </p>
                  </>
                ) : (
                  <>
                    <button
                      disabled
                      className="w-full px-6 py-3 bg-gray-300 text-gray-500 rounded-lg font-semibold cursor-not-allowed flex items-center justify-center gap-2"
                      title="Số dư chưa đủ tối thiểu 500,000đ"
                    >
                      <DollarSign size={20} />
                      Yêu Cầu Thanh Toán
                    </button>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm">
                      <p className="text-yellow-800 font-semibold mb-1">⚠️ Chưa đủ điều kiện rút tiền</p>
                      <p className="text-yellow-700 text-xs">
                        Số dư hiện tại: <span className="font-semibold">{(stats?.availableBalance || 0).toLocaleString('vi-VN')}đ</span>
                      </p>
                      <p className="text-yellow-700 text-xs">
                        Cần thêm: <span className="font-semibold text-red-600">{(500000 - (stats?.availableBalance || 0)).toLocaleString('vi-VN')}đ</span> để đạt tối thiểu rút tiền (500,000đ)
                      </p>
                      <p className="text-yellow-600 text-xs mt-2">
                        💡 Tiếp tục chia sẻ link affiliate để kiếm thêm hoa hồng!
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
