"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/authContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AffiliateTestPage() {
  const { user, isAuthenticated, token, refreshUser } = useAuth();
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    const fetchDebugInfo = async () => {
      try {
        const tokenValue = localStorage.getItem('token');
        const userValue = localStorage.getItem('user');
        
        setDebugInfo({
          isAuthenticated,
          user,
          token,
          localStorageToken: tokenValue ? 'exists' : 'missing',
          localStorageUser: userValue ? 'exists' : 'missing',
          userParsed: userValue ? JSON.parse(userValue) : null
        });
      } catch (error: any) {
        setDebugInfo({ error: error.message });
      }
    };

    fetchDebugInfo();
  }, [isAuthenticated, user, token]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20">
        <div className="container-custom py-8">
          <h1 className="text-4xl font-bold text-center mb-8">
            🔍 Affiliate Authentication Debug
          </h1>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-4">Authentication Status</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">isAuthenticated:</span>
                  <span className={`px-2 py-1 rounded text-sm ${
                    isAuthenticated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {String(isAuthenticated)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-semibold">user loaded:</span>
                  <span className={`px-2 py-1 rounded text-sm ${
                    user ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user ? 'Yes' : 'No'}
                  </span>
                </div>

                {user && (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">username:</span>
                      <span>{user.username}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-semibold">email:</span>
                      <span>{user.email}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-semibold">affiliateStatus:</span>
                      <span className={`px-2 py-1 rounded text-sm ${
                        user.affiliateStatus === 'approved' ? 'bg-green-100 text-green-800' :
                        user.affiliateStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {user.affiliateStatus || 'none'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-semibold">affiliateCode:</span>
                      <span className="font-mono">{user.affiliateCode || 'NOT SET'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-semibold">membershipTier:</span>
                      <span>{user.membershipTier || 'free'}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-4">Raw Debug Data</h2>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-60">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
              
              <div className="mb-6">
                <button
                  onClick={async () => {
                    await refreshUser();
                    // Refresh debug info after user refresh
                    const tokenValue = localStorage.getItem('token');
                    const userValue = localStorage.getItem('user');
                    setDebugInfo({
                      isAuthenticated,
                      user,
                      token,
                      localStorageToken: tokenValue ? 'exists' : 'missing',
                      localStorageUser: userValue ? 'exists' : 'missing',
                      userParsed: userValue ? JSON.parse(userValue) : null
                    });
                  }}
                  className="w-full px-6 py-3 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700 transition-colors"
                >
                  🔄 Refresh User Data (Force Update from Database)
                </button>
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Click this if admin approved your affiliate status but you still see "none"
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <a
                  href="/affiliate/dashboard"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg text-center hover:bg-blue-700 transition-colors"
                >
                  Go to Affiliate Dashboard
                </a>
                
                <a
                  href="/affiliate/debug"
                  className="px-6 py-3 bg-green-600 text-white rounded-lg text-center hover:bg-green-700 transition-colors"
                >
                  Go to Affiliate Debug
                </a>
                
                <a
                  href="/referral"
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg text-center hover:bg-purple-700 transition-colors"
                >
                  Go to Referral Page
                </a>
                
                <a
                  href="/admin/affiliates"
                  className="px-6 py-3 bg-orange-600 text-white rounded-lg text-center hover:bg-orange-700 transition-colors"
                >
                  Go to Admin Affiliates
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
