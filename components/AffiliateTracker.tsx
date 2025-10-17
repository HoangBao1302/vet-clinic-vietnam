"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ExternalLink, Copy, CheckCircle } from "lucide-react";

export default function AffiliateTracker() {
  const searchParams = useSearchParams();
  const [affiliateCode, setAffiliateCode] = useState<string | null>(null);
  const [tracked, setTracked] = useState(false);

  useEffect(() => {
    const affiliate = searchParams.get('affiliate');
    const product = searchParams.get('product');
    
    if (affiliate) {
      setAffiliateCode(affiliate);
      
      // Track the affiliate click
      fetch('/api/affiliate/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          affiliateCode: affiliate,
          productId: product || 'general',
          productName: product || 'General Visit',
        }),
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setTracked(true);
          console.log('Affiliate click tracked:', affiliate);
        }
      })
      .catch(error => {
        console.error('Affiliate tracking error:', error);
      });
    }
  }, [searchParams]);

  if (!affiliateCode) {
    return null;
  }

  return (
    <div className="fixed top-20 right-4 bg-green-600 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm">
      <div className="flex items-center gap-2 mb-2">
        <CheckCircle size={20} />
        <span className="font-semibold">Affiliate Link Detected</span>
      </div>
      <p className="text-sm text-green-100 mb-2">
        Bạn đã vào từ link affiliate: <span className="font-mono">{affiliateCode}</span>
      </p>
      {tracked && (
        <p className="text-xs text-green-200">
          ✅ Click đã được track thành công
        </p>
      )}
    </div>
  );
}
