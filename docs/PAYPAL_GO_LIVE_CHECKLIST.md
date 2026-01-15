# ✅ PayPal Go Live Checklist

## 🎯 Mục Tiêu
Chuyển PayPal từ Sandbox (Test) sang Live (Production) để nhận thanh toán thật.

---

## 📋 Pre-Launch (Trước Khi Go Live)

### 1. Tài Khoản PayPal
- [ ] Có tài khoản PayPal Business
- [ ] Đã verify email
- [ ] Đã liên kết ngân hàng/thẻ
- [ ] Đã hoàn tất KYC (xác minh danh tính)
- [ ] Tài khoản không bị giới hạn

### 2. PayPal Developer Dashboard
- [ ] Đăng nhập https://developer.paypal.com/
- [ ] Chuyển sang tab **"Live"** (không phải Sandbox)
- [ ] Tạo app mới: "ThebenchmarkTrader Production"
- [ ] Lấy **Live Client ID** (bắt đầu bằng `A`)
- [ ] Lấy **Live Secret** (bắt đầu bằng `E`)
- [ ] Bật tính năng: Accept payments, Checkout, Transaction Search

### 3. Webhook Configuration
- [ ] Tạo webhook endpoint: `https://thebenchmarktrader.com/api/webhooks/paypal`
- [ ] Chọn events:
  - [ ] `CHECKOUT.ORDER.APPROVED`
  - [ ] `PAYMENT.CAPTURE.COMPLETED`
  - [ ] `PAYMENT.CAPTURE.DENIED`
  - [ ] `PAYMENT.CAPTURE.REFUNDED`
- [ ] Lưu Webhook ID

### 4. Environment Variables (Vercel)
- [ ] Login Vercel: https://vercel.com/
- [ ] Vào Settings → Environment Variables
- [ ] Cập nhật:
  - [ ] `PAYPAL_MODE=live`
  - [ ] `PAYPAL_CLIENT_ID=AXXXXXXXXXXXXXx` (Live)
  - [ ] `PAYPAL_CLIENT_SECRET=EXXXXXXXXXXXXXx` (Live)
  - [ ] `NEXT_PUBLIC_SITE_URL=https://thebenchmarktrader.com`
- [ ] Click Save
- [ ] Redeploy project

### 5. Code Updates
- [ ] Mở `config/paymentMethods.ts`
- [ ] Xóa text "(Sandbox)" trong label PayPal
- [ ] Mở `app/downloads/page.tsx`
- [ ] Xóa `<span className="text-orange-600 ml-1">(Sandbox)</span>`
- [ ] Mở `app/checkout/page.tsx`
- [ ] Xóa tất cả text "(Sandbox)"
- [ ] Commit và push lên GitHub

### 6. Backup
- [ ] Backup database MongoDB
- [ ] Backup code (Git commit)
- [ ] Backup environment variables (note riêng)

---

## 🧪 Testing (Sau Khi Deploy)

### 7. Test Giao Dịch Thật
- [ ] Chọn sản phẩm giá thấp nhất để test
- [ ] Click "Mua qua PayPal"
- [ ] Thanh toán bằng tài khoản PayPal thật
- [ ] Kiểm tra redirect đến PayPal checkout
- [ ] Hoàn tất thanh toán
- [ ] Kiểm tra redirect về success page
- [ ] Kiểm tra nhận email xác nhận

### 8. Verify Database
- [ ] Login MongoDB
- [ ] Kiểm tra order mới được tạo
- [ ] Verify thông tin order đúng:
  - [ ] Product ID
  - [ ] Amount
  - [ ] Customer email
  - [ ] Payment status: "completed"

### 9. Verify PayPal Dashboard
- [ ] Login https://www.paypal.com/
- [ ] Vào "Activity"
- [ ] Kiểm tra giao dịch hiển thị
- [ ] Xem chi tiết giao dịch
- [ ] Verify số tiền đúng

### 10. Verify Webhook
- [ ] Vào PayPal Developer Dashboard
- [ ] Chọn app "ThebenchmarkTrader Production"
- [ ] Vào "Webhooks"
- [ ] Xem "Recent Deliveries"
- [ ] Verify webhook status: 200 OK

---

## 📊 Post-Launch (Sau Khi Go Live)

### 11. Monitoring (24h đầu)
- [ ] Kiểm tra Vercel logs mỗi 2-4 giờ
- [ ] Kiểm tra PayPal dashboard mỗi 4 giờ
- [ ] Test 1-2 giao dịch nhỏ
- [ ] Kiểm tra không có error logs
- [ ] Verify tất cả webhook đều success

### 12. Weekly Monitoring
- [ ] Kiểm tra PayPal dashboard mỗi ngày
- [ ] Review logs 1 lần/tuần
- [ ] Test 1 giao dịch/tuần
- [ ] Kiểm tra không có dispute/refund bất thường

### 13. Security
- [ ] Live credentials không commit vào Git
- [ ] Environment variables chỉ ở Vercel
- [ ] HTTPS enabled cho webhook URL
- [ ] Webhook signature verification enabled
- [ ] Rate limiting enabled

---

## 🚨 Rollback Plan (Nếu Có Vấn Đề)

### Nếu Live Mode Gặp Lỗi:
1. [ ] Vào Vercel Environment Variables
2. [ ] Đổi `PAYPAL_MODE=sandbox`
3. [ ] Đổi lại Sandbox Client ID
4. [ ] Đổi lại Sandbox Secret
5. [ ] Redeploy
6. [ ] Thêm lại text "(Sandbox)" vào UI
7. [ ] Commit và push

---

## 📝 Notes

### Sandbox vs Live

| Item | Sandbox | Live |
|------|---------|------|
| API URL | `api-m.sandbox.paypal.com` | `api-m.paypal.com` |
| Thanh toán | Giả lập | Thật |
| Dashboard | developer.paypal.com | paypal.com |
| Credentials | Test credentials | Live credentials |

### Phí PayPal (VN)

- Nhận tiền trong nước: **3.9% + 10,000 VNĐ**
- Nhận tiền quốc tế: **4.4% + phí cố định**
- Rút tiền về ngân hàng: **Miễn phí** (1-3 ngày)

### Ví Dụ Tính Phí

Sản phẩm: 7,900,000 VNĐ
```
Phí = (7,900,000 × 3.9%) + 10,000 = 318,100 VNĐ
Bạn nhận = 7,900,000 - 318,100 = 7,581,900 VNĐ
```

---

## 📞 Support

- **PayPal Hotline VN**: 1800 588 857
- **Email**: https://www.paypal.com/vn/smarthelp/contact-us
- **Developer Docs**: https://developer.paypal.com/docs/

---

## 🎉 Hoàn Tất!

Khi tất cả checkbox được tick ✅, bạn đã sẵn sàng nhận thanh toán thật qua PayPal!

**Thời gian ước tính**: 2-4 giờ (không tính verify tài khoản)

**Lưu ý**: Nên làm vào giờ ít traffic để dễ monitor.
