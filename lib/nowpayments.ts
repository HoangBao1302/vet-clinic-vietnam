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

  const data = await response.json();
  if (!response.ok) {
    const message = data?.message || data?.error || `NOWPayments error ${response.status}`;
    throw new Error(message);
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

type MinAmountResponse = {
  min_amount?: number | string;
  fiat_equivalent?: number | string;
};

type EstimateResponse = {
  estimated_amount?: number | string;
};

type ChargePlan = {
  priceAmount: number;
  payCurrency: string;
  payAmount?: number;
};

function toNumber(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : NaN;
}

function roundCrypto(value: number) {
  return Math.ceil(value * 1e6) / 1e6;
}

function roundUsd(value: number) {
  return Math.ceil(value * 100) / 100;
}

async function getNowPaymentsMinAmount(payCurrency: string) {
  return nowPaymentsRequest<MinAmountResponse>(
    `/min-amount?currency_from=usd&currency_to=${encodeURIComponent(payCurrency)}&fiat_equivalent=usd`
  );
}

async function getNowPaymentsEstimate(amountUsd: number, payCurrency: string) {
  return nowPaymentsRequest<EstimateResponse>(
    `/estimate?amount=${encodeURIComponent(String(amountUsd))}&currency_from=usd&currency_to=${encodeURIComponent(payCurrency)}`
  );
}

async function buildUsdtPlan(priceUsd: number): Promise<ChargePlan | null> {
  const min = await getNowPaymentsMinAmount(NOWPAYMENTS_PAY_CURRENCY);
  const estimate = await getNowPaymentsEstimate(priceUsd, NOWPAYMENTS_PAY_CURRENCY);
  const estimatedPay = toNumber(estimate.estimated_amount);
  const minPay = toNumber(min.min_amount);
  const minFiat = toNumber(min.fiat_equivalent);

  const neededPay = roundCrypto(
    Math.max(
      Number.isFinite(estimatedPay) ? estimatedPay : priceUsd,
      Number.isFinite(minPay) ? minPay : 0,
      priceUsd
    )
  );

  const neededFiat = Number.isFinite(minFiat) ? minFiat : neededPay;
  // $3 → 2.995 USDT is only an FX rounding gap; do not jump to NOWPayments' ~$9 USDT floor.
  if (neededFiat > priceUsd + 1) {
    return null;
  }

  return {
    priceAmount: roundUsd(Math.max(priceUsd, neededFiat) + 0.05),
    payCurrency: NOWPAYMENTS_PAY_CURRENCY,
    payAmount: neededPay,
  };
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
  const plans: ChargePlan[] = [];

  try {
    const usdtPlan = await buildUsdtPlan(input.priceUsd);
    if (usdtPlan) plans.push(usdtPlan);
  } catch (error) {
    console.error("NOWPayments USDT min/estimate failed:", error);
  }

  plans.push({ priceAmount: input.priceUsd, payCurrency: NOWPAYMENTS_FALLBACK_CURRENCY });
  plans.push({
    priceAmount: roundUsd(input.priceUsd + 0.1),
    payCurrency: NOWPAYMENTS_PAY_CURRENCY,
    payAmount: roundCrypto(input.priceUsd + 0.1),
  });

  let lastError: Error | null = null;
  for (const plan of plans) {
    try {
      const payment = await createPaymentWithPlan(input, plan);
      return {
        ...payment,
        pay_currency: payment.pay_currency || plan.payCurrency,
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Cannot create crypto payment");
      if (!/less than minimal|minimum/i.test(lastError.message)) {
        throw lastError;
      }
    }
  }

  throw lastError || new Error("Cannot create crypto payment");
}

export function toCryptoCheckoutError(message: string) {
  if (/less than minimal|minimum/i.test(message)) {
    return "Số tiền quy đổi thấp hơn mức tối thiểu của NOWPayments. Vui lòng thử lại hoặc thanh toán bằng PayPal.";
  }
  return message;
}
