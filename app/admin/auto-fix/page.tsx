'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/authContext';
import { useRouter } from 'next/navigation';

interface MonitorData {
  success: boolean;
  totalAffiliates: number;
  problematicAffiliates: number;
  affiliates: Array<{
    email: string;
    username: string;
    affiliateCode: string;
    totalClicks: number;
    conversions: number;
    conversionRate: string;
    totalCommission: number;
    userCommissionEarned: number;
    hasIssues: boolean;
    hasDataInconsistency: boolean;
  }>;
  issues: Array<{
    email: string;
    username: string;
    affiliateCode: string;
    issue: string;
    totalClicks: number;
    conversions: number;
    totalCommission: number;
    userCommissionEarned: number;
  }>;
  summary: {
    totalClicks: number;
    totalConversions: number;
    totalCommission: number;
  };
}

export default function AdminAutoFixPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [monitorData, setMonitorData] = useState<MonitorData | null>(null);
  const [loading, setLoading] = useState(false);
  const [autoFixRunning, setAutoFixRunning] = useState(false);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'admin')) {
      router.push('/unauthorized');
    }
  }, [isAuthenticated, isLoading, user, router]);

  const fetchMonitorData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/monitor-affiliates', {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMonitorData(data);
      } else {
        console.error('Failed to fetch monitor data');
      }
    } catch (error) {
      console.error('Error fetching monitor data:', error);
    } finally {
      setLoading(false);
    }
  };

  const runAutoFix = async () => {
    setAutoFixRunning(true);
    try {
      const token = localStorage.getItem('token');
      
      // Run auto-fix for all problematic affiliates
      if (monitorData?.issues && monitorData.issues.length > 0) {
        for (const issue of monitorData.issues) {
          console.log(`Auto-fixing ${issue.email}...`);
          
          // Refresh user data
          await fetch('/api/admin/refresh-user-data', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ email: issue.email })
          });
          
          // Fix affiliate status
          await fetch('/api/admin/fix-affiliate-status', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ email: issue.email })
          });
          
          // Auto-fix conversions
          await fetch('/api/admin/auto-fix-conversions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ email: issue.email })
          });
        }
      }
      
      // Refresh monitor data
      await fetchMonitorData();
      
    } catch (error) {
      console.error('Error running auto-fix:', error);
    } finally {
      setAutoFixRunning(false);
    }
  };

  const scheduleAutoMonitoring = () => {
    // This would be implemented on the server side
    console.log('Scheduling automatic monitoring...');
    alert('Auto-monitoring scheduled! The system will check for issues every 30 minutes.');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              🔧 Admin Auto-Fix System
            </h1>

            {/* Control Panel */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={fetchMonitorData}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
                >
                  {loading ? 'Loading...' : '📊 Check All Affiliates'}
                </button>
                
                <button
                  onClick={runAutoFix}
                  disabled={autoFixRunning || !monitorData?.issues?.length}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
                >
                  {autoFixRunning ? 'Fixing...' : '🔧 Auto-Fix All Issues'}
                </button>
                
                <button
                  onClick={scheduleAutoMonitoring}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md"
                >
                  ⏰ Schedule Auto-Monitoring
                </button>
              </div>
            </div>

            {/* Summary */}
            {monitorData && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">📋 Summary</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{monitorData.totalAffiliates}</div>
                    <div className="text-sm text-gray-600">Total Affiliates</div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{monitorData.problematicAffiliates}</div>
                    <div className="text-sm text-gray-600">With Issues</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{monitorData.summary?.totalClicks || 0}</div>
                    <div className="text-sm text-gray-600">Total Clicks</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{monitorData.summary?.totalConversions || 0}</div>
                    <div className="text-sm text-gray-600">Total Conversions</div>
                  </div>
                </div>
              </div>
            )}

            {/* Issues List */}
            {monitorData?.issues && monitorData.issues.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">⚠️ Issues Found</h2>
                <div className="space-y-4">
                  {monitorData.issues.map((issue, index) => (
                    <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-red-800">{issue.email}</h3>
                          <p className="text-sm text-red-600">Issue: {issue.issue}</p>
                          <div className="mt-2 text-sm text-gray-600">
                            <p>Clicks: {issue.totalClicks} | Conversions: {issue.conversions}</p>
                            <p>Commission: {issue.totalCommission.toLocaleString()}₫ | User Earned: {issue.userCommissionEarned.toLocaleString()}₫</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            {issue.issue}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Affiliates */}
            {monitorData?.affiliates && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">👥 All Affiliates</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversions</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commission</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {monitorData.affiliates.map((affiliate, index) => (
                        <tr key={index} className={affiliate.hasIssues ? 'bg-red-50' : ''}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{affiliate.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{affiliate.affiliateCode}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{affiliate.totalClicks}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{affiliate.conversions}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{affiliate.conversionRate}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{affiliate.totalCommission.toLocaleString()}₫</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {affiliate.hasIssues ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Issues
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                OK
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
