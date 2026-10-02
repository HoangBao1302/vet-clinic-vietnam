import {
  getPayPalAccessToken,
  getPayPalApiBase,
} from "@/lib/paypal";
import { fulfillPaidPayPalOrder, parsePayPalCustomId } from "@/lib/paypalFulfill";
import { PRODUCT_PRICES_USD } from "@/config/productPrices";

type PayPalTransaction = {
  transaction_info?: {
    transaction_id?: string;
    paypal_reference_id?: string;
    transaction_status?: string;
    transaction_amount?: { value?: string; currency_code?: string };
    custom_field?: string;
    transaction_initiation_date?: string;
    transaction_subject?: string;
  };
  payer_info?: {
    email_address?: string;
    payer_name?: { given_name?: string; surname?: string };
  };
};

function maskEmail(email: string) {
  const [name, domain] = email.split("@");
  if (!name || !domain) return "***";
  return `${name[0]}***@${domain}`;
}

function productIdFromAmount(amountUsd: number, hint = "") {
  const lower = hint.toLowerCase();
  const platform = lower.includes("mt5") ? "mt5" : "mt4";
  const entries = Object.entries(PRODUCT_PRICES_USD);
  const match = entries.find(([, price]) => Math.abs(price - amountUsd) < 0.05);
  if (!match) return "";
  const base = match[0].replace(/-mt[45]$/, "");
  return `${base}-${platform}`;
}

export async function syncRecentPayPalPayments(hoursBack = 72) {
  const accessToken = await getPayPalAccessToken();
  if (!accessToken) {
    return { success: false, error: "PayPal auth failed", results: [] as const };
  }

  const end = new Date();
  const start = new Date(end.getTime() - hoursBack * 60 * 60 * 1000);
  const params = new URLSearchParams({
    start_date: start.toISOString(),
    end_date: end.toISOString(),
    transaction_status: "S",
    fields: "all",
    page_size: "100",
  });

  const response = await fetch(
    `${getPayPalApiBase()}/v1/reporting/transactions?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();

  if (!response.ok) {
    return {
      success: false,
      error: data?.message || data?.name || "PayPal transaction search failed",
      details: data,
      results: [],
    };
  }

  const transactions: PayPalTransaction[] = data.transaction_details || [];
  const results = [];

  for (const item of transactions) {
    const info = item.transaction_info || {};
    const amountUsd = parseFloat(info.transaction_amount?.value || "0");
    if (!amountUsd || amountUsd <= 0) continue;

    const custom = parsePayPalCustomId(info.custom_field);
    const payerEmail = item.payer_info?.email_address || "";
    const email = custom.email || payerEmail;
    const productId =
      custom.productId ||
      productIdFromAmount(amountUsd, `${info.custom_field || ""} ${info.transaction_subject || ""}`);
    const orderId = info.paypal_reference_id || info.transaction_id;
    const name = custom.name || `${item.payer_info?.payer_name?.given_name || ""} ${item.payer_info?.payer_name?.surname || ""}`.trim();

    if (!orderId || !email || !productId) {
      results.push({
        orderId: orderId || info.transaction_id || "",
        emailed: false,
        skipped: true,
        reason: "Missing order, email, or product",
        emailMasked: email ? maskEmail(email) : "",
        amountUsd,
      });
      continue;
    }

    const fulfillment = await fulfillPaidPayPalOrder({
      orderId,
      productId,
      customerEmail: email,
      customerName: name,
      customerPhone: custom.phone,
      amountUsd,
    });

    results.push({
      orderId,
      emailed: fulfillment.emailed,
      skipped: false,
      productId: fulfillment.productId,
      emailMasked: maskEmail(email),
      amountUsd,
    });
  }

  return {
    success: true,
    count: transactions.length,
    results,
  };
}
