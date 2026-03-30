"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Building2, TrendingUp, Star, Trash2, Eye, EyeOff, RefreshCw, Edit, Plus, ChevronDown, ChevronUp, Upload
} from "lucide-react";
import { useAuth } from "@/lib/authContext";

interface Partner {
  _id?: string;
  id: string;
  name: string;
  website: string;
  rating: number;
  active: boolean;
  order: number;
}

interface TradingAccount {
  _id?: string;
  id: string;
  broker: string;
  account: string;
  gain: string;
  balance: string;
  active: boolean;
  order: number;
}

interface FeaturedAccount {
  _id?: string;
  id: string;
  broker: string;
  accountNumber: string;
  gain: string;
  year: number;
  active: boolean;
  order: number;
}

type TabType = 'partners' | 'trading-accounts' | 'featured-accounts';

export default function ContentDashboard() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('partners');
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // State for data
  const [partners, setPartners] = useState<Partner[]>([]);
  const [tradingAccounts, setTradingAccounts] = useState<TradingAccount[]>([]);
  const [featuredAccounts, setFeaturedAccounts] = useState<FeaturedAccount[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/admin/content-dashboard");
      return;
    }
    if (user?.role !== "admin") {
      router.push("/");
      return;
    }

    // Fetch all data
    fetchAllData();
  }, [isAuthenticated, user, router]);

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([
      fetchPartners(),
      fetchTradingAccounts(),
      fetchFeaturedAccounts()
    ]);
    setLoading(false);
  };

  // Partners API calls
  const fetchPartners = async () => {
    try {
      const response = await fetch('/api/admin/partners');
      if (response.ok) {
        const data = await response.json();
        setPartners(data.partners || []);
      }
    } catch (error) {
      console.error('Error fetching partners:', error);
    }
  };

  const handlePartnerToggleActive = async (id: string) => {
    try {
      const partner = partners.find(p => p.id === id);
      if (!partner) return;

      const response = await fetch(`/api/admin/partners/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !partner.active })
      });

      if (response.ok) {
        await fetchPartners();
      } else {
        alert('Có lỗi khi cập nhật partner');
      }
    } catch (error) {
      console.error('Error toggling partner:', error);
      alert('Có lỗi khi cập nhật partner');
    }
  };

  const handlePartnerDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa partner này?")) return;

    try {
      const response = await fetch(`/api/admin/partners/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchPartners();
        alert('Xóa thành công!');
      } else {
        alert('Có lỗi khi xóa partner');
      }
    } catch (error) {
      console.error('Error deleting partner:', error);
      alert('Có lỗi khi xóa partner');
    }
  };

  // Trading Accounts API calls
  const fetchTradingAccounts = async () => {
    try {
      const response = await fetch('/api/admin/trading-accounts');
      if (response.ok) {
        const data = await response.json();
        setTradingAccounts(data.accounts || []);
      }
    } catch (error) {
      console.error('Error fetching trading accounts:', error);
    }
  };

  const handleTradingAccountToggleActive = async (id: string) => {
    try {
      const account = tradingAccounts.find(a => a.id === id);
      if (!account) return;

      const response = await fetch(`/api/admin/trading-accounts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !account.active })
      });

      if (response.ok) {
        await fetchTradingAccounts();
      } else {
        alert('Có lỗi khi cập nhật trading account');
      }
    } catch (error) {
      console.error('Error toggling trading account:', error);
      alert('Có lỗi khi cập nhật trading account');
    }
  };

  const handleTradingAccountDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) return;

    try {
      const response = await fetch(`/api/admin/trading-accounts/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchTradingAccounts();
        alert('Xóa thành công!');
      } else {
        alert('Có lỗi khi xóa trading account');
      }
    } catch (error) {
      console.error('Error deleting trading account:', error);
      alert('Có lỗi khi xóa trading account');
    }
  };

  // Featured Accounts API calls
  const fetchFeaturedAccounts = async () => {
    try {
      const response = await fetch('/api/admin/featured-accounts');
      if (response.ok) {
        const data = await response.json();
        setFeaturedAccounts(data.accounts || []);
      }
    } catch (error) {
      console.error('Error fetching featured accounts:', error);
    }
  };

  const handleFeaturedAccountToggleActive = async (id: string) => {
    try {
      const account = featuredAccounts.find(a => a.id === id);
      if (!account) return;

      const response = await fetch(`/api/admin/featured-accounts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !account.active })
      });

      if (response.ok) {
        await fetchFeaturedAccounts();
      } else {
        alert('Có lỗi khi cập nhật featured account');
      }
    } catch (error) {
      console.error('Error toggling featured account:', error);
      alert('Có lỗi khi cập nhật featured account');
    }
  };

  const handleFeaturedAccountDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa featured account này?")) return;

    try {
      const response = await fetch(`/api/admin/featured-accounts/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchFeaturedAccounts();
        alert('Xóa thành công!');
      } else {
        alert('Có lỗi khi xóa featured account');
      }
    } catch (error) {
      console.error('Error deleting featured account:', error);
      alert('Có lỗi khi xóa featured account');
    }
  };

  if (!isAuthenticated || user?.role !== "admin") {
    return null;
  }

  const stats = {
    partners: {
      total: partners.length,
      active: partners.filter(p => p.active).length
    },
    tradingAccounts: {
      total: tradingAccounts.length,
      active: tradingAccounts.filter(a => a.active).length
    },
    featuredAccounts: {
      total: featuredAccounts.length,
      active: featuredAccounts.filter(a => a.active).length
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20">
        {/* Header */}
        <section className="py-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container-custom">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold flex items-center gap-3">
                  <TrendingUp size={40} />
                  Content Dashboard
                </h1>
                <p className="text-blue-100 mt-2">
                  Quản lý Partners, Trading Accounts và Featured Results (MongoDB)
                </p>
              </div>
              <button
                onClick={fetchAllData}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-8">
          <div className="container-custom">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <Building2 className="text-blue-600" size={32} />
                </div>
                <p className="text-3xl font-bold text-gray-800">{stats.partners.total}</p>
                <p className="text-sm text-gray-600">Total Partners</p>
                <p className="text-xs text-gray-500 mt-1">{stats.partners.active} active</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="text-green-600" size={32} />
                </div>
                <p className="text-3xl font-bold text-gray-800">{stats.tradingAccounts.total}</p>
                <p className="text-sm text-gray-600">Trading Accounts</p>
                <p className="text-xs text-gray-500 mt-1">{stats.tradingAccounts.active} active</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <Star className="text-yellow-600" size={32} />
                </div>
                <p className="text-3xl font-bold text-gray-800">{stats.featuredAccounts.total}</p>
                <p className="text-sm text-gray-600">Featured Accounts</p>
                <p className="text-xs text-gray-500 mt-1">{stats.featuredAccounts.active} active</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-md mb-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 px-6">
                  <button
                    onClick={() => setActiveTab('partners')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                      activeTab === 'partners'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Building2 size={16} />
                    Partners ({stats.partners.total})
                  </button>
                  <button
                    onClick={() => setActiveTab('trading-accounts')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                      activeTab === 'trading-accounts'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <TrendingUp size={16} />
                    Trading Accounts ({stats.tradingAccounts.total})
                  </button>
                  <button
                    onClick={() => setActiveTab('featured-accounts')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                      activeTab === 'featured-accounts'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Star size={16} />
                    Featured Accounts ({stats.featuredAccounts.total})
                  </button>
                </nav>
              </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {loading ? (
                <div className="p-12 text-center">
                  <RefreshCw size={40} className="animate-spin mx-auto text-blue-600 mb-4" />
                  <p className="text-gray-600">Loading data from MongoDB...</p>
                </div>
              ) : (
                <>
                  {/* Partners Tab */}
                  {activeTab === 'partners' && (
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Partners Management</h2>
                        <div className="flex gap-2">
                          <a
                            href="/admin/content-dashboard/import"
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                          >
                            <Upload size={18} />
                            Import Data
                          </a>
                          <button
                            onClick={() => router.push('/admin/content-dashboard/partners/create')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                          >
                            <Plus size={18} />
                            Add Partner
                          </button>
                        </div>
                      </div>
                      
                      {partners.length === 0 ? (
                        <div className="text-center py-12">
                          <Building2 size={48} className="mx-auto text-gray-400 mb-4" />
                          <p className="text-gray-600 mb-4">Chưa có partners nào</p>
                          <a
                            href="/admin/content-dashboard/import"
                            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            Import từ data files
                          </a>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {partners.map((partner) => (
                            <div
                              key={partner.id}
                              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-xl font-bold">{partner.name}</h3>
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                      partner.active 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'bg-gray-100 text-gray-600'
                                    }`}>
                                      {partner.active ? 'Active' : 'Inactive'}
                                    </span>
                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                                      ⭐ {partner.rating}/5.0
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600">{partner.website}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handlePartnerToggleActive(partner.id)}
                                    className={`p-2 rounded ${
                                      partner.active 
                                        ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' 
                                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                                    }`}
                                    title={partner.active ? 'Deactivate' : 'Activate'}
                                  >
                                    {partner.active ? <EyeOff size={18} /> : <Eye size={18} />}
                                  </button>
                                  <button
                                    onClick={() => router.push(`/admin/content-dashboard/partners/edit/${partner.id}`)}
                                    className="p-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                                    title="Edit"
                                  >
                                    <Edit size={18} />
                                  </button>
                                  <button
                                    onClick={() => handlePartnerDelete(partner.id)}
                                    className="p-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
                                    title="Delete"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                  <button
                                    onClick={() => setExpandedId(expandedId === partner.id ? null : partner.id)}
                                    className="p-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                                    title="Toggle details"
                                  >
                                    {expandedId === partner.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                  </button>
                                </div>
                              </div>
                              {expandedId === partner.id && (
                                <div className="mt-4 pt-4 border-t border-gray-200 grid md:grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <strong className="text-gray-700">Order:</strong>
                                    <p className="text-gray-600">#{partner.order}</p>
                                  </div>
                                  <div>
                                    <strong className="text-gray-700">Website:</strong>
                                    <p className="text-gray-600">
                                      <a href={partner.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                        {partner.website}
                                      </a>
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Trading Accounts Tab */}
                  {activeTab === 'trading-accounts' && (
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Trading Accounts Management</h2>
                        <button
                          onClick={() => router.push('/admin/content-dashboard/trading-accounts/create')}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                        >
                          <Plus size={18} />
                          Add Account
                        </button>
                      </div>
                      
                      {tradingAccounts.length === 0 ? (
                        <div className="text-center py-12">
                          <TrendingUp size={48} className="mx-auto text-gray-400 mb-4" />
                          <p className="text-gray-600 mb-4">Chưa có trading accounts nào</p>
                          <a
                            href="/admin/content-dashboard/import"
                            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            Import từ data files
                          </a>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {tradingAccounts.map((account) => (
                            <div
                              key={account.id}
                              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-xl font-bold">{account.broker}</h3>
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                      account.active 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'bg-gray-100 text-gray-600'
                                    }`}>
                                      {account.active ? 'Active' : 'Inactive'}
                                    </span>
                                  </div>
                                  <div className="flex gap-4 text-sm text-gray-600">
                                    <span><strong>Account:</strong> {account.account}</span>
                                    <span><strong>Gain:</strong> {account.gain}</span>
                                    <span><strong>Balance:</strong> {account.balance}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleTradingAccountToggleActive(account.id)}
                                    className={`p-2 rounded ${
                                      account.active 
                                        ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' 
                                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                                    }`}
                                    title={account.active ? 'Deactivate' : 'Activate'}
                                  >
                                    {account.active ? <EyeOff size={18} /> : <Eye size={18} />}
                                  </button>
                                  <button
                                    onClick={() => router.push(`/admin/content-dashboard/trading-accounts/edit/${account.id}`)}
                                    className="p-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                                    title="Edit"
                                  >
                                    <Edit size={18} />
                                  </button>
                                  <button
                                    onClick={() => handleTradingAccountDelete(account.id)}
                                    className="p-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
                                    title="Delete"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Featured Accounts Tab */}
                  {activeTab === 'featured-accounts' && (
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Featured Accounts Management</h2>
                        <button
                          onClick={() => router.push('/admin/content-dashboard/featured-accounts/create')}
                          className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 flex items-center gap-2"
                        >
                          <Plus size={18} />
                          Add Featured
                        </button>
                      </div>
                      
                      {featuredAccounts.length === 0 ? (
                        <div className="text-center py-12">
                          <Star size={48} className="mx-auto text-gray-400 mb-4" />
                          <p className="text-gray-600 mb-4">Chưa có featured accounts nào</p>
                          <a
                            href="/admin/content-dashboard/import"
                            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            Import từ data files
                          </a>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {featuredAccounts
                            .sort((a, b) => a.order - b.order)
                            .map((account) => (
                            <div
                              key={account.id}
                              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-bold">
                                      #{account.order}
                                    </span>
                                    <h3 className="text-xl font-bold">{account.broker}</h3>
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                      account.active 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'bg-gray-100 text-gray-600'
                                    }`}>
                                      {account.active ? 'Active' : 'Inactive'}
                                    </span>
                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                                      {account.year}
                                    </span>
                                  </div>
                                  <div className="flex gap-4 text-sm text-gray-600">
                                    <span><strong>Account:</strong> {account.accountNumber}</span>
                                    <span><strong>Gain:</strong> {account.gain}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleFeaturedAccountToggleActive(account.id)}
                                    className={`p-2 rounded ${
                                      account.active 
                                        ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' 
                                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                                    }`}
                                    title={account.active ? 'Deactivate' : 'Activate'}
                                  >
                                    {account.active ? <EyeOff size={18} /> : <Eye size={18} />}
                                  </button>
                                  <button
                                    onClick={() => router.push(`/admin/content-dashboard/featured-accounts/edit/${account.id}`)}
                                    className="p-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                                    title="Edit"
                                  >
                                    <Edit size={18} />
                                  </button>
                                  <button
                                    onClick={() => handleFeaturedAccountDelete(account.id)}
                                    className="p-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
                                    title="Delete"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
