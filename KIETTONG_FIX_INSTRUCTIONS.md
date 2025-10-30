# 🚀 Hướng Dẫn Fix Hoàn Toàn Vấn Đề Kiettong

## 📋 Tóm Tắt Vấn Đề

**Khách hàng**: kiettong  
**Vấn đề**:
1. ❌ Mua EA Pro + Source Code (14.9M VND) nhưng không download được
2. ❌ Email nhận được hiển thị sai sản phẩm "EA Full Version"  
3. ❌ Email hiển thị sai số tiền: 79.000đ

**Nguyên nhân**: 
- PayPal webhook không lấy được productId đúng
- Webhook lưu sai thông tin vào database
- Email template hiển thị amount sai cách

---

## ✅ Các Fix Đã Thực Hiện

### 1. **Cải Thiện PayPal Webhook** (`app/api/webhooks/paypal/route.ts`)

**Thay đổi**:
- ✅ Thêm 3 strategies để detect productId (custom_id → reference_id → amount)
- ✅ Thêm amount validation để auto-correct productId nếu sai
- ✅ Fix email amount display (hiển thị đúng VND)
- ✅ Thêm extensive logging để debug

**Kết quả**: 
- Webhook giờ resilient hơn, tự động phát hiện & correct lỗi
- Email hiển thị đúng thông tin sản phẩm và giá

---

## 🛠️ Các Bước Thực Hiện

### Bước 1: Deploy Code Mới (QUAN TRỌNG)

```bash
# 1. Commit changes
git add app/api/webhooks/paypal/route.ts
git commit -m "fix: improve PayPal webhook with multi-strategy productId detection and amount validation"

# 2. Push to GitHub (Vercel sẽ auto-deploy)
git push origin main

# 3. Đợi Vercel deploy xong (check tại https://vercel.com/dashboard)
```

**Kiểm tra deployment**:
- Vào Vercel Dashboard
- Check deployment status = "Ready"
- Click vào deployment → Function Logs → xem có errors không

---

### Bước 2: Fix Database cho Order Hiện Tại của Kiettong

**File**: `fix-kiettong-order.js`

```bash
# 1. Set MongoDB URI (lấy từ Vercel Environment Variables)
export MONGODB_URI="mongodb+srv://..."

# 2. Run fix script
node fix-kiettong-order.js

# 3. Script sẽ:
#    - Tìm order có vấn đề
#    - Hiển thị thông tin cũ vs mới
#    - Tự động update database
#    - Show customer email info để gửi email
```

**Expected output**:
```
✅ Found 1 order(s) for kiettong:

📦 Order 1:
   Order ID: 5WC92533C1420994X
   Product ID: ea-full-mt4 (WRONG!)
   Product Name: EA ThebenchmarkTrader Full Version (WRONG!)
   Amount: 79.000đ (WRONG!)
   
   🔧 Applying fix...
   ✅ Order fixed successfully!
   
   📋 Updated Order:
     Product ID: ea-pro-source-mt4
     Product Name: EA ThebenchmarkTrader Pro + Source Code (MT4)
     Amount: 14.900.000đ
```

---

### Bước 3: Gửi Email Corrected cho Khách Hàng

**File**: `KIETTONG_CORRECTED_EMAIL_TEMPLATE.html`

**Steps**:
1. Mở file `KIETTONG_CORRECTED_EMAIL_TEMPLATE.html`
2. Replace các placeholders:
   - `[CUSTOMER_NAME]` → tên khách hàng (từ script output)
   - `[ORDER_ID]` → order ID thật (xuất hiện 2 chỗ)
3. Nếu là MT5: replace "MT4" → "MT5", ".ex4" → ".ex5"
4. Send email với:
   - **To**: email của kiettong (từ script output)
   - **Subject**: `✅ Đơn hàng EA ThebenchmarkTrader đã được cập nhật`
   - **Body**: Paste HTML từ template

**Hoặc gửi qua Resend API** (nếu có setup):
```javascript
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'support@thebenchmarktrader.com',
  to: 'customer@email.com', // Thay bằng email thật
  subject: '✅ Đơn hàng EA ThebenchmarkTrader đã được cập nhật',
  html: `... paste template HTML ...`
});
```

---

### Bước 4: Verify Fix Hoạt Động

**Test download flow**:
1. Vào https://thebenchmarktrader.com/downloads
2. Scroll đến sản phẩm "EA Pro + Source Code MT4"
3. Nhập order code (từ email) vào ô "Mã đơn hàng"
4. Click "Xác thực"
5. **Expected**: "✅ Xác thực thành công! Đang tải file..."
6. File download tự động bắt đầu

**Check MongoDB**:
```javascript
// Verify order đã được fix đúng
db.orders.findOne({ orderId: "5WC92533C1420994X" })

// Expected output:
{
  orderId: "5WC92533C1420994X",
  productId: "ea-pro-source-mt4",  // ✅ CORRECT
  productName: "EA ThebenchmarkTrader Pro + Source Code (MT4)",  // ✅ CORRECT
  amount: 1489900000,  // ✅ 14.9M VND in cents
  status: "paid",
  customerEmail: "...",
  paymentMethod: "paypal"
}
```

---

### Bước 5: Follow Up với Khách Hàng

**24h sau khi gửi email**:

```
Subject: Follow-up - Đơn hàng EA ThebenchmarkTrader

Xin chào [Customer Name],

Chúng tôi muốn kiểm tra xem bạn đã download được sản phẩm EA ThebenchmarkTrader Pro + Source Code chưa?

Nếu còn bất kỳ vấn đề gì, vui lòng reply email này hoặc liên hệ:
📱 Telegram: t.me/+0ETUdIuYUzdhZWQ1
📞 Hotline: +84 765 452 515

Xin lỗi một lần nữa vì sự bất tiện!

Best regards,
ThebenchmarkTrader Support Team
```

---

## 🧪 Test Quy Trình Mới

### Test Case 1: PayPal Order Mới (Sandbox)

```bash
# Run test script
node test-paypal-download-flow.js
```

**Test scenarios**:
1. ✅ Normal flow (custom_id có đúng productId)
2. ✅ Fallback to reference_id (custom_id trống)
3. ✅ Fallback to amount detection (cả 2 đều trống)
4. ✅ Auto-correction (custom_id sai nhưng amount đúng)

### Test Case 2: Manual Test trên Production

1. **Tạo PayPal test order**:
   - Vào /downloads
   - Click "Mua với PayPal" cho EA Pro + Source Code
   - Dùng PayPal Sandbox account để thanh toán
   - Complete payment

2. **Check webhook logs** (Vercel):
   - Vào Vercel Dashboard → Functions → paypal webhook
   - Xem logs có message: `🔍 PayPal Webhook ProductID Detection`
   - Verify `finalProductId` = "ea-pro-source-mt4"
   - Verify `amountVND` = "14.900.000đ"

3. **Check email**:
   - Inbox của email test
   - Verify subject: "✅ Thanh toán thành công - Download EA ThebenchmarkTrader"
   - Verify product name: "EA ThebenchmarkTrader Pro + Source Code (MT4)"
   - Verify amount: "14.900.000₫ (≈ $620.83 USD)"

4. **Test download**:
   - Click "Tải xuống ngay" trong email
   - Hoặc vào /downloads và nhập order code
   - Verify download bắt đầu

---

## 📊 Monitoring & Alerts

### Check Webhook Logs Daily

```bash
# Vercel CLI
vercel logs --follow

# Filter PayPal webhook
vercel logs | grep "PayPal"
```

**Look for**:
- ⚠️ Warning messages về productId detection
- ❌ Error messages về price mismatch
- 📋 Success logs với correct productId

### Set Up Alerts (Optional)

**Sentry/LogRocket**:
- Alert khi webhook fails > 3 times trong 1 hour
- Alert khi price mismatch detected
- Alert khi email send fails

---

## 🔮 Future Prevention

### 1. Add Pre-Payment Validation

**File**: `app/api/paypal/create-order/route.ts`

Thêm validation TRƯỚC khi tạo PayPal order:
```typescript
// Validate productId exists
const validProducts = {
  'ea-pro-source-mt4': 14900000,
  'ea-full-mt4': 7900000,
  ...
};

if (!validProducts[productId]) {
  return NextResponse.json({ error: "Invalid product" }, { status: 400 });
}

// Validate amount matches
if (Math.abs(amount - validProducts[productId]) > 10000) {
  return NextResponse.json({ error: "Price mismatch" }, { status: 400 });
}
```

### 2. Add Admin Dashboard

**Features**:
- View all orders
- Filter by payment method, status, product
- Manually edit/fix orders
- Resend emails
- View webhook logs

### 3. Add Customer Portal

**Features**:
- User login to see order history
- Re-download purchased products anytime
- No need order code each time
- Support ticket system

---

## ❓ FAQs

### Q1: Script báo lỗi "MONGODB_URI not found"?

**A**: Set environment variable:
```bash
export MONGODB_URI="mongodb+srv://..."
# Hoặc
MONGODB_URI="..." node fix-kiettong-order.js
```

### Q2: Không tìm thấy order của kiettong?

**A**: Script tìm order theo:
- Email có chứa "kiettong"
- Customer name có "kiet" và "tong"
- Recent PayPal orders với wrong amount

Nếu không tìm được, update script line 30-35 với criteria khác.

### Q3: Email gửi không được?

**A**: Check:
1. RESEND_API_KEY có set chưa?
2. Email domain verified chưa?
3. Resend API có active không?
4. Check Resend dashboard logs

### Q4: Download vẫn báo "Order is for a different product"?

**A**: 
1. Check MongoDB order đã được fix chưa
2. Verify `productId` trong DB match với productId user đang request
3. Check Vercel logs xem có error gì không

### Q5: Làm sao biết fix đã work?

**A**: Checklist:
- [ ] Vercel deployment thành công
- [ ] Script chạy và update được DB
- [ ] Email gửi thành công
- [ ] Customer confirm download được
- [ ] Test order mới không còn lỗi

---

## 📞 Need Help?

**Contact Info**:
- 📧 Email: support@thebenchmarktrader.com
- 📱 Telegram: t.me/+0ETUdIuYUzdhZWQ1
- 📞 Hotline: +84 765 452 515

---

## ✅ Final Checklist

### Immediate Actions (Today):
- [ ] Deploy code fixes to production
- [ ] Run database fix script
- [ ] Send corrected email to kiettong
- [ ] Verify download works

### Follow-up (24-48h):
- [ ] Check customer response
- [ ] Verify no new similar issues
- [ ] Monitor webhook logs
- [ ] Test new orders

### Long-term (This week):
- [ ] Add pre-payment validation
- [ ] Set up monitoring alerts
- [ ] Document process for future
- [ ] Create admin dashboard (optional)

---

**Status**: ✅ Ready to execute  
**Last Updated**: 2025-10-29  
**Reviewed By**: AI Assistant  
**Approved**: Pending deployment

