// Simple instructions to fix missing Stripe order
console.log('🔧 HƯỚNG DẪN FIX MISSING STRIPE ORDER\n');

console.log('📊 VẤN ĐỀ:');
console.log('   - haidangtong mua hàng 2 lần (PayPal + Stripe)');
console.log('   - PayPal order: 9GH52985019985411 ✅ Đã ghi nhận');
console.log('   - Stripe order: Missing từ MongoDB ❌ Chưa ghi nhận');
console.log('   - Affiliate click: ea-pro-source (clicked nhưng chưa converted)\n');

console.log('🛠️ GIẢI PHÁP:');
console.log('   Đã tạo API endpoint: POST /api/admin/fix-missing-stripe-order');
console.log('   API này sẽ:');
console.log('   1. Tạo missing Stripe order cho ea-pro-source');
console.log('   2. Convert affiliate click thành converted');
console.log('   3. Tính commission cho kietdangtong');
console.log('   4. Cập nhật totalCommissionEarned\n');

console.log('🚀 CÁCH CHẠY:');
console.log('   Cách 1: Sử dụng curl');
console.log('   curl -X POST http://localhost:3000/api/admin/fix-missing-stripe-order \\');
console.log('     -H "Content-Type: application/json" \\');
console.log('     -d \'{"customerEmail":"haidangtong2612@gmail.com","customerName":"Hai Tong","customerPhone":"0948617091"}\'\n');

console.log('   Cách 2: Sử dụng Postman hoặc API client');
console.log('   URL: POST http://localhost:3000/api/admin/fix-missing-stripe-order');
console.log('   Body:');
console.log('   {');
console.log('     "customerEmail": "haidangtong2612@gmail.com",');
console.log('     "customerName": "Hai Tong",');
console.log('     "customerPhone": "0948617091"');
console.log('   }\n');

console.log('   Cách 3: Sử dụng browser console');
console.log('   fetch("/api/admin/fix-missing-stripe-order", {');
console.log('     method: "POST",');
console.log('     headers: { "Content-Type": "application/json" },');
console.log('     body: JSON.stringify({');
console.log('       customerEmail: "haidangtong2612@gmail.com",');
console.log('       customerName: "Hai Tong",');
console.log('       customerPhone: "0948617091"');
console.log('     })');
console.log('   }).then(r => r.json()).then(console.log);\n');

console.log('💰 EXPECTED RESULTS:');
console.log('   - Stripe order: STRIPE-FIX-xxxxx (ea-pro-source, 14,900,000đ)');
console.log('   - PayPal order: 9GH52985019985411 (ea-full, 7,900,000đ)');
console.log('   - Total Commission: 6,840,000đ');
console.log('   - kietdangtong thấy commission trong affiliate dashboard\n');

console.log('🔍 VERIFICATION:');
console.log('   Sau khi chạy API, check:');
console.log('   1. MongoDB orders collection có 2 orders');
console.log('   2. AffiliateClick có 2 converted clicks');
console.log('   3. kietdangtong.totalCommissionEarned = 6,840,000đ');
console.log('   4. Affiliate dashboard hiển thị commission\n');

console.log('🚨 NẾU CÓ LỖI:');
console.log('   1. Check server logs cho error messages');
console.log('   2. Verify MongoDB connection');
console.log('   3. Check Order model exists');
console.log('   4. Verify user permissions\n');

console.log('✅ READY TO FIX!');
console.log('   Chọn một trong các cách trên để chạy fix API.');

