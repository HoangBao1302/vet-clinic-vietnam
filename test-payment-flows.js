// Test script to verify both PayPal and Stripe payment flows
console.log('🧪 TESTING PAYMENT FLOWS - PAYPAL & STRIPE\n');

console.log('📊 ISSUE IDENTIFIED:');
console.log('   - haidangtong made 2 purchases');
console.log('   - PayPal order: 9GH52985019985411 (ea-full, 7,900,000đ) ✅ Recorded');
console.log('   - Stripe order: Missing from MongoDB ❌ Not recorded');
console.log('   - Affiliate click: ea-pro-source (clicked but not converted)\n');

console.log('🔧 ROOT CAUSE:');
console.log('   - Stripe webhook was only logging orders, not saving to MongoDB');
console.log('   - PayPal webhook was also only logging orders, not saving to MongoDB');
console.log('   - Both webhooks needed to save Order records to database\n');

console.log('🛠️ FIXES IMPLEMENTED:');
console.log('   1. Updated Stripe webhook to save orders to MongoDB');
console.log('   2. Updated PayPal webhook to save orders to MongoDB');
console.log('   3. Created script to fix missing Stripe order');
console.log('   4. Enhanced error handling and logging\n');

console.log('📋 TESTING STEPS:');
console.log('   1. Fix missing Stripe order:');
console.log('      node fix-missing-stripe-order.js\n');

console.log('   2. Verify both orders exist:');
console.log('      - Check MongoDB orders collection');
console.log('      - Should see both PayPal and Stripe orders\n');

console.log('   3. Test new payment flows:');
console.log('      - Test PayPal payment → Should save to MongoDB');
console.log('      - Test Stripe payment → Should save to MongoDB\n');

console.log('💰 EXPECTED COMMISSION CALCULATION:');
console.log('   PayPal Order (ea-full):');
console.log('     - Amount: 7,900,000đ');
console.log('     - Commission Rate: 30%');
console.log('     - Commission: 2,370,000đ\n');

console.log('   Stripe Order (ea-pro-source):');
console.log('     - Amount: 14,900,000đ');
console.log('     - Commission Rate: 30%');
console.log('     - Commission: 4,470,000đ\n');

console.log('   Total Commission: 6,840,000đ\n');

console.log('🔍 VERIFICATION QUERIES:');
console.log('   # Check all orders for haidangtong');
console.log('   db.orders.find({ customerEmail: "haidangtong2612@gmail.com" })\n');

console.log('   # Check affiliate clicks');
console.log('   db.affiliateclicks.find({ affiliateCode: "AFF-KIET DANG TONG-15B161" })\n');

console.log('   # Check converted clicks');
console.log('   db.affiliateclicks.find({ affiliateCode: "AFF-KIET DANG TONG-15B161", status: "converted" })\n');

console.log('   # Check kietdangtong commission');
console.log('   db.users.findOne({ username: "kietdangtong" }, { totalCommissionEarned: 1 })\n');

console.log('🚨 COMMON ISSUES TO CHECK:');
console.log('   1. Webhook Configuration:');
console.log('      - Stripe webhook URL: /api/webhooks/stripe');
console.log('      - PayPal webhook URL: /api/webhooks/paypal');
console.log('      - Webhook secrets configured correctly\n');

console.log('   2. Database Connection:');
console.log('      - MongoDB connection string');
console.log('      - Order model imported correctly');
console.log('      - Error handling for DB failures\n');

console.log('   3. Payment Metadata:');
console.log('      - Affiliate code in payment metadata');
console.log('      - Product ID in payment metadata');
console.log('      - Customer info in payment metadata\n');

console.log('✅ EXPECTED RESULTS AFTER FIX:');
console.log('   - Both PayPal and Stripe orders in MongoDB');
console.log('   - Both affiliate clicks converted');
console.log('   - Total commission: 6,840,000đ');
console.log('   - kietdangtong sees commission in dashboard\n');

console.log('🔧 NEXT STEPS:');
console.log('   1. Run: node fix-missing-stripe-order.js');
console.log('   2. Verify orders in MongoDB');
console.log('   3. Check affiliate dashboard');
console.log('   4. Test new payments to ensure they save correctly\n');

console.log('🎯 READY FOR TESTING!');

