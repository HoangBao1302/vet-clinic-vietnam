# 🔐 Lấy MongoDB URI Từ Vercel

## 📋 Mục Đích

Lấy MongoDB connection string đang được sử dụng trên production để chạy migration scripts locally.

---

## 🚀 Các Bước Thực Hiện

### **Bước 1: Login Vercel Dashboard**

1. Truy cập: https://vercel.com/
2. Login với account của bạn
3. Chọn project: **thebenchmarktrader** (hoặc tên project của bạn)

---

### **Bước 2: Vào Settings**

1. Click vào project name
2. Click tab **"Settings"** ở top menu
3. Chọn **"Environment Variables"** trong sidebar

---

### **Bước 3: Tìm MONGODB_URI**

1. Scroll xuống list environment variables
2. Tìm variable có tên: **`MONGODB_URI`**
3. Click vào icon **"eye"** (👁️) để reveal value
4. Copy toàn bộ giá trị

**Format sẽ giống như:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/thebenchmarktrader?retryWrites=true&w=majority
```

---

### **Bước 4: Update Local .env.local**

1. Mở file `.env.local` trong project
2. Tìm dòng: `MONGODB_URI=...`
3. Replace với giá trị vừa copy từ Vercel
4. Save file

**Ví dụ:**
```bash
# Before
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/...

# After (with real values)
MONGODB_URI=mongodb+srv://myuser:MyRealP@ssw0rd@cluster0.abc123.mongodb.net/thebenchmarktrader?retryWrites=true&w=majority
```

---

### **Bước 5: Verify Connection**

Chạy check script để verify:

```bash
node scripts/check-paypal-orders.js
```

**Nếu thành công, bạn sẽ thấy:**
```
🔍 Connecting to MongoDB...
✅ Connected to MongoDB

📦 Checking PayPal Orders...
Found X PayPal orders
...
```

**Nếu lỗi:**
```
❌ Error: querySrv ENOTFOUND
```
→ Check lại connection string có đúng không

---

## 🔐 Security Notes

1. **KHÔNG commit** `.env.local` vào Git
2. **KHÔNG share** MongoDB URI publicly
3. File `.env.local` đã có trong `.gitignore` (safe)

---

## 🛠️ Troubleshooting

### **Problem: Variable không có trong Vercel**

**Solution:**
- Check project đúng chưa
- Check environment (Production / Preview / Development)
- Có thể variable chỉ set cho Production

### **Problem: Connection string không work**

**Solution:**
- Verify username/password không có special characters problematic
- Check IP whitelist trong MongoDB Atlas
- Test connection trên MongoDB Compass

### **Problem: Authentication failed**

**Solution:**
- Username/password có thể đã thay đổi
- Check MongoDB Atlas → Database Access
- Reset password nếu cần

---

## 📱 Alternative: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Pull environment variables
vercel env pull .env.local

# This will automatically download all env vars
```

---

## ✅ Next Steps

Sau khi có MongoDB URI:

1. ✅ Run `node scripts/check-paypal-orders.js`
2. ✅ Review database contents
3. ✅ Run migration if needed

---

## 💡 Tips

- **Backup before migration**: Export data từ MongoDB Atlas
- **Test with staging**: Nếu có staging environment, test đó trước
- **Monitor logs**: Check Vercel logs để xem có lỗi gì không

