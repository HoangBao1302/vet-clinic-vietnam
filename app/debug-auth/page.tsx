"use client";

import { useAuth } from "@/lib/authContext";
import { useState, useEffect } from "react";

export default function AuthDebugPage() {
  const { user, token, isAuthenticated, isLoading } = useAuth();
  const [localToken, setLocalToken] = useState<string | null>(null);
  const [localUser, setLocalUser] = useState<any>(null);
  const [apiTest, setApiTest] = useState<any>(null);

  useEffect(() => {
    // Get data from localStorage
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    setLocalToken(token);
    setLocalUser(user ? JSON.parse(user) : null);

    // Test API if we have token
    if (token) {
      testAPI(token);
    }
  }, []);

  const testAPI = async (token: string) => {
    try {
      const response = await fetch('/api/auth/validate', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const data = await response.ok ? await response.json() : await response.text();
      setApiTest({ status: response.status, ok: response.ok, data });
    } catch (error) {
      setApiTest({ error: error.message });
    }
  };

  const testAffiliateAccess = async () => {
    if (!token) return;
    
    try {
      const response = await fetch('/api/affiliate/check-access', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const data = await response.ok ? await response.json() : await response.text();
      console.log('Affiliate Access Test:', { status: response.status, ok: response.ok, data });
      alert(`Affiliate Access Test:\nStatus: ${response.status}\nOK: ${response.ok}\nData: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      console.error('Error testing affiliate access:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const navigateToDashboard = () => {
    window.location.href = '/affiliate/dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔍 Authentication Debug Page</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* AuthContext State */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">AuthContext State</h2>
            <div className="space-y-2 text-sm">
              <p><strong>isLoading:</strong> {String(isLoading)}</p>
              <p><strong>isAuthenticated:</strong> {String(isAuthenticated)}</p>
              <p><strong>hasToken:</strong> {String(!!token)}</p>
              <p><strong>hasUser:</strong> {String(!!user)}</p>
              <p><strong>User Email:</strong> {user?.email || 'None'}</p>
              <p><strong>User Role:</strong> {user?.role || 'None'}</p>
              <p><strong>Affiliate Status:</strong> {user?.affiliateStatus || 'None'}</p>
              <p><strong>Affiliate Code:</strong> {user?.affiliateCode || 'None'}</p>
            </div>
          </div>

          {/* LocalStorage State */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">LocalStorage State</h2>
            <div className="space-y-2 text-sm">
              <p><strong>hasToken:</strong> {String(!!localToken)}</p>
              <p><strong>hasUser:</strong> {String(!!localUser)}</p>
              <p><strong>Token Length:</strong> {localToken?.length || 0}</p>
              <p><strong>User Email:</strong> {localUser?.email || 'None'}</p>
              <p><strong>User Role:</strong> {localUser?.role || 'None'}</p>
              <p><strong>Affiliate Status:</strong> {localUser?.affiliateStatus || 'None'}</p>
              <p><strong>Affiliate Code:</strong> {localUser?.affiliateCode || 'None'}</p>
            </div>
          </div>

          {/* API Test Results */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">API Test Results</h2>
            <div className="space-y-2 text-sm">
              {apiTest ? (
                <>
                  <p><strong>Status:</strong> {apiTest.status}</p>
                  <p><strong>OK:</strong> {String(apiTest.ok)}</p>
                  <p><strong>Data:</strong></p>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                    {JSON.stringify(apiTest.data, null, 2)}
                  </pre>
                </>
              ) : (
                <p>No API test results</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Actions</h2>
            <div className="space-y-3">
              <button
                onClick={testAffiliateAccess}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Test Affiliate Access API
              </button>
              
              <button
                onClick={navigateToDashboard}
                className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Navigate to Affiliate Dashboard
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>

        {/* Current URL Info */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Current URL Info</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Href:</strong> {typeof window !== 'undefined' ? window.location.href : 'N/A'}</p>
            <p><strong>Pathname:</strong> {typeof window !== 'undefined' ? window.location.pathname : 'N/A'}</p>
            <p><strong>Search:</strong> {typeof window !== 'undefined' ? window.location.search : 'N/A'}</p>
            <p><strong>Redirect Param:</strong> {typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('redirect') : 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
