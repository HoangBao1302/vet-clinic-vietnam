# 🚀 Hướng Dẫn Chuyển PayPal Từ Sandbox Sang Live (Production)

## 📋 Tổng Quan

Hiện tại hệ thống của bạn đang chạy ở **Sandbox mode** (test mode). Để nhận thanh toán thật, bạn cần chuyển sang **Live mode**.

## ⚠️ Quan Trọng: Đọc Trước Khi Làm

- ✅ Đảm bảo bạn đã test kỹ trên Sandbox
- ✅ Có tài khoản PayPal Business đã verify
- ✅ Backup toàn bộ code và database
- ✅ Test trên staging environment trước khi deploy production

---

## 🎯 Bước 1: Tạo PayPal Business Account (Nếu Chưa Có)

### 1.1. Đăng Ký Tài Khoản

1. Truy cập: https://www.paypal.com/vn/business
2. Click **"Đăng ký miễn phí"**
3. Chọn **"Business Account"**
4. Điền thông tin:
   - Email kinh doanh
   - Mật khẩu
   - Thông tin doanh nghiệp/cá nhân

### 1.2. Verify Tài Khoản

1. Xác thực email
2. Liên kết tài khoản ngân hàng hoặc thẻ
3. Hoàn tất xác minh danh tính (KYC)
   - Cung cấp CMND/CCCD
   - Giấy phép kinh doanh (nếu có)

**Thời gian verify**: 1-3 ngày làm việc

---

## 🔑 Bước 2: Lấy Live API Credentials

### 2.1. Truy Cập PayPal Developer Dashboard

1. Đăng nhập: https://developer.paypal.com/
2. Đăng nhập bằng tài khoản PayPal Business của bạn

### 2.2. Tạo Live App

1. Click **"Dashboard"** → **"My Apps & Credentials"**
2. Chuyển sang tab **"Live"** (quan trọng!)
3. Click **"Create App"**
4. Điền thông tin:
   - **App Name**: `ThebenchmarkTrader Production`
   - **App Type**: `Merchant`
5. Click **"Create App"**

### 2.3. Lấy Live Credentials

Sau khi tạo app, bạn sẽ thấy:

```
Client ID: AXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx
Secret: EXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx
```

**⚠️ Lưu ý**: 
- Live credentials bắt đầu bằng `A` (Client ID) và `E` (Secret)
- Sandbox credentials bắt đầu bằng `A` và `E` nhưng có domain `sandbox.paypal.com`

### 2.4. Cấu Hình App Settings

1. Scroll xuống **"App Settings"**
2. Bật các tính năng:
   - ✅ **Accept payments**
   - ✅ **Checkout**
   - ✅ **Transaction Search**
3. Click **"Save"**

---

## 🔔 Bước 3: Cấu Hình Webhooks (Live)

### 3.1. Tạo Webhook Endpoint

1. Trong PayPal Developer Dashboard
2. Chọn app **"ThebenchmarkTrader Production"**
3. Scroll xuống **"Webhooks"**
4. Click **"Add Webhook"**

### 3.2. Điền Thông Tin Webhook

```
Webhook URL: https://thebenchmarktrader.com/api/webhooks/paypal
```

**Event types** (chọn các event sau):
- ✅ `CHECKOUT.ORDER.APPROVED`
- ✅ `PAYMENT.CAPTURE.COMPLETED`
- ✅ `PAYMENT.CAPTURE.DENIED`
- ✅ `PAYMENT.CAPTURE.REFUNDED`

### 3.3. Lưu Webhook ID

Sau khi tạo, bạn sẽ nhận được **Webhook ID**. Lưu lại để dùng sau.

---

## 🔧 Bước 4: Cập Nhật Environment Variables

### 4.1. Trên Local (Development)

Mở file `.env.local` và cập nhật:

```bash
# PayPal Configuration - LIVE MODE
PAYPAL_MODE=live                    # ← Đổi từ "sandbox" sang "live"
PAYPAL_CLIENT_ID=AXXXXXXXXXXXXXx   # ← Live Client ID (bắt đầu bằng A)
PAYPAL_CLIENT_SECRET=EXXXXXXXXXXx  # ← Live Secret (bắt đầu bằng E)

# Site URL (Production)
NEXT_PUBLIC_SITE_URL=https://thebenchmarktrader.com
```

### 4.2. Trên Vercel (Production)

1. Đăng nhập Vercel: https://vercel.com/
2. Chọn project **"Thebenchmarktrader"**
3. Vào **Settings** → **Environment Variables**
4. Cập nhật các biến sau:

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `PAYPAL_MODE` | `live` | Production |
| `PAYPAL_CLIENT_ID` | `AXXXXXXXXXXXXXx` | Production |
| `PAYPAL_CLIENT_SECRET` | `EXXXXXXXXXXXXXx` | Production |
| `NEXT_PUBLIC_SITE_URL` | `https://thebenchmarktrader.com` | Production |

5. Click **"Save"**
6. **Redeploy** project để áp dụng thay đổi

---

## 🎨 Bước 5: Cập Nhật UI (Xóa Text "Sandbox")

### 5.1. Cập Nhật File Cấu Hình

Mở `config/paymentMethods.ts` và sửa:

```typescript
paypal: {
  enabled: true,
  label: 'Mua qua PayPal',              // ← Xóa "(Sandbox)"
  labelEn: 'Buy with PayPal',           // ← Xóa "(Sandbox)"
  color: 'yellow',
  disabledMessage: 'Tạm thời không khả dụng',
  disabledMessageEn: 'Temporarily unavailable'
}
```

### 5.2. Cập Nhật Trang Downloads

Mở `app/downloads/page.tsx` và tìm dòng:

```typescript
PayPal: ${((item.price || 0) / 24000).toFixed(2)} USD
<span className="text-orange-600 ml-1">(Sandbox)</span>
```

Xóa dòng `<span className="text-orange-600 ml-1">(Sandbox)</span>`

### 5.3. Cập Nhật Trang Checkout

Mở `app/checkout/page.tsx` và tìm:

```typescript
<span className="text-orange-600 ml-1">(Sandbox)</span>
```

Xóa tất cả các dòng này.

---

## ✅ Bước 6: Testing Trên Live Mode

### 6.1. Test Với Số Tiền Nhỏ

1. Chọn sản phẩm có giá thấp nhất
2. Click **"Mua qua PayPal"**
3. Thanh toán bằng tài khoản PayPal thật
4. Kiểm tra:
   - ✅ Redirect đến PayPal checkout
   - ✅ Thanh toán thành công
   - ✅ Redirect về success page
   - ✅ Nhận email xác nhận
   - ✅ Order được lưu vào database

### 6.2. Kiểm Tra PayPal Dashboard

1. Đăng nhập PayPal Business: https://www.paypal.com/
2. Vào **"Activity"**
3. Kiểm tra giao dịch có hiển thị không
4. Xem chi tiết giao dịch

### 6.3. Kiểm Tra Webhook

1. Vào PayPal Developer Dashboard
2. Chọn app **"ThebenchmarkTrader Production"**
3. Vào **"Webhooks"**
4. Xem **"Recent Deliveries"**
5. Kiểm tra webhook có được gửi thành công không

---

## 🔍 Bước 7: Monitoring & Troubleshooting

### 7.1. Kiểm Tra Logs

**Trên Vercel:**
1. Vào project **"Thebenchmarktrader"**
2. Click **"Logs"**
3. Xem real-time logs khi có giao dịch

**Tìm kiếm:**
- `PayPal order created`
- `PayPal webhook received`
- `Order saved to MongoDB`

### 7.2. Common Issues

#### Issue 1: "Invalid credentials"

**Nguyên nhân**: Dùng nhầm Sandbox credentials cho Live mode

**Giải pháp**:
- Kiểm tra `PAYPAL_MODE=live`
- Kiểm tra Client ID bắt đầu bằng `A` (Live)
- Kiểm tra Secret bắt đầu bằng `E` (Live)

#### Issue 2: "Webhook not received"

**Nguyên nhân**: Webhook URL chưa đúng hoặc chưa verify

**Giải pháp**:
- Kiểm tra URL: `https://thebenchmarktrader.com/api/webhooks/paypal`
- Kiểm tra SSL certificate của domain
- Test webhook bằng PayPal Webhook Simulator

#### Issue 3: "Payment declined"

**Nguyên nhân**: Tài khoản PayPal chưa verify hoặc hạn mức

**Giải pháp**:
- Verify tài khoản PayPal
- Liên kết thẻ/ngân hàng
- Kiểm tra hạn mức giao dịch

---

## 📊 Bước 8: So Sánh Sandbox vs Live

| Feature | Sandbox (Test) | Live (Production) |
|---------|----------------|-------------------|
| **API URL** | `api-m.sandbox.paypal.com` | `api-m.paypal.com` |
| **Client ID** | Bắt đầu bằng `A` | Bắt đầu bằng `A` |
| **Secret** | Bắt đầu bằng `E` | Bắt đầu bằng `E` |
| **Thanh toán** | Giả lập, không mất tiền | Thật, mất tiền thật |
| **Webhook** | Test webhook | Production webhook |
| **Dashboard** | developer.paypal.com | paypal.com |

---

## 🔐 Bước 9: Security Checklist

- [ ] Live credentials được lưu trong environment variables (không commit vào Git)
- [ ] Webhook URL sử dụng HTTPS
- [ ] Verify webhook signature (đã implement trong code)
- [ ] Rate limiting cho API endpoints
- [ ] Logging tất cả giao dịch
- [ ] Backup database định kỳ

---

## 💰 Bước 10: Phí Giao Dịch PayPal

### Phí Chuẩn (Việt Nam)

- **Nhận tiền trong nước**: 3.9% + 10,000 VNĐ
- **Nhận tiền quốc tế**: 4.4% + phí cố định
- **Rút tiền về ngân hàng**: Miễn phí (1-3 ngày)

### Ví Dụ Tính Phí

Sản phẩm giá: **7,900,000 VNĐ**

```
Phí PayPal = (7,900,000 × 3.9%) + 10,000
           = 308,100 + 10,000
           = 318,100 VNĐ

Bạn nhận được = 7,900,000 - 318,100 = 7,581,900 VNĐ
```

---

## 📝 Checklist: Trước Khi Go Live

### Pre-Launch Checklist

- [ ] Tài khoản PayPal Business đã verify
- [ ] Đã lấy Live API credentials
- [ ] Đã cấu hình webhook cho Live mode
- [ ] Đã cập nhật environment variables trên Vercel
- [ ] Đã xóa text "(Sandbox)" khỏi UI
- [ ] Đã test thanh toán với số tiền nhỏ
- [ ] Đã kiểm tra webhook hoạt động
- [ ] Đã kiểm tra order được lưu vào database
- [ ] Đã kiểm tra email confirmation được gửi
- [ ] Đã backup database

### Post-Launch Checklist

- [ ] Monitor logs trong 24h đầu
- [ ] Kiểm tra PayPal dashboard mỗi ngày
- [ ] Test 1-2 giao dịch thật mỗi tuần
- [ ] Kiểm tra webhook deliveries
- [ ] Theo dõi refund/dispute (nếu có)

---

## 🚨 Rollback Plan (Nếu Có Vấn Đề)

Nếu Live mode gặp vấn đề, rollback về Sandbox:

1. Trên Vercel, đổi `PAYPAL_MODE=sandbox`
2. Đổi lại Sandbox credentials
3. Redeploy
4. Thêm lại text "(Sandbox)" vào UI

---

## 📞 Support & Resources

### PayPal Support

- **Hotline VN**: 1800 588 857
- **Email**: https://www.paypal.com/vn/smarthelp/contact-us
- **Developer Forum**: https://www.paypal-community.com/

### Documentation

- **PayPal REST API**: https://developer.paypal.com/docs/api/overview/
- **Webhooks Guide**: https://developer.paypal.com/docs/api-basics/notifications/webhooks/

### Internal Docs

- `docs/PAYMENT_METHODS_GUIDE.md` - Quản lý phương thức thanh toán
- `PAYPAL_TESTING_GUIDE.md` - Testing guide
- `COMPLETE_PAYPAL_FIX_GUIDE.md` - Troubleshooting

---

## 🎉 Tóm Tắt: 10 Bước Go Live

1. ✅ Tạo PayPal Business Account & Verify
2. ✅ Lấy Live API Credentials từ Developer Dashboard
3. ✅ Cấu hình Webhooks cho Live mode
4. ✅ Cập nhật Environment Variables (Vercel)
5. ✅ Xóa text "(Sandbox)" khỏi UI
6. ✅ Test với số tiền nhỏ
7. ✅ Kiểm tra logs & webhook
8. ✅ Monitor trong 24h đầu
9. ✅ Setup backup & security
10. ✅ Sẵn sàng nhận thanh toán thật!

---

**Thời gian ước tính**: 2-4 giờ (không tính thời gian verify tài khoản)

**Độ khó**: Trung bình ⭐⭐⭐

**Lưu ý**: Nên làm vào thời gian ít traffic để dễ monitor và troubleshoot.
