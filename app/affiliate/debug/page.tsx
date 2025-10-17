"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/authContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AlertCircle, CheckCircle, Info, User, Mail, Key } from "lucide-react";

export default function AffiliateDebugPage() {
  const { user, isAuthenticated } = useAuth();
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchDebugInfo();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const fetchDebugInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/affiliate/check-access', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setDebugInfo(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-20">
          <div className="container-custom py-20 text-center">
            <AlertCircle size={64} className="mx-auto mb-4 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Authentication Required</h1>
            <p className="text-gray-600">Please login to view affiliate debug information.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-20">
          <div className="container-custom py-20 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading debug information...</p>
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
            <Info size={40} />
            Affiliate Debug Information
          </h1>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
              <p className="text-red-600">❌ {error}</p>
            </div>
          )}

          <div className="max-w-4xl mx-auto space-y-6">
            {/* User Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <User size={24} />
                User Information
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail size={20} className="text-gray-500" />
                    <span className="font-semibold">Email:</span>
                    <span>{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User size={20} className="text-gray-500" />
                    <span className="font-semibold">Username:</span>
                    <span>{user?.username}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Key size={20} className="text-gray-500" />
                    <span className="font-semibold">Affiliate Status:</span>
                    <span className={`px-2 py-1 rounded text-sm ${
                      user?.affiliateStatus === 'approved' ? 'bg-green-100 text-green-800' :
                      user?.affiliateStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      user?.affiliateStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user?.affiliateStatus || 'none'}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <span className="font-semibold">Affiliate Code:</span>
                    <p className="font-mono text-lg bg-gray-100 p-2 rounded mt-1">
                      {user?.affiliateCode || 'NOT ASSIGNED'}
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold">Membership:</span>
                    <p className="text-lg">{user?.membershipTier} {user?.isPaid ? '(Paid)' : '(Free)'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Debug Information */}
            {debugInfo && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Info size={24} />
                  Debug Information
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    {debugInfo.canAccessDashboard ? (
                      <CheckCircle size={24} className="text-green-600" />
                    ) : (
                      <AlertCircle size={24} className="text-red-600" />
                    )}
                    <span className="font-semibold">Dashboard Access:</span>
                    <span className={debugInfo.canAccessDashboard ? 'text-green-600' : 'text-red-600'}>
                      {debugInfo.canAccessDashboard ? '✅ Can Access' : '❌ Cannot Access'}
                    </span>
                  </div>
                  
                  <div>
                    <span className="font-semibold">Reason:</span>
                    <p className="text-gray-700 mt-1">{debugInfo.reason}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Recommendations */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">🔧 Recommendations</h2>
              
              {!user?.affiliateCode ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-semibold text-yellow-800 mb-2">No Affiliate Code</h3>
                  <p className="text-yellow-700 text-sm">
                    Your account doesn't have an affiliate code. This usually means:
                  </p>
                  <ul className="text-yellow-700 text-sm mt-2 space-y-1">
                    <li>• You haven't applied for affiliate program yet</li>
                    <li>• Your application is still pending</li>
                    <li>• There was an error during application process</li>
                  </ul>
                  <p className="text-yellow-700 text-sm mt-2">
                    <strong>Solution:</strong> Go to <a href="/referral/apply" className="underline">/referral/apply</a> to apply for affiliate program.
                  </p>
                </div>
              ) : user?.affiliateStatus !== 'approved' ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-semibold text-yellow-800 mb-2">Affiliate Not Approved</h3>
                  <p className="text-yellow-700 text-sm">
                    Your affiliate status is "{user.affiliateStatus}". You need admin approval to access the dashboard.
                  </p>
                  <p className="text-yellow-700 text-sm mt-2">
                    <strong>Solution:</strong> Contact admin to approve your affiliate application.
                  </p>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-2">✅ All Good!</h3>
                  <p className="text-green-700 text-sm">
                    Your affiliate account is properly configured. You should be able to access the dashboard.
                  </p>
                  <p className="text-green-700 text-sm mt-2">
                    <strong>Next:</strong> Go to <a href="/affiliate/dashboard" className="underline">/affiliate/dashboard</a> to view your stats and tracking links.
                  </p>
                </div>
              )}
            </div>

            {/* Raw Data */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">📊 Raw Data</h2>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-60">
                {JSON.stringify({ user, debugInfo }, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
