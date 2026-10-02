export const PAYPAL_PRODUCT_NAMES: Record<string, string> = {
  "indicator-pro-mt4": "Multi-Indicator Pro Pack (MT4)",
  "ea-full-mt4": "EA ThebenchmarkTrader Full Version (MT4)",
  "ea-pro-source-mt4": "EA ThebenchmarkTrader Pro + Source Code (MT4)",
  "indicator-pro-mt5": "Multi-Indicator Pro Pack (MT5)",
  "ea-full-mt5": "EA ThebenchmarkTrader Full Version (MT5)",
  "ea-pro-source-mt5": "EA ThebenchmarkTrader Pro + Source Code (MT5)",
  "indicator-pro": "Multi-Indicator Pro Pack",
  "ea-full": "EA ThebenchmarkTrader Full Version",
  "ea-pro-source": "EA ThebenchmarkTrader Pro + Source Code",
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
