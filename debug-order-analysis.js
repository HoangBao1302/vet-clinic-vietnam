// Debug PayPal order 3142567640581632W - User bought Pro + Source Code MT5 (14.9M₫)
const orderId = "3142567640581632W";

console.log("🔍 Debugging PayPal Order:", orderId);
console.log("=====================================");

console.log("📊 User Information:");
console.log("- Product: EA Pro + Source Code MT5");
console.log("- Price: 14,900,000₫ (623 USD)");
console.log("- Expected ProductId: ea-pro-source-mt5");

console.log("\n🎯 Expected PayPal Order Data:");
console.log("- Reference ID: ea-pro-source-mt5");
console.log("- Amount: $623.00 USD");
console.log("- Description: EA ThebenchmarkTrader Pro + Source Code (MT5)");

console.log("\n❌ Current Issue:");
console.log("- User tries to verify on 'Pro + Source Code (MT5)' page");
console.log("- But gets 'Order is for a different product' error");
console.log("- This suggests PayPal order has wrong reference_id");

console.log("\n🔧 Possible Causes:");
console.log("1. Frontend sent wrong productId to PayPal");
console.log("2. PayPal stored wrong reference_id");
console.log("3. Verification logic doesn't match correctly");

console.log("\n✅ Solution:");
console.log("1. Check PayPal order reference_id");
console.log("2. Fix verification logic to handle amount-based fallback");
console.log("3. Ensure frontend sends correct productId");

// Test verification with expected productId
console.log("\n🧪 Testing verification with expected productId...");

// This would be the correct verification call:
const expectedVerification = {
  orderId: orderId,
  productId: "ea-pro-source-mt5" // Expected productId for Pro + Source Code MT5
};

console.log("Expected verification call:", JSON.stringify(expectedVerification, null, 2));
