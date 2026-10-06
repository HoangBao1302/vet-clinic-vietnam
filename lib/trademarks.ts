/** Plain compatibility names. Do not add a ® mark to MetaQuotes trademarks. */
export function withMetaQuotesMark(text: string | undefined | null): string {
  if (!text) return "";
  return text
    .replace(/®/g, "")
    .replace(/\bMT4\b/g, "MetaTrader 4")
    .replace(/\bMT5\b/g, "MetaTrader 5")
    .replace(/\bMQL5\b(?!\.com)/g, "MQL5.com");
}
