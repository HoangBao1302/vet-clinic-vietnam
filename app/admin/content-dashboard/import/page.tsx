"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Upload, CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react";

interface ImportResult {
  success: number;
  failed: number;
  total: number;
}

export default function ImportDataPage() {
  const router = useRouter();
  const [importing, setImporting] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [dataCounts, setDataCounts] = useState({
    partners: 0,
    tradingAccounts: 0,
    featuredAccounts: 0
  });
  const [results, setResults] = useState<{
    partners?: ImportResult;
    tradingAccounts?: ImportResult;
    featuredAccounts?: ImportResult;
  }>({});
  const [error, setError] = useState<string | null>(null);

  // Load data counts from API
  const loadDataInfo = async () => {
    setLoadingData(true);
    try {
      const response = await fetch('/api/admin/import/prepare');
      if (response.ok) {
        const data = await response.json();
        setDataCounts(data.counts);
        setDataLoaded(true);
        setError(null);
      } else {
        throw new Error('Failed to load data from files');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoadingData(false);
    }
  };

  const handleImport = async () => {
    setImporting(true);
    setError(null);
    setResults({});

    try {
      // Fetch data from API endpoint
      const dataResponse = await fetch('/api/admin/import/prepare');
      if (!dataResponse.ok) {
        throw new Error('Failed to fetch import data');
      }

      const { data } = await dataResponse.json();

      // Import Partners
      const partnersRes = await importPartners(data.partners);
      
      // Import Trading Accounts
      const tradingAccountsRes = await importTradingAccounts(data.tradingAccounts);
      
      // Import Featured Accounts
      const featuredAccountsRes = await importFeaturedAccounts(data.featuredAccounts);

      setResults({
        partners: partnersRes,
        tradingAccounts: tradingAccountsRes,
        featuredAccounts: featuredAccountsRes
      });

    } catch (err: any) {
      setError(err.message || 'Import failed');
    } finally {
      setImporting(false);
    }
  };

  const importPartners = async (partnersData: any[]): Promise<ImportResult> => {
    let success = 0;
    let failed = 0;
    let skipped = 0;

    for (const partner of partnersData) {
      try {
        const response = await fetch('/api/admin/partners', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(partner)
        });

        if (response.ok) {
          success++;
        } else {
          const data = await response.json();
          if (data.error && data.error.includes('already exists')) {
            skipped++;
            console.log(`Partner ${partner.name} already exists - skipped`);
          } else {
            failed++;
            console.error(`Failed to import partner ${partner.name}:`, data.error);
          }
        }
      } catch (error) {
        failed++;
        console.error(`Failed to import partner ${partner.name}:`, error);
      }
    }

    return { success, failed: failed + skipped, total: partnersData.length };
  };

  const importTradingAccounts = async (accountsData: any[]): Promise<ImportResult> => {
    let success = 0;
    let failed = 0;
    let skipped = 0;

    for (const account of accountsData) {
      try {
        const response = await fetch('/api/admin/trading-accounts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(account)
        });

        if (response.ok) {
          success++;
        } else {
          const data = await response.json();
          if (data.error && data.error.includes('already exists')) {
            skipped++;
            console.log(`Trading account ${account.id} already exists - skipped`);
          } else {
            failed++;
            console.error(`Failed to import account ${account.id}:`, data.error);
          }
        }
      } catch (error) {
        failed++;
        console.error(`Failed to import account:`, error);
      }
    }

    return { success, failed: failed + skipped, total: accountsData.length };
  };

  const importFeaturedAccounts = async (featuredData: any[]): Promise<ImportResult> => {
    let success = 0;
    let failed = 0;
    let skipped = 0;

    for (const account of featuredData) {
      try {
        const response = await fetch('/api/admin/featured-accounts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(account)
        });

        if (response.ok) {
          success++;
        } else {
          const data = await response.json();
          if (data.error && data.error.includes('already exists')) {
            skipped++;
            console.log(`Featured account ${account.id} already exists - skipped`);
          } else {
            failed++;
            console.error(`Failed to import featured account ${account.id}:`, data.error);
          }
        }
      } catch (error) {
        failed++;
        console.error(`Failed to import featured account:`, error);
      }
    }

    return { success, failed: failed + skipped, total: featuredData.length };
  };

  const getTotalStats = () => {
    const total = {
      success: 0,
      failed: 0,
      total: 0
    };

    if (results.partners) {
      total.success += results.partners.success;
      total.failed += results.partners.failed;
      total.total += results.partners.total;
    }
    if (results.tradingAccounts) {
      total.success += results.tradingAccounts.success;
      total.failed += results.tradingAccounts.failed;
      total.total += results.tradingAccounts.total;
    }
    if (results.featuredAccounts) {
      total.success += results.featuredAccounts.success;
      total.failed += results.featuredAccounts.failed;
      total.total += results.featuredAccounts.total;
    }

    return total;
  };

  const totalStats = getTotalStats();
  const hasResults = Object.keys(results).length > 0;

  // Auto-load data info on mount
  if (!dataLoaded && !loadingData && !error) {
    loadDataInfo();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20">
        <section className="py-12">
          <div className="container-custom max-w-4xl">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-8">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                  <Upload size={32} />
                  Import Content Data to MongoDB
                </h1>
                <p className="text-green-100 mt-2">
                  Import Partners, Trading Accounts, and Featured Accounts from data files
                </p>
              </div>

              <div className="p-8">
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                    <XCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                    <div>
                      <h3 className="font-semibold text-red-900">Error</h3>
                      <p className="text-red-700 text-sm">{error}</p>
                      <button
                        onClick={loadDataInfo}
                        className="mt-2 text-sm text-red-600 underline hover:text-red-800"
                      >
                        Try again
                      </button>
                    </div>
                  </div>
                )}

                {loadingData && (
                  <div className="text-center py-8">
                    <RefreshCw size={48} className="animate-spin mx-auto text-blue-600 mb-4" />
                    <p className="text-gray-600">Loading data from files...</p>
                  </div>
                )}

                {!hasResults && dataLoaded && !loadingData ? (
                  <div className="text-center py-8">
                    <AlertCircle size={64} className="mx-auto text-blue-600 mb-4" />
                    <h2 className="text-2xl font-bold mb-4">Ready to Import Data</h2>
                    <p className="text-gray-600 mb-4">
                      Found data in files:
                    </p>
                    <div className="grid grid-cols-3 gap-4 mb-6 max-w-2xl mx-auto">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-3xl font-bold text-blue-600">{dataCounts.partners}</p>
                        <p className="text-sm text-gray-600">Partners</p>
                      </div>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-3xl font-bold text-green-600">{dataCounts.tradingAccounts}</p>
                        <p className="text-sm text-gray-600">Trading Accounts</p>
                      </div>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-3xl font-bold text-yellow-600">{dataCounts.featuredAccounts}</p>
                        <p className="text-sm text-gray-600">Featured Accounts</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-8">
                      ⚠️ Existing records with the same ID will be skipped (not overwritten)
                    </p>
                    <button
                      onClick={handleImport}
                      disabled={importing}
                      className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                    >
                      {importing ? (
                        <>
                          <RefreshCw size={20} className="animate-spin" />
                          Importing...
                        </>
                      ) : (
                        <>
                          <Upload size={20} />
                          Start Import
                        </>
                      )}
                    </button>
                  </div>
                ) : hasResults ? (
                  <div>
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                      <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                      <div>
                        <h3 className="font-semibold text-green-900">Import Completed!</h3>
                        <p className="text-green-700 text-sm">
                          Successfully imported {totalStats.success} / {totalStats.total} records
                          {totalStats.failed > 0 && ` (${totalStats.failed} failed or skipped)`}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {results.partners && (
                        <div className="border border-gray-200 rounded-lg p-4">
                          <h3 className="font-bold mb-2 flex items-center gap-2">
                            <CheckCircle className="text-blue-600" size={20} />
                            Partners
                          </h3>
                          <p className="text-sm text-gray-600">
                            Success: {results.partners.success} / Total: {results.partners.total}
                            {results.partners.failed > 0 && ` (Skipped/Failed: ${results.partners.failed})`}
                          </p>
                        </div>
                      )}

                      {results.tradingAccounts && (
                        <div className="border border-gray-200 rounded-lg p-4">
                          <h3 className="font-bold mb-2 flex items-center gap-2">
                            <CheckCircle className="text-green-600" size={20} />
                            Trading Accounts
                          </h3>
                          <p className="text-sm text-gray-600">
                            Success: {results.tradingAccounts.success} / Total: {results.tradingAccounts.total}
                            {results.tradingAccounts.failed > 0 && ` (Skipped/Failed: ${results.tradingAccounts.failed})`}
                          </p>
                        </div>
                      )}

                      {results.featuredAccounts && (
                        <div className="border border-gray-200 rounded-lg p-4">
                          <h3 className="font-bold mb-2 flex items-center gap-2">
                            <CheckCircle className="text-yellow-600" size={20} />
                            Featured Accounts
                          </h3>
                          <p className="text-sm text-gray-600">
                            Success: {results.featuredAccounts.success} / Total: {results.featuredAccounts.total}
                            {results.featuredAccounts.failed > 0 && ` (Skipped/Failed: ${results.featuredAccounts.failed})`}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="mt-8 flex gap-4">
                      <button
                        onClick={() => router.push('/admin/content-dashboard')}
                        className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                      >
                        Go to Dashboard
                      </button>
                      <button
                        onClick={() => {
                          setResults({});
                          setError(null);
                          loadDataInfo();
                        }}
                        className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300"
                      >
                        Import Again
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
