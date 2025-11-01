"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Users, Shield, Award, TrendingUp, Search, 
  CheckCircle, XCircle, Clock, Crown, Mail, DollarSign, CreditCard, Building2, Trash2
} from "lucide-react";
import { useAuth } from "@/lib/authContext";

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  membershipTier: string;
  isPaid: boolean;
  affiliateStatus: string;
  affiliateCode?: string;
  downloadsThisMonth: {
    eaDemo: number;
    indicators: number;
  };
  premiumPostsReadThisMonth: number;
  createdAt: string;
}

interface PaymentRequest {
  _id: string;
  userId: string;
  affiliateCode: string;
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
  user?: {
    username: string;
    email: string;
  };
}

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [activeTab, setActiveTab] = useState<'users' | 'payments'>('users');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/admin");
      return;
    }

    if (user?.role !== "admin") {
      router.push("/");
      return;
    }

    fetchUsers();
    fetchPaymentRequests();
  }, [isAuthenticated, user, router]);

  // Fetch users when page changes
  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      fetchUsers();
    }
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      // Increase limit to show all users (or use a reasonable large number)
      const response = await fetch(`/api/admin/users?page=${currentPage}&limit=50`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
        setTotalUsers(data.pagination?.total || data.users.length);
        setTotalPages(data.pagination?.pages || 1);
        console.log(`✅ Loaded ${data.users.length} users (Total: ${data.pagination?.total || 'unknown'})`);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/admin/payment-requests", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPaymentRequests(data.paymentRequests);
      }
    } catch (error) {
      console.error("Error fetching payment requests:", error);
    }
  };

  const handleAffiliateAction = async (userId: string, action: "approve" | "reject") => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          affiliateStatus: action === "approve" ? "approved" : "rejected",
        }),
      });

      if (response.ok) {
        alert(`Affiliate ${action === "approve" ? "approved" : "rejected"} successfully!`);
        fetchUsers();
      } else {
        alert("Failed to update affiliate status");
      }
    } catch (error) {
      console.error("Error updating affiliate:", error);
      alert("Error updating affiliate status");
    }
  };

  const handleTogglePaidStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          isPaid: !currentStatus,
          membershipTier: !currentStatus ? "paid" : "free",
        }),
      });

      if (response.ok) {
        alert(`User ${!currentStatus ? "upgraded to" : "downgraded from"} Paid Member!`);
        fetchUsers();
      } else {
        alert("Failed to update membership");
      }
    } catch (error) {
      console.error("Error updating membership:", error);
      alert("Error updating membership");
    }
  };

  const handleDeleteUser = async (userId: string, username: string) => {
    if (!confirm(`⚠️ Bạn có chắc muốn xóa user "${username}"? Hành động này không thể hoàn tác!`)) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert("Xóa user thành công!");
        fetchUsers();
      } else {
        const errorData = await response.json();
        alert(`Không thể xóa user: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Lỗi khi xóa user");
    }
  };

  const handleResetCommission = async (userId: string, username: string) => {
    if (!confirm(`Reset commission balance for ${username}? This will recalculate from all paid payment requests.`)) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch('/api/admin/reset-commission', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Commission reset successfully!\nOld: ${data.data.oldPaid.toLocaleString('vi-VN')}đ\nNew: ${data.data.newPaid.toLocaleString('vi-VN')}đ\nFrom ${data.data.paidRequestsCount} paid requests`);
        fetchPaymentRequests();
      } else {
        const errorData = await response.json();
        alert(`Failed to reset commission: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error resetting commission:", error);
      alert("Error resetting commission");
    }
  };

  const handlePaymentAction = async (requestId: string, action: 'approve' | 'reject' | 'paid', notes?: string) => {
    try {
      const token = localStorage.getItem("token");
      
      const body: any = {
        status: action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'paid'
      };
      
      if (action === 'reject' && notes) {
        body.rejectionReason = notes;
      } else if (notes) {
        body.adminNotes = notes;
      }
      
      const response = await fetch(`/api/admin/payment-requests/${requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const actionText = action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'marked as paid';
        alert(`Payment request ${actionText} successfully!`);
        fetchPaymentRequests();
      } else {
        const errorData = await response.json();
        alert(`Failed to update payment request: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error updating payment request:", error);
      alert("Error updating payment request");
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterStatus === "all") return matchesSearch;
    if (filterStatus === "paid") return matchesSearch && u.isPaid;
    if (filterStatus === "free") return matchesSearch && !u.isPaid;
    if (filterStatus === "affiliate") return matchesSearch && u.affiliateStatus === "approved";
    if (filterStatus === "pending") return matchesSearch && u.affiliateStatus === "pending";

    return matchesSearch;
  });

  const filteredPaymentRequests = paymentRequests.filter((pr) => {
    const matchesSearch = pr.user?.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pr.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pr.affiliateCode.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterStatus === "all") return matchesSearch;
    if (filterStatus === "pending") return matchesSearch && pr.status === "pending";
    if (filterStatus === "approved") return matchesSearch && pr.status === "approved";
    if (filterStatus === "rejected") return matchesSearch && pr.status === "rejected";
    if (filterStatus === "paid") return matchesSearch && pr.status === "paid";

    return matchesSearch;
  });

  const stats = {
    total: users.length,
    paid: users.filter((u) => u.isPaid).length,
    free: users.filter((u) => !u.isPaid).length,
    affiliates: users.filter((u) => u.affiliateStatus === "approved").length,
    pending: users.filter((u) => u.affiliateStatus === "pending").length,
    paymentRequests: paymentRequests.length,
    pendingPayments: paymentRequests.filter((pr) => pr.status === "pending").length,
    totalPaymentAmount: paymentRequests.reduce((sum, pr) => sum + pr.amount, 0),
  };

  if (!isAuthenticated || user?.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20">
        {/* Header */}
        <section className="py-8 bg-gradient-to-r from-purple-600 to-purple-800 text-white">
          <div className="container-custom">
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <Shield size={40} />
              Admin Dashboard
            </h1>
            <p className="text-purple-100 mt-2">Quản lý users và affiliate applications</p>
          </div>
        </section>

        {/* Stats */}
        <section className="py-8">
          <div className="container-custom">
            <div className="grid md:grid-cols-7 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <Users className="text-blue-600" size={32} />
                </div>
                <p className="text-3xl font-bold text-gray-800">{totalUsers}</p>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-xs text-gray-500 mt-1">Showing {users.length} of {totalUsers}</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <Crown className="text-yellow-600" size={32} />
                </div>
                <p className="text-3xl font-bold text-gray-800">{stats.paid}</p>
                <p className="text-sm text-gray-600">Paid Members</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <Users className="text-gray-600" size={32} />
                </div>
                <p className="text-3xl font-bold text-gray-800">{stats.free}</p>
                <p className="text-sm text-gray-600">Free Members</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <Award className="text-green-600" size={32} />
                </div>
                <p className="text-3xl font-bold text-gray-800">{stats.affiliates}</p>
                <p className="text-sm text-gray-600">Active Affiliates</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="text-orange-600" size={32} />
                </div>
                <p className="text-3xl font-bold text-gray-800">{stats.pending}</p>
                <p className="text-sm text-gray-600">Pending Approval</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="text-green-600" size={32} />
                </div>
                <p className="text-3xl font-bold text-gray-800">{stats.paymentRequests}</p>
                <p className="text-sm text-gray-600">Payment Requests</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="text-yellow-600" size={32} />
                </div>
                <p className="text-3xl font-bold text-gray-800">{stats.pendingPayments}</p>
                <p className="text-sm text-gray-600">Pending Payments</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-md mb-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 px-6">
                  <button
                    onClick={() => setActiveTab('users')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'users'
                        ? 'border-purple-500 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Users className="inline mr-2" size={16} />
                    Users Management
                  </button>
                  <button
                    onClick={() => setActiveTab('payments')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'payments'
                        ? 'border-purple-500 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <DollarSign className="inline mr-2" size={16} />
                    Payment Requests
                  </button>
                  <button
                    onClick={() => router.push('/admin/affiliates')}
                    className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm"
                  >
                    <Award className="inline mr-2" size={16} />
                    Affiliates Dashboard
                  </button>
                  <button
                    onClick={() => router.push('/admin/auto-fix')}
                    className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm"
                  >
                    <TrendingUp className="inline mr-2" size={16} />
                    Auto-Fix System
                  </button>
                  <button
                    onClick={() => router.push('/admin/content-dashboard')}
                    className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm"
                  >
                    <Building2 className="inline mr-2" size={16} />
                    Content Dashboard
                  </button>
                </nav>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder={activeTab === 'users' ? "Tìm kiếm username hoặc email..." : "Tìm kiếm affiliate code hoặc email..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {activeTab === 'users' ? (
                    <>
                      <option value="all">Tất cả users</option>
                      <option value="paid">Paid Members</option>
                      <option value="free">Free Members</option>
                      <option value="affiliate">Active Affiliates</option>
                      <option value="pending">Pending Approval</option>
                    </>
                  ) : (
                    <>
                      <option value="all">Tất cả payment requests</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                      <option value="paid">Paid</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Đang tải...</p>
                </div>
              ) : activeTab === 'users' ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Membership
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Affiliate
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Stats
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.map((u) => (
                        <tr key={u._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <p className="font-semibold text-gray-800">{u.username}</p>
                              <p className="text-sm text-gray-600">{u.email}</p>
                              {u.role === "admin" && (
                                <span className="inline-block mt-1 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                                  Admin
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {u.isPaid ? (
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm rounded-full font-semibold">
                                <Crown size={14} />
                                Paid
                              </span>
                            ) : (
                              <span className="inline-block px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full">
                                Free
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {u.affiliateStatus === "approved" ? (
                              <div>
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full font-semibold">
                                  <CheckCircle size={14} />
                                  Approved
                                </span>
                                {u.affiliateCode && (
                                  <p className="text-xs text-gray-600 mt-1 font-mono">{u.affiliateCode}</p>
                                )}
                              </div>
                            ) : u.affiliateStatus === "pending" ? (
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-full">
                                <Clock size={14} />
                                Pending
                              </span>
                            ) : u.affiliateStatus === "rejected" ? (
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full">
                                <XCircle size={14} />
                                Rejected
                              </span>
                            ) : (
                              <span className="text-gray-400 text-sm">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            <div>
                              <p>Downloads: {u.downloadsThisMonth.eaDemo + u.downloadsThisMonth.indicators}</p>
                              <p>Premium: {u.premiumPostsReadThisMonth}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col gap-2">
                              {u.affiliateStatus === "pending" && (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleAffiliateAction(u._id, "approve")}
                                    className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleAffiliateAction(u._id, "reject")}
                                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                                  >
                                    Reject
                                  </button>
                                </div>
                              )}
                              <button
                                onClick={() => handleTogglePaidStatus(u._id, u.isPaid)}
                                className={`px-3 py-1 text-white text-sm rounded ${
                                  u.isPaid
                                    ? "bg-gray-600 hover:bg-gray-700"
                                    : "bg-yellow-600 hover:bg-yellow-700"
                                }`}
                              >
                                {u.isPaid ? "Downgrade" : "Upgrade"}
                              </button>
                              <button
                                onClick={() => handleDeleteUser(u._id, u.username)}
                                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 flex items-center gap-1 justify-center"
                              >
                                <Trash2 size={14} />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                      <div className="flex-1 flex justify-between sm:hidden">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm text-gray-700">
                            Showing page <span className="font-medium">{currentPage}</span> of{' '}
                            <span className="font-medium">{totalPages}</span> ({totalUsers} total users)
                          </p>
                        </div>
                        <div>
                          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                            <button
                              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                              disabled={currentPage === 1}
                              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Previous
                            </button>
                            
                            {/* Page numbers */}
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                              const pageNum = Math.max(1, Math.min(totalPages, currentPage - 2 + i));
                              return (
                                <button
                                  key={pageNum}
                                  onClick={() => setCurrentPage(pageNum)}
                                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                    pageNum === currentPage
                                      ? 'z-10 bg-purple-50 border-purple-500 text-purple-600'
                                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                  }`}
                                >
                                  {pageNum}
                                </button>
                              );
                            })}
                            
                            <button
                              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                              disabled={currentPage === totalPages}
                              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Next
                            </button>
                          </nav>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Affiliate
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Payment Method
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredPaymentRequests.map((pr) => (
                        <tr key={pr._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <p className="font-semibold text-gray-800">{pr.user?.username}</p>
                              <p className="text-sm text-gray-600">{pr.user?.email}</p>
                              <p className="text-xs text-gray-500 font-mono">{pr.affiliateCode}</p>
                              <button
                                onClick={() => handleResetCommission(pr.userId, pr.user?.username || 'User')}
                                className="mt-1 text-xs text-blue-600 hover:text-blue-800 underline"
                                title="Recalculate commission from all paid requests"
                              >
                                🔄 Reset Commission
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <p className="text-lg font-semibold text-gray-800">
                              {pr.amount.toLocaleString('vi-VN')} VNĐ
                            </p>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              {pr.paymentMethod === 'bank_transfer' ? (
                                <>
                                  <Building2 size={16} className="text-green-600" />
                                  <span className="text-sm text-gray-600">Bank Transfer</span>
                                </>
                              ) : (
                                <>
                                  <CreditCard size={16} className="text-blue-600" />
                                  <span className="text-sm text-gray-600">PayPal</span>
                                </>
                              )}
                            </div>
                            {pr.paymentMethod === 'bank_transfer' && pr.bankInfo && (
                              <div className="text-xs text-gray-500 mt-1">
                                <p>{pr.bankInfo.bankName}</p>
                                <p>{pr.bankInfo.accountHolderName}</p>
                              </div>
                            )}
                            {pr.paymentMethod === 'paypal' && pr.paypalEmail && (
                              <div className="text-xs text-gray-500 mt-1">
                                <p>{pr.paypalEmail}</p>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {pr.status === 'pending' ? (
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-full">
                                <Clock size={14} />
                                Pending
                              </span>
                            ) : pr.status === 'approved' ? (
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                                <CheckCircle size={14} />
                                Approved
                              </span>
                            ) : pr.status === 'rejected' ? (
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full">
                                <XCircle size={14} />
                                Rejected
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                                <DollarSign size={14} />
                                Paid
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            <p>{new Date(pr.createdAt).toLocaleDateString('vi-VN')}</p>
                            {pr.processedAt && (
                              <p className="text-xs text-gray-500">
                                Processed: {new Date(pr.processedAt).toLocaleDateString('vi-VN')}
                              </p>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {pr.status === 'pending' && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handlePaymentAction(pr._id, 'approve')}
                                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => {
                                    const reason = prompt('Rejection reason:');
                                    if (reason) {
                                      handlePaymentAction(pr._id, 'reject', reason);
                                    }
                                  }}
                                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                            {pr.status === 'approved' && (
                              <button
                                onClick={() => handlePaymentAction(pr._id, 'paid')}
                                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                              >
                                Mark as Paid
                              </button>
                            )}
                            {pr.adminNotes && (
                              <div className="text-xs text-gray-500 mt-1">
                                <p className="font-semibold">Admin Notes:</p>
                                <p>{pr.adminNotes}</p>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
