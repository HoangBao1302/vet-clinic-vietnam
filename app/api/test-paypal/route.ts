import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Check environment variables
    const hasClientId = !!process.env.PAYPAL_CLIENT_ID;
    const hasClientSecret = !!process.env.PAYPAL_CLIENT_SECRET;
    const mode = process.env.PAYPAL_MODE;
    
    // Don't expose actual credentials, just check if they exist
    const clientIdLength = process.env.PAYPAL_CLIENT_ID?.length || 0;
    const clientSecretLength = process.env.PAYPAL_CLIENT_SECRET?.length || 0;
    
    // Determine expected base URL
    const expectedBaseUrl = mode === 'live' 
      ? 'https://api-m.paypal.com' 
      : 'https://api-m.sandbox.paypal.com';
    
    // Test authentication
    let authTest: any = null;
    if (hasClientId && hasClientSecret) {
      try {
        const auth = Buffer.from(
          `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
        ).toString("base64");
        
        const response = await fetch(`${expectedBaseUrl}/v1/oauth2/token`, {
          method: "POST",
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: "grant_type=client_credentials",
        });
        
        authTest = {
          success: response.ok,
          status: response.status,
          statusText: response.statusText,
          baseUrl: expectedBaseUrl
        };
        
        if (!response.ok) {
          const errorData = await response.json();
          authTest.error = errorData;
        }
      } catch (error: any) {
        authTest = {
          success: false,
          error: error.message,
          baseUrl: expectedBaseUrl
        };
      }
    }
    
    return NextResponse.json({
      environment: {
        hasClientId,
        hasClientSecret,
        mode,
        clientIdLength,
        clientSecretLength,
        expectedBaseUrl
      },
      authTest,
      recommendations: {
        sandbox: "If you see 'Sandbox' in your PayPal dashboard, use PAYPAL_MODE=sandbox",
        live: "If you see 'Live' in your PayPal dashboard, use PAYPAL_MODE=live",
        note: "Your PayPal dashboard environment must match your PAYPAL_MODE setting"
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
