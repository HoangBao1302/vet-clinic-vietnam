"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Shield, Plus, Edit, Trash2, Eye, EyeOff, 
  Building2, TrendingUp, Star, Save, X, 
  ChevronDown, ChevronUp
} from "lucide-react";
import { useAuth } from "@/lib/authContext";
import { partners, PartnerInfo } from "@/data/partners";
import { tradingAccounts, TradingAccount } from "@/data/tradingAccounts";
import { featuredAccounts, FeaturedAccount } from "@/data/featuredAccounts";

type TabType = 'partners' | 'trading-accounts' | 'featured-accounts';

export default function ContentDashboard() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('partners');
  const [localPartners, setLocalPartners] = useState<PartnerInfo[]>(partners);
  const [localTradingAccounts, setLocalTradingAccounts] = useState<TradingAccount[]>(tradingAccounts);
  const [localFeaturedAccounts, setLocalFeaturedAccounts] = useState<FeaturedAccount[]>(featuredAccounts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/admin/content-dashboard");
      return;
    }
    if (user?.role !== "admin") {
      router.push("/");
      return;
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== "admin") {
    return null;
  }

  // Partners handlers
  const handlePartnerToggleActive = (id: string) => {
    setLocalPartners(prev => 
      prev.map(p => p.id === id ? { ...p, active: !p.active } : p)
    );
  };

  const handlePartnerDelete = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa partner này?")) {
      setLocalPartners(prev => prev.filter(p => p.id !== id));
    }
  };

  // Trading Accounts handlers
  const handleTradingAccountToggleActive = (id: string) => {
    setLocalTradingAccounts(prev => 
      prev.map(a => a.id === id ? { ...a, active: !a.active } : a)
    );
  };

  const handleTradingAccountDelete = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) {
      setLocalTradingAccounts(prev => prev.filter(a => a.id !== id));
    }
  };

  // Featured Accounts handlers
  const handleFeaturedAccountToggleActive = (id: string) => {
    setLocalFeaturedAccounts(prev => 
      prev.map(a => a.id === id ? { ...a, active: !a.active } : a)
    );
  };

  const handleFeaturedAccountDelete = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa featured account này?")) {
      setLocalFeaturedAccounts(prev => prev.filter(a => a.id !== id));
    }
  };

  const handleSave = async () => {
    // TODO: Implement API to save to database or file
    alert("Lưu thành công! (Chức năng này cần API backend để lưu vào database/file)");
  };

  const stats = {
    partners: {
      total: localPartners.length,
      active: localPartners.filter(p => p.active).length
    },
    tradingAccounts: {
      total: localTradingAccounts.length,
      active: localTradingAccounts.filter(a => a.active).length
    },
    featuredAccounts: {
      total: localFeaturedAccounts.length,
      active: localFeaturedAccounts.filter(a => a.active).length
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
                  Quản lý Partners, Trading Accounts và Featured Results
                </p>
              </div>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                <Save size={20} />
                Lưu Tất Cả
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
              {activeTab === 'partners' && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Partners Management</h2>
                    <button
                      onClick={() => router.push('/admin/content-dashboard/partners/create')}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Plus size={18} />
                      Thêm Partner
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {localPartners.map((partner) => (
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
                            >
                              {partner.active ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                            <button
                              onClick={() => router.push(`/admin/content-dashboard/partners/edit/${partner.id}`)}
                              className="p-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handlePartnerDelete(partner.id)}
                              className="p-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
                            >
                              <Trash2 size={18} />
                            </button>
                            <button
                              onClick={() => setExpandedId(expandedId === partner.id ? null : partner.id)}
                              className="p-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                            >
                              {expandedId === partner.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </button>
                          </div>
                        </div>
                        {expandedId === partner.id && (
                          <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 text-sm">
                            <div><strong>Spread:</strong> {partner.spread.length} items</div>
                            <div><strong>License:</strong> {partner.license.length} items</div>
                            <div><strong>Deposit:</strong> {partner.deposit.length} items</div>
                            <div><strong>Support:</strong> {partner.support.length} items</div>
                            <div><strong>Notes:</strong> {partner.notes.length} items</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'trading-accounts' && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Trading Accounts Management</h2>
                    <button
                      onClick={() => router.push('/admin/content-dashboard/trading-accounts/create')}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <Plus size={18} />
                      Thêm Account
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {localTradingAccounts.map((account) => (
                      <div
                        key={account.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold">{account.accountName}</h3>
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                account.active 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                {account.active ? 'Active' : 'Inactive'}
                              </span>
                              {account.verified && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                                  ✓ Verified
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                              <span><strong>Platform:</strong> {account.platform}</span>
                              <span>•</span>
                              <span><strong>Broker:</strong> {account.broker}</span>
                              <span>•</span>
                              <span><strong>Account:</strong> {account.accountNumber}</span>
                            </div>
                            <div className="flex gap-4 mt-2 text-sm">
                              <span className="text-green-600 font-semibold">Gain: {account.stats.gain}</span>
                              <span className="text-red-600 font-semibold">DD: {account.stats.drawdown}</span>
                              <span className="text-blue-600 font-semibold">WR: {account.stats.winRate}</span>
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
                            >
                              {account.active ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                            <button
                              onClick={() => router.push(`/admin/content-dashboard/trading-accounts/edit/${account.id}`)}
                              className="p-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleTradingAccountDelete(account.id)}
                              className="p-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'featured-accounts' && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Featured Accounts Management</h2>
                    <button
                      onClick={() => router.push('/admin/content-dashboard/featured-accounts/create')}
                      className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                    >
                      <Plus size={18} />
                      Thêm Featured
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {localFeaturedAccounts
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
                              <h3 className="text-xl font-bold">{account.name}</h3>
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                account.active 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                {account.active ? 'Active' : 'Inactive'}
                              </span>
                              {account.copyable && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                                  Copy ✓
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-2">
                              <span><strong>Platform:</strong> {account.platform}</span>
                              <span>•</span>
                              <span><strong>Broker:</strong> {account.broker}</span>
                            </div>
                            <div className="flex gap-4 text-sm">
                              <span className="text-green-600 font-semibold">Gain: {account.gain}</span>
                              <span className="text-red-600 font-semibold">DD: {account.drawdown}</span>
                              <span className="text-gray-600 font-semibold">Days: {account.days}</span>
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
                            >
                              {account.active ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                            <button
                              onClick={() => router.push(`/admin/content-dashboard/featured-accounts/edit/${account.id}`)}
                              className="p-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleFeaturedAccountDelete(account.id)}
                              className="p-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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

