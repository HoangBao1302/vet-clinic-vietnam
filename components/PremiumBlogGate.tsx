"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { Lock, Crown, CheckCircle, Star, TrendingUp, Users, Zap, ArrowRight } from "lucide-react";

interface PremiumBlogGateProps {
  children: React.ReactNode;
  isPremium: boolean;
  previewContent?: string;
}

export default function PremiumBlogGate({ children, isPremium, previewContent }: PremiumBlogGateProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [canAccess, setCanAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    checkAccess();
  }, [isAuthenticated, user, isPremium]);

  const checkAccess = async () => {
    // If not premium content, everyone can access
    if (!isPremium) {
      setCanAccess(true);
      setLoading(false);
      return;
    }

    // If premium but not logged in, can't access
    if (!isAuthenticated) {
      setCanAccess(false);
      setLoading(false);
      return;
    }

    // If paid member, can access
    if (user?.isPaid) {
      setCanAccess(true);
      setLoading(false);
      return;
    }

    // If free member, check limit
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/blog/check-access', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
        setCanAccess(data.canAccess);
      } else {
        setCanAccess(false);
      }
    } catch (error) {
      console.error('Failed to check access:', error);
      setCanAccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handleTrackRead = async () => {
    if (!isAuthenticated || !isPremium || user?.isPaid) return;

    try {
      const token = localStorage.getItem('token');
      await fetch('/api/blog/track-read', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Failed to track read:', error);
    }
  };

  // Track read when accessing premium content
  useEffect(() => {
    if (canAccess && isPremium && !user?.isPaid) {
      handleTrackRead();
    }
  }, [canAccess]);

  // Show full content
  if (!isPremium || canAccess) {
    return <>{children}</>;
  }

  // Loading state
  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Đang kiểm tra quyền truy cập...</p>
      </div>
    );
  }

  // Not logged in - show preview + login gate
  if (!isAuthenticated) {
    return (
      <div>
        {/* Preview content */}
        {previewContent && (
          <div className="mb-8">
            <div className="prose max-w-none">
              <p>{previewContent}</p>
            </div>
          </div>
        )}

        {/* Blur overlay */}
        <div className="relative">
          <div className="blur-sm pointer-events-none select-none" style={{ filter: 'blur(8px)' }}>
            {children}
          </div>

          {/* Enhanced Login Gate */}
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-transparent via-white/90 to-white">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg mx-auto text-center border border-gray-200">
              {/* Premium Badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <Star size={16} className="text-yellow-300" />
                Premium Content
              </div>
              
              {/* Lock Icon */}
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Lock className="w-10 h-10 text-white" />
              </div>
              
              <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                Nội Dung Độc Quyền
              </h3>
              
              <p className="text-gray-600 mb-8 text-lg">
                Đăng nhập để khám phá kiến thức chuyên sâu và chiến lược trading nâng cao
              </p>

              {/* Benefits Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                  <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-gray-800">3 Bài Premium</p>
                  <p className="text-xs text-gray-600">mỗi tháng</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200">
                  <Zap className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-gray-800">EA Demo</p>
                  <p className="text-xs text-gray-600">miễn phí</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-4 rounded-xl border border-purple-200">
                  <Star className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-gray-800">Indicators</p>
                  <p className="text-xs text-gray-600">chuyên nghiệp</p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-xl border border-orange-200">
                  <Users className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-gray-800">Community</p>
                  <p className="text-xs text-gray-600">hỗ trợ 24/7</p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-4">
                <button
                  onClick={() => router.push(`/login?redirect=${window.location.pathname}`)}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                >
                  <span>Đăng Nhập Ngay</span>
                  <ArrowRight size={18} />
                </button>
                <button
                  onClick={() => router.push('/register')}
                  className="w-full py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
                >
                  Tạo Tài Khoản Miễn Phí
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-3">Đã có hơn 10,000+ trader tin tưởng</p>
                <div className="flex justify-center items-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <CheckCircle size={12} className="text-green-500" />
                    Miễn phí
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle size={12} className="text-green-500" />
                    Bảo mật
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle size={12} className="text-green-500" />
                    Hỗ trợ 24/7
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Logged in but reached limit - show upgrade gate
  return (
    <div>
      {/* Preview content */}
      {previewContent && (
        <div className="mb-8">
          <div className="prose max-w-none">
            <p>{previewContent}</p>
          </div>
        </div>
      )}

      {/* Blur overlay */}
      <div className="relative">
        <div className="blur-sm pointer-events-none select-none" style={{ filter: 'blur(8px)' }}>
          {children}
        </div>

        {/* Enhanced Upgrade Gate */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-transparent via-white/90 to-white">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg mx-auto text-center border border-gray-200">
            {/* Crown Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Crown size={16} className="text-yellow-300" />
              Premium Upgrade
            </div>
            
            {/* Progress Indicator */}
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg relative">
              <Crown className="w-10 h-10 text-white" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">!</span>
              </div>
            </div>
            
            <h3 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-3">
              Hết Lượt Đọc Miễn Phí
            </h3>
            
            <p className="text-gray-600 mb-6 text-lg">
              Bạn đã đọc <span className="font-bold text-orange-600">{stats?.premiumPostsReadThisMonth || 0}/3</span> bài premium tháng này
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 mb-8">
              <div 
                className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${((stats?.premiumPostsReadThisMonth || 0) / 3) * 100}%` }}
              ></div>
            </div>

            {/* Premium Benefits */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-4 rounded-xl border border-purple-200">
                <Star className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-800">Unlimited</p>
                <p className="text-xs text-gray-600">premium content</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                <Zap className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-800">All Downloads</p>
                <p className="text-xs text-gray-600">unlimited</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-800">Private Signals</p>
                <p className="text-xs text-gray-600">VIP group</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-xl border border-orange-200">
                <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-800">35% Commission</p>
                <p className="text-xs text-gray-600">affiliate</p>
              </div>
            </div>

            {/* Special Offer */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-orange-600 font-bold">🎯 Ưu đãi đặc biệt</span>
              </div>
              <p className="text-sm text-gray-700">
                Giảm <span className="font-bold text-orange-600">30%</span> cho thành viên đầu tiên trong tháng này!
              </p>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => router.push('/pricing')}
              className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
            >
              <Crown size={18} />
              <span>Nâng Cấp Premium</span>
              <ArrowRight size={18} />
            </button>

            {/* Alternative Options */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-3">Hoặc đợi đến tháng sau để có thêm 3 lượt miễn phí</p>
              <div className="flex justify-center items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <CheckCircle size={12} className="text-green-500" />
                  Reset mỗi tháng
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle size={12} className="text-green-500" />
                  Không mất phí
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

