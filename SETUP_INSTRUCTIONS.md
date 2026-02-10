# 🎯 MongoDB Keep-Alive - Setup Instructions

## ✅ Những gì đã hoàn thành

Tôi đã tạo sẵn **hệ thống tự động** để giữ MongoDB cluster của bạn luôn hoạt động và tránh bị pause sau 30 ngày.

---

## 📦 Files đã tạo

### **1. API Endpoints:**

**`app/api/health/mongodb/route.ts`**
- Health check endpoint public
- URL: `/api/health/mongodb`
- Kiểm tra MongoDB connection
- Reset activity timer mỗi khi được gọi

**`app/api/cron/keep-mongodb-alive/route.ts`**
- Endpoint cho Vercel Cron
- URL: `/api/cron/keep-mongodb-alive`
- Tự động chạy theo lịch (nếu có Vercel Pro)

### **2. Configuration:**

**`vercel.json`** (đã cập nhật)
- Thêm cron job configuration
- Schedule: Mỗi thứ 2 hàng tuần lúc 00:00 UTC

### **3. Documentation:**

**`docs/MONGODB_KEEP_ALIVE.md`**
- Hướng dẫn chi tiết đầy đủ
- Tất cả options (Vercel Cron, UptimeRobot, Cron-job.org, GitHub Actions)
- Troubleshooting guide

**`MONGODB_KEEP_ALIVE_QUICK_START.md`**
- Quick start guide 5 phút
- Setup UptimeRobot miễn phí
- Test instructions

### **4. Utility Script:**

**`keep-mongodb-alive.js`**
- Script standalone để test MongoDB connection
- Có thể chạy manual: `node keep-mongodb-alive.js`

### **5. Environment Variables:**

**`.env.local`** (đã cập nhật)
- Đã thêm MONGODB_URI từ Vercel
- Sẵn sàng để test local

---

## 🚀 Bước tiếp theo (BẠN CẦN LÀM)

### **Bước 1: Push code lên GitHub** ⚠️ QUAN TRỌNG

Code đã được commit nhưng chưa push do lỗi connection. Bạn cần push thủ công:

```bash
# Mở terminal trong project folder
cd D:\CursorP\Thebenchmarktrader

# Push lên GitHub
git push origin main
```

Hoặc dùng GitHub Desktop / VSCode Source Control để push.

---

### **Bước 2: Đợi Vercel auto-deploy** (2-3 phút)

Sau khi push, Vercel sẽ tự động deploy. Theo dõi tại:
- Vercel Dashboard: https://vercel.com/dashboard

---

### **Bước 3: Test endpoint sau khi deploy xong**

**Mở trong browser:**
```
https://thebenchmarktrader.com/api/health/mongodb
```

**Hoặc dùng curl:**
```bash
curl https://thebenchmarktrader.com/api/health/mongodb
```

**Kết quả mong đợi:**
```json
{
  "status": "healthy",
  "message": "MongoDB connection is active",
  "database": "leopardsmart",
  "state": "connected",
  "note": "Activity timer has been reset. Cluster will remain active."
}
```

✅ **Nếu thấy response này → MongoDB đã được reset activity timer!**

---

### **Bước 4: Setup UptimeRobot (MIỄN PHÍ - 2 phút)**

**Tại sao cần UptimeRobot?**
- Vercel Cron cần Pro plan ($20/month)
- UptimeRobot hoàn toàn MIỄN PHÍ
- Tự động ping endpoint mỗi tuần
- Email alert nếu MongoDB down

**Cách setup:**

1. **Đăng ký:** https://uptimerobot.com/signUp

2. **Add New Monitor:**
   - Click **"+ Add New Monitor"**
   - **Monitor Type:** HTTP(s)
   - **Friendly Name:** MongoDB Keep-Alive
   - **URL:** `https://thebenchmarktrader.com/api/health/mongodb`
   - **Monitoring Interval:** 
     - Free plan: Tối thiểu 5 minutes
     - Khuyến nghị: 7 days (để tránh ping quá nhiều)
   - **Alert Contacts:** Email của bạn
   - Click **"Create Monitor"**

3. **Done!** UptimeRobot sẽ tự động làm việc.

---

## 🎉 Kết quả

### ✅ Sau khi hoàn thành setup:

1. **MongoDB sẽ KHÔNG BAO GIỜ bị pause** (do có activity mỗi tuần)
2. **Tự động 100%** - không cần làm gì thêm
3. **Nhận email alert** nếu có vấn đề
4. **Miễn phí hoàn toàn** (dùng UptimeRobot)

### 📊 Monitoring:

**MongoDB Atlas:**
- Vào: https://cloud.mongodb.com
- Cluster0 → Metrics → Connections
- Sẽ thấy connection spike mỗi tuần

**UptimeRobot Dashboard:**
- Xem uptime %
- Check lần ping cuối
- Xem response time

---

## ⏰ Timeline

| Thời gian | Việc cần làm | Status |
|-----------|--------------|--------|
| **Ngay bây giờ** | Push code lên GitHub | ⚠️ Chưa xong |
| **Sau 2-3 phút** | Vercel auto-deploy | ⏳ Chờ push |
| **Sau deploy** | Test endpoint | ⏳ Chờ deploy |
| **Sau test OK** | Setup UptimeRobot | ⏳ Chờ test |
| **Mỗi tuần** | UptimeRobot auto-ping | 🤖 Tự động |

---

## 📖 Tài liệu tham khảo

**Quick Start (5 phút):**
- [`MONGODB_KEEP_ALIVE_QUICK_START.md`](./MONGODB_KEEP_ALIVE_QUICK_START.md)

**Chi tiết đầy đủ:**
- [`docs/MONGODB_KEEP_ALIVE.md`](./docs/MONGODB_KEEP_ALIVE.md)

---

## 🆘 Nếu có vấn đề

### **Endpoint trả về 404:**
- Chưa deploy xong → Đợi Vercel deploy
- Check Vercel Dashboard → Deployments

### **Endpoint trả về 503 (unhealthy):**
- Cluster bị paused → Vào MongoDB Atlas, click "Resume"
- Network Access → Allow 0.0.0.0/0
- Check MONGODB_URI trong Vercel env vars

### **Không push được code:**
```bash
# Check git remote
git remote -v

# Nếu có proxy issue, tắt proxy:
git config --global --unset http.proxy
git config --global --unset https.proxy

# Thử push lại
git push origin main
```

---

## ✅ Checklist

- [ ] Push code lên GitHub (`git push origin main`)
- [ ] Verify Vercel deploy thành công
- [ ] Test endpoint: `https://thebenchmarktrader.com/api/health/mongodb`
- [ ] Setup UptimeRobot monitor
- [ ] Test UptimeRobot ping một lần
- [ ] Kiểm tra MongoDB Atlas dashboard (có connection)

---

**Status:** ✅ Code ready, chờ deploy  
**Priority:** ⚠️ HIGH (còn 6 ngày đến deadline pause)  
**Next action:** Push code lên GitHub ngay

---

💡 **Tips:** Sau khi setup xong, hãy test manual endpoint một lần để confirm MongoDB connection OK trước khi rely vào UptimeRobot!
