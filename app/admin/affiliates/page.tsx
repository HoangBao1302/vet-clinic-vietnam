"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Users, Copy, ExternalLink, DollarSign, MousePointer, CheckCircle } from "lucide-react";

interface Affiliate {
  _id: string;
  username: string;
  email: string;
  affiliateCode: string;
  membershipTier: string;
  isPaid: boolean;
  createdAt: string;
  stats: {
    totalClicks: number;
    conversions: number;
    conversionRate: string;
    totalCommission: number;
  };
}

export default function AdminAffiliatesPage() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAffiliates();
  }, []);

  const fetchAffiliates = async () => {
    try {
      const response = await fetch('/api/admin/affiliates');
      const data = await response.json();
      
      if (data.success) {
        setAffiliates(data.affiliates);
      } else {
        setError(data.error || 'Failed to fetch affiliates');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const generateTrackingLink = (affiliateCode: string, productId: string) => {
    return `https://thebenchmarktrader.com?affiliate=${affiliateCode}&product=${productId}`;
  };

  const getCommissionRate = (isPaid: boolean) => {
    return isPaid ? 35 : 30;
  };

  const getProductInfo = (productId: string) => {
    const products = {
      'ea-full': { name: 'EA Full Version', price: 7900000 },
      'ea-pro-source': { name: 'EA Pro + Source', price: 14900000 },
      'indicator-pro': { name: 'Multi-Indicator Pack', price: 1990000 },
    };
    return products[productId as keyof typeof products] || { name: 'Unknown', price: 0 };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-20">
          <div className="container-custom py-20 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading affiliates...</p>
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
            <Users size={40} />
            Approved Affiliates
          </h1>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
              <p className="text-red-600">❌ {error}</p>
            </div>
          )}

          {affiliates.length === 0 ? (
            <div className="text-center py-20">
              <Users size={64} className="mx-auto mb-4 text-gray-400" />
              <h2 className="text-2xl font-semibold text-gray-600 mb-2">No Approved Affiliates</h2>
              <p className="text-gray-500">No affiliates have been approved yet.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {affiliates.map((affiliate, index) => (
                <div key={affiliate._id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-800">
                        #{index + 1} {affiliate.username}
                      </h2>
                      <p className="text-gray-600">{affiliate.email}</p>
                      <p className="text-sm text-gray-500">
                        Joined: {new Date(affiliate.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-blue-600">
                        {affiliate.affiliateCode}
                      </p>
                      <p className="text-sm text-gray-500">
                        {affiliate.membershipTier} • {affiliate.isPaid ? 'Paid' : 'Free'}
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                      <MousePointer className="text-blue-600 mx-auto mb-2" size={24} />
                      <p className="text-2xl font-bold text-gray-800">{affiliate.stats.totalClicks}</p>
                      <p className="text-sm text-gray-600">Total Clicks</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <CheckCircle className="text-green-600 mx-auto mb-2" size={24} />
                      <p className="text-2xl font-bold text-gray-800">{affiliate.stats.conversions}</p>
                      <p className="text-sm text-gray-600">Conversions</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 text-center">
                      <ExternalLink className="text-purple-600 mx-auto mb-2" size={24} />
                      <p className="text-2xl font-bold text-gray-800">{affiliate.stats.conversionRate}%</p>
                      <p className="text-sm text-gray-600">Conversion Rate</p>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-4 text-center">
                      <DollarSign className="text-yellow-600 mx-auto mb-2" size={24} />
                      <p className="text-2xl font-bold text-gray-800">
                        {affiliate.stats.totalCommission.toLocaleString('vi-VN')}đ
                      </p>
                      <p className="text-sm text-gray-600">Total Commission</p>
                    </div>
                  </div>

                  {/* Tracking Links */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">🔗 Tracking Links</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      {['ea-full', 'ea-pro-source', 'indicator-pro'].map((productId) => {
                        const product = getProductInfo(productId);
                        const trackingLink = generateTrackingLink(affiliate.affiliateCode, productId);
                        const commissionRate = getCommissionRate(affiliate.isPaid);
                        const estimatedCommission = Math.round(product.price * commissionRate / 100);

                        return (
                          <div key={productId} className="border border-gray-200 rounded-lg p-4">
                            <h4 className="font-semibold mb-2">{product.name}</h4>
                            <p className="text-sm text-gray-600 mb-2">
                              Price: {product.price.toLocaleString('vi-VN')}đ
                            </p>
                            <p className="text-sm text-green-600 font-semibold mb-3">
                              Commission: {commissionRate}% ({estimatedCommission.toLocaleString('vi-VN')}đ)
                            </p>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={trackingLink}
                                readOnly
                                className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm bg-gray-50"
                              />
                              <button
                                onClick={() => copyToClipboard(trackingLink)}
                                className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 flex items-center gap-1"
                              >
                                <Copy size={16} />
                                Copy
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Test Instructions */}
                  <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">🧪 Test Instructions for {affiliate.username}:</h4>
                    <ol className="text-sm text-yellow-700 space-y-1">
                      <li>1. Copy one of the tracking links above</li>
                      <li>2. Open in new browser/incognito window</li>
                      <li>3. Check if affiliate notification appears</li>
                      <li>4. Go to checkout and complete test payment</li>
                      <li>5. Check if conversion is tracked</li>
                      <li>6. Refresh this page to see updated stats</li>
                    </ol>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Testing Summary */}
          <div className="mt-12 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">📋 Testing Summary</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3 text-green-600">✅ What to Test:</h3>
                <ul className="text-sm space-y-2">
                  <li>• Click tracking from affiliate links</li>
                  <li>• Conversion tracking on payment completion</li>
                  <li>• Commission calculation accuracy</li>
                  <li>• Dashboard stats updates</li>
                  <li>• Cookie-based conversion tracking</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3 text-blue-600">🔍 How to Monitor:</h3>
                <ul className="text-sm space-y-2">
                  <li>• Check browser console for tracking logs</li>
                  <li>• Monitor database for new records</li>
                  <li>• Verify webhook processing</li>
                  <li>• Check affiliate dashboard stats</li>
                  <li>• Test with different products</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
