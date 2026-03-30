"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Upload, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function ImportDataPage() {
  const router = useRouter();
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState<{
    partners?: { success: number; failed: number; total: number };
    tradingAccounts?: { success: number; failed: number; total: number };
    featuredAccounts?: { success: number; failed: number; total: number };
  }>({});
  const [error, setError] = useState<string | null>(null);

  const handleImport = async () => {
    setImporting(true);
    setError(null);
    setResults({});

    try {
      // Import Partners
      const partnersRes = await importPartners();
      
      // Import Trading Accounts
      const tradingAccountsRes = await importTradingAccounts();
      
      // Import Featured Accounts
      const featuredAccountsRes = await importFeaturedAccounts();

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

  const importPartners = async () => {
    // This data is hardcoded from data/partners.ts
    // In production, you might want to fetch this from the files or have it as a JSON endpoint
    const partnersData = [
      {
        id: "tickmill",
        name: "Tickmill",
        website: "https://tickmill.com",
        rating: 4.5,
        active: true,
        order: 1,
        spread: ["Spread từ 0.0 pips (tài khoản Pro)"],
        license: ["FCA (UK)", "CySEC (Cyprus)"],
        deposit: ["Nạp tối thiểu: $100"],
        support: ["Support 24/7"],
        notes: ["Broker uy tín"]
      },
      {
        id: "thinkmarkets",
        name: "ThinkMarkets",
        website: "https://thinkmarkets.com",
        rating: 4.3,
        active: true,
        order: 2,
        spread: ["Spread từ 0.0 pips"],
        license: ["FCA (UK)", "ASIC (Australia)"],
        deposit: ["Nạp tối thiểu: $250"],
        support: ["Support đa ngôn ngữ"],
        notes: ["Platform tốt"]
      },
      {
        id: "puprime",
        name: "PuPrime",
        website: "https://puprime.com",
        rating: 4.1,
        active: true,
        order: 3,
        spread: ["Spread thấp"],
        license: ["VFSC (Vanuatu)"],
        deposit: ["Nạp tối thiểu: $20"],
        support: ["Support 24/5"],
        notes: ["Phù hợp trader mới"]
      }
    ];

    let success = 0;
    let failed = 0;

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
            // Skip existing partners
            console.log(`Partner ${partner.name} already exists`);
          } else {
            failed++;
          }
        }
      } catch (error) {
        failed++;
        console.error(`Failed to import partner ${partner.name}:`, error);
      }
    }

    return { success, failed, total: partnersData.length };
  };

  const importTradingAccounts = async () => {
    const accountsData = [
      {
        id: "tickmill-pro-1",
        broker: "Tickmill",
        account: "12345678",
        gain: "+245%",
        balance: "$12,450",
        maxDrawdown: "8.5%",
        monthlyProfit: "+18%",
        verified: true,
        status: "Đang hoạt động",
        active: true,
        order: 1
      },
      {
        id: "thinkmarkets-std-1",
        broker: "ThinkMarkets",
        account: "87654321",
        gain: "+189%",
        balance: "$8,920",
        maxDrawdown: "12.3%",
        monthlyProfit: "+15%",
        verified: true,
        status: "Đang hoạt động",
        active: true,
        order: 2
      }
    ];

    let success = 0;
    let failed = 0;

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
            console.log(`Account ${account.broker} already exists`);
          } else {
            failed++;
          }
        }
      } catch (error) {
        failed++;
        console.error(`Failed to import account ${account.broker}:`, error);
      }
    }

    return { success, failed, total: accountsData.length };
  };

  const importFeaturedAccounts = async () => {
    const featuredData = [
      {
        id: "featured-2024-1",
        broker: "Tickmill",
        accountNumber: "12345678",
        startBalance: "$5,000",
        currentBalance: "$17,250",
        totalProfit: "$12,250",
        gain: "+245%",
        monthlyReturn: "+18%",
        maxDrawdown: "8.5%",
        verified: true,
        year: 2024,
        active: true,
        order: 1
      },
      {
        id: "featured-2023-1",
        broker: "ThinkMarkets",
        accountNumber: "87654321",
        startBalance: "$3,000",
        currentBalance: "$8,670",
        totalProfit: "$5,670",
        gain: "+189%",
        monthlyReturn: "+15%",
        maxDrawdown: "12.3%",
        verified: true,
        year: 2023,
        active: true,
        order: 2
      }
    ];

    let success = 0;
    let failed = 0;

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
            console.log(`Featured account ${account.broker} already exists`);
          } else {
            failed++;
          }
        }
      } catch (error) {
        failed++;
        console.error(`Failed to import featured account ${account.broker}:`, error);
      }
    }

    return { success, failed, total: featuredData.length };
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
                      <h3 className="font-semibold text-red-900">Import Error</h3>
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  </div>
                )}

                {!hasResults ? (
                  <div className="text-center py-8">
                    <AlertCircle size={64} className="mx-auto text-blue-600 mb-4" />
                    <h2 className="text-2xl font-bold mb-4">Ready to Import Data</h2>
                    <p className="text-gray-600 mb-6">
                      This will import sample data for Partners, Trading Accounts, and Featured Accounts into MongoDB.
                    </p>
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
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
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
                ) : (
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
                            {results.partners.failed > 0 && ` (Failed: ${results.partners.failed})`}
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
                            {results.tradingAccounts.failed > 0 && ` (Failed: ${results.tradingAccounts.failed})`}
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
                            {results.featuredAccounts.failed > 0 && ` (Failed: ${results.featuredAccounts.failed})`}
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
                        }}
                        className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300"
                      >
                        Import Again
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
