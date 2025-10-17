# 🔄 PayPal Commissions Migration Guide

## 📋 Mục Đích

Scripts này giúp:
1. **Kiểm tra** database xem có orders PayPal nào
2. **Migrate** affiliate commissions cho các orders PayPal cũ (trước khi có affiliate tracking)

---

## 🚀 Cách Sử Dụng

### **Bước 1: Check Database**

Kiểm tra xem có orders PayPal nào trong database:

```bash
node scripts/check-paypal-orders.js
```

**Output sẽ hiển thị:**
- ✅ Số lượng PayPal orders trong DB
- ✅ Affiliate clicks (converted vs clicked)
- ✅ Commission breakdown by affiliate
- ✅ Potential missing conversions

---

### **Bước 2: Chuẩn Bị Data**

#### **Option A: Orders Đã Có Trong Database**

Nếu script check-database tìm thấy PayPal orders, bạn có thể migrate trực tiếp:

```bash
# Dry run (xem trước, không apply)
node scripts/migrate-paypal-commissions.js

# Apply changes
node scripts/migrate-paypal-commissions.js --apply
```

#### **Option B: Orders Từ File JSON**

Nếu orders không có trong DB (chỉ trong logs), tạo file JSON:

1. **Copy example file:**
   ```bash
   cp scripts/paypal-orders-example.json scripts/paypal-orders.json
   ```

2. **Edit file** `paypal-orders.json`:
   ```json
   {
     "orders": [
       {
         "orderId": "PAYPAL-123456",
         "productId": "ea-full",
         "amount": 790000000,
         "customerEmail": "customer@example.com",
         "customerName": "Nguyen Van A",
         "customId": "ea-full|AFF-HOANGKIM-ABC123",
         "createdAt": "2025-01-15T10:00:00Z",
         "paidAt": "2025-01-15T10:05:00Z"
       }
     ]
   }
   ```

3. **Run migration:**
   ```bash
   # Dry run
   node scripts/migrate-paypal-commissions.js --file=scripts/paypal-orders.json
   
   # Apply
   node scripts/migrate-paypal-commissions.js --file=scripts/paypal-orders.json --apply
   ```

---

## 📝 Định Dạng File JSON

### **Các Field Bắt Buộc:**

```json
{
  "orderId": "PAYPAL-ORDER-ID",          // PayPal order ID
  "productId": "ea-full",                 // Product ID (ea-full, ea-pro-source, etc.)
  "amount": 790000000,                    // Amount in VND cents (7,900,000đ = 790000000)
  "customId": "productId|affiliateCode"   // Format: "ea-full|AFF-USERNAME-ABC"
}
```

### **Các Field Optional:**

```json
{
  "productName": "EA ThebenchmarkTrader",
  "customerEmail": "customer@example.com",
  "customerName": "Nguyen Van A",
  "customerPhone": "+84123456789",
  "createdAt": "2025-01-15T10:00:00Z",
  "paidAt": "2025-01-15T10:05:00Z",
  "paymentMethod": "paypal"
}
```

---

## 🔍 Custom ID Format

PayPal orders lưu affiliate code trong `custom_id` field với format:

```
productId|affiliateCode
```

**Examples:**
- `ea-full|AFF-HOANGKIM-ABC123`
- `ea-pro-source|AFF-JOHNSMITH-XYZ789`
- `indicator-pro|AFF-TRADER-DEF456`

**Nếu không có `customId`:**

Script sẽ bỏ qua order đó (không thể xác định affiliate).

---

## 💰 Commission Rates

Script tự động tính commission based on:

| Product | Free Member | Paid Member |
|---------|-------------|-------------|
| EA Full | 30% | 35% |
| EA Pro + Source | 30% | 35% |
| Indicator Pro | 30% | 35% |
| Course | 25% | 25% |
| Social Copy | 10% | 10% |

**Example:**
- Order: 7,900,000đ (EA Full)
- Affiliate: Free member
- Commission: 7,900,000 × 30% = **2,370,000đ**

---

## ⚙️ Script Hoạt Động Như Thế Nào?

### **check-paypal-orders.js:**

1. Connect MongoDB
2. Query `orders` collection (paymentMethod: 'paypal')
3. Query `affiliateclicks` collection
4. Display statistics and breakdown
5. Show potential missing conversions

### **migrate-paypal-commissions.js:**

1. Load orders (from DB or file)
2. For each order:
   - Parse `affiliateCode` from `customId`
   - Find affiliate user
   - Check if already processed
   - Calculate commission
   - Create/update `AffiliateClick` record
   - Update `User.totalCommissionEarned`
3. Display summary

---

## 🛡️ Safety Features

### **Dry Run Mode (Default):**

```bash
node scripts/migrate-paypal-commissions.js
```

- ✅ Shows what WOULD be done
- ✅ No changes to database
- ✅ Safe to run multiple times

### **Apply Mode:**

```bash
node scripts/migrate-paypal-commissions.js --apply
```

- ⚠️ Actually makes changes
- ✅ Checks for duplicates
- ✅ Skips already processed orders

### **Duplicate Prevention:**

Script checks:
- Existing `AffiliateClick` with same `orderId`
- Prevents double-counting commission

---

## 📊 Example Output

### **Check Database:**

```
🔍 Connecting to MongoDB...
✅ Connected to MongoDB

📦 Checking PayPal Orders...
Found 3 PayPal orders

📋 PayPal Orders List:
────────────────────────────────────────────────────────────────────────────────
Order ID: PAYPAL-123456
  Product: EA ThebenchmarkTrader Full Version
  Amount: 7,900,000đ
  Customer: Nguyen Van A (customer@example.com)
  Date: 2025-01-15T10:05:00Z
────────────────────────────────────────────────────────────────────────────────

📊 Checking Affiliate Clicks...
Total Affiliate Clicks: 5
  - Converted: 2
  - Clicked (not converted): 3

👥 Affiliate Clicks Breakdown:
────────────────────────────────────────────────────────────────────────────────
Affiliate: AFF-HOANGKIM-ABC123 (hoangkim)
  Clicks: 3
  Converted: 1
  Total Commission: 2,370,000đ
  User Commission Earned: 2,370,000đ
  User Commission Paid: 0đ
────────────────────────────────────────────────────────────────────────────────
```

### **Migration (Dry Run):**

```
🚀 PayPal Commissions Migration Script
════════════════════════════════════════════════════════════════════════════════
Mode: 🔍 DRY RUN (no changes will be made)
════════════════════════════════════════════════════════════════════════════════

📦 Processing Order: PAYPAL-123456
   Product: EA ThebenchmarkTrader Full Version
   Amount: 7,900,000đ
   Customer: Nguyen Van A (customer@example.com)
   Affiliate Code: AFF-HOANGKIM-ABC123
   Affiliate User: hoangkim (hoangkim@example.com)
   💰 Commission: 2,370,000đ (30%)
   🔍 DRY RUN - Would create/update:
      - AffiliateClick with commission: 2,370,000đ
      - User totalCommissionEarned: 0 → 2,370,000đ

════════════════════════════════════════════════════════════════════════════════
📊 MIGRATION SUMMARY
════════════════════════════════════════════════════════════════════════════════
🔍 DRY RUN RESULTS:
   Would process: 3 orders
   Already processed: 0 orders
   Skipped (no affiliate): 0 orders
   
💡 Run with --apply to actually apply changes
════════════════════════════════════════════════════════════════════════════════
```

---

## 🔧 Troubleshooting

### **Problem: No orders found**

**Solution:**
- PayPal orders might not be saved in DB
- Check Vercel logs for PayPal webhook events
- Create JSON file manually with order data

### **Problem: Affiliate not found**

**Solution:**
- Check affiliate code format: `AFF-USERNAME-XXX`
- Verify affiliate status is 'approved'
- Check `customId` format in order

### **Problem: Amount is 0 or wrong**

**Solution:**
- Amount should be in VND cents: 7,900,000đ = 790000000
- Check if amount was properly stored in order

### **Problem: Already processed**

**Solution:**
- Script automatically skips already processed orders
- This is normal and safe

---

## 📞 Support

Nếu gặp vấn đề:

1. Run `check-paypal-orders.js` để xem database state
2. Check logs để tìm lỗi
3. Verify `.env.local` có `MONGODB_URI`
4. Đảm bảo affiliate codes đúng format

---

## ✅ Checklist

- [ ] Copy `.env.local` có `MONGODB_URI`
- [ ] Run `check-paypal-orders.js` để xem data
- [ ] Chuẩn bị data (DB hoặc JSON file)
- [ ] Run migration dry-run
- [ ] Review output
- [ ] Run migration với `--apply`
- [ ] Verify results trong dashboard

---

## 🎯 Next Steps

Sau khi migration:

1. **Check Dashboard:** Xem commission đã cập nhật
2. **Verify Email:** Test email commission cho lần rút tiếp theo
3. **Test New Orders:** Verify tracking hoạt động cho orders mới

---

## 📝 Notes

- Script an toàn để chạy nhiều lần (có duplicate check)
- Luôn run dry-run trước
- Backup database trước khi apply (recommended)
- Orders cũ không có `customId` sẽ bị skip

