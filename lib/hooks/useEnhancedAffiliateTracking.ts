// Enhanced affiliate tracking for frontend
"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export function useEnhancedAffiliateTracking() {
  const searchParams = useSearchParams();
  const [trackingData, setTrackingData] = useState(null);
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    // Get affiliate parameters from URL
    const affiliateCode = searchParams.get('affiliate');
    const productId = searchParams.get('product');
    const session = searchParams.get('session');

    if (affiliateCode && productId) {
      // Generate session ID if not provided
      const finalSessionId = session || generateSessionId();
      setSessionId(finalSessionId);

      // Enhanced tracking data
      const trackingData = {
        affiliateCode,
        productId,
        productName: getProductName(productId),
        sessionId: finalSessionId,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        screenResolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        fingerprint: generateBrowserFingerprint()
      };

      setTrackingData(trackingData);

      // Track the click
      trackAffiliateClick(trackingData);
    }
  }, [searchParams]);

  return { trackingData, sessionId };
}

// Generate unique session ID
function generateSessionId(): string {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Get product name from product ID
function getProductName(productId: string): string {
  const productNames: Record<string, string> = {
    'ea-full': 'EA ThebenchmarkTrader Full Version',
    'ea-pro-source': 'EA Pro + Source Code',
    'indicator-pro': 'Multi-Indicator Pro Pack',
    'course': 'Khóa học Forex Trading',
    'social-copy': 'Copy Social Trading',
  };
  return productNames[productId] || productId;
}

// Generate browser fingerprint
function generateBrowserFingerprint(): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
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
  
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(16);
}

// Track affiliate click with enhanced data
async function trackAffiliateClick(trackingData: any) {
  try {
    const response = await fetch('/api/affiliate/enhanced-track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(trackingData)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Enhanced affiliate tracking successful:', result);
      
      // Store session ID in localStorage for checkout
      localStorage.setItem('affiliateSessionId', trackingData.sessionId);
      localStorage.setItem('affiliateCode', trackingData.affiliateCode);
      localStorage.setItem('affiliateProductId', trackingData.productId);
    } else {
      console.error('❌ Enhanced affiliate tracking failed:', response.status);
    }
  } catch (error) {
    console.error('❌ Enhanced affiliate tracking error:', error);
  }
}

// Enhanced checkout data collection
export function getEnhancedCheckoutData() {
  return {
    sessionId: localStorage.getItem('affiliateSessionId'),
    affiliateCode: localStorage.getItem('affiliateCode'),
    affiliateProductId: localStorage.getItem('affiliateProductId'),
    fingerprint: generateBrowserFingerprint(),
    ipAddress: 'unknown', // Will be filled by server
    timestamp: new Date().toISOString()
  };
}

// Clean up tracking data
export function cleanupTrackingData() {
  localStorage.removeItem('affiliateSessionId');
  localStorage.removeItem('affiliateCode');
  localStorage.removeItem('affiliateProductId');
}
