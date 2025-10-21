// MongoDB Connection Fix Guide
console.log('🔧 HƯỚNG DẪN KẾT NỐI MONGODB\n');

console.log('📊 TÌNH HÌNH HIỆN TẠI:');
console.log('   ✅ MongoDB Atlas hoạt động tốt');
console.log('   ✅ Cluster: Cluster0 (AWS Singapore)');
console.log('   ✅ Database: leopardsmart');
console.log('   ✅ Collection: affiliateclicks (8 documents)');
console.log('   ❌ Next.js app không kết nối được MongoDB\n');

console.log('🔍 NGUYÊN NHÂN:');
console.log('   - Thiếu file .env.local');
console.log('   - MongoDB connection string không đúng');
console.log('   - IP address không được whitelist\n');

console.log('🛠️ GIẢI PHÁP:');
console.log('   1. Lấy MongoDB Connection String từ Atlas');
console.log('   2. Tạo file .env.local');
console.log('   3. Whitelist IP address');
console.log('   4. Test connection\n');

console.log('📋 BƯỚC 1: LẤY CONNECTION STRING');
console.log('   1. Vào MongoDB Atlas Dashboard');
console.log('   2. Click "Connect" trên cluster Cluster0');
console.log('   3. Chọn "Connect your application"');
console.log('   4. Copy connection string (sẽ có dạng):');
console.log('      mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/leopardsmart?retryWrites=true&w=majority\n');

console.log('📋 BƯỚC 2: TẠO FILE .env.local');
console.log('   Tạo file .env.local trong thư mục gốc với nội dung:');
console.log('   ');
console.log('   # MongoDB Connection');
console.log('   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/leopardsmart?retryWrites=true&w=majority');
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

console.log('📋 BƯỚC 3: WHITELIST IP ADDRESS');
console.log('   1. Vào MongoDB Atlas Dashboard');
console.log('   2. Click "Network Access" ở sidebar');
console.log('   3. Click "Add IP Address"');
console.log('   4. Chọn "Add Current IP Address" hoặc "Allow Access from Anywhere" (0.0.0.0/0)');
console.log('   5. Click "Confirm"\n');

console.log('📋 BƯỚC 4: TEST CONNECTION');
console.log('   1. Restart Next.js server:');
console.log('      Ctrl+C (dừng server)');
console.log('      npm run dev (start lại)');
console.log('   ');
console.log('   2. Test API:');
console.log('      curl -X POST http://localhost:3000/api/admin/fix-missing-stripe-order \\');
console.log('        -H "Content-Type: application/json" \\');
console.log('        -d \'{"customerEmail":"haidangtong2612@gmail.com"}\'\n');

console.log('🔑 QUAN TRỌNG:');
console.log('   - Thay <username> và <password> bằng credentials thực tế');
console.log('   - Đảm bảo database name là "leopardsmart" (như trong hình)');
console.log('   - Whitelist IP address hiện tại');
console.log('   - File .env.local phải ở thư mục gốc của project\n');

console.log('✅ EXPECTED RESULT:');
console.log('   {"success":true,"message":"Missing Stripe order fixed successfully",...}');
console.log('   Thay vì lỗi MongoDB connection\n');

console.log('🚨 NẾU VẪN CÓ LỖI:');
console.log('   1. Check MongoDB Atlas logs');
console.log('   2. Verify username/password');
console.log('   3. Check IP whitelist');
console.log('   4. Verify database name\n');

console.log('🎯 READY TO CONNECT!');
