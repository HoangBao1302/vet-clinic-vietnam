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
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [trackingLinks, setTrackingLinks] = useState<TrackingProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/affiliate/dashboard');
      return;
    }

    if (user?.affiliateStatus !== 'approved') {
      router.push('/referral');
      return;
    }

    fetchData();
  }, [isAuthenticated, user, router]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch tracking links
      const linksResponse = await fetch('/api/affiliate/links', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (linksResponse.ok) {
        const linksData = await linksResponse.json();
        setTrackingLinks(linksData.products);
      }

      // Fetch stats
      const statsResponse = await fetch(`/api/affiliate/track?affiliateCode=${user?.affiliateCode}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData.stats);
      }
    } catch (err) {
      setError('Lỗi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  if (!isAuthenticated || user?.affiliateStatus !== 'approved') {
    return null;
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
                <p className="text-sm text-gray-600">Total Commission</p>
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
              <div className="grid md:grid-cols-2 gap-4 text-sm">
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
                    <li>• Qua chuyển khoản ngân hàng</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
