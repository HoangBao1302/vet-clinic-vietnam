// Simple test for affiliate flow with anhkim
console.log('🧪 TESTING AFFILIATE FLOW WITH ANHKIM\n');

console.log('📊 TEST SCENARIO:');
console.log('   Affiliate: anhkim');
console.log('   Customer: New user');
console.log('   Product: EA ThebenchmarkTrader Full Version');
console.log('   Expected Commission: 30% (2,370,000đ)\n');

console.log('🔍 STEP-BY-STEP TEST:');
console.log('   1. ✅ Check anhkim is approved affiliate');
console.log('   2. ✅ Generate affiliate link: https://thebenchmarktrader.com?affiliate=AFF-ANHKIM-ABC123&product=ea-full');
console.log('   3. ✅ Customer clicks link → AffiliateClick record created');
console.log('   4. ✅ Customer completes purchase → Webhook processes');
console.log('   5. ✅ Commission calculated and assigned to anhkim\n');

console.log('💰 COMMISSION CALCULATION:');
console.log('   Product Price: 7,900,000đ');
console.log('   Commission Rate: 30% (free member)');
console.log('   Commission Amount: 2,370,000đ\n');

console.log('🔧 MANUAL TEST STEPS:');
console.log('   1. Ensure anhkim is approved affiliate:');
console.log('      - Check MongoDB: users collection');
console.log('      - Filter: { username: "anhkim" }');
console.log('      - Verify: affiliateStatus: "approved", affiliateCode exists\n');

console.log('   2. Generate affiliate link:');
console.log('      - Login as anhkim');
console.log('      - Go to affiliate dashboard');
console.log('      - Copy tracking link for EA Full\n');

console.log('   3. Test purchase flow:');
console.log('      - Use affiliate link in incognito browser');
console.log('      - Complete purchase with test card');
console.log('      - Check webhook logs for commission processing\n');

console.log('   4. Verify commission:');
console.log('      - Check anhkim\'s affiliate dashboard');
console.log('      - Verify commission appears');
console.log('      - Check AffiliateClick records in MongoDB\n');

console.log('📋 MONGODB QUERIES TO VERIFY:');
console.log('   # Check anhkim user');
console.log('   db.users.findOne({ username: "anhkim" })\n');

console.log('   # Check affiliate clicks');
console.log('   db.affiliateclicks.find({ affiliateCode: "AFF-ANHKIM-ABC123" })\n');

console.log('   # Check converted clicks');
console.log('   db.affiliateclicks.find({ affiliateCode: "AFF-ANHKIM-ABC123", status: "converted" })\n');

console.log('🚨 COMMON ISSUES TO CHECK:');
console.log('   1. Affiliate link format:');
console.log('      - Must include affiliate parameter');
console.log('      - Must include product parameter');
console.log('      - Must be properly URL encoded\n');

console.log('   2. Click tracking:');
console.log('      - API call to /api/affiliate/track');
console.log('      - AffiliateClick record created');
console.log('      - Cookie set for conversion tracking\n');

console.log('   3. Payment processing:');
console.log('      - Affiliate code in payment metadata');
console.log('      - Webhook receives affiliate code');
console.log('      - Commission calculation executed\n');

console.log('   4. Commission assignment:');
console.log('      - AffiliateClick record updated');
console.log('      - User totalCommissionEarned updated');
console.log('      - Dashboard shows correct amount\n');

console.log('✅ EXPECTED RESULTS:');
console.log('   - anhkim sees 2,370,000đ commission in dashboard');
console.log('   - AffiliateClick record shows status: "converted"');
console.log('   - Commission breakdown shows EA Full purchase');
console.log('   - Total commission earned updated\n');

console.log('🔧 IF TEST FAILS:');
console.log('   1. Check webhook logs for errors');
console.log('   2. Verify affiliate code in payment metadata');
console.log('   3. Check AffiliateClick records exist');
console.log('   4. Use manual fix API if needed\n');

console.log('🎯 READY FOR TESTING!');
console.log('   Run the manual test steps above to verify the affiliate flow works correctly.');

