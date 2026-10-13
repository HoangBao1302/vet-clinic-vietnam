"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { useLocale } from "@/lib/i18n/LocaleContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  DollarSign, CreditCard, Building2, User, Mail,
  CheckCircle, Clock, XCircle, AlertCircle, Plus
} from "lucide-react";

interface PaymentRequest {
  _id: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  paymentMethod: 'bank_transfer' | 'paypal';
  bankInfo?: {
    accountNumber: string;
    bankName: string;
    accountHolderName: string;
  };
  paypalEmail?: string;
  adminNotes?: string;
  rejectionReason?: string;
  createdAt: string;
  processedAt?: string;
}

export default function PaymentRequestPage() {
  const router = useRouter();
  const { user, isAuthenticated, refreshUser } = useAuth();
  const { t, locale } = useLocale();
  const money = (n: number) =>
    locale === "en" ? `${n.toLocaleString("en-US")} VND` : `${n.toLocaleString("vi-VN")}đ`;
  const tr = (key: string, vars: Record<string, string | number> = {}) =>
    Object.entries(vars).reduce(
      (s, [k, v]) => s.replaceAll(`{${k}}`, String(v)),
      String(t(key))
    );
  const dateLocale = locale === "en" ? "en-US" : "vi-VN";
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [totalCommission, setTotalCommission] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    paymentMethod: 'bank_transfer' as 'bank_transfer' | 'paypal',
    bankInfo: {
      accountNumber: '',
      bankName: '',
      accountHolderName: ''
    },
    paypalEmail: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  useEffect(() => {
    console.log('🔍 Payment Request Page - useEffect triggered');
    console.log('🔍 Auth state:', { isAuthenticated, user: user?.email, affiliateStatus: user?.affiliateStatus });
    
    if (!isAuthenticated) {
      console.log('❌ Not authenticated, redirecting to login');
      router.push('/login?redirect=/affiliate/payment-request');
      return;
    }

    // Only redirect if affiliateStatus is explicitly not 'approved' (not undefined)
    if (user?.affiliateStatus && user.affiliateStatus !== 'approved') {
      console.log('❌ Not approved affiliate, redirecting to dashboard');
      router.push('/affiliate/dashboard');
      return;
    }

    // If affiliateStatus is undefined, wait for AuthContext to load or fetch user data
    if (!user?.affiliateStatus) {
      console.log('⏳ Affiliate status not loaded yet, waiting...');
      return;
    }

    console.log('✅ User is authenticated and approved, fetching payment requests');
    fetchPaymentRequests();
  }, [isAuthenticated, user, router]);

  // Additional useEffect to fetch user data if affiliateStatus is missing
  useEffect(() => {
    if (isAuthenticated && !user?.affiliateStatus) {
      console.log('🔄 Fetching user data to get affiliate status...');
      const fetchUserData = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch('/api/user/stats', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          if (response.ok) {
            const data = await response.json();
            console.log('📊 User stats fetched:', data.stats?.affiliateStatus);
            
            // Force refresh AuthContext to update user data
            console.log('🔄 Refreshing AuthContext...');
            await refreshUser();
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
      
      fetchUserData();
    }
  }, [isAuthenticated, user?.affiliateStatus, refreshUser]);

  // Timeout fallback for loading state
  useEffect(() => {
    if (!user?.affiliateStatus && isAuthenticated) {
      const timeout = setTimeout(() => {
        console.log('⏰ Loading timeout reached, showing fallback');
        setLoadingTimeout(true);
      }, 10000); // 10 seconds timeout

      return () => clearTimeout(timeout);
    }
  }, [user?.affiliateStatus, isAuthenticated]);

  const fetchPaymentRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch payment requests
      const response = await fetch('/api/affiliate/payment-request', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPaymentRequests(data.paymentRequests);
      }

      // Fetch user stats to get available balance
      const userStatsResponse = await fetch('/api/user/stats', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (userStatsResponse.ok) {
        const userStatsData = await userStatsResponse.json();
        const totalCommissionPaid = userStatsData.stats?.totalCommissionPaid || 0;
        
        // Fetch affiliate stats
        const statsResponse = await fetch(`/api/affiliate/track?affiliateCode=${user?.affiliateCode}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          const totalCommissionEarned = statsData.stats.totalCommission || 0;
          setTotalCommission(totalCommissionEarned);
          setAvailableBalance(totalCommissionEarned - totalCommissionPaid);
        }
      }
    } catch (error) {
      console.error('Error fetching payment requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/affiliate/payment-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Payment request submitted successfully!');
        setFormData({
          amount: '',
          paymentMethod: 'bank_transfer',
          bankInfo: {
            accountNumber: '',
            bankName: '',
            accountHolderName: ''
          },
          paypalEmail: ''
        });
        setShowForm(false);
        fetchPaymentRequests();
      } else {
        setError(data.message || t("affiliate.payment.submitError"));
      }
    } catch (error) {
      setError(t("affiliate.payment.genericError"));
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="text-yellow-600" size={20} />;
      case 'approved':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'rejected':
        return <XCircle className="text-red-600" size={20} />;
      case 'paid':
        return <DollarSign className="text-blue-600" size={20} />;
      default:
        return <AlertCircle className="text-gray-600" size={20} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return t("affiliate.payment.statusPending");
      case "approved":
        return t("affiliate.payment.statusApproved");
      case "rejected":
        return t("affiliate.payment.statusRejected");
      case "paid":
        return t("affiliate.payment.statusPaid");
      default:
        return t("affiliate.payment.statusUnknown");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'paid':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  // Show loading if affiliateStatus is not loaded yet
  if (!user?.affiliateStatus) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-20">
          <div className="container-custom">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">{t("affiliate.payment.loadingAffiliate")}</p>
              {loadingTimeout && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 font-semibold mb-2">{t("affiliate.payment.slowTitle")}</p>
                  <p className="text-yellow-700 text-sm mb-3">
                    {t("affiliate.payment.slowBody")}
                  </p>
                  <div className="space-y-2">
                    <button
                      onClick={() => window.location.reload()}
                      className="w-full px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 text-sm"
                    >
                      {t("affiliate.payment.reload")}
                    </button>
                    <button
                      onClick={() => router.push('/affiliate/dashboard')}
                      className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
                    >
                      {t("affiliate.payment.backDashboard")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Redirect if not approved (only after we know the status)
  if (user.affiliateStatus !== 'approved') {
    router.push('/affiliate/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20">
        {/* Header */}
        <section className="py-8 bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <div className="container-custom">
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <DollarSign size={40} />
              {t("affiliate.payment.title")}
            </h1>
            <p className="text-green-100 mt-2">
              {t("affiliate.payment.code")} <span className="font-mono font-bold">{user?.affiliateCode}</span>
            </p>
          </div>
        </section>

        <section className="py-8">
          <div className="container-custom">
            {/* Success/Error Messages */}
            {success && (
              <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                {success}
              </div>
            )}
            {error && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {/* Balance Info */}
            <div className="mb-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
              <div className="grid md:grid-cols-3 gap-4 text-center mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{t("affiliate.payment.earned")}</p>
                  <p className="text-2xl font-bold text-gray-800">{money(totalCommission)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">{t("affiliate.payment.withdrawn")}</p>
                  <p className="text-2xl font-bold text-red-600">-{money(totalCommission - availableBalance)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">{t("affiliate.payment.available")}</p>
                  <p className="text-2xl font-bold text-green-600">{money(availableBalance)}</p>
                </div>
              </div>
              
              {availableBalance < 500000 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm">
                  <p className="text-yellow-800 font-semibold mb-1">{t("affiliate.payment.notEligible")}</p>
                  <p className="text-yellow-700 text-xs">
                    {tr("affiliate.payment.needMore", {
                      amount: (500000 - availableBalance).toLocaleString(dateLocale),
                    })}
                  </p>
                  <p className="text-yellow-600 text-xs mt-2">
                    {t("affiliate.payment.keepSharing")}
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mb-8 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">{t("affiliate.payment.history")}</h2>
              <button
                onClick={() => availableBalance >= 500000 ? setShowForm(!showForm) : alert(t("affiliate.payment.minAlert"))}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                  availableBalance >= 500000 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={availableBalance < 500000}
              >
                <Plus size={20} />
                {t("affiliate.payment.createNew")}
              </button>
            </div>

            {/* Payment Request Form */}
            {showForm && (
              <div className="mb-8 bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold mb-6">{t("affiliate.payment.createTitle")}</h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("affiliate.payment.amount")}
                    </label>
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      min="500000"
                      step="1000"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder={t("affiliate.payment.amountPlaceholder")}
                      required
                    />
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("affiliate.payment.method")}
                    </label>
                    <div className="grid md:grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, paymentMethod: 'bank_transfer' })}
                        className={`p-4 border-2 rounded-lg flex items-center gap-3 ${
                          formData.paymentMethod === 'bank_transfer'
                            ? 'border-green-600 bg-green-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <Building2 size={24} className="text-green-600" />
                        <div className="text-left">
                          <p className="font-semibold">{t("affiliate.payment.bank")}</p>
                          <p className="text-sm text-gray-600">{t("affiliate.payment.bankHint")}</p>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, paymentMethod: 'paypal' })}
                        className={`p-4 border-2 rounded-lg flex items-center gap-3 ${
                          formData.paymentMethod === 'paypal'
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <CreditCard size={24} className="text-blue-600" />
                        <div className="text-left">
                          <p className="font-semibold">PayPal</p>
                          <p className="text-sm text-gray-600">{t("affiliate.payment.paypalHint")}</p>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Bank Transfer Fields */}
                  {formData.paymentMethod === 'bank_transfer' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t("affiliate.payment.accountNumber")}
                        </label>
                        <input
                          type="text"
                          value={formData.bankInfo.accountNumber}
                          onChange={(e) => setFormData({
                            ...formData,
                            bankInfo: { ...formData.bankInfo, accountNumber: e.target.value }
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder={t("affiliate.payment.accountPlaceholder")}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t("affiliate.payment.bankName")}
                        </label>
                        <input
                          type="text"
                          value={formData.bankInfo.bankName}
                          onChange={(e) => setFormData({
                            ...formData,
                            bankInfo: { ...formData.bankInfo, bankName: e.target.value }
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder={t("affiliate.payment.bankNamePlaceholder")}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t("affiliate.payment.holder")}
                        </label>
                        <input
                          type="text"
                          value={formData.bankInfo.accountHolderName}
                          onChange={(e) => setFormData({
                            ...formData,
                            bankInfo: { ...formData.bankInfo, accountHolderName: e.target.value }
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder={t("affiliate.payment.holderPlaceholder")}
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* PayPal Fields */}
                  {formData.paymentMethod === 'paypal' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("affiliate.payment.paypalEmail")}
                      </label>
                      <input
                        type="email"
                        value={formData.paypalEmail}
                        onChange={(e) => setFormData({ ...formData, paypalEmail: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="your-email@example.com"
                        required
                      />
                    </div>
                  )}

                  {/* Submit Buttons */}
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {submitting ? t("affiliate.payment.submitting") : t("affiliate.payment.submit")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                    >
                      {t("affiliate.payment.cancel")}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Payment Requests List */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className="text-gray-600">{t("affiliate.payment.loading")}</p>
              </div>
            ) : paymentRequests.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <DollarSign size={48} className="text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">{t("affiliate.payment.emptyTitle")}</h3>
                <p className="text-gray-500">{t("affiliate.payment.emptyBody")}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {paymentRequests.map((request) => (
                  <div key={request._id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(request.status)}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {money(request.amount)}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {new Date(request.createdAt).toLocaleDateString(dateLocale)}
                          </p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(request.status)}`}>
                        {getStatusText(request.status)}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">{t("affiliate.payment.methodLabel")}</p>
                        <p className="text-sm text-gray-600">
                          {request.paymentMethod === 'bank_transfer' ? t("affiliate.payment.bank") : 'PayPal'}
                        </p>
                      </div>
                      {request.paymentMethod === 'bank_transfer' && request.bankInfo && (
                        <div>
                          <p className="text-sm font-medium text-gray-700">{t("affiliate.payment.bankInfo")}</p>
                          <p className="text-sm text-gray-600">
                            {request.bankInfo.bankName} - {request.bankInfo.accountHolderName}
                          </p>
                        </div>
                      )}
                      {request.paymentMethod === 'paypal' && request.paypalEmail && (
                        <div>
                          <p className="text-sm font-medium text-gray-700">{t("affiliate.payment.paypalEmail")}</p>
                          <p className="text-sm text-gray-600">{request.paypalEmail}</p>
                        </div>
                      )}
                    </div>

                    {request.adminNotes && (
                      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm font-medium text-blue-800">{t("affiliate.payment.adminNote")}</p>
                        <p className="text-sm text-blue-700">{request.adminNotes}</p>
                      </div>
                    )}

                    {request.rejectionReason && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm font-medium text-red-800">{t("affiliate.payment.rejectReason")}</p>
                        <p className="text-sm text-red-700">{request.rejectionReason}</p>
                      </div>
                    )}

                    {request.processedAt && (
                      <div className="text-sm text-gray-500">
                        {t("affiliate.payment.processedAt")} {new Date(request.processedAt).toLocaleString(dateLocale)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
