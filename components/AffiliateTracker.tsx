"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ExternalLink, Copy, CheckCircle } from "lucide-react";

// Enhanced tracking with session management
function AffiliateTrackerContent() {
  const searchParams = useSearchParams();
  const [affiliateCode, setAffiliateCode] = useState<string | null>(null);
  const [tracked, setTracked] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Generate session ID
  const generateSessionId = () => {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  };

  // Generate browser fingerprint
  const generateBrowserFingerprint = (): string => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        return 'no-canvas';
      }
      
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Browser fingerprint', 2, 2);
      
      const fingerprint = [
        navigator.userAgent,
        navigator.language,
        screen.width + 'x' + screen.height,
        new Date().getTimezoneOffset(),
        canvas.toDataURL()
      ].join('|');
      
      return btoa(fingerprint).substring(0, 32);
    } catch (error) {
      return 'fingerprint-error';
    }
  };

  useEffect(() => {
    const affiliate = searchParams.get('affiliate');
    const product = searchParams.get('product');
    
    if (affiliate) {
      setAffiliateCode(affiliate);
      
      // Generate session ID and fingerprint
      const finalSessionId = generateSessionId();
      const fingerprint = generateBrowserFingerprint();
      
      setSessionId(finalSessionId);
      
      // Enhanced tracking with session management
      fetch('/api/affiliate/enhanced-track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          affiliateCode: affiliate,
          productId: product || 'general',
          productName: product || 'General Visit',
          sessionId: finalSessionId,
          fingerprint: fingerprint,
          // Additional tracking data
          trackingData: {
            timestamp: new Date().toISOString(),
            method: 'enhanced-tracker',
            referrer: document.referrer || 'direct',
            userAgent: navigator.userAgent,
            language: navigator.language,
            screenResolution: `${screen.width}x${screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
          }
        }),
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setTracked(true);
          console.log('✅ Enhanced affiliate click tracked:', {
            affiliateCode: affiliate,
            sessionId: finalSessionId,
            clickId: data.clickId
          });
          
          // Store session ID in localStorage for checkout process
          localStorage.setItem('affiliate_session', JSON.stringify({
            affiliateCode: affiliate,
            sessionId: finalSessionId,
            productId: product || 'general',
            timestamp: new Date().toISOString()
          }));
        }
      })
      .catch(error => {
        console.error('❌ Enhanced affiliate tracking error:', error);
        
        // Fallback to old tracking method
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
            console.log('✅ Fallback affiliate click tracked:', affiliate);
          }
        })
        .catch(fallbackError => {
          console.error('❌ Fallback tracking also failed:', fallbackError);
        });
      });
    }
  }, [searchParams]);

  if (!affiliateCode) {
    return null;
  }

  return (
    <div className="fixed top-20 right-4 bg-gradient-to-r from-green-600 to-blue-600 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm">
      <div className="flex items-center gap-2 mb-2">
        <CheckCircle size={20} />
        <span className="font-semibold">Enhanced Affiliate Tracking</span>
      </div>
      <p className="text-sm text-green-100 mb-2">
        Link affiliate: <span className="font-mono text-yellow-200">{affiliateCode}</span>
      </p>
      {sessionId && (
        <p className="text-xs text-blue-200 mb-1">
          Session ID: <span className="font-mono">{sessionId.substring(0, 12)}...</span>
        </p>
      )}
      {tracked && (
        <p className="text-xs text-green-200">
          ✅ Enhanced tracking active
        </p>
      )}
    </div>
  );
}

export default function AffiliateTracker() {
  return (
    <Suspense fallback={null}>
      <AffiliateTrackerContent />
    </Suspense>
  );
}
