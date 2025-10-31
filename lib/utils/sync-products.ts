/**
 * Utility functions to sync product data across pricing, webhooks, and downloads
 * 
 * This ensures consistency when products are created/updated in MongoDB
 */

import Product from "@/lib/models/Product";

/**
 * Get all active products for pricing page
 */
export async function getProductsForPricing() {
  await require("@/lib/mongodb").dbConnect();
  const products = await Product.find({ status: "active" })
    .sort({ platform: 1, category: 1 })
    .lean();

  return products;
}

/**
 * Get price mapping for webhook validation
 * Example: { "ea-full-mt4": 7900000, "indicator-pro-mt5": 1990000, ... }
 */
export async function getPriceMapping() {
  await require("@/lib/mongodb").dbConnect();
  const products = await Product.find({ status: "active" }).lean();

  const priceMap: Record<string, number> = {};
  products.forEach((product) => {
    priceMap[product.id] = product.price;
  });

  return priceMap;
}

/**
 * Get product name mapping for emails
 * Example: { "ea-full-mt4": "EA ThebenchmarkTrader Full Version (MT4)", ... }
 */
export async function getProductNameMapping() {
  await require("@/lib/mongodb").dbConnect();
  const products = await Product.find({ status: "active" }).lean();

  const nameMap: Record<string, string> = {};
  products.forEach((product) => {
    nameMap[product.id] = product.name;
  });

  return nameMap;
}

/**
 * Get commission rates mapping
 * Example: { "ea-full-mt4": { paid: 0.35, free: 0.30 }, ... }
 */
export async function getCommissionRatesMapping() {
  await require("@/lib/mongodb").dbConnect();
  const products = await Product.find({ status: "active" }).lean();

  const ratesMap: Record<string, { paid: number; free: number }> = {};
  products.forEach((product) => {
    ratesMap[product.id] = {
      paid: product.commissionRates?.paidAffiliate || 0.35,
      free: product.commissionRates?.freeAffiliate || 0.30,
    };
  });

  return ratesMap;
}

/**
 * Generate code snippets for manual sync
 * (Use this when you need to update pricing/webhooks files)
 */
export async function generateSyncCode() {
  await require("@/lib/mongodb").dbConnect();
  const products = await Product.find({ status: "active" })
    .sort({ platform: 1, category: 1 })
    .lean();

  // Generate expectedPrices
  const expectedPrices: Record<string, number> = {};
  products.forEach((product) => {
    expectedPrices[product.id] = product.price;
  });

  // Generate productNames
  const productNames: Record<string, string> = {};
  products.forEach((product) => {
    productNames[product.id] = product.name;
  });

  // Generate commissionRates
  const commissionRates: Record<string, string> = {};
  products.forEach((product) => {
    const paid = product.commissionRates?.paidAffiliate || 0.35;
    const free = product.commissionRates?.freeAffiliate || 0.30;
    commissionRates[product.id] = `affiliate.isPaid ? ${paid} : ${free}`;
  });

  return {
    expectedPrices,
    productNames,
    commissionRates,
    codeSnippet: `
// Copy this to app/pricing/page.tsx, app/downloads/page.tsx, webhooks

const expectedPrices: Record<string, number> = ${JSON.stringify(expectedPrices, null, 2)};

const productNames: Record<string, string> = ${JSON.stringify(productNames, null, 2)};

const commissionRates: Record<string, number> = {
${products.map((p) => `  "${p.id}": affiliate.isPaid ? ${p.commissionRates?.paidAffiliate || 0.35} : ${p.commissionRates?.freeAffiliate || 0.30}`).join(",\n")}
};
`,
  };
}

