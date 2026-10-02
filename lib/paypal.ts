/**
 * PayPal Live/Sandbox helpers.
 * Live is the default. Set PAYPAL_MODE=sandbox only for test credentials.
 */
export function isPayPalLive(): boolean {
  return process.env.PAYPAL_MODE !== "sandbox";
}

export function getPayPalApiBase(): string {
  return isPayPalLive()
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
}

export function getPayPalSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    "https://thebenchmarktrader.com"
  );
}

export function isPayPalConfigured(): boolean {
  return Boolean(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET);
}

export function sanitizePayPalPhone(phone?: string): string | undefined {
  const digits = (phone || "").replace(/\D/g, "");
  if (digits.length >= 8 && digits.length <= 15) {
    return digits;
  }
  return undefined;
}

export async function getPayPalAccessToken(): Promise<string | null> {
  if (!isPayPalConfigured()) {
    console.error("PayPal credentials not configured:", {
      hasClientId: !!process.env.PAYPAL_CLIENT_ID,
      hasClientSecret: !!process.env.PAYPAL_CLIENT_SECRET,
      mode: isPayPalLive() ? "live" : "sandbox",
    });
    return null;
  }

  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");
  const baseUrl = getPayPalApiBase();

  console.log("PayPal auth request:", {
    baseUrl,
    mode: isPayPalLive() ? "live" : "sandbox",
    clientIdLength: process.env.PAYPAL_CLIENT_ID?.length,
  });

  const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("PayPal auth failed:", {
      status: response.status,
      statusText: response.statusText,
      data,
      baseUrl,
      mode: isPayPalLive() ? "live" : "sandbox",
    });
    return null;
  }

  return data.access_token as string;
}
