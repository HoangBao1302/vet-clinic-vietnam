// Test frontend productId mapping
const downloads = [
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

console.log("🧪 Testing Frontend ProductId Mapping:");
console.log("=====================================");

downloads.forEach(item => {
  console.log(`\n📦 Product: ${item.name}`);
  console.log(`🆔 ID: ${item.id}`);
  console.log(`💰 Price: ${item.price.toLocaleString()}₫`);
  console.log(`📱 Platform: ${item.platform}`);
  
  // Simulate URL params that would be sent to checkout
  const params = new URLSearchParams({
    item: item.id,
    name: item.name,
    price: item.price.toString(),
    method: "paypal"
  });
  
  console.log(`🔗 Checkout URL: /checkout?${params.toString()}`);
});

console.log("\n🎯 Expected PayPal Order for MT5 Full Version:");
console.log("Product ID: ea-full-mt5");
console.log("Amount: 79,000₫ → $3.29 USD");
console.log("Reference ID: ea-full-mt5");

console.log("\n❌ If user sees 'Order is for a different product':");
console.log("1. Check if user clicked correct button");
console.log("2. Check if frontend sends correct productId");
console.log("3. Check if PayPal stores correct reference_id");
console.log("4. Check if verification logic matches correctly");
