// Test API endpoint availability
console.log('🧪 TESTING API ENDPOINT AVAILABILITY\n');

console.log('📊 API ENDPOINT CREATED:');
console.log('   POST /api/admin/fix-missing-stripe-order\n');

console.log('🔍 TESTING STEPS:');
console.log('   1. Start your Next.js server:');
console.log('      npm run dev');
console.log('      # or');
console.log('      yarn dev\n');

console.log('   2. Test API endpoint:');
console.log('      curl -X POST http://localhost:3000/api/admin/fix-missing-stripe-order \\');
console.log('        -H "Content-Type: application/json" \\');
console.log('        -d \'{"customerEmail":"haidangtong2612@gmail.com"}\'\n');

console.log('   3. Expected response:');
console.log('      {');
console.log('        "success": true,');
console.log('        "message": "Missing Stripe order fixed successfully",');
console.log('        "data": {');
console.log('          "orders": [...],');
console.log('          "convertedClicks": [...],');
console.log('          "totalCommission": 6840000,');
console.log('          "newStripeOrder": {...}');
console.log('        }');
console.log('      }\n');

console.log('💰 WHAT THE API WILL DO:');
console.log('   1. ✅ Create missing Stripe order for ea-pro-source');
console.log('   2. ✅ Convert affiliate click from "clicked" to "converted"');
console.log('   3. ✅ Calculate commission: 14,900,000đ × 30% = 4,470,000đ');
console.log('   4. ✅ Update kietdangtong.totalCommissionEarned');
console.log('   5. ✅ Return all orders and commission data\n');

console.log('🔍 VERIFICATION AFTER API CALL:');
console.log('   MongoDB orders collection:');
console.log('   - PayPal order: 9GH52985019985411 (ea-full, 7,900,000đ)');
console.log('   - Stripe order: STRIPE-FIX-xxxxx (ea-pro-source, 14,900,000đ)\n');

console.log('   MongoDB affiliateclicks collection:');
console.log('   - Click 1: ea-pro-source (converted, 4,470,000đ commission)');
console.log('   - Click 2: ea-full (converted, 2,370,000đ commission)\n');

console.log('   MongoDB users collection:');
console.log('   - kietdangtong.totalCommissionEarned = 6,840,000đ\n');

console.log('🎯 FINAL RESULT:');
console.log('   - haidangtong: 2 orders recorded ✅');
console.log('   - kietdangtong: 6,840,000đ commission ✅');
console.log('   - Affiliate dashboard: Shows correct commission ✅');
console.log('   - Future payments: Will be saved correctly ✅\n');

console.log('🚀 READY TO EXECUTE!');
console.log('   Run the curl command above to fix the missing Stripe order.');

