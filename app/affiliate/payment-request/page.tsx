"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
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
  const { user, isAuthenticated } = useAuth();
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

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/affiliate/payment-request');
      return;
    }

    if (user?.affiliateStatus !== 'approved') {
      router.push('/affiliate/dashboard');
      return;
    }

    fetchPaymentRequests();
  }, [isAuthenticated, user, router]);

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
        setError(data.message || 'Failed to submit payment request');
      }
    } catch (error) {
      setError('An error occurred while submitting the request');
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
      case 'pending':
        return 'Đang chờ duyệt';
      case 'approved':
        return 'Đã duyệt';
      case 'rejected':
        return 'Bị từ chối';
      case 'paid':
        return 'Đã thanh toán';
      default:
        return 'Không xác định';
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

  if (!isAuthenticated || user?.affiliateStatus !== 'approved') {
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
              Yêu Cầu Thanh Toán
            </h1>
            <p className="text-green-100 mt-2">
              Mã affiliate: <span className="font-mono font-bold">{user?.affiliateCode}</span>
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
                  <p className="text-sm text-gray-600 mb-1">Tổng kiếm được</p>
                  <p className="text-2xl font-bold text-gray-800">{totalCommission.toLocaleString('vi-VN')}đ</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Đã rút</p>
                  <p className="text-2xl font-bold text-red-600">-{(totalCommission - availableBalance).toLocaleString('vi-VN')}đ</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Khả dụng</p>
                  <p className="text-2xl font-bold text-green-600">{availableBalance.toLocaleString('vi-VN')}đ</p>
                </div>
              </div>
              
              {availableBalance < 500000 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm">
                  <p className="text-yellow-800 font-semibold mb-1">⚠️ Chưa đủ điều kiện rút tiền</p>
                  <p className="text-yellow-700 text-xs">
                    Cần thêm: <span className="font-semibold text-red-600">{(500000 - availableBalance).toLocaleString('vi-VN')}đ</span> để đạt tối thiểu rút tiền (500,000đ)
                  </p>
                  <p className="text-yellow-600 text-xs mt-2">
                    💡 Tiếp tục chia sẻ link affiliate để kiếm thêm hoa hồng!
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mb-8 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Lịch Sử Yêu Cầu</h2>
              <button
                onClick={() => availableBalance >= 500000 ? setShowForm(!showForm) : alert('Số dư chưa đủ tối thiểu 500,000đ để tạo yêu cầu thanh toán')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                  availableBalance >= 500000 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={availableBalance < 500000}
              >
                <Plus size={20} />
                Tạo Yêu Cầu Mới
              </button>
            </div>

            {/* Payment Request Form */}
            {showForm && (
              <div className="mb-8 bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold mb-6">Tạo Yêu Cầu Thanh Toán</h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số tiền (VNĐ) *
                    </label>
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      min="500000"
                      step="1000"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Tối thiểu 500,000 VNĐ"
                      required
                    />
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phương thức thanh toán *
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
                          <p className="font-semibold">Chuyển khoản ngân hàng</p>
                          <p className="text-sm text-gray-600">Thanh toán qua ngân hàng địa phương</p>
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
                          <p className="text-sm text-gray-600">Thanh toán qua PayPal</p>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Bank Transfer Fields */}
                  {formData.paymentMethod === 'bank_transfer' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Số tài khoản *
                        </label>
                        <input
                          type="text"
                          value={formData.bankInfo.accountNumber}
                          onChange={(e) => setFormData({
                            ...formData,
                            bankInfo: { ...formData.bankInfo, accountNumber: e.target.value }
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Nhập số tài khoản ngân hàng"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tên ngân hàng *
                        </label>
                        <input
                          type="text"
                          value={formData.bankInfo.bankName}
                          onChange={(e) => setFormData({
                            ...formData,
                            bankInfo: { ...formData.bankInfo, bankName: e.target.value }
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="VD: Vietcombank, Techcombank, BIDV..."
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tên chủ tài khoản *
                        </label>
                        <input
                          type="text"
                          value={formData.bankInfo.accountHolderName}
                          onChange={(e) => setFormData({
                            ...formData,
                            bankInfo: { ...formData.bankInfo, accountHolderName: e.target.value }
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Tên đầy đủ của chủ tài khoản"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* PayPal Fields */}
                  {formData.paymentMethod === 'paypal' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email PayPal *
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
                      {submitting ? 'Đang gửi...' : 'Gửi Yêu Cầu'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                    >
                      Hủy
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Payment Requests List */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Đang tải...</p>
              </div>
            ) : paymentRequests.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <DollarSign size={48} className="text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Chưa có yêu cầu thanh toán</h3>
                <p className="text-gray-500">Tạo yêu cầu thanh toán đầu tiên của bạn</p>
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
                            {request.amount.toLocaleString('vi-VN')} VNĐ
                          </h3>
                          <p className="text-sm text-gray-600">
                            {new Date(request.createdAt).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(request.status)}`}>
                        {getStatusText(request.status)}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Phương thức thanh toán:</p>
                        <p className="text-sm text-gray-600">
                          {request.paymentMethod === 'bank_transfer' ? 'Chuyển khoản ngân hàng' : 'PayPal'}
                        </p>
                      </div>
                      {request.paymentMethod === 'bank_transfer' && request.bankInfo && (
                        <div>
                          <p className="text-sm font-medium text-gray-700">Thông tin ngân hàng:</p>
                          <p className="text-sm text-gray-600">
                            {request.bankInfo.bankName} - {request.bankInfo.accountHolderName}
                          </p>
                        </div>
                      )}
                      {request.paymentMethod === 'paypal' && request.paypalEmail && (
                        <div>
                          <p className="text-sm font-medium text-gray-700">Email PayPal:</p>
                          <p className="text-sm text-gray-600">{request.paypalEmail}</p>
                        </div>
                      )}
                    </div>

                    {request.adminNotes && (
                      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm font-medium text-blue-800">Ghi chú từ admin:</p>
                        <p className="text-sm text-blue-700">{request.adminNotes}</p>
                      </div>
                    )}

                    {request.rejectionReason && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm font-medium text-red-800">Lý do từ chối:</p>
                        <p className="text-sm text-red-700">{request.rejectionReason}</p>
                      </div>
                    )}

                    {request.processedAt && (
                      <div className="text-sm text-gray-500">
                        Xử lý lúc: {new Date(request.processedAt).toLocaleString('vi-VN')}
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
