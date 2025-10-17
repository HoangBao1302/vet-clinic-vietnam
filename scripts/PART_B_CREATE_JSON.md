# 📝 PART B: Tạo JSON File Migration

## 🎯 Mục Đích

Sau khi check PayPal (Part A), nếu có nhiều hơn 1 order cần migrate, tạo JSON file để run migration script.

---

## 🚀 Quick Start (Recommended)

### **Method 1: Interactive Script** ⭐ EASIEST

```bash
node scripts/create-migration-json.js
```

Script sẽ hỏi từng thông tin:
- Affiliate code
- Số orders
- Transaction ID, email, date cho mỗi order

**Output:** `scripts/paypal-orders-hoangkim.json`

---

## 📝 Method 2: Manual Edit

### **Bước 1: Copy Template**

```bash
cp scripts/paypal-orders-hoangkim-template.json scripts/paypal-orders-hoangkim.json
```

---

### **Bước 2: Edit File**

Mở file `scripts/paypal-orders-hoangkim.json` và replace:

#### **Field 1: orderId**
```json
"orderId": "8VS12345ABC123"
```
- Lấy từ PayPal transaction
- Example: `8VS12345ABC`, `9WX67890DEF`, `1AB23456GHI`

---

#### **Field 2: amount**
```json
"amount": 790000000
```

**Amount Guide:**

| Product | Price VND | Price USD | Amount (cents) |
|---------|-----------|-----------|----------------|
| EA Full | 7,900,000đ | $329.17 | 790000000 |
| EA Pro + Source | 14,000,000đ | $583.33 | 1400000000 |
| Indicator Pro | 1,900,000đ | $79.17 | 190000000 |
| Course | 5,000,000đ | $208.33 | 500000000 |
| Social Copy | 2,000,000đ | $83.33 | 200000000 |

**Formula:**
```
VND amount × 100 = cents
Example: 7,900,000 × 100 = 790,000,000
```

---

#### **Field 3: customerEmail**
```json
"customerEmail": "nguyenvana@gmail.com"
```
- Lấy từ PayPal transaction details
- Exact email customer dùng để pay

---

#### **Field 4: customerName**
```json
"customerName": "Nguyen Van A"
```
- Tên customer
- From PayPal payer info

---

#### **Field 5: customId** (CRITICAL!)
```json
"customId": "ea-full|AFF-HOANGKIM-IBQ095"
```

**Format:** `productId|affiliateCode`

**Your affiliate code:** `AFF-HOANGKIM-IBQ095` (from dashboard)

**Examples:**
```json
"customId": "ea-full|AFF-HOANGKIM-IBQ095"          // EA Full
"customId": "ea-pro-source|AFF-HOANGKIM-IBQ095"    // EA Pro
"customId": "indicator-pro|AFF-HOANGKIM-IBQ095"    // Indicator
```

---

#### **Field 6: createdAt / paidAt**
```json
"createdAt": "2025-01-15T14:30:00+07:00",
"paidAt": "2025-01-15T14:35:00+07:00"
```

**Format:** ISO 8601 with Vietnam timezone (+07:00)

**From PayPal transaction date/time:**
- PayPal shows PST or UTC
- Convert to Vietnam time (UTC+7)

**Example conversion:**
```
PayPal: Jan 15, 2025 7:30 AM PST
→ Vietnam: Jan 15, 2025 2:30 PM (+7 hours)
→ ISO: 2025-01-15T14:30:00+07:00
```

**Quick tool:** https://www.timeanddate.com/worldclock/converter.html

---

### **Bước 3: Example - 3 Orders**

```json
{
  "orders": [
    {
      "orderId": "8VS12345ABC123",
      "productId": "ea-full",
      "productName": "EA ThebenchmarkTrader Full Version",
      "amount": 790000000,
      "customerEmail": "customer1@gmail.com",
      "customerName": "Nguyen Van A",
      "customerPhone": "+84123456789",
      "customId": "ea-full|AFF-HOANGKIM-IBQ095",
      "createdAt": "2025-01-15T14:30:00+07:00",
      "paidAt": "2025-01-15T14:35:00+07:00",
      "paymentMethod": "paypal"
    },
    {
      "orderId": "9WX67890DEF456",
      "productId": "ea-full",
      "productName": "EA ThebenchmarkTrader Full Version",
      "amount": 790000000,
      "customerEmail": "customer2@yahoo.com",
      "customerName": "Tran Thi B",
      "customerPhone": "+84987654321",
      "customId": "ea-full|AFF-HOANGKIM-IBQ095",
      "createdAt": "2025-01-16T09:15:00+07:00",
      "paidAt": "2025-01-16T09:20:00+07:00",
      "paymentMethod": "paypal"
    },
    {
      "orderId": "1AB23456GHI789",
      "productId": "ea-full",
      "productName": "EA ThebenchmarkTrader Full Version",
      "amount": 790000000,
      "customerEmail": "customer3@hotmail.com",
      "customerName": "Le Quoc C",
      "customerPhone": "+84999888777",
      "customId": "ea-full|AFF-HOANGKIM-IBQ095",
      "createdAt": "2025-01-17T16:45:00+07:00",
      "paidAt": "2025-01-17T16:50:00+07:00",
      "paymentMethod": "paypal"
    }
  ]
}
```

---

### **Bước 4: Validate JSON**

**Option A: PowerShell**
```powershell
Get-Content scripts/paypal-orders-hoangkim.json | ConvertFrom-Json
```

**Option B: Online Tool**
- https://jsonlint.com/
- Paste JSON và check for errors

**Option C: VS Code**
- Open file in VS Code
- Look for red squiggly lines
- Fix any syntax errors

---

### **Bước 5: Calculate Expected Commission**

```
Number of orders: 3
Amount per order: 7,900,000đ
Commission rate: 30% (free member)

Calculation:
3 orders × 7,900,000đ × 30% = 7,110,000đ

Expected dashboard after migration:
- Conversions: 1 → 4 (3 new + 1 old)
  Wait, or maybe 1 → 3 if old one is included

Actually:
- If 1 order already tracked: Add 2 more
- Conversions: 1 → 3
- Commission: 2,370,000đ → 7,110,000đ
```

---

## ✅ Checklist Before Migration

- [ ] JSON file created
- [ ] All `orderId` filled with real PayPal IDs
- [ ] All `amount` correct (in cents!)
- [ ] All `customerEmail` correct
- [ ] All `customId` has correct affiliate code
- [ ] All dates in correct timezone (+07:00)
- [ ] JSON syntax validated (no errors)
- [ ] Calculated expected commission
- [ ] Ready to run migration

---

## 🚀 Run Migration

### **Step 1: Dry Run (Safe)**

```bash
node scripts/migrate-paypal-commissions.js --file=scripts/paypal-orders-hoangkim.json
```

**Review output:**
- How many orders will be processed?
- Commission amounts correct?
- Any warnings or errors?
- Check "Would process" count

---

### **Step 2: Review Output**

Look for:

```
📦 Processing Order: PAYPAL-123456
   Product: EA ThebenchmarkTrader Full Version
   Amount: 7,900,000đ
   Affiliate Code: AFF-HOANGKIM-IBQ095
   Affiliate User: hoangkim (hoangkim@example.com)
   💰 Commission: 2,370,000đ (30%)
   🔍 DRY RUN - Would create/update:
      - AffiliateClick with commission: 2,370,000đ
      - User totalCommissionEarned: 2,370,000 → 4,740,000đ

✅ Already processed (Click ID: xxx)  ← This is OK for order 1

📊 MIGRATION SUMMARY
═══════════════════════════════════════════════════════
🔍 DRY RUN RESULTS:
   Would process: 2 orders
   Already processed: 1 orders
   Skipped (no affiliate): 0 orders
```

---

### **Step 3: Apply If Looks Good**

```bash
node scripts/migrate-paypal-commissions.js --file=scripts/paypal-orders-hoangkim.json --apply
```

---

### **Step 4: Verify Results**

**Check Dashboard:**
1. Refresh https://thebenchmarktrader.com/affiliate/dashboard
2. Expected changes:
   ```
   Before:
   - Conversions: 1
   - Commission: 2,370,000đ
   
   After:
   - Conversions: 3
   - Commission: 7,110,000đ
   ```

**Check Database (if have access):**
```bash
node scripts/check-paypal-orders.js
```

---

## 🛠️ Troubleshooting

### **Error: Invalid JSON**

```
SyntaxError: Unexpected token
```

**Solutions:**
- Check for missing/extra commas
- Check all quotes are correct
- Use JSON validator
- Remove comments (lines with `_comment`)

---

### **Warning: No affiliate code found**

```
⚠️ No affiliate code found - skipping
```

**Solutions:**
- Check `customId` field exists
- Format: `productId|affiliateCode`
- Correct: `"ea-full|AFF-HOANGKIM-IBQ095"`
- Wrong: `"AFF-HOANGKIM-IBQ095"` (missing productId)

---

### **Error: Already processed**

```
✅ Already processed (Click ID: ...)
```

**This is normal!**
- Order was already migrated
- Script prevents duplicates
- Safe to skip

---

### **Error: Affiliate not found**

```
❌ Affiliate not found or not approved
```

**Solutions:**
- Check affiliate code spelling
- Verify status is 'approved'
- Check in database: Users collection

---

### **Amount doesn't match**

```
Expected: 7,110,000đ
Got: Different amount
```

**Solutions:**
- Check amount is in cents (× 100)
- 7,900,000đ = 790000000 (not 7900000)
- Recalculate: orders × amount × commission rate

---

## 💡 Pro Tips

1. **Start with 1 order:**
   - Test with just order 2 first
   - Verify it works
   - Then add order 3

2. **Keep backup:**
   ```bash
   cp scripts/paypal-orders-hoangkim.json scripts/paypal-orders-hoangkim.backup.json
   ```

3. **Document source:**
   - Add note in JSON where data came from
   - PayPal transaction export
   - Vercel logs
   - Email receipts

4. **Double-check dates:**
   - Use exact timestamps from PayPal
   - Timezone matters for sorting

5. **Commission calculation:**
   ```javascript
   // Free member
   7,900,000 × 0.30 = 2,370,000đ
   
   // Paid member (if upgraded)
   7,900,000 × 0.35 = 2,765,000đ
   ```

---

## ✅ Success Criteria

After migration:

- ✅ No errors in migration output
- ✅ Dashboard shows 3 conversions
- ✅ Commission = 7,110,000đ
- ✅ Can see all orders in affiliate dashboard
- ✅ Email notifications sent (if configured)

---

## 🎯 Summary

| Step | Command | Purpose |
|------|---------|---------|
| 1 | `node scripts/create-migration-json.js` | Interactive creation |
| 2 | Edit `paypal-orders-hoangkim.json` | Fill real data |
| 3 | Validate JSON | Check syntax |
| 4 | `migrate...js --file=...` | Dry run |
| 5 | Review output | Verify before apply |
| 6 | `migrate...js --file=... --apply` | Apply changes |
| 7 | Refresh dashboard | Verify results |

---

## 📞 Need Help?

If stuck:

1. **Check template:** `paypal-orders-hoangkim-template.json`
2. **Check example:** `paypal-orders-example.json`
3. **Run interactive script:** Let it guide you
4. **Validate JSON:** Use online tools
5. **Dry run first:** Always test before apply

---

## 🎉 Ready?

After completing Part B:
- ✅ JSON file created with real data
- ✅ Validated syntax
- ✅ Dry run successful
- ✅ Ready to apply

**→ Proceed to Part C for MongoDB verification!** 🚀

