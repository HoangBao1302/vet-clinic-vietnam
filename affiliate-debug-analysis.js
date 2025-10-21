// Simple test to check affiliate commission issue
console.log('🔍 Affiliate Commission Debug Analysis\n');

console.log('📊 Based on the code analysis, here are the potential issues:\n');

console.log('1. AFFILIATE CLICK TRACKING ISSUE:');
console.log('   - When haidangtong clicked kietdangtong\'s affiliate link,');
console.log('   - The system should have created an AffiliateClick record');
console.log('   - But this might not have happened if:');
console.log('     * The affiliate link was not properly formatted');
console.log('     * The click tracking API was not called');
console.log('     * The affiliate code was not passed correctly\n');

console.log('2. COMMISSION CALCULATION ISSUE:');
console.log('   - In webhook handlers (Stripe & PayPal),');
console.log('   - The system looks for affiliateCode in metadata');
console.log('   - Then finds the most recent "clicked" AffiliateClick record');
console.log('   - If no "clicked" record exists, no commission is calculated\n');

console.log('3. POTENTIAL SOLUTIONS:');
console.log('   - Check if kietdangtong has affiliateCode and status="approved"');
console.log('   - Check if there are any AffiliateClick records for kietdangtong');
console.log('   - Check if the affiliate link was properly formatted');
console.log('   - Check if the payment metadata included the affiliateCode\n');

console.log('4. DEBUGGING STEPS:');
console.log('   - Run: node debug-affiliate-commission.js (if MongoDB connection works)');
console.log('   - Or check MongoDB directly for:');
console.log('     * users collection: kietdangtong user data');
console.log('     * affiliateclicks collection: click records');
console.log('   - Check webhook logs for commission calculation\n');

console.log('5. IMMEDIATE FIX:');
console.log('   - If haidangtong\'s purchase was successful but no commission:');
console.log('   - We can manually create the commission record');
console.log('   - Or re-run the webhook with proper affiliate data\n');

console.log('💡 RECOMMENDATION:');
console.log('   - Test with anhkim as suggested');
console.log('   - But first fix the existing issue for kietdangtong');
console.log('   - Ensure affiliate links are properly formatted');
console.log('   - Ensure click tracking is working\n');

