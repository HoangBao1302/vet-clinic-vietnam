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
  const { user, isAuthenticated, isLoading, refreshUser } = useAuth();
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [trackingLinks, setTrackingLinks] = useState<TrackingProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log('Affiliate Dashboard Auth Check:', {
      isLoading,
      isAuthenticated,
      user,
      affiliateStatus: user?.affiliateStatus,
      hasToken: typeof window !== 'undefined' ? !!localStorage.getItem('token') : false
    });

    // Wait for AuthContext to finish loading
    if (isLoading) {
      console.log('AuthContext still loading...');
      return;
    }

    // Wait for authentication to be determined
    if (typeof isAuthenticated === 'undefined') {
      console.log('Auth still loading...');
      return; // Still loading
    }

    if (!isAuthenticated) {
      console.log('Not authenticated, redirecting to login');
      router.push('/login?redirect=/affiliate/dashboard');
      return;
    }

    // Check if user has affiliate access
    if (!user) {
      console.log('User data still loading...');
      return; // Still loading user data
    }

    console.log('User loaded, checking affiliate status:', user.affiliateStatus);

    // Auto-refresh user data if affiliateStatus is not approved
    if (user.affiliateStatus !== 'approved') {
      console.log('User affiliate status not approved, attempting to refresh user data...');
      
      const refreshAndCheck = async () => {
        try {
          await refreshUser();
          console.log('User data refreshed, checking again...');
          
          // After refresh, the useEffect will run again with updated user data
          // If still not approved after refresh, then redirect to referral
          const refreshedUser = JSON.parse(localStorage.getItem('user') || '{}');
          if (refreshedUser.affiliateStatus !== 'approved') {
            console.log('Still not approved after refresh, redirecting to referral');
            router.push('/referral');
            return;
          }
          
          console.log('User approved after refresh, fetching data...');
          fetchData();
        } catch (error) {
          console.error('Error refreshing user data:', error);
          router.push('/referral');
        }
      };
      
      refreshAndCheck();
      return;
    }

    console.log('All checks passed, fetching data...');
    fetchData();
  }, [isLoading, isAuthenticated, user, router, refreshUser]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // First check affiliate access
      const accessResponse = await fetch('/api/affiliate/check-access', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (accessResponse.ok) {
        const accessData = await accessResponse.json();
        console.log('Affiliate access check:', accessData);
        
        if (!accessData.canAccessDashboard) {
          setError(`Cannot access dashboard: ${accessData.reason}`);
          setLoading(false);
          return;
        }
      }
      
      // Fetch tracking links
      const linksResponse = await fetch('/api/affiliate/links', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (linksResponse.ok) {
        const linksData = await linksResponse.json();
        setTrackingLinks(linksData.products);
      } else {
        const errorData = await linksResponse.json();
        setError(`Failed to fetch links: ${errorData.message}`);
      }

      // Fetch user stats to get totalCommissionPaid
      const userStatsResponse = await fetch('/api/user/stats', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      let totalCommissionPaid = 0;
      if (userStatsResponse.ok) {
        const userStatsData = await userStatsResponse.json();
        totalCommissionPaid = userStatsData.stats?.totalCommissionPaid || 0;
        console.log('User commission paid:', totalCommissionPaid);
      }

      // Fetch stats
      const statsResponse = await fetch(`/api/affiliate/track?affiliateCode=${user?.affiliateCode}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        const totalCommission = statsData.stats.totalCommission || 0;
        setStats({
          ...statsData.stats,
          totalCommissionPaid,
          availableBalance: totalCommission - totalCommissionPaid
        });
      } else {
        const errorData = await statsResponse.json();
        console.error('Failed to fetch stats:', errorData);
      }
    } catch (err: any) {
      setError('Lỗi tải dữ liệu: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  if (isLoading || !isAuthenticated || user?.affiliateStatus !== 'approved') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-20">
          <div className="container-custom py-20 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">
              {isLoading ? 'Loading authentication...' : 'Checking affiliate access...'}
            </p>
            <div className="mt-4 text-sm text-gray-500 max-w-md mx-auto">
              <p className="font-semibold mb-2">Debug Info:</p>
              <div className="bg-gray-100 p-4 rounded text-left">
                <p>isLoading: <span className={isLoading ? 'text-yellow-600' : 'text-green-600'}>{String(isLoading)}</span></p>
                <p>isAuthenticated: <span className={isAuthenticated ? 'text-green-600' : 'text-red-600'}>{String(isAuthenticated)}</span></p>
                <p>user: <span className={user ? 'text-green-600' : 'text-yellow-600'}>{user ? 'loaded' : 'loading'}</span></p>
                <p>affiliateStatus: <span className={user?.affiliateStatus === 'approved' ? 'text-green-600' : 'text-red-600'}>{user?.affiliateStatus || 'none'}</span></p>
                <p>affiliateCode: <span className="font-mono text-xs">{user?.affiliateCode || 'NOT SET'}</span></p>
                <p>hasToken: <span className={typeof window !== 'undefined' && localStorage.getItem('token') ? 'text-green-600' : 'text-red-600'}>{typeof window !== 'undefined' && localStorage.getItem('token') ? 'Yes' : 'No'}</span></p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-20">
          <div className="container-custom py-20 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải dashboard...</p>
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
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
