// Debug PayPal order 4SN76180EE411502P - Amount mismatch issue
const orderId = "4SN76180EE411502P";

console.log("🔍 Debugging PayPal Order Amount Mismatch:", orderId);
console.log("================================================");

console.log("📊 User Information:");
console.log("- PayPal Amount: $6.21 USD");
console.log("- Email Display: 79,000₫");
console.log("- Order Code: 4SN76180EE411502P");

console.log("\n🧮 Amount Calculations:");
console.log("=======================");

// Calculate VND from USD
const usdAmount = 6.21;
const conversionRate = 24000; // 1 USD = 24,000 VND
const calculatedVND = usdAmount * conversionRate;

console.log(`USD Amount: $${usdAmount}`);
console.log(`Conversion Rate: 1 USD = ${conversionRate.toLocaleString()} VND`);
console.log(`Calculated VND: ${calculatedVND.toLocaleString()}₫`);
console.log(`Email Display: 79,000₫`);
console.log(`Difference: ${Math.abs(calculatedVND - 79000).toLocaleString()}₫`);

console.log("\n🎯 Product Price Analysis:");
console.log("==========================");

const products = [
  { name: "Indicator Pro Pack", price: 1990000, usd: 1990000/24000 },
  { name: "EA Full Version", price: 7900000, usd: 7900000/24000 },
  { name: "EA Pro + Source Code", price: 14900000, usd: 14900000/24000 }
];

products.forEach(product => {
  console.log(`${product.name}:`);
  console.log(`  VND: ${product.price.toLocaleString()}₫`);
  console.log(`  USD: $${product.usd.toFixed(2)}`);
  console.log(`  Match with $6.21: ${Math.abs(product.usd - 6.21) < 0.1 ? '✅ YES' : '❌ NO'}`);
});

console.log("\n❌ PROBLEM IDENTIFIED:");
console.log("======================");
console.log("1. PayPal charged $6.21 USD");
console.log("2. This converts to 149,040₫ (not 79,000₫)");
console.log("3. No product matches $6.21 USD");
console.log("4. Amount-based fallback will fail");
console.log("5. Verification will always fail");

console.log("\n🔧 POSSIBLE CAUSES:");
console.log("===================");
console.log("1. PayPal sandbox conversion rate issue");
console.log("2. Frontend sent wrong amount to PayPal");
console.log("3. PayPal order creation error");
console.log("4. Currency conversion bug");

console.log("\n✅ SOLUTION NEEDED:");
console.log("===================");
console.log("1. Check PayPal order creation API");
console.log("2. Verify amount calculation in frontend");
console.log("3. Add more flexible amount matching");
console.log("4. Debug PayPal order data");
