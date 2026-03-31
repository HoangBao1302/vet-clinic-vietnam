"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Upload, CheckCircle, XCircle, AlertCircle, RefreshCw, Package } from "lucide-react";

interface ImportResult {
  success: number;
  failed: number;
  total: number;
}

export default function ImportProductsPage() {
  const router = useRouter();
  const [importing, setImporting] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [updateExisting, setUpdateExisting] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [dataCounts, setDataCounts] = useState({
    products: 0
  });
  const [results, setResults] = useState<{
    products?: ImportResult;
  }>({});
  const [error, setError] = useState<string | null>(null);

  // Load data counts from API
  const loadDataInfo = async () => {
    setLoadingData(true);
    try {
      const response = await fetch('/api/admin/import/prepare-products', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setDataCounts(data.counts);
        setDataLoaded(true);
        setError(null);
      } else {
        throw new Error('Failed to load products data');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoadingData(false);
    }
  };

  const handleClearAll = async () => {
    if (!confirm('⚠️ WARNING: This will DELETE ALL products from MongoDB.\n\nAre you absolutely sure?')) {
      return;
    }

    setClearing(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/products/clear-all', {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        alert(`✅ Cleared successfully!\n\nDeleted ${data.deleted} products.\n\nYou can now import fresh data.`);
        setResults({});
      } else {
        const data = await response.json();
        alert(`Error: ${data.error || 'Failed to clear data'}`);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to clear data');
    } finally {
      setClearing(false);
    }
  };

  const handleImport = async () => {
    setImporting(true);
    setError(null);
    setResults({});

    try {
      // Fetch products data from API endpoint
      const dataResponse = await fetch('/api/admin/import/prepare-products', {
        credentials: 'include'
      });
      if (!dataResponse.ok) {
        throw new Error('Failed to fetch products data');
      }

      const { data } = await dataResponse.json();

      // Import Products
      const productsRes = await importProducts(data.products);

      setResults({
        products: productsRes
      });

    } catch (err: any) {
      setError(err.message || 'Import failed');
    } finally {
      setImporting(false);
    }
  };

  const importProducts = async (productsData: any[]): Promise<ImportResult> => {
    let success = 0;
    let failed = 0;
    let skipped = 0;

    for (const product of productsData) {
      try {
        if (updateExisting) {
          // Try to update first, if not exists then create
          const updateResponse = await fetch(`/api/admin/products/${product.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(product)
          });

          if (updateResponse.ok) {
            success++;
            console.log(`Updated product: ${product.id}`);
          } else if (updateResponse.status === 404) {
            // Not found, create new
            const createResponse = await fetch('/api/admin/products', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify(product)
            });
            if (createResponse.ok) {
              success++;
              console.log(`Created product: ${product.id}`);
            } else {
              failed++;
              const errorData = await createResponse.json();
              console.error(`Failed to create product ${product.id}:`, errorData);
            }
          } else {
            failed++;
            const errorData = await updateResponse.json();
            console.error(`Failed to update product ${product.id}:`, updateResponse.status, errorData);
          }
        } else {
          // Create new only
          const response = await fetch('/api/admin/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(product)
          });

          if (response.ok) {
            success++;
            console.log(`Imported product: ${product.name}`);
          } else {
            const errorData = await response.json();
            if (errorData.error?.includes('duplicate') || errorData.error?.includes('already exists')) {
              skipped++;
              console.log(`Skipped existing product: ${product.name}`);
            } else {
              failed++;
              console.error(`Failed to import product ${product.name}:`, errorData);
            }
          }
        }
      } catch (error) {
        failed++;
        console.error(`Error importing product ${product.name}:`, error);
      }
    }

    return { success, failed: failed + skipped, total: productsData.length };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-24 pb-12">
        <div className="container-custom max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Import Products to MongoDB
                </h1>
                <p className="text-gray-600">
                  Bulk import products from fallback data into MongoDB
                </p>
              </div>
              <Package size={48} className="text-blue-600" />
            </div>

            {/* Step 1: Load Data */}
            <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Step 1: Load Products Data
              </h2>
              <button
                onClick={loadDataInfo}
                disabled={loadingData || dataLoaded}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loadingData ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" />
                    <span>Loading...</span>
                  </>
                ) : dataLoaded ? (
                  <>
                    <CheckCircle size={18} />
                    <span>Data Loaded</span>
                  </>
                ) : (
                  <>
                    <Upload size={18} />
                    <span>Load Data</span>
                  </>
                )}
              </button>

              {dataLoaded && (
                <div className="mt-4 p-4 bg-white rounded border border-blue-300">
                  <p className="text-sm text-gray-700">
                    <strong>Found {dataCounts.products} products</strong> ready to import
                  </p>
                </div>
              )}
            </div>

            {/* Options */}
            {dataLoaded && (
              <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Import Options
                </h2>
                
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={updateExisting}
                    onChange={(e) => setUpdateExisting(e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <div>
                    <span className="font-medium text-gray-800">Update existing products</span>
                    <p className="text-sm text-gray-600">
                      If checked, will update products with matching IDs. If unchecked, will skip duplicates.
                    </p>
                  </div>
                </label>
              </div>
            )}

            {/* Step 2: Import */}
            {dataLoaded && (
              <div className="mb-8 p-6 bg-green-50 rounded-lg border border-green-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Step 2: Run Import
                </h2>
                <button
                  onClick={handleImport}
                  disabled={importing}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {importing ? (
                    <>
                      <RefreshCw size={18} className="animate-spin" />
                      <span>Importing...</span>
                    </>
                  ) : (
                    <>
                      <Upload size={18} />
                      <span>Start Import</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Results */}
            {Object.keys(results).length > 0 && (
              <div className="mb-8 p-6 bg-white rounded-lg border-2 border-green-500">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                  <CheckCircle className="text-green-600" />
                  <span>Import Results</span>
                </h2>

                {results.products && (
                  <div className="mb-4 p-4 bg-gray-50 rounded">
                    <h3 className="font-semibold text-gray-800 mb-2">Products:</h3>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-green-600 font-semibold">{results.products.success}</span> success
                      </div>
                      <div>
                        <span className="text-red-600 font-semibold">{results.products.failed}</span> failed/skipped
                      </div>
                      <div>
                        <span className="text-gray-600 font-semibold">{results.products.total}</span> total
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => router.push('/admin/products')}
                  className="btn-primary mt-4"
                >
                  Go to Products Dashboard
                </button>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mb-8 p-6 bg-red-50 rounded-lg border border-red-200 flex items-start space-x-3">
                <AlertCircle className="text-red-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-red-800 mb-2">Error</h3>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Danger Zone */}
            <div className="mt-12 p-6 bg-red-50 rounded-lg border-2 border-red-300">
              <h2 className="text-xl font-semibold text-red-800 mb-4">
                ⚠️ Danger Zone
              </h2>
              <p className="text-sm text-red-700 mb-4">
                This will permanently delete ALL products from MongoDB. This action cannot be undone.
              </p>
              <button
                onClick={handleClearAll}
                disabled={clearing}
                className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {clearing ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" />
                    <span>Clearing...</span>
                  </>
                ) : (
                  <>
                    <XCircle size={18} />
                    <span>Clear All Products</span>
                  </>
                )}
              </button>
            </div>

            {/* Back Button */}
            <div className="mt-8 text-center">
              <button
                onClick={() => router.push('/admin/products')}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ← Back to Products Dashboard
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
