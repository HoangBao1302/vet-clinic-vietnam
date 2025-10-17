# 🗄️ Setup MongoDB Atlas - Complete Guide

## 📋 Mục Đích

Hướng dẫn tạo MongoDB Atlas database từ đầu (hoặc connect với existing cluster).

---

## 🆓 Bước 1: Create Free MongoDB Atlas Account

### **1.1. Sign Up**

1. Truy cập: https://www.mongodb.com/cloud/atlas/register
2. Sign up với:
   - Google Account (recommended - faster)
   - Email address
   - GitHub account

### **1.2. Choose Plan**

1. Select: **"Shared (Free)"** plan
   - ✅ 512 MB storage
   - ✅ Free forever
   - ✅ Đủ cho development và testing

2. Cloud Provider: **AWS** (recommended)
3. Region: **Singapore (ap-southeast-1)** (closest to Vietnam)

### **1.3. Cluster Name**

```
Cluster Name: Cluster0 (default OK)
```

4. Click: **"Create Cluster"**

⏱️ Wait 3-5 minutes for cluster creation

---

## 🔐 Bước 2: Database Access (Create User)

### **2.1. Create Database User**

1. Click **"Database Access"** trong left sidebar
2. Click **"Add New Database User"**

3. **Authentication Method:** Password
   - Username: `thebenchmarktrader`
   - Password: Click **"Autogenerate Secure Password"**
   - ⚠️ **SAVE PASSWORD!** Copy và lưu lại
   
4. **Database User Privileges:**
   - Select: **"Read and write to any database"**

5. Click **"Add User"**

**Example credentials:**
```
Username: thebenchmarktrader
Password: AbC123xYz789MnO456 (your generated password)
```

---

## 🌐 Bước 3: Network Access (Whitelist IP)

### **3.1. Allow Access From Anywhere (Development)**

1. Click **"Network Access"** trong left sidebar
2. Click **"Add IP Address"**

3. **Option A - Allow From Anywhere (Easiest):**
   ```
   Click: "Allow Access From Anywhere"
   IP Address: 0.0.0.0/0
   Description: Allow all IPs (development only)
   ```
   ⚠️ **Note:** Không recommend cho production

4. **Option B - Specific IPs (Production):**
   ```
   Add your local IP
   Add Vercel IPs if deploying
   ```

5. Click **"Confirm"**

---

## 🔗 Bước 4: Get Connection String

### **4.1. Connect to Cluster**

1. Go to **"Database"** trong left sidebar
2. Click **"Connect"** button trên cluster của bạn
3. Choose: **"Connect your application"**

### **4.2. Copy Connection String**

1. Driver: **Node.js**
2. Version: **6.8 or later**

3. Copy connection string:
```
mongodb+srv://thebenchmarktrader:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### **4.3. Customize Connection String**

Replace placeholders:

**Before:**
```
mongodb+srv://thebenchmarktrader:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**After:**
```
mongodb+srv://thebenchmarktrader:AbC123xYz789MnO456@cluster0.abc123.mongodb.net/thebenchmarktrader?retryWrites=true&w=majority
```

**Changes:**
- `<password>` → Your actual password
- Add `/thebenchmarktrader` before `?` (database name)

---

## 📝 Bước 5: Update Environment Variables

### **5.1. Local Development**

Edit `.env.local`:

```bash
MONGODB_URI=mongodb+srv://thebenchmarktrader:AbC123xYz789MnO456@cluster0.abc123.mongodb.net/thebenchmarktrader?retryWrites=true&w=majority
```

### **5.2. Vercel Production**

1. Go to Vercel Dashboard
2. Select your project
3. Settings → Environment Variables
4. Find `MONGODB_URI`
5. Click "Edit"
6. Paste new connection string
7. Save
8. **Redeploy** project để apply changes

---

## ✅ Bước 6: Test Connection

### **6.1. Test Locally**

```bash
node scripts/check-paypal-orders.js
```

**Expected output:**
```
🔍 Connecting to MongoDB...
✅ Connected to MongoDB

📦 Checking PayPal Orders...
Found 0 PayPal orders  # OK if new database
```

### **6.2. Test với MongoDB Compass (Optional)**

1. Download: https://www.mongodb.com/products/compass
2. Install MongoDB Compass
3. Connect with connection string
4. Browse collections

---

## 🗂️ Bước 7: Create Collections (If Needed)

MongoDB tự động tạo collections khi insert data lần đầu. Nhưng nếu muốn tạo trước:

### **7.1. Via MongoDB Atlas UI**

1. Database → Browse Collections
2. Click "Create Database"
   - Database name: `thebenchmarktrader`
   - Collection name: `users`
3. Repeat for other collections:
   - `affiliateclicks`
   - `orders`
   - `paymentrequests`

### **7.2. Via Application**

Collections sẽ tự động được tạo khi app chạy lần đầu.

---

## 🔧 Bước 8: Configure for Production

### **8.1. Security Best Practices**

1. **Change default password:**
   ```
   Database Access → Edit User → Reset Password
   ```

2. **Restrict Network Access:**
   ```
   Network Access → Edit → Add specific IPs only
   ```

3. **Enable Monitoring:**
   ```
   Metrics → Enable alerts for:
   - High connections
   - Low storage
   ```

### **8.2. Backup Configuration**

1. **Enable Auto-Backups (M10+ clusters - not free):**
   - Or manual exports regularly

2. **Export Data:**
   ```bash
   # Using mongodump
   mongodump --uri="mongodb+srv://..." --out=./backup
   ```

---

## 📊 Bước 9: Monitor & Maintain

### **9.1. Check Metrics**

1. MongoDB Atlas → Metrics
2. Monitor:
   - ✅ Connections
   - ✅ Storage used (max 512MB on free tier)
   - ✅ Operations per second

### **9.2. Check Logs**

1. MongoDB Atlas → Database → Monitoring
2. View real-time logs
3. Check for errors

---

## 🛠️ Troubleshooting

### **Problem: Connection timeout**

**Solutions:**
1. Check Network Access whitelist
2. Verify password in connection string (no special chars issues)
3. Check if cluster is running
4. Test with MongoDB Compass

### **Problem: Authentication failed**

**Solutions:**
1. Verify username/password
2. Check Database Access permissions
3. Password có special characters cần URL encode:
   ```
   @ → %40
   : → %3A
   / → %2F
   ? → %3F
   # → %23
   ```

### **Problem: Database not found**

**Solution:**
- Add database name to connection string:
  ```
  ...mongodb.net/thebenchmarktrader?retryWrites...
                     ↑ database name here
  ```

### **Problem: IP not whitelisted**

**Solution:**
1. Get your current IP: https://whatismyipaddress.com/
2. Add to Network Access in Atlas
3. Or use 0.0.0.0/0 for testing

---

## 🔄 Migrate Data From Old Database (If Needed)

### **Option A: Using MongoDB Compass**

1. Connect to old database
2. Export collections (JSON/CSV)
3. Connect to new database
4. Import collections

### **Option B: Using mongodump/mongorestore**

```bash
# Export from old database
mongodump --uri="mongodb+srv://old-connection..." --out=./backup

# Import to new database
mongorestore --uri="mongodb+srv://new-connection..." ./backup
```

### **Option C: Application-level migration**

Use migration scripts to copy data programmatically.

---

## 📱 MongoDB Atlas Mobile App

Download app để monitor on-the-go:
- iOS: https://apps.apple.com/app/mongodb-atlas/id1449546312
- Android: https://play.google.com/store/apps/details?id=com.mongodb.atlas

---

## 💡 Free Tier Limits

| Resource | Free Tier Limit |
|----------|----------------|
| Storage | 512 MB |
| RAM | Shared |
| Connections | 500 concurrent |
| Backups | Manual only |
| Clusters | 1 per project |

**When to upgrade:**
- Storage > 400MB (approaching limit)
- Need automated backups
- Need better performance
- Production workload

---

## 🎯 Connection String Formats

### **Standard Connection String:**
```
mongodb+srv://username:password@cluster.mongodb.net/database?options
```

### **With All Options:**
```
mongodb+srv://thebenchmarktrader:pass@cluster0.abc123.mongodb.net/thebenchmarktrader?retryWrites=true&w=majority&appName=ThebenchmarkTrader
```

### **Local MongoDB (for testing):**
```
mongodb://localhost:27017/thebenchmarktrader
```

---

## ✅ Post-Setup Checklist

- [ ] MongoDB Atlas account created
- [ ] Cluster created (Singapore region)
- [ ] Database user created with password saved
- [ ] Network access configured (whitelist IPs)
- [ ] Connection string obtained
- [ ] `.env.local` updated with connection string
- [ ] Vercel environment variables updated
- [ ] Connection tested successfully
- [ ] Collections created (or will auto-create)
- [ ] Monitoring enabled

---

## 🚀 Next Steps

After setup:

1. ✅ Run `node scripts/check-paypal-orders.js`
2. ✅ Deploy application to Vercel
3. ✅ Test full workflow
4. ✅ Run migrations if needed
5. ✅ Monitor database metrics

---

## 📞 Support Resources

- MongoDB Atlas Docs: https://docs.atlas.mongodb.com/
- Community Forums: https://www.mongodb.com/community/forums/
- Stack Overflow: https://stackoverflow.com/questions/tagged/mongodb
- MongoDB University (Free courses): https://university.mongodb.com/

---

## 🔐 Security Reminders

1. ❌ Never commit `.env.local` to Git
2. ❌ Never share connection string publicly
3. ✅ Use strong passwords
4. ✅ Restrict network access in production
5. ✅ Monitor for suspicious activity
6. ✅ Rotate passwords regularly
7. ✅ Use read-only users for analytics/reporting

---

## 💾 Backup Strategy

**For Free Tier (Manual):**

```bash
# Weekly backup script
mongodump --uri="$MONGODB_URI" --out="./backups/$(date +%Y%m%d)"

# Keep last 4 weeks
find ./backups -type d -mtime +28 -exec rm -rf {} \;
```

**For Paid Tier:**
- Enable automatic point-in-time backups
- Configure retention policy
- Test restore procedure regularly

