export const PAYPAL_PRODUCT_NAMES: Record<string, string> = {
  "indicator-pro-mt4": "Benchmark Trader - Multi-Indicator Pro Pack (MT4 Software License)",
  "ea-full-mt4": "Benchmark Trader - Full Analytics Pack (MT4 Software License)",
  "ea-pro-source-mt4": "Benchmark Trader - Pro Analytics Source Pack (MT4 Software License)",
  "indicator-pro-mt5": "Benchmark Trader - Multi-Indicator Pro Pack (MT5 Software License)",
  "ea-full-mt5": "Benchmark Trader - Full Analytics Pack (MT5 Software License)",
  "ea-pro-source-mt5": "Benchmark Trader - Pro Analytics Source Pack (MT5 Software License)",
  "indicator-pro": "Benchmark Trader - Multi-Indicator Pro Pack (Software License)",
  "ea-full": "Benchmark Trader - Full Analytics Pack (Software License)",
  "ea-pro-source": "Benchmark Trader - Pro Analytics Source Pack (Software License)",
};

export const PAYPAL_PRODUCT_DOWNLOADS: Record<string, string> = {
  "indicator-pro-mt4": "/downloads/files/Indicator-Pro-Pack-MT4.zip",
  "ea-full-mt4": "/downloads/files/ThebenchmarkTrader-Full-MT4.ex4",
  "ea-pro-source-mt4": "/downloads/files/ThebenchmarkTrader-Pro-Source-MT4.zip",
  "indicator-pro-mt5": "/downloads/files/Indicator-Pro-Pack-MT5.zip",
  "ea-full-mt5": "/downloads/files/ThebenchmarkTrader-Full-MT5.ex5",
  "ea-pro-source-mt5": "/downloads/files/ThebenchmarkTrader-Pro-Source-MT5.zip",
  "indicator-pro": "/downloads/files/Indicator-Pro-Pack.zip",
  "ea-full": "/downloads/files/ThebenchmarkTrader-Full.ex4",
  "ea-pro-source": "/downloads/files/ThebenchmarkTrader-Pro-Source.zip",
};

export function getPayPalProductName(productId: string): string {
  return PAYPAL_PRODUCT_NAMES[productId] || "ThebenchmarkTrader Analytics Software";
}

export function getPayPalDownloadUrl(productId: string): string | undefined {
  return PAYPAL_PRODUCT_DOWNLOADS[productId];
}
