"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { useLocale } from "@/lib/i18n/LocaleContext";
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
  const { t, locale } = useLocale();
  const formatNum = (n: number) => n.toLocaleString(locale === "en" ? "en-US" : "vi-VN");
  const money = (n: number) =>
    locale === "en" ? `${formatNum(n)} VND` : `${formatNum(n)}đ`;
  const tr = (key: string, vars: Record<string, string | number> = {}) =>
    Object.entries(vars).reduce(
      (s, [k, v]) => s.replaceAll(`{${k}}`, String(v)),
      String(t(key))
    );
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [trackingLinks, setTrackingLinks] = useState<TrackingProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  
  // Debug logging for authentication state
  useEffect(() => {
    console.log('🔍 Affiliate Dashboard Debug:', {
      isLoading,
      isAuthenticated,
      hasUser: !!user,
      userEmail: user?.email,
      affiliateStatus: user?.affiliateStatus,
      affiliateCode: user?.affiliateCode,
      hasToken: !!localStorage.getItem('token'),
      tokenLength: localStorage.getItem('token')?.length,
      currentUrl: typeof window !== 'undefined' ? window.location.href : 'N/A'
    });
  }, [isLoading, isAuthenticated, user]);

  // Simplified loading logic with API-first validation
  useEffect(() => {
    const initializeDashboard = async () => {
      console.log('🚀 Initializing Affiliate Dashboard...');
      
      // Wait for auth to be ready
      if (isLoading) {
        console.log('⏳ Auth still loading...');
        return;
      }

      // Check if we have token in localStorage first
      const token = localStorage.getItem('token');
      
      console.log('🔍 Auth state check:', {
        isLoading,
        isAuthenticated,
        hasToken: !!token,
        userFromContext: !!user
      });

      // If no token at all, redirect to login
      if (!token) {
        console.log('❌ No token found, redirecting to login');
        router.push('/login?redirect=/affiliate/dashboard');
        return;
      }

      // Always check with API first for affiliate access
      try {
        console.log('📡 Checking affiliate access with API...');
        const response = await fetch('/api/affiliate/check-access', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('API Response:', data);
          
          if (data.canAccessDashboard) {
            console.log('✅ API confirms access to dashboard');
            
            // Update localStorage with fresh user data
            if (data.user) {
              console.log('🔍 Fetching user stats...');
              const userStatsResponse = await fetch('/api/user/stats', {
                headers: { Authorization: `Bearer ${token}` }
              });
              
              if (userStatsResponse.ok) {
                const userStatsData = await userStatsResponse.json();
                console.log('🔍 User stats response:', userStatsData);
                localStorage.setItem('user', JSON.stringify(userStatsData.stats));
              } else {
                console.log('❌ User stats API failed:', userStatsResponse.status);
              }
            }
            
            // Load dashboard data
            console.log('✅ Loading dashboard data...');
            await loadDashboardData();
          } else {
            console.log('❌ API denies access:', data.message);
            router.push('/referral');
          }
        } else {
          console.log('❌ API check failed, status:', response.status);
          if (response.status === 401) {
            router.push('/login?redirect=/affiliate/dashboard');
          } else {
            router.push('/referral');
          }
        }
      } catch (error) {
        console.error('❌ Error checking affiliate access:', error);
        // Don't redirect on error, try to continue
        if (user?.affiliateStatus === 'approved') {
          console.log('⚠️ API error but user is approved, loading dashboard...');
          await loadDashboardData();
        } else {
          router.push('/referral');
        }
      }
    };

    initializeDashboard();
  }, [isLoading, router]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('📊 Loading dashboard data...');

      // Load data in parallel with better error handling
      const [statsResponse, linksResponse, userStatsResponse] = await Promise.allSettled([
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
      if (statsResponse.status === 'fulfilled' && statsResponse.value.ok) {
        const statsData = await statsResponse.value.json();
        console.log('📈 Stats loaded:', statsData);
        
        // Process user stats for commission data
        let totalCommissionEarned = 0;
        let totalCommissionPaid = 0;
        if (userStatsResponse.status === 'fulfilled' && userStatsResponse.value.ok) {
          const userStatsData = await userStatsResponse.value.json();
          console.log('🔍 User stats data for dashboard:', userStatsData);
          totalCommissionEarned = userStatsData.stats?.totalCommissionEarned || 0;
          totalCommissionPaid = userStatsData.stats?.totalCommissionPaid || 0;
        }

        // Use commission from user stats instead of affiliate track
        const totalCommission = totalCommissionEarned || statsData.stats.totalCommission || 0;
        setStats({
          ...statsData.stats,
          totalCommission: totalCommission,
          totalCommissionEarned: totalCommissionEarned,
          totalCommissionPaid,
          availableBalance: totalCommission - totalCommissionPaid
        });
      } else {
        const errorMsg = statsResponse.status === 'rejected' 
          ? statsResponse.reason.message 
          : 'Failed to load affiliate stats';
        throw new Error(errorMsg);
      }

      // Process tracking links
      if (linksResponse.status === 'fulfilled' && linksResponse.value.ok) {
        const linksData = await linksResponse.value.json();
        setTrackingLinks(linksData.products || []);
      } else {
        console.warn('Failed to load tracking links, using empty array');
        setTrackingLinks([]);
      }

      console.log('✅ Dashboard data loaded successfully');
      
    } catch (err: any) {
      console.error('❌ Error loading dashboard:', err);
      setError(err.message);
      
      // Enhanced retry logic
      if (retryCount < 3) {
        console.log(`🔄 Retrying... (${retryCount + 1}/3)`);
        setRetryCount((prev: number) => prev + 1);
        
        // Exponential backoff
        const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
        setTimeout(() => {
          loadDashboardData();
        }, delay);
      } else {
        console.error('❌ Max retries reached, showing error');
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
              {isLoading ? t("affiliate.dashboard.loadingAuth") : t("affiliate.dashboard.loadingDashboard")}
            </p>
            {retryCount > 0 && (
              <p className="text-sm text-yellow-600 mt-2">
                {tr("affiliate.dashboard.retrying", { count: retryCount })}
              </p>
            )}
            <div className="mt-4">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {t("affiliate.dashboard.refresh")}
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Enhanced error state with debug info
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-20">
          <div className="container-custom py-20 text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
              <AlertCircle className="text-red-600 mx-auto mb-4" size={48} />
              <h2 className="text-xl font-semibold text-red-800 mb-2">{t("affiliate.dashboard.errorTitle")}</h2>
              <p className="text-red-600 mb-4">{error}</p>
              
              {/* Debug Information */}
              <div className="bg-gray-100 rounded-lg p-4 mb-4 text-left">
                <h3 className="font-semibold text-gray-800 mb-2">{t("affiliate.dashboard.debugTitle")}</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>• {t("affiliate.dashboard.debugEmail")} {user?.email || t("affiliate.dashboard.notLoaded")}</p>
                  <p>• {t("affiliate.dashboard.debugStatus")} {user?.affiliateStatus || t("affiliate.dashboard.notLoaded")}</p>
                  <p>• {t("affiliate.dashboard.debugCode")} {user?.affiliateCode || t("affiliate.dashboard.notLoaded")}</p>
                  <p>• {t("affiliate.dashboard.debugTier")} {user?.membershipTier || t("affiliate.dashboard.notLoaded")}</p>
                  <p>• {t("affiliate.dashboard.debugPaid")} {user?.isPaid ? t("affiliate.dashboard.yes") : t("affiliate.dashboard.no")}</p>
                  <p>• {t("affiliate.dashboard.debugRetry")} {retryCount}/3</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={loadDashboardData}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  {t("affiliate.dashboard.retry")}
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  {t("affiliate.dashboard.refresh")}
                </button>
                <button
                  onClick={() => {
                    // Clear localStorage and redirect to login
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    router.push('/login');
                  }}
                  className="w-full px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                >
                  {t("affiliate.dashboard.clearAuth")}
                </button>
              </div>
              
              <div className="mt-4 text-xs text-gray-500">
                <p>{t("affiliate.dashboard.persistHelp")}</p>
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
              {t("affiliate.dashboard.title")}
            </h1>
            <p className="text-green-100 mt-2">
              {t("affiliate.dashboard.code")} <span className="font-mono font-bold">{user?.affiliateCode}</span>
            </p>
            <p className="text-green-100 text-sm mt-1">
              {t("affiliate.dashboard.status")} <span className="font-bold">{user?.affiliateStatus}</span> | 
              {t("affiliate.dashboard.membership")} <span className="font-bold">{user?.membershipTier}</span>
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
                <p className="text-sm text-gray-600">{t("affiliate.dashboard.totalClicks")}</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle className="text-green-600" size={32} />
                </div>
                <p className="text-3xl font-bold text-gray-800">{stats?.conversions || 0}</p>
                <p className="text-sm text-gray-600">{t("affiliate.dashboard.conversions")}</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <BarChart3 className="text-purple-600" size={32} />
                </div>
                <p className="text-3xl font-bold text-gray-800">{stats?.conversionRate || 0}%</p>
                <p className="text-sm text-gray-600">{t("affiliate.dashboard.conversionRate")}</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="text-yellow-600" size={32} />
                </div>
                <p className="text-3xl font-bold text-gray-800">
                  {money(stats?.totalCommission || 0)}
                </p>
                <p className="text-sm text-gray-600">{t("affiliate.dashboard.totalEarned")}</p>
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-500">{t("affiliate.dashboard.withdrawn")} {money(stats?.totalCommissionPaid || 0)}</p>
                  <p className="text-xs text-green-600 font-semibold">{t("affiliate.dashboard.available")} {money(stats?.availableBalance || 0)}</p>
                </div>
              </div>
            </div>

            {/* Tracking Links */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <ExternalLink size={24} />
                {t("affiliate.dashboard.trackingLinks")}
              </h2>

              <div className="space-y-4">
                {trackingLinks.map((product) => (
                  <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{t("affiliate.dashboard.price")} {money(product.price)}</span>
                          <span>{t("affiliate.dashboard.commission")} {product.commissionRate}%</span>
                          <span className="text-green-600 font-semibold">
                            {t("affiliate.dashboard.estimate")} {money(product.estimatedCommission)}
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
                        {t("affiliate.dashboard.copy")}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Click Analysis */}
            {stats && stats.totalClicks > 0 && (
              <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <BarChart3 size={20} />
                  {t("affiliate.dashboard.analysis")}
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Conversion Analysis */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-3">{t("affiliate.dashboard.conversionTitle")}</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{t("affiliate.dashboard.clicksLabel")}</span>
                        <span className="font-semibold">{stats.totalClicks}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{t("affiliate.dashboard.conversionsLabel")}</span>
                        <span className="font-semibold text-green-600">{stats.conversions}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{t("affiliate.dashboard.rateLabel")}</span>
                        <span className={`font-semibold ${
                          stats.conversionRate >= 20 ? 'text-green-600' : 
                          stats.conversionRate >= 10 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {stats.conversionRate}%
                        </span>
                      </div>
                    </div>
                    
                    {/* Performance indicator */}
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      {stats.conversionRate >= 20 ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle size={16} />
                          <span className="text-sm font-medium">{t("affiliate.dashboard.excellent")}</span>
                        </div>
                      ) : stats.conversionRate >= 10 ? (
                        <div className="flex items-center gap-2 text-yellow-600">
                          <Clock size={16} />
                          <span className="text-sm font-medium">{t("affiliate.dashboard.needsWork")}</span>
                        </div>
                      ) : stats.conversionRate > 0 ? (
                        <div className="flex items-center gap-2 text-orange-600">
                          <AlertCircle size={16} />
                          <span className="text-sm font-medium">{t("affiliate.dashboard.needsHelp")}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-red-600">
                          <AlertCircle size={16} />
                          <span className="text-sm font-medium">{t("affiliate.dashboard.noConversion")}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Tips based on performance */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-3">{t("affiliate.dashboard.tips")}</h4>
                    <div className="space-y-2 text-sm">
                      {stats.conversionRate === 0 ? (
                        <>
                          <p className="text-gray-700">• {tr("affiliate.dashboard.tipNoConv1", { clicks: stats.totalClicks })}</p>
                          <p className="text-gray-700">• {t("affiliate.dashboard.tipNoConv2")}</p>
                          <p className="text-gray-700">• {t("affiliate.dashboard.tipNoConv3")}</p>
                          <p className="text-gray-700">• {t("affiliate.dashboard.tipNoConv4")}</p>
                        </>
                      ) : stats.conversionRate < 10 ? (
                        <>
                          <p className="text-gray-700">• {tr("affiliate.dashboard.tipLow1", { rate: stats.conversionRate })}</p>
                          <p className="text-gray-700">• {t("affiliate.dashboard.tipLow2")}</p>
                          <p className="text-gray-700">• {t("affiliate.dashboard.tipLow3")}</p>
                          <p className="text-gray-700">• {t("affiliate.dashboard.tipLow4")}</p>
                        </>
                      ) : stats.conversionRate < 20 ? (
                        <>
                          <p className="text-gray-700">• {tr("affiliate.dashboard.tipMid1", { rate: stats.conversionRate })}</p>
                          <p className="text-gray-700">• {t("affiliate.dashboard.tipMid2")}</p>
                          <p className="text-gray-700">• {t("affiliate.dashboard.tipMid3")}</p>
                          <p className="text-gray-700">• {t("affiliate.dashboard.tipMid4")}</p>
                        </>
                      ) : (
                        <>
                          <p className="text-gray-700">• {tr("affiliate.dashboard.tipHigh1", { rate: stats.conversionRate })}</p>
                          <p className="text-gray-700">• {t("affiliate.dashboard.tipHigh2")}</p>
                          <p className="text-gray-700">• {t("affiliate.dashboard.tipHigh3")}</p>
                          <p className="text-gray-700">• {t("affiliate.dashboard.tipHigh4")}</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Commission Info */}
            <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">{t("affiliate.dashboard.commissionInfo")}</h3>
              
              {/* Commission Summary */}
              <div className="bg-white rounded-lg p-4 mb-4 border-l-4 border-green-600">
                <div className="grid grid-cols-3 gap-1 text-center">
                  <div>
                    <p className="text-sm md:text-base font-bold text-gray-800">{money(stats?.totalCommission || 0)}</p>
                    <p className="text-xs text-gray-600">{t("affiliate.dashboard.earned")}</p>
                  </div>
                  <div>
                    <p className="text-sm md:text-base font-bold text-red-600">-{money(stats?.totalCommissionPaid || 0)}</p>
                    <p className="text-xs text-gray-600">{t("affiliate.dashboard.withdrawnShort")}</p>
                  </div>
                  <div>
                    <p className="text-sm md:text-base font-bold text-green-600">{money(stats?.availableBalance || 0)}</p>
                    <p className="text-xs text-gray-600">{t("affiliate.dashboard.availableShort")}</p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <p className="font-semibold text-gray-700">{t("affiliate.dashboard.ratesTitle")}</p>
                  <ul className="text-gray-600 mt-1 space-y-1">
                    <li>• {tr("affiliate.dashboard.rateEa", { rate: user?.isPaid ? 35 : 30 })}</li>
                    <li>• {t("affiliate.dashboard.rateCourse")}</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-gray-700">{t("affiliate.dashboard.payoutTitle")}</p>
                  <ul className="text-gray-600 mt-1 space-y-1">
                    <li>• {t("affiliate.dashboard.payout1")}</li>
                    <li>• {t("affiliate.dashboard.payout2")}</li>
                    <li>• {t("affiliate.dashboard.payout3")}</li>
                  </ul>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200 space-y-2">
                {(stats?.availableBalance || 0) >= 500000 ? (
                  <>
                    <button
                      onClick={() => {
                        console.log('🔍 Payment request button clicked');
                        console.log('🔍 Available balance:', stats?.availableBalance);
                        console.log('🔍 User affiliate status:', user?.affiliateStatus);
                        router.push('/affiliate/payment-request');
                      }}
                      className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <DollarSign size={20} />
                      {t("affiliate.dashboard.requestPayout")}
                    </button>
                    <p className="text-xs text-center text-gray-500">
                      {tr("affiliate.dashboard.availableBalance", { amount: formatNum(stats?.availableBalance || 0) })}
                    </p>
                  </>
                ) : (
                  <>
                    <button
                      disabled
                      className="w-full px-6 py-3 bg-gray-300 text-gray-500 rounded-lg font-semibold cursor-not-allowed flex items-center justify-center gap-2"
                      title={t("affiliate.payment.minAlert")}
                    >
                      <DollarSign size={20} />
                      {t("affiliate.dashboard.requestPayout")}
                    </button>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm">
                      <p className="text-yellow-800 font-semibold mb-1">{t("affiliate.dashboard.notEligible")}</p>
                      <p className="text-yellow-700 text-xs">
                        {tr("affiliate.dashboard.currentBalance", { amount: formatNum(stats?.availableBalance || 0) })}
                      </p>
                      <p className="text-yellow-700 text-xs">
                        {tr("affiliate.dashboard.needMore", { amount: formatNum(500000 - (stats?.availableBalance || 0)) })}
                      </p>
                      <p className="text-yellow-600 text-xs mt-2">
                        {t("affiliate.dashboard.keepSharing")}
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
