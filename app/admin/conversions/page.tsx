"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Search, AlertCircle, CheckCircle, Clock, DollarSign, User, Mail } from "lucide-react";

interface Conversion {
  _id: string;
  affiliateCode: string;
  clickedAt: Date;
  convertedAt: Date;
  orderId: string;
  commissionAmount: number;
  productId: string;
  productName: string;
  customerEmail: string;
  customerName: string;
  status: string;
}

interface Affiliate {
  _id: string;
  username: string;
  email: string;
  affiliateCode: string;
  affiliateStatus: string;
  membershipTier: string;
  isPaid: boolean;
}

export default function AdminConversionsPage() {
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [selectedAffiliate, setSelectedAffiliate] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/admin/conversions');
      const data = await response.json();
      
      if (data.success) {
        setConversions(data.recentConversions);
        setAffiliates(data.affiliates);
      } else {
        setError(data.error || 'Failed to fetch data');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const searchConversions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedAffiliate) params.append('affiliateCode', selectedAffiliate);
      if (searchEmail) params.append('customerEmail', searchEmail);

      const response = await fetch(`/api/admin/conversions?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setConversions(data.recentConversions);
      } else {
        setError(data.error || 'Failed to search');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createTestConversion = async () => {
    try {
      const response = await fetch('/api/admin/conversions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: 'test_order_' + Date.now(),
          affiliateCode: 'AFF-HOANGKIM-BD295D',
          customerEmail: 'kietdangtong0812@test.com',
          productId: 'ea-full',
          amount: 7900000
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert(`✅ Test conversion created! Commission: ${data.commissionAmount.toLocaleString('vi-VN')}đ`);
        fetchData(); // Refresh data
      } else {
        alert(`❌ Failed: ${data.error}`);
      }
    } catch (err: any) {
      alert(`❌ Error: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-20">
          <div className="container-custom py-20 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading conversions...</p>
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
        <div className="container-custom py-8">
          <h1 className="text-4xl font-bold text-center mb-8 flex items-center justify-center gap-3">
            <DollarSign size={40} />
            Admin Conversions
          </h1>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
              <p className="text-red-600">❌ {error}</p>
            </div>
          )}

          {/* Search Controls */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">🔍 Search Conversions</h2>
            
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Affiliate</label>
                <select
                  value={selectedAffiliate}
                  onChange={(e) => setSelectedAffiliate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Affiliates</option>
                  {affiliates.map((affiliate) => (
                    <option key={affiliate._id} value={affiliate.affiliateCode}>
                      {affiliate.username} ({affiliate.affiliateCode})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Customer Email</label>
                <input
                  type="text"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  placeholder="e.g., kietdangtong0812"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={searchConversions}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  <Search size={20} />
                  Search
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={fetchData}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Refresh All
              </button>
              
              <button
                onClick={createTestConversion}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Create Test Conversion
              </button>
            </div>
          </div>

          {/* Conversions List */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">📊 Recent Conversions</h2>
            
            {conversions.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle size={64} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Conversions Found</h3>
                <p className="text-gray-500">No conversions found for the selected criteria.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {conversions.map((conversion) => (
                  <div key={conversion._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle size={20} className="text-green-600" />
                          <span className="font-semibold text-lg">Conversion #{conversion.orderId}</span>
                          <span className={`px-2 py-1 rounded text-sm ${
                            conversion.status === 'converted' ? 'bg-green-100 text-green-800' :
                            conversion.status === 'paid' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {conversion.status}
                          </span>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p><strong>Affiliate:</strong> {conversion.affiliateCode}</p>
                            <p><strong>Customer:</strong> {conversion.customerEmail}</p>
                            <p><strong>Product:</strong> {conversion.productName || conversion.productId}</p>
                          </div>
                          <div>
                            <p><strong>Commission:</strong> {conversion.commissionAmount?.toLocaleString('vi-VN')}đ</p>
                            <p><strong>Converted:</strong> {new Date(conversion.convertedAt).toLocaleString('vi-VN')}</p>
                            <p><strong>Clicked:</strong> {new Date(conversion.clickedAt).toLocaleString('vi-VN')}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Affiliates Summary */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-8">
            <h2 className="text-2xl font-semibold mb-4">👥 Affiliates Summary</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {affiliates.map((affiliate) => (
                <div key={affiliate._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <User size={20} className="text-blue-600" />
                    <span className="font-semibold">{affiliate.username}</span>
                    <span className={`px-2 py-1 rounded text-sm ${
                      affiliate.membershipTier === 'paid' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {affiliate.membershipTier}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><Mail size={16} className="inline mr-1" />{affiliate.email}</p>
                    <p><strong>Code:</strong> {affiliate.affiliateCode}</p>
                    <p><strong>Commission Rate:</strong> {affiliate.isPaid ? '35%' : '30%'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
