export const PRODUCT_PRICES_USD: Record<string, number> = {
  "indicator-pro-mt4": 16,
  "indicator-pro-mt5": 16,
  "ea-full-mt4": 329,
  "ea-full-mt5": 329,
  "ea-pro-source-mt4": 621,
  "ea-pro-source-mt5": 621,
};

export function formatUsd(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function usdToStripeCents(amountUsd: number) {
  return Math.round(Number(amountUsd) * 100);
}
