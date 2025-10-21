import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AffiliateClick from '@/lib/models/AffiliateClick';
import User from '@/lib/models/User';
import crypto from 'crypto';

// Session-based tracking for incognito mode support
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { affiliateCode, productId, productName, customerEmail, customerName, sessionId } = await request.json();

    if (!affiliateCode || !productId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('🔧 Enhanced Affiliate Tracking:', {
      affiliateCode,
      productId,
      productName,
      customerEmail,
      customerName,
      sessionId
    });

    // Get IP and User Agent
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const referrer = request.headers.get('referer') || 'direct';

    // Generate session ID if not provided
    const finalSessionId = sessionId || crypto.randomUUID();

    // Create comprehensive affiliate click record
    const click = await AffiliateClick.create({
      affiliateCode,
      ipAddress,
      userAgent,
      referrer,
      productId,
      productName: productName || productId,
      customerEmail: customerEmail || undefined,
      customerName: customerName || undefined,
      sessionId: finalSessionId,
      status: 'clicked',
      // Enhanced tracking data
      trackingData: {
        timestamp: new Date(),
        sessionId: finalSessionId,
        ipAddress,
        userAgent,
        referrer,
        // Device fingerprinting data
        fingerprint: generateDeviceFingerprint(request),
        // URL parameters
        urlParams: extractUrlParams(request),
        // Browser capabilities
        browserInfo: extractBrowserInfo(request)
      }
    });

    // Set multiple tracking cookies for redundancy
    const cookieValue = `${affiliateCode}:${click._id}:${finalSessionId}`;
    const cookieExpiry = new Date();
    cookieExpiry.setDate(cookieExpiry.getDate() + 30);

    const response = NextResponse.json({
      success: true,
      message: 'Affiliate click tracked successfully',
      data: {
        clickId: click._id,
        sessionId: finalSessionId,
        affiliateCode,
        productId,
        productName: click.productName,
        trackingUrl: generateTrackingUrl(affiliateCode, productId, finalSessionId)
      }
    });

    // Set multiple cookies for redundancy
    response.cookies.set('affiliate_tracking', cookieValue, {
      expires: cookieExpiry,
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });

    response.cookies.set('affiliate_session', finalSessionId, {
      expires: cookieExpiry,
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });

    response.cookies.set('affiliate_code', affiliateCode, {
      expires: cookieExpiry,
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });

    return response;

  } catch (error: any) {
    console.error('Enhanced Affiliate Tracking Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Generate device fingerprint for fallback tracking
function generateDeviceFingerprint(request: NextRequest): string {
  const userAgent = request.headers.get('user-agent') || '';
  const acceptLanguage = request.headers.get('accept-language') || '';
  const acceptEncoding = request.headers.get('accept-encoding') || '';
  const connection = request.headers.get('connection') || '';
  
  const fingerprint = `${userAgent}:${acceptLanguage}:${acceptEncoding}:${connection}`;
  return crypto.createHash('sha256').update(fingerprint).digest('hex').substring(0, 16);
}

// Extract URL parameters for fallback
function extractUrlParams(request: NextRequest): Record<string, string> {
  const url = new URL(request.url);
  const params: Record<string, string> = {};
  
  url.searchParams.forEach((value, key) => {
    params[key] = value;
  });
  
  return params;
}

// Extract browser information
function extractBrowserInfo(request: NextRequest): Record<string, string> {
  const userAgent = request.headers.get('user-agent') || '';
  const acceptLanguage = request.headers.get('accept-language') || '';
  const acceptEncoding = request.headers.get('accept-encoding') || '';
  
  return {
    userAgent,
    acceptLanguage,
    acceptEncoding,
    platform: extractPlatform(userAgent),
    browser: extractBrowser(userAgent)
  };
}

// Extract platform from user agent
function extractPlatform(userAgent: string): string {
  if (userAgent.includes('Windows')) return 'Windows';
  if (userAgent.includes('Mac')) return 'Mac';
  if (userAgent.includes('Linux')) return 'Linux';
  if (userAgent.includes('Android')) return 'Android';
  if (userAgent.includes('iOS')) return 'iOS';
  return 'Unknown';
}

// Extract browser from user agent
function extractBrowser(userAgent: string): string {
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  if (userAgent.includes('Opera')) return 'Opera';
  return 'Unknown';
}

// Generate enhanced tracking URL
function generateTrackingUrl(affiliateCode: string, productId: string, sessionId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://thebenchmarktrader.com';
  return `${baseUrl}/?affiliate=${encodeURIComponent(affiliateCode)}&product=${productId}&session=${sessionId}&tracking=enhanced`;
}
