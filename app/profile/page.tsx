"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyCallToAction from "@/components/StickyCallToAction";
import { 
  User, Mail, Calendar, Shield, Download, BookOpen, 
  Award, TrendingUp, Settings, Crown, CheckCircle,
  BarChart3, Eye, Clock, Target, Star, TrendingDown
} from "lucide-react";
import { useAuth } from "@/lib/authContext";

interface UserStats {
  downloadsThisMonth: {
    eaDemo: number;
    indicators: number;
  };
  premiumPostsReadThisMonth: number;
  premiumPostsLimit: number;
  totalPostsRead: number;
  readingTimeMinutes: number;
  favoriteCategories: string[];
  lastReadDate?: string;
  affiliateStatus: string;
  affiliateCode?: string;
  membershipTier: string;
  isPaid: boolean;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, refreshUser } = useAuth();
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
        console.log('Profile Page - User Stats:', data.stats);
        console.log('Profile Page - Affiliate Status:', data.stats?.affiliateStatus);
        setStats(data.stats);
      } else {
        console.error('Failed to fetch user stats:', response.status);
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


                  {(stats?.affiliateStatus === "approved" || user?.affiliateStatus === "approved") && (
                    <button
                      onClick={() => {
                        console.log('Navigating to Affiliate Dashboard...');
                        router.push('/affiliate/dashboard');
                      }}
                      className="flex items-center gap-3 p-4 border-2 border-green-600 rounded-lg hover:bg-green-50 transition-colors"
                    >
                      <TrendingUp className="text-green-600" size={24} />
                      <div className="text-left">
                        <p className="font-semibold text-gray-800">Xem Affiliate Dashboard</p>
                        <p className="text-sm text-gray-600">Quản lý affiliate và hoa hồng</p>
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

              {/* Reading Analytics Section */}
              {stats && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <BarChart3 className="text-blue-600" size={28} />
                    <h3 className="text-xl font-bold">📈 Thống Kê Đọc Bài</h3>
                  </div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Total Posts Read */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-500 rounded-lg">
                          <Eye className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-sm text-gray-600">Tổng bài đã đọc</span>
                      </div>
                      <p className="text-3xl font-bold text-gray-800 mb-1">
                        {stats.totalPostsRead || 0}
                      </p>
                      <p className="text-sm text-gray-600">bài viết</p>
                    </div>

                    {/* Reading Time */}
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-green-500 rounded-lg">
                          <Clock className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-sm text-gray-600">Thời gian đọc</span>
                      </div>
                      <p className="text-3xl font-bold text-gray-800 mb-1">
                        {Math.round((stats.readingTimeMinutes || 0) / 60)}
                      </p>
                      <p className="text-sm text-gray-600">giờ</p>
                    </div>

                    {/* Premium Progress */}
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-purple-500 rounded-lg">
                          <Star className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-sm text-gray-600">Premium tháng này</span>
                      </div>
                      <p className="text-3xl font-bold text-gray-800 mb-1">
                        {stats.premiumPostsReadThisMonth || 0}
                      </p>
                      <p className="text-sm text-gray-600">/ {stats.premiumPostsLimit || 3}</p>
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${Math.min(100, ((stats.premiumPostsReadThisMonth || 0) / (stats.premiumPostsLimit || 3)) * 100)}%` 
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Reading Goal */}
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-orange-500 rounded-lg">
                          <Target className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-sm text-gray-600">Mục tiêu tháng</span>
                      </div>
                      <p className="text-3xl font-bold text-gray-800 mb-1">
                        {Math.round(((stats.totalPostsRead || 0) / 10) * 100)}%
                      </p>
                      <p className="text-sm text-gray-600">10 bài/tháng</p>
                    </div>
                  </div>

                  {/* Reading Insights */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Favorite Categories */}
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        Thể loại yêu thích
                      </h4>
                      <div className="space-y-3">
                        {stats.favoriteCategories && stats.favoriteCategories.length > 0 ? (
                          stats.favoriteCategories.slice(0, 5).map((category, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <span className="text-gray-700">{category}</span>
                              <div className="flex items-center gap-2">
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                                    style={{ width: `${100 - (index * 15)}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm text-gray-500">{100 - (index * 15)}%</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 text-center py-4">Chưa có dữ liệu đọc bài</p>
                        )}
                      </div>
                    </div>

                    {/* Reading Activity */}
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-600" />
                        Hoạt động gần đây
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">Lần đọc cuối</p>
                            <p className="text-xs text-gray-500">
                              {stats.lastReadDate ? 
                                new Date(stats.lastReadDate).toLocaleDateString('vi-VN') : 
                                'Chưa có dữ liệu'
                              }
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">Trung bình mỗi tuần</p>
                            <p className="text-xs text-gray-500">
                              {Math.round((stats.totalPostsRead || 0) / 4)} bài viết
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">Thời gian đọc TB</p>
                            <p className="text-xs text-gray-500">
                              {stats.totalPostsRead > 0 ? 
                                Math.round((stats.readingTimeMinutes || 0) / stats.totalPostsRead) : 
                                0
                              } phút/bài
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Reading Recommendations */}
                  <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-600" />
                      Gợi ý cho bạn
                    </h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      {stats.premiumPostsReadThisMonth < (stats.premiumPostsLimit || 3) && (
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <h5 className="font-medium text-gray-800 mb-2">📖 Đọc thêm bài premium</h5>
                          <p className="text-sm text-gray-600 mb-3">
                            Bạn còn {stats.premiumPostsLimit - stats.premiumPostsReadThisMonth} lượt đọc miễn phí
                          </p>
                          <button 
                            onClick={() => router.push('/blog')}
                            className="text-blue-600 text-sm font-medium hover:text-blue-700"
                          >
                            Khám phá ngay →
                          </button>
                        </div>
                      )}
                      {stats.totalPostsRead < 10 && (
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <h5 className="font-medium text-gray-800 mb-2">🎯 Đạt mục tiêu tháng</h5>
                          <p className="text-sm text-gray-600 mb-3">
                            Còn {10 - stats.totalPostsRead} bài để đạt mục tiêu 10 bài/tháng
                          </p>
                          <button 
                            onClick={() => router.push('/blog')}
                            className="text-green-600 text-sm font-medium hover:text-green-700"
                          >
                            Xem bài viết →
                          </button>
                        </div>
                      )}
                      {!stats.isPaid && (
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <h5 className="font-medium text-gray-800 mb-2">💎 Nâng cấp Premium</h5>
                          <p className="text-sm text-gray-600 mb-3">
                            Đọc unlimited bài premium và nhiều quyền lợi khác
                          </p>
                          <button 
                            onClick={() => router.push('/pricing')}
                            className="text-purple-600 text-sm font-medium hover:text-purple-700"
                          >
                            Xem gói premium →
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

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
