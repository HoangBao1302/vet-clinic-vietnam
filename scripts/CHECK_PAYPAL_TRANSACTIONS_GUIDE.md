# 💳 Hướng Dẫn Check PayPal Transactions Chi Tiết

## 🎯 Mục Đích

Kiểm tra xem có bao nhiêu orders PayPal thành công với affiliate link của bạn.

---

## 🔍 Method 1: PayPal Business Dashboard

### **Bước 1: Login PayPal**

1. Truy cập: https://www.paypal.com/
2. Login với PayPal Business account
3. Click **"Activity"** ở top menu

---

### **Bước 2: Filter Transactions**

1. **Date Range:**
   - Click calendar icon
   - Select: Last 30 days (hoặc custom range)
   - Ví dụ: 2025-01-01 đến 2025-01-31

2. **Status Filter:**
   - Click "All" dropdown
   - Select: **"Completed"** only
   - Loại bỏ: Pending, Refunded, etc.

3. **Type Filter:**
   - Select: **"All sales"** hoặc **"Express Checkout"**

---

### **Bước 3: Identify Affiliate Orders**

Với mỗi transaction, click vào để xem chi tiết:

**Thông tin cần check:**

1. **Amount:**
   - $329.17 USD = 7,900,000đ (EA Full)
   - $583.33 USD = 14,000,000đ (EA Pro)
   - Check amount có khớp với products không

2. **Date & Time:**
   - Note lại date chính xác
   - Timezone: UTC hoặc Vietnam time

3. **Customer Email:**
   - Lưu lại email address

4. **Reference/Custom Field:**
   - Expand "Transaction details"
   - Look for "Custom" hoặc "Reference ID"
   - Should be: `ea-full|AFF-HOANGKIM-XXXXX`
   
   **Nếu KHÔNG có Custom field:**
   - ⚠️ Khó track về affiliate
   - Phải dùng timestamp + email để match

5. **Transaction ID:**
   - Example: `8VS12345ABC123`
   - This is the `orderId` you need

---

### **Bước 4: Record Information**

Tạo bảng như này:

| # | Date | Transaction ID | Amount (USD) | Amount (VND) | Customer Email | Custom ID | Has Affiliate? |
|---|------|----------------|--------------|--------------|----------------|-----------|----------------|
| 1 | 2025-01-15 14:30 | 8VS12345ABC | $329.17 | 7,900,000đ | customer1@gmail.com | ea-full\|AFF-HOANGKIM-ABC123 | ✅ Yes |
| 2 | 2025-01-16 09:15 | 9WX67890DEF | $329.17 | 7,900,000đ | customer2@yahoo.com | ea-full\|AFF-HOANGKIM-ABC123 | ✅ Yes |
| 3 | 2025-01-17 16:45 | 1AB23456GHI | $329.17 | 7,900,000đ | customer3@hotmail.com | ea-full\|AFF-HOANGKIM-ABC123 | ✅ Yes |

---

### **Bước 5: Count Affiliate Orders**

**Questions to answer:**

1. ✅ Có bao nhiêu transactions **COMPLETED**?
2. ✅ Có bao nhiêu transactions có **affiliate code trong Custom ID**?
3. ✅ Total amount là bao nhiêu?
4. ✅ Tất cả đều từ same affiliate code?

---

## 🌐 Method 2: Check Vercel Webhook Logs

### **Bước 1: Vào Vercel Logs**

1. Login Vercel Dashboard: https://vercel.com/
2. Select project: **thebenchmarktrader**
3. Click tab **"Logs"**

---

### **Bước 2: Filter Logs**

1. **Time Range:**
   - Select: Last 24 hours / 7 days / Custom
   
2. **Search:**
   ```
   PayPal webhook received
   ```
   
3. **Or search:**
   ```
   PayPal order approved
   ```

---

### **Bước 3: Analyze Logs**

Mỗi webhook log sẽ hiển thị:

```json
{
  "event_type": "CHECKOUT.ORDER.APPROVED",
  "resource": {
    "id": "PAYPAL-ORDER-ID-123456",
    "purchase_units": [{
      "custom_id": "ea-full|AFF-HOANGKIM-ABC123",
      "amount": { "value": "329.17" }
    }],
    "payer": {
      "email_address": "customer@example.com",
      "name": { "given_name": "Nguyen", "surname": "Van A" }
    }
  }
}
```

**Count:**
- Số lần xuất hiện của log này = số orders
- Check `custom_id` có affiliate code không
- Note lại `orderId`, `amount`, `email`

---

### **Bước 4: Compare với Database**

Check xem webhook đã process chưa:

```
✅ PayPal Affiliate conversion tracked:
   - affiliateCode: AFF-HOANGKIM-ABC123
   - orderId: PAYPAL-123456
   - commission: 2,370,000
```

**Nếu KHÔNG thấy log này:**
- ⚠️ Webhook received nhưng không track affiliate
- → Cần migration!

---

## 📧 Method 3: Check Email Receipts

### **Option A: Check Customer Emails (Nếu Có Access)**

1. Search inbox for:
   - From: `service@paypal.com`
   - Subject: "You've got money"
   - Date range: Last 30 days

2. Count emails = số orders

---

### **Option B: Check Sent Confirmation Emails**

1. Check sent emails from your app:
   - To customers
   - Subject: "✅ Thanh toán thành công"

2. Count emails = số orders processed

---

### **Option C: Ask Customers (If Known)**

Nếu biết customers:
- Email/message hỏi: "Bạn có thanh toán qua link affiliate của mình không?"
- Confirm transaction ID

---

## 📊 Method 4: MongoDB Compass (If Have Access)

### **Bước 1: Download MongoDB Compass**

- https://www.mongodb.com/products/compass
- Install

---

### **Bước 2: Connect**

1. Get connection string từ Vercel (follow guide A)
2. Paste vào Compass
3. Click "Connect"

---

### **Bước 3: Query Orders**

1. Database: `thebenchmarktrader`
2. Collection: `orders`
3. Filter:
   ```json
   { "paymentMethod": "paypal" }
   ```

4. Sort by: `createdAt: -1` (newest first)

---

### **Bước 4: Check AffiliateClicks**

1. Collection: `affiliateclicks`
2. Filter:
   ```json
   { 
     "affiliateCode": "AFF-HOANGKIM-ABC123",
     "status": "converted"
   }
   ```

3. Count results = số conversions tracked

---

## ✅ Expected Findings

### **Scenario 1: Chỉ 1 Order**

```
PayPal Transactions: 1 completed
Webhook Logs: 1 event
Affiliate Conversions: 1
Commission: 2,370,000đ

→ Dashboard ĐÚNG ✅
→ Không cần migration
```

---

### **Scenario 2: 3 Orders Nhưng Chỉ 1 Tracked**

```
PayPal Transactions: 3 completed ✅
Webhook Logs: 3 events (hoặc không có tracking log)
Affiliate Conversions: 1 ❌
Commission: 2,370,000đ (should be 7,110,000đ)

→ CẦN MIGRATION! 🔄
→ 2 orders chưa được tracked
```

---

### **Scenario 3: 3 Clicks Nhưng 1 Order**

```
Clicks: 3 (3 người xem)
Orders: 1 (1 người mua)
Tracked correctly: Yes ✅

→ Dashboard ĐÚNG ✅
→ 2 clicks khác chưa convert (chưa mua)
```

---

## 🎯 Decision Matrix

| PayPal Orders | Tracked Conversions | Dashboard Shows | Action |
|---------------|---------------------|-----------------|--------|
| 1 | 1 | 2,370,000đ | ✅ Correct - No action |
| 3 | 1 | 2,370,000đ | 🔄 Need migration |
| 3 | 3 | 7,110,000đ | ✅ Correct - All good |
| 0 | 1 | 2,370,000đ | ⚠️ Data inconsistency |

---

## 📝 Checklist

Check off as you verify:

- [ ] Logged into PayPal Business Dashboard
- [ ] Filtered transactions (Completed only)
- [ ] Checked last 30 days
- [ ] Counted affiliate orders with custom_id
- [ ] Recorded all transaction IDs
- [ ] Checked Vercel webhook logs
- [ ] Verified affiliate tracking logs
- [ ] Compared with dashboard numbers
- [ ] Determined: Need migration? Yes/No

---

## 🚨 Red Flags

Watch out for:

❌ **Missing Custom ID:**
- Orders không có `custom_id`
- Cannot determine affiliate
- Need to match by timestamp + email

❌ **Wrong Affiliate Code:**
- Custom ID có affiliate code khác
- Not your commissions

❌ **Refunded Orders:**
- Transaction completed → later refunded
- Commission should be reversed

❌ **Test Orders:**
- Sandbox transactions
- Should not count

---

## 💡 Tips

1. **Export Data:**
   - PayPal: Export as CSV
   - Easier to analyze in Excel

2. **Timezone:**
   - PayPal may show PST/UTC
   - Vietnam is UTC+7
   - Convert timestamps correctly

3. **Currency:**
   - PayPal shows USD
   - Multiply by ~24,000 for VND
   - Then multiply by 100 for cents

4. **Commission Calculation:**
   ```
   7,900,000đ × 30% = 2,370,000đ (free member)
   7,900,000đ × 35% = 2,765,000đ (paid member)
   ```

---

## 🎯 Next Step

After checking:

**If found 1 order:**
- ✅ Dashboard correct
- No action needed
- Wait for more conversions

**If found 3 orders:**
- 🔄 Go to Part B: Create JSON file
- Migrate missing 2 orders
- Commission will update to 7,110,000đ

---

## 📞 Need Help?

Common issues:

**Can't access PayPal Dashboard:**
- Ask account owner for transaction export
- Or use Vercel logs method

**Can't find Custom ID:**
- Check "Transaction details" section
- May be labeled as "Reference ID"
- Or ask developer who integrated PayPal

**Unsure about timezone:**
- Use Vercel logs (shows exact UTC time)
- Match with PayPal transaction time

---

## ✅ Confirmation Questions

Before proceeding to Part B:

1. ❓ Có bao nhiêu PayPal orders COMPLETED? _____
2. ❓ Có bao nhiêu có affiliate code? _____
3. ❓ Total amount? _____
4. ❓ Cần migrate? Yes / No
5. ❓ Nếu Yes, có bao nhiêu orders cần migrate? _____

Fill these in, then proceed to Part B! 🚀

