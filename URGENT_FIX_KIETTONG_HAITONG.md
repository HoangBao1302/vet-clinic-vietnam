# 🚨 URGENT: Fix Orders for Kiettong & Haitong

**Date**: October 29, 2025  
**Issue**: Orders created BEFORE code deployment still have wrong data  
**Impact**: 2 customers (kiettong, haitong)

---

## 🔴 **VẤN ĐỀ:**

### Order 96K95691P40465515 (kiettong):
- ❌ Email hiển thị: "EA ThebenchmarkTrader Full Version" + 79.000đ
- ❌ Order code không download được: "Order is for a different product"
- ❓ Customer thực tế mua: "EA Pro + Source Code" (14.9M VND)

### Order của haitong:
- ❌ Không nhận được email
- ❌ Số tiền sai
- ❌ Code không download được

---

## 🔍 **NGUYÊN NHÂN:**

1. **Orders được tạo TRƯỚC khi deploy code mới**
2. **Webhook đã chạy với code CŨ** → Lưu wrong data vào DB
3. **Code mới chỉ áp dụng cho orders MỚI** (sau deploy)
4. **Orders cũ vẫn có wrong productId/amount trong DB**

---

## ✅ **GIẢI PHÁP NGAY:**

### Bước 1: Kiểm Tra PayPal Dashboard

**Đăng nhập**: https://www.sandbox.paypal.com (hoặc live)

**Tìm orders**:
- Order ID: `96K95691P40465515` (kiettong)
- Customer email: kiettong@ hoặc haitong@

**Cần xác nhận**:
1. Actual amount paid (USD)
2. Product description
3. Customer email

---

### Bước 2: Fix Database

**Option A - Nếu biết chính xác order details**:

```javascript
// Kết nối MongoDB và update
const mongoose = require('mongoose');
await mongoose.connect(MONGODB_URI);

const Order = mongoose.model('Order', orderSchema);

// Fix kiettong's order (example - adjust based on actual data)
await Order.updateOne(
  { orderId: '96K95691P40465515' },
  {
    $set: {
      productId: 'ea-pro-source-mt4',  // If customer bought EA Pro + Source Code
      productName: 'EA ThebenchmarkTrader Pro + Source Code (MT4)',
      amount: 1490000000  // 14.9M VND in cents
    }
  }
);

// Fix haitong's order - need order ID first
```

**Option B - Automatic script**:

```bash
# Set MongoDB URI
export MONGODB_URI="your-mongodb-uri"

# Run fix script
node fix-specific-orders-now.js
```

---

### Bước 3: Resend Emails

**Sau khi fix database, resend email**:

```javascript
const { sendEmail } = require('./lib/email');

// For kiettong
await sendEmail({
  to: 'kiettong@email.com',  // Replace with actual email
  subject: '✅ Cập nhật đơn hàng - EA ThebenchmarkTrader',
  html: `... use KIETTONG_CORRECTED_EMAIL_TEMPLATE.html ...`
});

// For haitong
await sendEmail({
  to: 'haitong@email.com',  // Replace with actual email
  subject: '✅ Đơn hàng EA ThebenchmarkTrader',
  html: `... email template ...`
});
```

---

## 🔧 **QUICK FIX VỚI VERCEL CLI:**

### Check Webhook Logs:

```bash
# View recent webhook calls
vercel logs --follow | grep "PayPal"

# Or filter by order ID
vercel logs | grep "96K95691P40465515"
```

**Look for**:
- Amount paid
- ProductId detected
- Any errors

---

## 📊 **XÁC ĐỊNH ĐÚNG SẢN PHẨM:**

Từ screenshot, order `96K95691P40465515`:
- Email show: "EA Full Version" (7.9M) ❌
- User expect: "EA Pro + Source Code" (14.9M) ✅
- Error message: "Order is for a different product"

**→ Database có wrong productId!**

### Nếu User MUA EA Full Version (7.9M):
```javascript
{
  productId: 'ea-full-mt4',
  productName: 'EA ThebenchmarkTrader Full Version (MT4)',
  amount: 790000000  // 7.9M VND in cents
}
```

### Nếu User MUA EA Pro + Source Code (14.9M):
```javascript
{
  productId: 'ea-pro-source-mt4',
  productName: 'EA ThebenchmarkTrader Pro + Source Code (MT4)',
  amount: 1490000000  // 14.9M VND in cents
}
```

---

## 🎯 **ACTION ITEMS:**

### Immediate (NOW):
- [ ] Check PayPal dashboard cho 2 orders
- [ ] Xác định actual product & amount
- [ ] Update database với correct data
- [ ] Resend emails cho cả 2 customers

### Verify:
- [ ] Order code works
- [ ] Download successful
- [ ] Email shows correct info
- [ ] Customers confirm receipt

---

## 💡 **TẠI SAO CODE MỚI KHÔNG TỰ FIX?**

**Code mới chỉ chạy khi**:
- New webhook được trigger
- New orders được tạo

**Code mới KHÔNG chạy cho**:
- Orders đã tồn tại trong DB
- Webhooks đã process trước đó

**→ Cần MANUAL FIX cho orders cũ!**

---

## 📝 **TEMPLATE EMAIL FIX:**

```html
Subject: ✅ Cập nhật đơn hàng EA ThebenchmarkTrader

Xin chào [Customer Name],

Cảm ơn bạn đã mua hàng! Chúng tôi đã cập nhật thông tin đơn hàng của bạn:

**Thông tin đúng:**
- Mã đơn hàng: 96K95691P40465515
- Sản phẩm: EA ThebenchmarkTrader Pro + Source Code (MT4)
- Số tiền: 14.900.000₫ (≈ $620.83 USD)

**Download ngay:**
Truy cập: https://thebenchmarktrader.com/downloads
Nhập mã: 96K95691P40465515

Xin lỗi vì sự bất tiện!

Support:
📧 support@thebenchmarktrader.com
📱 +84 765 452 515
```

---

## 🔍 **DEBUG COMMANDS:**

```bash
# Connect to MongoDB
mongosh "your-mongodb-uri"

# Find orders
db.orders.find({ 
  $or: [
    { customerName: /kiettong/i },
    { customerName: /haitong/i },
    { orderId: "96K95691P40465515" }
  ]
}).pretty()

# Check what's in DB
db.orders.find({ orderId: "96K95691P40465515" })

# Update if needed
db.orders.updateOne(
  { orderId: "96K95691P40465515" },
  { $set: { 
    productId: "ea-pro-source-mt4",
    productName: "EA ThebenchmarkTrader Pro + Source Code (MT4)",
    amount: 1490000000
  }}
)
```

---

## ⚠️ **IMPORTANT:**

1. **Code mới ĐÃ DEPLOY** → Future orders sẽ OK ✅
2. **Code cũ đã process** → Past orders cần manual fix ❌
3. **Cần xác định chính xác** → Check PayPal dashboard
4. **Fix database FIRST** → Then resend emails

---

**Status**: 🔴 **URGENT - NEEDS IMMEDIATE ACTION**  
**Priority**: **HIGH**  
**ETA**: 10-15 minutes once data confirmed

---

## 📞 **NEXT:**

1. **Cung cấp cho tôi**:
   - Actual PayPal amount (USD) for both orders
   - Customer emails (kiettong & haitong)
   - Confirm which product they bought

2. **Hoặc share**:
   - Screenshot PayPal order details
   - MongoDB order documents
   - Vercel webhook logs

→ Tôi sẽ fix ngay lập tức!

