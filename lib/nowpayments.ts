import crypto from "crypto";
import { getPayPalSiteUrl } from "@/lib/paypal";

export const NOWPAYMENTS_API_BASE = "https://api.nowpayments.io/v1";
export const NOWPAYMENTS_PAY_CURRENCY = "usdttrc20";
export const NOWPAYMENTS_FALLBACK_CURRENCY = "trx";

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
};

type ChargePlan = {
  priceAmount: number;
  payCurrency: string;
  payAmount?: number;
};

function roundUsd(value: number) {
  return Math.ceil(value * 100) / 100;
}

function isBelowMinimumError(message: string) {
  return /less than minimal|minimum/i.test(message);
}

function buildChargePlans(priceUsd: number): ChargePlan[] {
  if (priceUsd < 10) {
    const buffered = roundUsd(priceUsd + 0.5);
    return [
      { priceAmount: buffered, payCurrency: NOWPAYMENTS_PAY_CURRENCY, payAmount: buffered },
      { priceAmount: priceUsd, payCurrency: NOWPAYMENTS_FALLBACK_CURRENCY },
    ];
  }

  return [{ priceAmount: priceUsd, payCurrency: NOWPAYMENTS_PAY_CURRENCY }];
}

async function createPaymentWithPlan(
  input: { orderId: string; description: string },
  plan: ChargePlan
) {
  const body: Record<string, unknown> = {
    price_amount: plan.priceAmount,
    price_currency: "usd",
    pay_currency: plan.payCurrency,
    order_id: input.orderId,
    order_description: input.description,
    ipn_callback_url: getNowPaymentsIpnUrl(),
  };
  if (plan.payAmount != null) {
    body.pay_amount = plan.payAmount;
  }

  return nowPaymentsRequest<NowPayment>("/payment", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function createNowPaymentsDeposit(input: {
  orderId: string;
  description: string;
  priceUsd: number;
}): Promise<NowPayment> {
  const plans = buildChargePlans(input.priceUsd);
  let lastError: Error | null = null;

  for (let index = 0; index < plans.length; index += 1) {
    const plan = plans[index];
    try {
      const payment = await createPaymentWithPlan(input, plan);
      return {
        ...payment,
        pay_currency: payment.pay_currency || plan.payCurrency,
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Cannot create crypto payment");
      console.error("NOWPayments create payment failed:", plan.payCurrency, lastError.message);
      if (lastError.message === "NOWPAYMENTS_RATE_LIMIT" || !isBelowMinimumError(lastError.message)) {
        throw lastError;
      }
      if (index < plans.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1200));
      }
    }
  }

  throw lastError || new Error("Cannot create crypto payment");
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
