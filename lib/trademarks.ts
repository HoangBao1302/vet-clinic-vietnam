/** Add ® on the first-style mention of MetaQuotes marks in a string. */
export function withMetaQuotesMark(text: string | undefined | null): string {
  if (!text) return "";
  return text
    .replace(/\bMetaTrader\b(?!®)/g, "MetaTrader®")
    .replace(/\bMQL4\b(?!®)/g, "MQL4®")
    .replace(/\bMQL5\b(?!®)/g, "MQL5®")
    .replace(/\bMT4\b(?!®)/g, "MT4®")
    .replace(/\bMT5\b(?!®)/g, "MT5®");
}
