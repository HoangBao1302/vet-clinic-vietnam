"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { Lock, Crown, CheckCircle } from "lucide-react";

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

          {/* Login Gate */}
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-transparent via-white/80 to-white">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-auto text-center border-2 border-blue-200">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-blue-600" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Nội Dung Premium
              </h3>
              
              <p className="text-gray-600 mb-6">
                Đăng nhập để đọc tiếp bài viết này và nhiều nội dung premium khác
              </p>

              <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
                <p className="text-sm font-semibold text-gray-800 mb-2">🎁 Đăng ký miễn phí để nhận:</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    3 bài premium/tháng
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    Download EA Demo
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    3 indicators miễn phí
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    Trading tips hàng tuần
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => router.push(`/login?redirect=${window.location.pathname}`)}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Đăng Nhập
                </button>
                <button
                  onClick={() => router.push('/register')}
                  className="w-full py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                  Đăng Ký Miễn Phí
                </button>
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

        {/* Upgrade Gate */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-transparent via-white/80 to-white">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-auto text-center border-2 border-orange-200">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown className="w-8 h-8 text-orange-600" />
            </div>
            
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Hết Lượt Đọc Miễn Phí
            </h3>
            
            <p className="text-gray-600 mb-4">
              Bạn đã đọc {stats?.premiumPostsReadThisMonth || 0}/3 bài premium tháng này
            </p>

            <div className="bg-orange-50 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm font-semibold text-gray-800 mb-2">💎 Upgrade để nhận:</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  Unlimited premium content
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  Unlimited downloads
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  Private signals group
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  Affiliate commission 35%
                </li>
              </ul>
            </div>

            <button
              onClick={() => router.push('/pricing')}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all"
            >
              Xem Gói Thành Viên
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

