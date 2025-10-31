"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Copy, Check, Loader } from "lucide-react";

export default function SyncCodePage() {
  const [loading, setLoading] = useState(true);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [syncData, setSyncData] = useState<any>(null);

  useEffect(() => {
    fetchSyncCode();
  }, []);

  const fetchSyncCode = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/products/sync-code");
      if (response.ok) {
        const data = await response.json();
        setSyncData(data);
      }
    } catch (error) {
      console.error("Error fetching sync code:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string, section: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(section);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const CodeBlock = ({ title, code, section }: { title: string; code: string; section: string }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <button
          onClick={() => handleCopy(code, section)}
          className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          {copiedSection === section ? (
            <>
              <Check size={16} />
              Đã copy!
            </>
          ) : (
            <>
              <Copy size={16} />
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
        <code>{code}</code>
      </pre>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!syncData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Không thể tải sync code</p>
          <Link
            href="/admin/products"
            className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <ArrowLeft size={18} />
            Quay lại
          </Link>
        </div>
      </div>
    );
  }

  // Generate individual code blocks
  const expectedPricesCode = `const expectedPrices: Record<string, number> = ${JSON.stringify(syncData.expectedPrices, null, 2)};`;

  const productNamesCode = `const productNames: Record<string, string> = ${JSON.stringify(syncData.productNames, null, 2)};`;

  const commissionRatesCode = `const commissionRates: Record<string, number> = {\n${syncData.commissionRates.map((rate: any) => `  "${rate.id}": affiliate.isPaid ? ${rate.paid} : ${rate.free}`).join(",\n")}\n};`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/products"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={24} />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Sync Code Generator</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Sao chép code để đồng bộ pricing và webhooks
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">📋 Hướng dẫn</h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-800">
            <li>Copy từng đoạn code dưới đây</li>
            <li>Paste vào file tương ứng trong project</li>
            <li>Commit và push lên GitHub</li>
            <li>Vercel sẽ tự động deploy</li>
          </ol>
        </div>

        <div className="space-y-6">
          {/* Expected Prices */}
          <CodeBlock
            title="💰 Expected Prices (Pricing Page & Webhooks)"
            code={expectedPricesCode}
            section="prices"
          />

          {/* Product Names */}
          <CodeBlock
            title="📦 Product Names (Webhooks & Emails)"
            code={productNamesCode}
            section="names"
          />

          {/* Commission Rates */}
          <CodeBlock
            title="💵 Commission Rates (Webhooks)"
            code={commissionRatesCode}
            section="commissions"
          />
        </div>

        {/* Files to Update */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-900 mb-4">📝 Files cần update:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-yellow-900 mb-2">Expected Prices:</h4>
              <ul className="space-y-1 text-yellow-800 list-disc list-inside">
                <li>app/pricing/page.tsx (line ~50)</li>
                <li>app/api/webhooks/paypal/route.ts (line ~242)</li>
                <li>app/api/webhooks/stripe/route.ts (line ~64)</li>
                <li>app/api/create-payment/route.ts (line ~22)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-yellow-900 mb-2">Product Names:</h4>
              <ul className="space-y-1 text-yellow-800 list-disc list-inside">
                <li>app/api/webhooks/paypal/route.ts (2 chỗ: ~313, ~527)</li>
                <li>app/api/webhooks/stripe/route.ts (3 chỗ: ~89, ~326, ~337)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-yellow-900 mb-2">Commission Rates:</h4>
              <ul className="space-y-1 text-yellow-800 list-disc list-inside">
                <li>app/api/webhooks/paypal/route.ts (line ~506)</li>
                <li>app/api/webhooks/stripe/route.ts (line ~255)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-yellow-900 mb-2">Downloads:</h4>
              <ul className="space-y-1 text-yellow-800 list-disc list-inside">
                <li>app/downloads/page.tsx (line ~26)</li>
                <li>app/downloads/protected-page.tsx</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

