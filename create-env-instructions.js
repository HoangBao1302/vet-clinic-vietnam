// Instructions to create .env.local file
console.log('🔧 HƯỚNG DẪN TẠO FILE .env.local\n');

console.log('📊 VẤN ĐỀ:');
console.log('   API hoạt động nhưng có lỗi MongoDB connection:');
console.log('   "querySrv ENOTFOUND _mongodb._tcp.cluster.mongodb.net"\n');

console.log('🛠️ GIẢI PHÁP:');
console.log('   Cần tạo file .env.local với MongoDB connection string\n');

console.log('📋 CÁCH TẠO FILE .env.local:');
console.log('   1. Tạo file .env.local trong thư mục gốc của project');
console.log('   2. Copy nội dung từ env.local.example');
console.log('   3. Cập nhật MONGODB_URI với connection string thực tế\n');

console.log('📝 NỘI DUNG FILE .env.local:');
console.log('   # MongoDB Connection');
console.log('   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/thebenchmarktrader?retryWrites=true&w=majority');
console.log('   ');
console.log('   # JWT Secret');
console.log('   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production');
console.log('   ');
console.log('   # Site URL');
console.log('   NEXT_PUBLIC_SITE_URL=http://localhost:3000');
console.log('   ');
console.log('   # SMTP Email Configuration');
console.log('   SMTP_HOST=smtp.gmail.com');
console.log('   SMTP_PORT=587');
console.log('   SMTP_USER=baotong130277@gmail.com');
console.log('   SMTP_PASS=your-app-password');
console.log('   SMTP_FROM=support@ThebenchmarkTrader.com');
console.log('   ');
console.log('   # Stripe Payment Configuration');
console.log('   STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here');
console.log('   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here');
console.log('   STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret_here');
console.log('   ');
console.log('   # PayPal Payment Configuration');
console.log('   PAYPAL_CLIENT_ID=your_paypal_client_id_here');
console.log('   PAYPAL_CLIENT_SECRET=your_paypal_client_secret_here');
console.log('   PAYPAL_MODE=sandbox\n');

console.log('🔑 QUAN TRỌNG:');
console.log('   - Thay "username:password" bằng MongoDB credentials thực tế');
console.log('   - Thay "cluster.mongodb.net" bằng cluster URL thực tế');
console.log('   - Đảm bảo MongoDB Atlas cho phép connection từ IP hiện tại\n');

console.log('🚀 SAU KHI TẠO FILE .env.local:');
console.log('   1. Restart server: Ctrl+C rồi npm run dev');
console.log('   2. Test API lại:');
console.log('      curl -X POST http://localhost:3000/api/admin/fix-missing-stripe-order \\');
console.log('        -H "Content-Type: application/json" \\');
console.log('        -d \'{"customerEmail":"haidangtong2612@gmail.com"}\'\n');

console.log('✅ EXPECTED RESULT:');
console.log('   {"success":true,"message":"Missing Stripe order fixed successfully",...}');
console.log('   Thay vì lỗi MongoDB connection\n');

console.log('🎯 READY TO CREATE .env.local!');

