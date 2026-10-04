import crypto from "crypto";
import { getPayPalSiteUrl } from "@/lib/paypal";

export const NOWPAYMENTS_API_BASE = "https://api.nowpayments.io/v1";
export const NOWPAYMENTS_PAY_CURRENCY = "usdttrc20";

export function isNowPaymentsConfigured() {
  return Boolean(process.env.NOWPAYMENTS_API_KEY);
}

export function getNowPaymentsIpnUrl() {
  return `${getPayPalSiteUrl()}/api/webhooks/crypto`;
}

export function sortObjectDeep(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortObjectDeep);
  }
  if (value && typeof value === "object") {
    return Object.keys(value as Record<string, unknown>)
      .sort()
      .reduce((acc: Record<string, unknown>, key) => {
        acc[key] = sortObjectDeep((value as Record<string, unknown>)[key]);
        return acc;
      }, {});
  }
  return value;
}

export function verifyNowPaymentsSignature(payload: unknown, signature: string | null) {
  const secret = process.env.NOWPAYMENTS_IPN_SECRET;
  if (!secret || !signature) return false;

  const sorted = sortObjectDeep(payload);
  const digest = crypto
    .createHmac("sha512", secret)
    .update(JSON.stringify(sorted))
    .digest("hex");

  const left = Buffer.from(digest);
  const right = Buffer.from(signature);
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

export function isCryptoPaidStatus(status?: string) {
  return status === "finished" || status === "confirmed";
}

export async function nowPaymentsRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const apiKey = process.env.NOWPAYMENTS_API_KEY;
  if (!apiKey) {
    throw new Error("NOWPAYMENTS_API_KEY is not configured");
  }

  const response = await fetch(`${NOWPAYMENTS_API_BASE}${path}`, {
    ...init,
    headers: {
      "x-api-key": apiKey,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  if (response.status === 429) {
    throw new Error("NOWPAYMENTS_RATE_LIMIT");
  }

  const text = await response.text();
  let data: Record<string, unknown> = {};
  try {
    data = text ? (JSON.parse(text) as Record<string, unknown>) : {};
  } catch {
    console.error("NOWPayments non-JSON response:", response.status, text.slice(0, 200));
    throw new Error(response.status === 429 ? "NOWPAYMENTS_RATE_LIMIT" : `NOWPayments error ${response.status}`);
  }

  if (!response.ok) {
    const message = data.message || data.error || `NOWPayments error ${response.status}`;
    throw new Error(String(message));
  }
  return data as T;
}

export type NowPayment = {
  payment_id?: number | string;
  payment_status?: string;
  pay_address?: string;
  pay_amount?: number | string;
  pay_currency?: string;
  price_amount?: number | string;
  order_id?: string;
  order_description?: string;
  invoice_id?: string | number;
  invoice_url?: string;
};

type NowInvoice = {
  id?: string | number;
  invoice_url?: string;
  token_id?: string;
  order_id?: string;
};

function isBelowMinimumError(message: string) {
  return /less than minimal|minimum/i.test(message);
}

async function createDirectUsdtPayment(input: {
  orderId: string;
  description: string;
  priceUsd: number;
}) {
  return nowPaymentsRequest<NowPayment>("/payment", {
    method: "POST",
    body: JSON.stringify({
      price_amount: input.priceUsd,
      price_currency: "usd",
      pay_currency: NOWPAYMENTS_PAY_CURRENCY,
      order_id: input.orderId,
      order_description: input.description,
      ipn_callback_url: getNowPaymentsIpnUrl(),
    }),
  });
}

async function createNowPaymentsInvoice(input: {
  orderId: string;
  description: string;
  priceUsd: number;
  productId?: string;
}) {
  const siteUrl = getPayPalSiteUrl();
  const success = new URL(`${siteUrl}/downloads/success`);
  success.searchParams.set("payment_method", "crypto");
  success.searchParams.set("order", input.orderId);
  if (input.productId) success.searchParams.set("productId", input.productId);

  return nowPaymentsRequest<NowInvoice>("/invoice", {
    method: "POST",
    body: JSON.stringify({
      price_amount: input.priceUsd,
      price_currency: "usd",
      order_id: input.orderId,
      order_description: input.description,
      ipn_callback_url: getNowPaymentsIpnUrl(),
      success_url: success.toString(),
      cancel_url: `${siteUrl}/downloads`,
    }),
  });
}

export async function createNowPaymentsDeposit(input: {
  orderId: string;
  description: string;
  priceUsd: number;
  productId?: string;
}): Promise<NowPayment> {
  // Forced USDT TRC20 rejects ~$3 because NOWPayments min is often ~$9. Invoice lets the customer pick a valid coin.
  if (input.priceUsd >= 15) {
    try {
      const payment = await createDirectUsdtPayment(input);
      return {
        ...payment,
        pay_currency: payment.pay_currency || NOWPAYMENTS_PAY_CURRENCY,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      if (message === "NOWPAYMENTS_RATE_LIMIT" || !isBelowMinimumError(message)) {
        throw error;
      }
    }
  }

  const invoice = await createNowPaymentsInvoice(input);
  if (!invoice.invoice_url || invoice.id == null) {
    throw new Error("NOWPayments did not return an invoice");
  }

  return {
    payment_id: invoice.id,
    invoice_id: invoice.id,
    invoice_url: invoice.invoice_url,
    payment_status: "waiting",
    order_id: input.orderId,
  };
}

export function toCryptoCheckoutError(message: string) {
  if (/429|RATE_LIMIT/i.test(message)) {
    return "NOWPayments đang giới hạn số lần gọi (429). Đợi khoảng 2 phút rồi bấm thanh toán lại. Không cần nạp tiền vào ví NOWPayments.";
  }
  if (/less than minimal|minimum/i.test(message)) {
    return "Số tiền quy đổi thấp hơn mức tối thiểu của NOWPayments. Vui lòng thử lại hoặc thanh toán bằng PayPal.";
  }
  return message;
}
