"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Copy, ExternalLink, CheckCircle, AlertCircle, Users, DollarSign } from "lucide-react";

export default function AffiliateTestPage() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (step: string, status: 'success' | 'error' | 'info', message: string, data?: any) => {
    setTestResults(prev => [...prev, {
      step,
      status,
      message,
      data,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const testAffiliateFlow = async () => {
    setLoading(true);
    clearResults();
    
    addResult("1. Setup", "info", "Bắt đầu test quy trình affiliate...");

    try {
      // Step 1: Test affiliate registration
      addResult("2. Registration", "info", "Testing affiliate registration...");
      
      const registerResponse = await fetch('/api/affiliate/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          fullName: "Test Affiliate",
          phone: "0123456789",
          company: "Test Company",
          website: "https://test.com",
          experience: "5 years",
          audience: "1000+ followers",
          promochannel: "Facebook, Telegram",
          reason: "Want to earn commission"
        }),
      });

      const registerData = await registerResponse.json();
      
      if (registerData.success) {
        addResult("2. Registration", "success", "✅ Đăng ký affiliate thành công", registerData);
      } else {
        addResult("2. Registration", "error", `❌ Lỗi đăng ký: ${registerData.message}`, registerData);
      }

      // Step 2: Test tracking links generation
      addResult("3. Generate Links", "info", "Testing tracking links generation...");
      
      const linksResponse = await fetch('/api/affiliate/links', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const linksData = await linksResponse.json();
      
      if (linksData.success) {
        addResult("3. Generate Links", "success", `✅ Tạo được ${linksData.products.length} tracking links`, linksData.products);
      } else {
        addResult("3. Generate Links", "error", `❌ Lỗi tạo links: ${linksData.message}`, linksData);
      }

      // Step 3: Test click tracking
      if (linksData.success && linksData.products.length > 0) {
        addResult("4. Click Tracking", "info", "Testing click tracking...");
        
        const testLink = linksData.products[0];
        const trackResponse = await fetch('/api/affiliate/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            affiliateCode: testLink.trackingLink.split('affiliate=')[1].split('&')[0],
            productId: testLink.id,
            productName: testLink.name,
          }),
        });

        const trackData = await trackResponse.json();
        
        if (trackData.success) {
          addResult("4. Click Tracking", "success", "✅ Track click thành công", trackData);
        } else {
          addResult("4. Click Tracking", "error", `❌ Lỗi track click: ${trackData.message}`, trackData);
        }
      }

      // Step 4: Test stats retrieval
      addResult("5. Get Stats", "info", "Testing stats retrieval...");
      
      const statsResponse = await fetch(`/api/affiliate/track?affiliateCode=${linksData.affiliateCode}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const statsData = await statsResponse.json();
      
      if (statsData.success) {
        addResult("5. Get Stats", "success", "✅ Lấy stats thành công", statsData.stats);
      } else {
        addResult("5. Get Stats", "error", `❌ Lỗi lấy stats: ${statsData.message}`, statsData);
      }

    } catch (error: any) {
      addResult("Error", "error", `❌ Lỗi hệ thống: ${error.message}`, error);
    }

    setLoading(false);
    addResult("Complete", "info", "🎉 Test hoàn thành!");
  };

  const testConversionFlow = async () => {
    setLoading(true);
    addResult("Conversion Test", "info", "Testing conversion tracking...");

    try {
      // Simulate a conversion by calling the webhook directly
      const webhookResponse = await fetch('/api/webhooks/stripe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'checkout.session.completed',
          data: {
            object: {
              id: 'test_session_' + Date.now(),
              amount_total: 7900000, // 79,000,000 VND
              customer_email: 'test@example.com',
              metadata: {
                productId: 'ea-full',
                customerName: 'Test Customer',
                customerPhone: '0123456789',
                affiliateCode: 'AFF-TEST-ABC123'
              }
            }
          }
        }),
      });

      const webhookData = await webhookResponse.json();
      addResult("Conversion Test", "success", "✅ Test conversion thành công", webhookData);

    } catch (error: any) {
      addResult("Conversion Test", "error", `❌ Lỗi test conversion: ${error.message}`, error);
    }

    setLoading(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    addResult("Copy", "success", "✅ Đã copy vào clipboard");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20">
        <div className="container-custom py-8">
          <h1 className="text-4xl font-bold text-center mb-8 flex items-center justify-center gap-3">
            <Users size={40} />
            Affiliate System Test
          </h1>

          <div className="max-w-4xl mx-auto">
            {/* Test Controls */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-4">🧪 Test Controls</h2>
              
              <div className="flex gap-4 mb-4">
                <button
                  onClick={testAffiliateFlow}
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Testing...' : 'Test Full Flow'}
                </button>
                
                <button
                  onClick={testConversionFlow}
                  disabled={loading}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  Test Conversion
                </button>
                
                <button
                  onClick={clearResults}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                >
                  Clear Results
                </button>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">📋 Hướng dẫn test:</h3>
                <ol className="text-sm text-yellow-700 space-y-1">
                  <li>1. Đăng nhập với tài khoản có affiliate status</li>
                  <li>2. Click "Test Full Flow" để test toàn bộ quy trình</li>
                  <li>3. Click "Test Conversion" để test conversion tracking</li>
                  <li>4. Xem kết quả chi tiết bên dưới</li>
                </ol>
              </div>
            </div>

            {/* Test Results */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">📊 Test Results</h2>
              
              {testResults.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <AlertCircle size={48} className="mx-auto mb-4" />
                  <p>Chưa có kết quả test nào. Hãy click "Test Full Flow" để bắt đầu.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {testResults.map((result, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-l-4 ${
                        result.status === 'success' 
                          ? 'bg-green-50 border-green-400' 
                          : result.status === 'error'
                          ? 'bg-red-50 border-red-400'
                          : 'bg-blue-50 border-blue-400'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {result.status === 'success' && <CheckCircle size={20} className="text-green-600" />}
                            {result.status === 'error' && <AlertCircle size={20} className="text-red-600" />}
                            {result.status === 'info' && <ExternalLink size={20} className="text-blue-600" />}
                            <span className="font-semibold">{result.step}</span>
                            <span className="text-sm text-gray-500">({result.timestamp})</span>
                          </div>
                          <p className="text-sm">{result.message}</p>
                          
                          {result.data && (
                            <details className="mt-2">
                              <summary className="text-sm text-gray-600 cursor-pointer hover:text-gray-800">
                                Xem chi tiết
                              </summary>
                              <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-40">
                                {JSON.stringify(result.data, null, 2)}
                              </pre>
                            </details>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Manual Test Instructions */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-8">
              <h2 className="text-2xl font-semibold mb-4">📖 Manual Test Instructions</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 text-green-600">✅ Test Affiliate Registration</h3>
                  <ol className="text-sm space-y-2">
                    <li>1. Go to <code className="bg-gray-100 px-2 py-1 rounded">/referral/apply</code></li>
                    <li>2. Fill the application form</li>
                    <li>3. Submit and check status</li>
                    <li>4. Admin approve in MongoDB</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 text-blue-600">🔗 Test Tracking Links</h3>
                  <ol className="text-sm space-y-2">
                    <li>1. Go to <code className="bg-gray-100 px-2 py-1 rounded">/affiliate/dashboard</code></li>
                    <li>2. Copy tracking links</li>
                    <li>3. Test format: <code className="bg-gray-100 px-2 py-1 rounded">?affiliate=AFF-USER-ABC123&product=ea-full</code></li>
                    <li>4. Check click tracking</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 text-purple-600">💰 Test Conversion</h3>
                  <ol className="text-sm space-y-2">
                    <li>1. Use affiliate link to visit site</li>
                    <li>2. Go to checkout with affiliate params</li>
                    <li>3. Complete payment (test mode)</li>
                    <li>4. Check webhook processes conversion</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 text-orange-600">📊 Test Dashboard</h3>
                  <ol className="text-sm space-y-2">
                    <li>1. View real-time stats</li>
                    <li>2. Check commission calculations</li>
                    <li>3. Monitor click/conversion rates</li>
                    <li>4. Generate new tracking links</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Sample Tracking Links */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-8">
              <h2 className="text-2xl font-semibold mb-4">🔗 Sample Tracking Links</h2>
              
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">EA Full Version</h3>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-gray-100 p-2 rounded text-sm">
                      https://thebenchmarktrader.com?affiliate=AFF-TEST-ABC123&product=ea-full
                    </code>
                    <button
                      onClick={() => copyToClipboard('https://thebenchmarktrader.com?affiliate=AFF-TEST-ABC123&product=ea-full')}
                      className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">EA Pro + Source</h3>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-gray-100 p-2 rounded text-sm">
                      https://thebenchmarktrader.com?affiliate=AFF-TEST-ABC123&product=ea-pro-source
                    </code>
                    <button
                      onClick={() => copyToClipboard('https://thebenchmarktrader.com?affiliate=AFF-TEST-ABC123&product=ea-pro-source')}
                      className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Multi-Indicator Pack</h3>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-gray-100 p-2 rounded text-sm">
                      https://thebenchmarktrader.com?affiliate=AFF-TEST-ABC123&product=indicator-pro
                    </code>
                    <button
                      onClick={() => copyToClipboard('https://thebenchmarktrader.com?affiliate=AFF-TEST-ABC123&product=indicator-pro')}
                      className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
