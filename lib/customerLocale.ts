import { getClientIP } from "@/lib/rateLimit";

export type EmailLocale = "vi" | "en";

const PRIVATE_IP =
  /^(127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1])\.|::1$|localhost$|unknown$)/i;

/** Vietnamese IP gets a Vietnamese email. Any other known country gets English. */
export function emailLocaleFromCountry(country?: string | null): EmailLocale {
  if (!country) return "vi";
  return country.trim().toUpperCase() === "VN" ? "vi" : "en";
}

/**
 * Country of the shopper on the checkout request.
 * Payment webhooks come from PayPal/NOWPayments, so this must run when the customer creates the order.
 */
export async function detectCustomerCountry(request: Request): Promise<string | null> {
  const header =
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cf-ipcountry") ||
    "";
  const fromHeader = header.trim().toUpperCase();
  if (fromHeader && fromHeader !== "XX" && fromHeader !== "T1") {
    return fromHeader;
  }

  const ip = getClientIP(request);
  if (!ip || PRIVATE_IP.test(ip)) return null;

  try {
    const response = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}`, {
      signal: AbortSignal.timeout(2500),
    });
    if (!response.ok) return null;
    const data = (await response.json()) as { success?: boolean; country_code?: string };
    if (data.success && data.country_code) return data.country_code.toUpperCase();
  } catch {
    return null;
  }
  return null;
}
