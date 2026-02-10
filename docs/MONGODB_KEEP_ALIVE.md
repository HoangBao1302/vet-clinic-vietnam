# 🔄 MongoDB Keep-Alive Guide

## 📋 Vấn đề

MongoDB Atlas M0 free tier sẽ **tự động pause cluster** sau **30 ngày không hoạt động**.

**Email cảnh báo từ MongoDB:**
> Your M0 free tier cluster, Cluster0, has been inactive since 2026/01/17. MongoDB Atlas will automatically pause this cluster after 30 days of inactivity.

---

## ✅ Giải pháp đã triển khai

Chúng ta đã tạo **2 API endpoints** để giữ MongoDB luôn active:

### 1. **Health Check Endpoint** (Dùng cho external cron services)

**URL:** `https://thebenchmarktrader.com/api/health/mongodb`

**Features:**
- ✅ Kiểm tra connection status
- ✅ Ping MongoDB để reset activity timer
- ✅ Trả về thông tin database detail
- ✅ Public endpoint - có thể truy cập bất cứ lúc nào

**Response mẫu:**
```json
{
  "status": "healthy",
  "message": "MongoDB connection is active",
  "database": "leopardsmart",
  "host": "cluster0.gqhymaa.mongodb.net",
  "state": "connected",
  "ping": { "ok": 1 },
  "timestamp": "2026-02-10T14:30:00.000Z",
  "responseTime": 234,
  "note": "Activity timer has been reset. Cluster will remain active."
}
```

---

### 2. **Vercel Cron Endpoint** (Dùng cho Vercel Cron Jobs)

**URL:** `https://thebenchmarktrader.com/api/cron/keep-mongodb-alive`

**Features:**
- ✅ Tự động chạy theo lịch (mỗi tuần)
- ✅ Lightweight và optimized
- ✅ Có authorization với CRON_SECRET (optional)

**Cấu hình trong `vercel.json`:**
```json
{
  "crons": [
    {
      "path": "/api/cron/keep-mongodb-alive",
      "schedule": "0 0 * * 1"
    }
  ]
}
```

**Schedule:** Mỗi thứ 2 hàng tuần lúc 00:00 UTC

---

## 🚀 Cách sử dụng

### **Option 1: Sử dụng Vercel Cron (Khuyến nghị - Tự động)**

**Yêu cầu:** Vercel Pro plan hoặc cao hơn ($20/month)

**Bước 1:** Deploy code lên Vercel (đã có cấu hình trong `vercel.json`)

**Bước 2:** (Optional) Thêm `CRON_SECRET` vào Vercel Environment Variables để bảo mật:
```bash
CRON_SECRET=your-random-secret-key-here
```

**Bước 3:** Vercel sẽ tự động chạy cron job theo lịch

**Giám sát:** Xem logs trong Vercel Dashboard → Functions → Cron Jobs

---

### **Option 2: Sử dụng UptimeRobot (Miễn phí - Khuyến nghị)**

**Service:** https://uptimerobot.com (Free plan: 50 monitors)

**Bước 1:** Đăng ký account tại UptimeRobot

**Bước 2:** Tạo HTTP(s) Monitor mới:
- **Monitor Type:** HTTP(s)
- **URL:** `https://thebenchmarktrader.com/api/health/mongodb`
- **Monitoring Interval:** 7 days (hoặc thấp hơn cho free plan)
- **Alert Contacts:** Email của bạn (nhận thông báo nếu endpoint down)

**Bước 3:** Save và monitor sẽ tự động ping endpoint

**Lợi ích:**
- ✅ Hoàn toàn miễn phí
- ✅ Tự động ping theo lịch
- ✅ Nhận email alert nếu MongoDB down
- ✅ Dashboard theo dõi uptime

---

### **Option 3: Sử dụng Cron-job.org (Miễn phí)**

**Service:** https://cron-job.org (Free: unlimited cron jobs)

**Bước 1:** Đăng ký tại cron-job.org

**Bước 2:** Tạo Cronjob mới:
- **Title:** MongoDB Keep-Alive
- **URL:** `https://thebenchmarktrader.com/api/health/mongodb`
- **Schedule:** `0 0 * * 1` (Every Monday at 00:00)
- **Enabled:** Yes

**Bước 3:** Save

**Lợi ích:**
- ✅ Miễn phí
- ✅ Flexible scheduling
- ✅ Email notifications

---

### **Option 4: GitHub Actions (Miễn phí)**

Tạo file `.github/workflows/mongodb-keep-alive.yml`:

```yaml
name: MongoDB Keep-Alive

on:
  schedule:
    # Runs every Monday at 00:00 UTC
    - cron: '0 0 * * 1'
  workflow_dispatch: # Allow manual trigger

jobs:
  ping-mongodb:
    runs-on: ubuntu-latest
    steps:
      - name: Ping MongoDB Health Endpoint
        run: |
          response=$(curl -s -w "\n%{http_code}" https://thebenchmarktrader.com/api/health/mongodb)
          http_code=$(echo "$response" | tail -n 1)
          body=$(echo "$response" | head -n -1)
          
          echo "Response: $body"
          echo "HTTP Code: $http_code"
          
          if [ "$http_code" -ne 200 ]; then
            echo "❌ MongoDB health check failed!"
            exit 1
          fi
          
          echo "✅ MongoDB is healthy!"
```

**Lợi ích:**
- ✅ Hoàn toàn miễn phí
- ✅ Tích hợp với GitHub repo
- ✅ Có thể manual trigger
- ✅ Logs chi tiết trong Actions tab

---

## 🧪 Test ngay

### **Test từ browser:**
Mở URL trong trình duyệt:
```
https://thebenchmarktrader.com/api/health/mongodb
```

### **Test từ terminal:**
```bash
curl https://thebenchmarktrader.com/api/health/mongodb
```

### **Test local (sau khi deploy):**
```bash
curl http://localhost:3000/api/health/mongodb
```

---

## 📊 Monitoring

### **Kiểm tra cluster status:**
1. Truy cập: https://cloud.mongodb.com
2. Vào **Cluster0** → **Metrics**
3. Xem biểu đồ **Connections** để xác nhận có activity

### **Kiểm tra logs trên Vercel:**
1. Vercel Dashboard → Your Project
2. Functions → Logs
3. Filter: `keep-mongodb-alive` hoặc `health/mongodb`

---

## ⏰ Recommended Schedule

MongoDB pause sau **30 ngày không hoạt động**, nên:

- **An toàn nhất:** Ping **mỗi tuần** (4 lần/tháng)
- **Tối thiểu:** Ping **mỗi 2 tuần** (2 lần/tháng)
- **Không khuyến nghị:** > 3 tuần

**Lịch hiện tại:** Mỗi thứ 2 hàng tuần (an toàn)

---

## 🔐 Security Notes

### **Bảo vệ Cron endpoint (Optional):**

Thêm `CRON_SECRET` vào environment variables và gọi endpoint với header:
```bash
curl -H "Authorization: Bearer your-secret-key" \
  https://thebenchmarktrader.com/api/cron/keep-mongodb-alive
```

### **Health endpoint:**
Public endpoint - không cần bảo mật vì chỉ kiểm tra connection status, không trả về sensitive data.

---

## ✅ Checklist

**Ngay lập tức:**
- [ ] Deploy code mới lên Vercel (có 2 endpoints mới)
- [ ] Test endpoint: `https://thebenchmarktrader.com/api/health/mongodb`
- [ ] Xác nhận MongoDB connection thành công

**Setup monitoring (chọn 1 trong các options):**
- [ ] **Option 1:** Upgrade Vercel Pro → Enable Cron Jobs
- [ ] **Option 2:** Setup UptimeRobot monitor (Free - Khuyến nghị)
- [ ] **Option 3:** Setup Cron-job.org
- [ ] **Option 4:** Setup GitHub Actions

**Kiểm tra định kỳ:**
- [ ] Theo dõi MongoDB Atlas dashboard (1 lần/tháng)
- [ ] Kiểm tra connection logs (nếu có alert)

---

## 🆘 Troubleshooting

### **Endpoint trả về error 503:**

**Nguyên nhân:**
- Cluster bị paused
- Network Access không cho phép kết nối
- Connection string sai

**Giải quyết:**
1. Vào MongoDB Atlas → Resume cluster
2. Network Access → Allow 0.0.0.0/0 (all IPs)
3. Kiểm tra MONGODB_URI trong Vercel env vars

### **Cron job không chạy:**

**Vercel Cron:**
- Cần Pro plan
- Kiểm tra Vercel Dashboard → Cron Jobs
- Xem logs để debug

**UptimeRobot/Cron-job.org:**
- Kiểm tra monitor status
- Verify URL chính xác
- Check email notifications

---

## 📞 Support

Nếu gặp vấn đề:
1. Check MongoDB Atlas dashboard
2. Test endpoint manual
3. Review Vercel logs
4. Verify environment variables

---

**Last updated:** 2026-02-10  
**Status:** ✅ Active and monitoring
