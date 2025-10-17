# 📄 Tạo PayPal Orders JSON Manually

## 📋 Mục Đích

Tạo file JSON chứa PayPal orders để migrate affiliate commissions khi orders không có trong database (chỉ trong logs).

---

## 🔍 Bước 1: Lấy PayPal Order Data

### **Option A: Từ Vercel Logs**

1. **Vào Vercel Dashboard**
   - https://vercel.com/
   - Chọn project
   - Click tab **"Logs"**

2. **Search PayPal webhook logs**
   - Filter: `PayPal webhook received`
   - Hoặc: `PayPal order approved`
   - Date range: Chọn khoảng thời gian có orders

3. **Copy log data**
   ```
   PayPal webhook received: {
     "event_type": "CHECKOUT.ORDER.APPROVED",
     "resource": {
       "id": "PAYPAL-123456789",
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

---

### **Option B: Từ PayPal Dashboard**

1. **Login PayPal Business Account**
   - https://www.paypal.com/
   - Go to: Activity / Transactions

2. **Tìm transactions**
   - Filter by date
   - Look for completed payments
   - Note: Order ID, Amount, Customer email

3. **Check custom data (nếu có)**
   - Click vào transaction
   - Expand "Transaction details"
   - Look for "Custom field" hoặc "Reference ID"

---

### **Option C: Từ Email Receipts**

1. Check email inbox có PayPal payment notifications
2. Extract:
   - Order ID
   - Amount
   - Customer email
   - Date

---

## 📝 Bước 2: Tạo JSON File

### **2.1. Copy Template**

```bash
cp scripts/paypal-orders-example.json scripts/paypal-orders-real.json
```

### **2.2. Format Chi Tiết**

Mở file `scripts/paypal-orders-real.json`:

```json
{
  "orders": [
    {
      "orderId": "PAYPAL-ORDER-ID",
      "productId": "ea-full",
      "productName": "EA ThebenchmarkTrader Full Version",
      "amount": 790000000,
      "customerEmail": "customer@example.com",
      "customerName": "Nguyen Van A",
      "customerPhone": "+84123456789",
      "customId": "ea-full|AFF-USERNAME-CODE",
      "createdAt": "2025-01-15T10:00:00Z",
      "paidAt": "2025-01-15T10:05:00Z",
      "paymentMethod": "paypal"
    }
  ]
}
```

---

## 📊 Bước 3: Fill Data

### **Field-by-Field Guide:**

#### **1. orderId** (Required)
```json
"orderId": "PAYPAL-8VS12345ABC123"
```
- PayPal Order ID từ logs hoặc dashboard
- Format: Usually starts with number or letter
- Example: `8VS12345ABC123`, `PAYPAL-123456`

#### **2. productId** (Required)
```json
"productId": "ea-full"
```
**Valid values:**
- `ea-full` - EA ThebenchmarkTrader Full Version
- `ea-pro-source` - EA Pro + Source Code
- `indicator-pro` - Multi-Indicator Pro Pack
- `course` - Khóa học Forex Trading
- `social-copy` - Copy Social Trading

#### **3. amount** (Required)
```json
"amount": 790000000
```
**Important: Amount in VND cents!**
- 7,900,000đ = 790000000 (multiply by 100)
- 14,000,000đ = 1400000000
- 3,500,000đ = 350000000

**Conversion từ PayPal USD:**
```
PayPal amount: $329.17 USD
→ VND: $329.17 × 24,000 = 7,900,080đ
→ Cents: 7,900,080 × 100 = 790008000
```

#### **4. customId** (CRITICAL - Required for affiliate tracking)
```json
"customId": "ea-full|AFF-HOANGKIM-ABC123"
```
**Format:** `productId|affiliateCode`

**Nếu KHÔNG có customId:**
- Script sẽ skip order này
- Không thể track commission
- ⚠️ Phải có affiliate code để migration work!

**Cách lấy affiliate code:**
- Check URL khách hàng dùng: `?aff=AFF-HOANGKIM-ABC123`
- Check trong database User collection
- Hỏi affiliate trực tiếp

#### **5. customerEmail** (Optional but recommended)
```json
"customerEmail": "customer@example.com"
```

#### **6. customerName** (Optional)
```json
"customerName": "Nguyen Van A"
```

#### **7. createdAt / paidAt** (Optional)
```json
"createdAt": "2025-01-15T10:00:00Z",
"paidAt": "2025-01-15T10:05:00Z"
```
**Format:** ISO 8601 date string
- Use Vietnam timezone: +7
- Example: `2025-01-15T17:30:00+07:00`
- Or UTC: `2025-01-15T10:30:00Z`

---

## 📋 Bước 4: Example với 3 Orders Thật

```json
{
  "orders": [
    {
      "orderId": "8VS12345ABC123",
      "productId": "ea-full",
      "productName": "EA ThebenchmarkTrader Full Version",
      "amount": 790000000,
      "customerEmail": "nguyenvana@gmail.com",
      "customerName": "Nguyen Van A",
      "customerPhone": "+84123456789",
      "customId": "ea-full|AFF-HOANGKIM-ABC123",
      "createdAt": "2025-01-15T14:30:00+07:00",
      "paidAt": "2025-01-15T14:35:00+07:00",
      "paymentMethod": "paypal"
    },
    {
      "orderId": "9WX67890DEF456",
      "productId": "ea-full",
      "amount": 790000000,
      "customerEmail": "tranthib@yahoo.com",
      "customerName": "Tran Thi B",
      "customId": "ea-full|AFF-HOANGKIM-ABC123",
      "createdAt": "2025-01-16T09:15:00+07:00",
      "paidAt": "2025-01-16T09:20:00+07:00",
      "paymentMethod": "paypal"
    },
    {
      "orderId": "1AB23456GHI789",
      "productId": "ea-full",
      "amount": 790000000,
      "customerEmail": "lequocc@hotmail.com",
      "customerName": "Le Quoc C",
      "customId": "ea-full|AFF-HOANGKIM-ABC123",
      "createdAt": "2025-01-17T16:45:00+07:00",
      "paidAt": "2025-01-17T16:50:00+07:00",
      "paymentMethod": "paypal"
    }
  ]
}
```

**Tổng commission cho 3 orders trên:**
- 3 orders × 7,900,000đ = 23,700,000đ
- Commission 30%: 23,700,000 × 0.30 = **7,110,000đ**
- Nhưng bạn nói 2,370,000đ → chỉ 1 order?

---

## ✅ Bước 5: Validate JSON

### **Check JSON syntax:**

```bash
# On Windows (PowerShell)
Get-Content scripts/paypal-orders-real.json | ConvertFrom-Json

# Or use online tool
# https://jsonlint.com/
```

### **Common errors:**

❌ **Missing comma:**
```json
{
  "orderId": "123"
  "productId": "ea-full"  // Missing comma after "123"
}
```

✅ **Correct:**
```json
{
  "orderId": "123",
  "productId": "ea-full"
}
```

❌ **Extra comma:**
```json
{
  "orderId": "123",
  "productId": "ea-full",  // No comma before closing }
}
```

---

## 🚀 Bước 6: Run Migration

### **6.1. Dry Run (Test)**

```bash
node scripts/migrate-paypal-commissions.js --file=scripts/paypal-orders-real.json
```

Output sẽ hiển thị:
- ✅ Which orders would be processed
- ✅ Commission amounts
- ✅ Affiliate users
- ⚠️ Any skipped orders

### **6.2. Review Output**

Check for:
- ✅ Correct affiliate codes
- ✅ Correct commission amounts
- ✅ No errors
- ⚠️ Any warnings

### **6.3. Apply Changes**

```bash
node scripts/migrate-paypal-commissions.js --file=scripts/paypal-orders-real.json --apply
```

---

## 📊 Bước 7: Verify Results

### **7.1. Check Database**

```bash
node scripts/check-paypal-orders.js
```

### **7.2. Check Dashboard**

Login affiliate dashboard và verify:
- ✅ Total commission updated
- ✅ Conversions count correct
- ✅ Available balance correct

---

## 🛠️ Troubleshooting

### **Problem: "No affiliate code found"**

**Solutions:**
1. Check `customId` field có đúng format: `productId|affiliateCode`
2. Verify affiliate code có trong database
3. Check affiliate status = 'approved'

### **Problem: "Already processed"**

**Solution:**
- Order đã được migrate rồi
- Check trong AffiliateClick collection
- Safe to skip

### **Problem: Amount không đúng**

**Solution:**
- Remember: amount in cents (multiply by 100)
- 7,900,000đ = 790000000
- Not: 7900000

### **Problem: Invalid JSON**

**Solution:**
- Use JSON validator: https://jsonlint.com/
- Check commas, brackets, quotes
- Use VS Code for syntax highlighting

---

## 💡 Tips

1. **Start small**: Test với 1-2 orders trước
2. **Backup data**: Export MongoDB data before migration
3. **Verify affiliate codes**: Confirm với affiliates trước khi migrate
4. **Document source**: Note where you got order data from
5. **Check commission rates**: Verify affiliate is free/paid member

---

## 📋 Checklist

Before running migration:

- [ ] Created `paypal-orders-real.json`
- [ ] All required fields filled
- [ ] customId format correct: `productId|affiliateCode`
- [ ] Amount in cents (multiply by 100)
- [ ] JSON syntax valid (no errors)
- [ ] Tested with dry run first
- [ ] Reviewed dry run output
- [ ] Ready to apply

---

## 🎯 Expected Results

Sau khi migration thành công:

**For example với 3 orders:**
```
Total commission: 7,110,000đ (3 orders × 7,900,000đ × 30%)
Affiliate balance increases: +7,110,000đ
Conversions: +3
Dashboard updates immediately
```

**Nhưng nếu chỉ 1 order = 2,370,000đ:**
```
1 order × 7,900,000đ × 30% = 2,370,000đ ✅
```

