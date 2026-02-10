# 🚀 MongoDB Keep-Alive - Quick Start

## ⚡ Giải pháp nhanh trong 5 phút

### Vấn đề
MongoDB Atlas sẽ pause Cluster0 của bạn sau 30 ngày không hoạt động (deadline: **16/02/2026**).

---

## ✅ 3 Bước Setup (Khuyến nghị: UptimeRobot - FREE)

### **Bước 1: Deploy code mới** (2 phút)

Code đã sẵn sàng! Chỉ cần deploy lên Vercel:

```bash
git add .
git commit -m "Add MongoDB keep-alive endpoints"
git push
```

Vercel sẽ tự động deploy.

---

### **Bước 2: Verify endpoint hoạt động** (1 phút)

Sau khi deploy xong, test endpoint:

**Từ browser:**
```
https://thebenchmarktrader.com/api/health/mongodb
```

**Hoặc từ terminal:**
```bash
curl https://thebenchmarktrader.com/api/health/mongodb
```

**Kết quả mong đợi:**
```json
{
  "status": "healthy",
  "message": "MongoDB connection is active",
  "database": "leopardsmart",
  "note": "Activity timer has been reset. Cluster will remain active."
}
```

✅ **Nếu thấy response này → MongoDB đã được kích hoạt!**

---

### **Bước 3: Setup UptimeRobot để tự động ping** (2 phút)

1. **Đăng ký FREE:** https://uptimerobot.com/signUp

2. **Add New Monitor:**
   - Click **"+ Add New Monitor"**
   - **Monitor Type:** HTTP(s)
   - **Friendly Name:** MongoDB Keep-Alive
   - **URL:** `https://thebenchmarktrader.com/api/health/mongodb`
   - **Monitoring Interval:** 7 days (hoặc ngắn hơn nếu muốn)
   - Click **"Create Monitor"**

3. **Done!** UptimeRobot sẽ tự động ping endpoint mỗi tuần.

---

## 🎉 Hoàn tất!

### ✅ Những gì đã có:

1. **API Health Endpoint:** `/api/health/mongodb`
   - Kiểm tra MongoDB status
   - Reset activity timer mỗi khi được gọi

2. **Cron Endpoint:** `/api/cron/keep-mongodb-alive`
   - Dùng cho Vercel Cron (nếu có Pro plan)
   - Configured trong `vercel.json`

3. **UptimeRobot Monitor:**
   - Tự động ping mỗi tuần
   - Email alert nếu MongoDB down
   - Hoàn toàn MIỄN PHÍ

### 📊 Theo dõi:

**MongoDB Atlas:**
- Vào: https://cloud.mongodb.com
- Check **Cluster0 → Metrics → Connections**
- Sẽ thấy connection activity mỗi tuần

**UptimeRobot Dashboard:**
- Xem uptime percentage
- Xem lần ping cuối cùng
- Nhận email nếu có vấn đề

---

## 🔥 Bonus: Test ngay lập tức

**Test manual từ terminal:**
```bash
# Windows PowerShell
Invoke-WebRequest https://thebenchmarktrader.com/api/health/mongodb

# hoặc dùng curl
curl https://thebenchmarktrader.com/api/health/mongodb
```

Mỗi lần chạy = 1 lần reset activity timer!

---

## ❓ FAQ

**Q: Có cần chỉnh gì trong code không?**  
A: Không! Code đã sẵn sàng. Chỉ cần deploy.

**Q: UptimeRobot có thực sự miễn phí không?**  
A: Có! Free plan cho phép 50 monitors, ping interval tối thiểu 5 phút.

**Q: Tôi phải trả tiền Vercel Cron không?**  
A: Vercel Cron cần Pro plan ($20/month). Nhưng UptimeRobot FREE là đủ!

**Q: Bao lâu thì nên ping một lần?**  
A: MongoDB pause sau 30 ngày. An toàn nhất là ping **mỗi tuần** (7 ngày).

**Q: Nếu quên setup, cluster bị pause thì sao?**  
A: Không sao! Vào MongoDB Atlas, click "Resume", cluster sẽ hoạt động lại. Dữ liệu không mất.

---

## 📖 Tài liệu đầy đủ

Xem chi tiết tại: [`docs/MONGODB_KEEP_ALIVE.md`](./docs/MONGODB_KEEP_ALIVE.md)

---

**Created:** 2026-02-10  
**Status:** ✅ Ready to use
