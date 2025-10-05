"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyCallToAction from "@/components/StickyCallToAction";
import { 
  User, Mail, Calendar, Shield, Download, BookOpen, 
  Award, TrendingUp, Settings, Crown, CheckCircle 
} from "lucide-react";
import { useAuth } from "@/lib/authContext";

interface UserStats {
  downloadsThisMonth: {
    eaDemo: number;
    indicators: number;
  };
  premiumPostsReadThisMonth: number;
  affiliateStatus: string;
  affiliateCode?: string;
  membershipTier: string;
  isPaid: boolean;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/profile");
      return;
    }

    fetchUserStats();
  }, [isAuthenticated, router]);

  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/user/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  const downloadLimits = stats?.isPaid
    ? { eaDemo: "Unlimited", indicators: "Unlimited" }
    : { eaDemo: 3, indicators: 5 };

  const premiumReadLimit = stats?.isPaid ? "Unlimited" : 3;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                  <User size={48} className="text-primary-600" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold mb-2">{user.username}</h1>
                  <p className="text-primary-100 flex items-center gap-2">
                    <Mail size={16} />
                    {user.email}
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    {stats?.isPaid ? (
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                        <Crown size={14} />
                        Paid Member
                      </span>
                    ) : (
                      <span className="bg-white/20 px-4 py-1 rounded-full text-sm font-semibold">
                        Free Member
                      </span>
                    )}
                    {user.role === "admin" && (
                      <span className="bg-purple-500 px-4 py-1 rounded-full text-sm font-semibold">
                        <Shield size={14} className="inline mr-1" />
                        Admin
                      </span>
                    )}
                    {stats?.affiliateStatus === "approved" && (
                      <span className="bg-green-500 px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                        <Award size={14} />
                        Affiliate Partner
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">📊 Thống Kê Tháng Này</h2>
              
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Đang tải...</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  {/* Downloads */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Download className="text-blue-600" size={32} />
                      <span className="text-sm text-gray-500">Downloads</span>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-gray-600">EA Demo</p>
                        <p className="text-2xl font-bold text-gray-800">
                          {stats?.downloadsThisMonth.eaDemo || 0}
                          <span className="text-sm text-gray-500 font-normal">
                            {" "}/ {downloadLimits.eaDemo}
                          </span>
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Indicators</p>
                        <p className="text-2xl font-bold text-gray-800">
                          {stats?.downloadsThisMonth.indicators || 0}
                          <span className="text-sm text-gray-500 font-normal">
                            {" "}/ {downloadLimits.indicators}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Premium Reads */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                      <BookOpen className="text-purple-600" size={32} />
                      <span className="text-sm text-gray-500">Premium Posts</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Bài đã đọc</p>
                    <p className="text-3xl font-bold text-gray-800">
                      {stats?.premiumPostsReadThisMonth || 0}
                      <span className="text-sm text-gray-500 font-normal">
                        {" "}/ {premiumReadLimit}
                      </span>
                    </p>
                  </div>

                  {/* Affiliate Status */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Award className="text-green-600" size={32} />
                      <span className="text-sm text-gray-500">Affiliate</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Trạng thái</p>
                    {stats?.affiliateStatus === "approved" ? (
                      <>
                        <p className="text-xl font-bold text-green-600 flex items-center gap-2">
                          <CheckCircle size={20} />
                          Đã duyệt
                        </p>
                        {stats.affiliateCode && (
                          <p className="text-sm text-gray-600 mt-2">
                            Code: <span className="font-mono font-semibold">{stats.affiliateCode}</span>
                          </p>
                        )}
                      </>
                    ) : stats?.affiliateStatus === "pending" ? (
                      <p className="text-xl font-bold text-yellow-600">Đang chờ duyệt</p>
                    ) : stats?.affiliateStatus === "rejected" ? (
                      <p className="text-xl font-bold text-red-600">Bị từ chối</p>
                    ) : (
                      <p className="text-xl font-bold text-gray-400">Chưa đăng ký</p>
                    )}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="text-primary-600" />
                  Hành Động Nhanh
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {!stats?.isPaid && (
                    <button
                      onClick={() => router.push("/pricing")}
                      className="flex items-center gap-3 p-4 border-2 border-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
                    >
                      <Crown className="text-primary-600" size={24} />
                      <div className="text-left">
                        <p className="font-semibold text-gray-800">Nâng cấp Paid Member</p>
                        <p className="text-sm text-gray-600">Unlimited downloads & premium posts</p>
                      </div>
                    </button>
                  )}
                  
                  {stats?.affiliateStatus === "none" && (
                    <button
                      onClick={() => router.push("/referral/apply")}
                      className="flex items-center gap-3 p-4 border-2 border-green-600 rounded-lg hover:bg-green-50 transition-colors"
                    >
                      <Award className="text-green-600" size={24} />
                      <div className="text-left">
                        <p className="font-semibold text-gray-800">Đăng ký Affiliate</p>
                        <p className="text-sm text-gray-600">Kiếm hoa hồng lên đến 30%</p>
                      </div>
                    </button>
                  )}

                  <button
                    onClick={() => router.push("/downloads")}
                    className="flex items-center gap-3 p-4 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Download className="text-blue-600" size={24} />
                    <div className="text-left">
                      <p className="font-semibold text-gray-800">Download EA & Indicators</p>
                      <p className="text-sm text-gray-600">Công cụ giao dịch miễn phí</p>
                    </div>
                  </button>

                  <button
                    onClick={() => router.push("/blog")}
                    className="flex items-center gap-3 p-4 border-2 border-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
                  >
                    <BookOpen className="text-purple-600" size={24} />
                    <div className="text-left">
                      <p className="font-semibold text-gray-800">Đọc Premium Blog</p>
                      <p className="text-sm text-gray-600">Phân tích thị trường chuyên sâu</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Account Settings */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Settings className="text-gray-600" />
                  Cài Đặt Tài Khoản
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <p className="font-semibold text-gray-800">Username</p>
                      <p className="text-sm text-gray-600">{user.username}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <p className="font-semibold text-gray-800">Email</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <p className="font-semibold text-gray-800">Loại tài khoản</p>
                      <p className="text-sm text-gray-600">
                        {stats?.isPaid ? "Paid Member" : "Free Member"}
                      </p>
                    </div>
                  </div>
                  <div className="pt-4">
                    <button
                      onClick={() => {
                        logout();
                        router.push("/");
                      }}
                      className="w-full px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                    >
                      Đăng Xuất
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <StickyCallToAction />
    </div>
  );
}
