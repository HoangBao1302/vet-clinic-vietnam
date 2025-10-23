// Test verification for ALL products to ensure comprehensive fix
const allProducts = [
  // MT4 Products
  {
    id: "indicator-pro-mt4",
    name: "Multi-Indicator Pro Pack (MT4)",
    price: 1990000,
    platform: "MT4"
  },
  {
    id: "ea-full-mt4", 
    name: "EA ThebenchmarkTrader Full Version (MT4)",
    price: 7900000,
    platform: "MT4"
  },
  {
    id: "ea-pro-source-mt4",
    name: "EA ThebenchmarkTrader Pro + Source Code (MT4)", 
    price: 14900000,
    platform: "MT4"
  },
  
  // MT5 Products
  {
    id: "indicator-pro-mt5",
    name: "Multi-Indicator Pro Pack (MT5)",
    price: 1990000,
    platform: "MT5"
  },
  {
    id: "ea-full-mt5",
    name: "EA ThebenchmarkTrader Full Version (MT5)",
    price: 7900000,
    platform: "MT5"
  },
  {
    id: "ea-pro-source-mt5",
    name: "EA ThebenchmarkTrader Pro + Source Code (MT5)",
    price: 14900000,
    platform: "MT5"
  }
];

console.log("🧪 Testing Verification for ALL Products");
console.log("==========================================");

allProducts.forEach((product, index) => {
  console.log(`\n${index + 1}. 📦 ${product.name}`);
  console.log(`   🆔 ID: ${product.id}`);
  console.log(`   💰 Price: ${product.price.toLocaleString()}₫`);
  console.log(`   📱 Platform: ${product.platform}`);
  
  // Calculate expected PayPal amount
  const expectedAmountUSD = (product.price / 24000).toFixed(2);
  console.log(`   💵 PayPal Amount: $${expectedAmountUSD} USD`);
  
  // Test amount-based fallback
  const tolerance = 200000;
  let fallbackMatch = false;
  
  if (Math.abs(product.price - 1990000) < tolerance) {
    fallbackMatch = true;
    console.log(`   ✅ Amount fallback: indicator-pro-mt5`);
  } else if (Math.abs(product.price - 7900000) < tolerance) {
    fallbackMatch = true;
    console.log(`   ✅ Amount fallback: ea-full-mt5`);
  } else if (Math.abs(product.price - 14900000) < tolerance) {
    fallbackMatch = true;
    console.log(`   ✅ Amount fallback: ea-pro-source-mt5`);
  }
  
  if (!fallbackMatch) {
    console.log(`   ❌ Amount fallback: NO MATCH`);
  }
});

console.log("\n🔍 Analysis:");
console.log("=============");
console.log("✅ All products have amount-based fallback");
console.log("✅ All products default to MT5 versions");
console.log("⚠️  MT4 products will get MT5 download URLs");
console.log("⚠️  This might cause confusion for MT4 users");

console.log("\n🔧 Recommended Fix:");
console.log("===================");
console.log("1. Enhance amount-based fallback to detect platform");
console.log("2. Use reference_id as primary source");
console.log("3. Add platform-specific fallback logic");
console.log("4. Test with real PayPal orders for each product");
