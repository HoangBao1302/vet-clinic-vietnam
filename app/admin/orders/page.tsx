'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Order {
  _id: string;
  orderId: string;
  productId: string;
  productName: string;
  status: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  amount: number;
  paymentMethod: string;
  createdAt: string;
  paidAt: string;
}

interface OrderStats {
  total: number;
  paid: number;
  pending: number;
  totalRevenue: number;
  byProduct: Record<string, number>;
  byPaymentMethod: Record<string, number>;
  recentOrders: Order[];
  invalidOrders: Order[];
}

export default function OrdersDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [filter, setFilter] = useState<'all' | 'valid' | 'invalid'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password protection (you should use proper auth in production)
    if (password === 'admin123') {
      setAuthenticated(true);
      fetchStats();
    } else {
      setError('Mật khẩu không đúng');
    }
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/orders/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fixOrder = async (orderId: string) => {
    if (!confirm(`Bạn có chắc muốn tự động fix order ${orderId}?`)) return;
    
    try {
      const response = await fetch('/api/admin/orders/fix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });
      
      if (!response.ok) throw new Error('Failed to fix order');
      
      alert('✅ Order đã được fix thành công!');
      fetchStats(); // Refresh data
    } catch (err: any) {
      alert(`❌ Lỗi: ${err.message}`);
    }
  };

  const fixAllLegacy = async () => {
    if (!confirm('Bạn có chắc muốn fix TẤT CẢ orders legacy (ea-full, ea-pro-source → ea-full-mt4, ea-pro-source-mt4)?')) return;
    
    try {
      const response = await fetch('/api/admin/orders/fix-all-legacy', {
        method: 'POST',
      });
      
      if (!response.ok) throw new Error('Failed to fix legacy orders');
      
      const result = await response.json();
      alert(`✅ Đã fix ${result.fixed} orders thành công!`);
      fetchStats(); // Refresh data
    } catch (err: any) {
      alert(`❌ Lỗi: ${err.message}`);
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">🔐 Admin Dashboard</h1>
          <form onSubmit={handleAuth}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Mật khẩu
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                placeholder="Nhập mật khẩu admin"
              />
            </div>
            {error && (
              <div className="mb-4 text-red-600 text-sm">{error}</div>
            )}
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
            >
              Đăng nhập
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">⏳ Đang tải dữ liệu...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">❌ Không thể tải dữ liệu</div>
      </div>
    );
  }

  const expectedPrices: Record<string, number> = {
    'ea-pro-source-mt4': 14900000,
    'ea-pro-source-mt5': 14900000,
    'ea-full-mt4': 7900000,
    'ea-full-mt5': 7900000,
    'indicator-pro-mt4': 1990000,
    'indicator-pro-mt5': 1990000,
  };

  const isOrderValid = (order: Order) => {
    const expectedPrice = expectedPrices[order.productId];
    if (!expectedPrice) return false;
    const actualPrice = order.amount / 100;
    return Math.abs(actualPrice - expectedPrice) < 1000;
  };

  const filteredOrders = stats.recentOrders.filter(order => {
    const matchesFilter = 
      filter === 'all' ? true :
      filter === 'valid' ? isOrderValid(order) :
      !isOrderValid(order);
    
    const matchesSearch = 
      searchTerm === '' ||
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">📊 Orders Dashboard</h1>
            <div className="flex gap-2">
              <button
                onClick={fixAllLegacy}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
              >
                🔧 Fix All Legacy
              </button>
              <button
                onClick={() => fetchStats()}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
              >
                🔄 Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-xl p-6">
            <div className="text-gray-500 text-sm font-semibold mb-2">Tổng đơn hàng</div>
            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-xl p-6">
            <div className="text-gray-500 text-sm font-semibold mb-2">Đã thanh toán</div>
            <div className="text-3xl font-bold text-green-600">{stats.paid}</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-xl p-6">
            <div className="text-gray-500 text-sm font-semibold mb-2">Đơn lỗi</div>
            <div className="text-3xl font-bold text-red-600">{stats.invalidOrders.length}</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-xl p-6">
            <div className="text-gray-500 text-sm font-semibold mb-2">Doanh thu</div>
            <div className="text-2xl font-bold text-purple-600">
              {(stats.totalRevenue / 100).toLocaleString('vi-VN')}đ
            </div>
          </div>
        </div>

        {/* Product Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">📦 Theo sản phẩm</h2>
            <div className="space-y-2">
              {Object.entries(stats.byProduct).map(([product, count]) => (
                <div key={product} className="flex justify-between items-center">
                  <span className="text-gray-700">{product}</span>
                  <span className="font-bold text-purple-600">{count}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">💳 Theo phương thức</h2>
            <div className="space-y-2">
              {Object.entries(stats.byPaymentMethod).map(([method, count]) => (
                <div key={method} className="flex justify-between items-center">
                  <span className="text-gray-700 capitalize">{method}</span>
                  <span className="font-bold text-purple-600">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Invalid Orders Alert */}
        {stats.invalidOrders.length > 0 && (
          <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-6 rounded-lg">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">⚠️</span>
              <h3 className="text-lg font-bold text-red-800">
                {stats.invalidOrders.length} đơn hàng có vấn đề!
              </h3>
            </div>
            <p className="text-red-700 mb-4">
              Các đơn hàng này có productId hoặc amount không khớp với giá chuẩn.
            </p>
            <button
              onClick={() => setFilter('invalid')}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Xem chi tiết
            </button>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="🔍 Tìm theo Order ID, Email, hoặc Tên..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg transition ${
                  filter === 'all'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Tất cả ({stats.recentOrders.length})
              </button>
              <button
                onClick={() => setFilter('valid')}
                className={`px-4 py-2 rounded-lg transition ${
                  filter === 'valid'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                ✅ Hợp lệ
              </button>
              <button
                onClick={() => setFilter('invalid')}
                className={`px-4 py-2 rounded-lg transition ${
                  filter === 'invalid'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                ❌ Lỗi ({stats.invalidOrders.length})
              </button>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Order ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Payment</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => {
                  const valid = isOrderValid(order);
                  const expectedPrice = expectedPrices[order.productId];
                  const actualPrice = order.amount / 100;
                  
                  return (
                    <tr key={order._id} className={!valid ? 'bg-red-50' : ''}>
                      <td className="px-4 py-3">
                        {valid ? (
                          <span className="text-green-600 text-xl">✅</span>
                        ) : (
                          <span className="text-red-600 text-xl">❌</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-mono text-gray-900">{order.orderId}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-900">{order.customerName}</div>
                        <div className="text-xs text-gray-500">{order.customerEmail}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-900">{order.productId}</div>
                        {!valid && expectedPrice && (
                          <div className="text-xs text-red-600">
                            Expected: {expectedPrice.toLocaleString('vi-VN')}đ
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className={`text-sm font-semibold ${!valid ? 'text-red-600' : 'text-gray-900'}`}>
                          {actualPrice.toLocaleString('vi-VN')}đ
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-900 capitalize">{order.paymentMethod}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-900">
                          {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleTimeString('vi-VN')}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {!valid && (
                          <button
                            onClick={() => fixOrder(order.orderId)}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition"
                          >
                            🔧 Fix
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {filteredOrders.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Không tìm thấy đơn hàng nào
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

