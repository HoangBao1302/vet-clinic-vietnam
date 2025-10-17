# 🎯 MASTER GUIDE: A → B → C Migration Flow

## 📋 Overview

Complete guide để check và migrate PayPal affiliate commissions từ đầu đến cuối.

**Your situation:**
- Dashboard shows: 3 clicks, 1 conversion, 2,370,000đ
- Need to verify: Có thực sự 3 orders không?
- If yes: Migrate missing orders

---

## 🗺️ Navigation

| Part | Title | File | Purpose |
|------|-------|------|---------|
| **A** | Check PayPal Transactions | [CHECK_PAYPAL_TRANSACTIONS_GUIDE.md](./CHECK_PAYPAL_TRANSACTIONS_GUIDE.md) | Xác định số orders thật |
| **B** | Create JSON File | [PART_B_CREATE_JSON.md](./PART_B_CREATE_JSON.md) | Tạo file để migrate |
| **C** | Setup MongoDB & Verify | [PART_C_SETUP_MONGODB.md](./PART_C_SETUP_MONGODB.md) | Verify kết quả |

---

## 🚀 Quick Start

### **Current State:**

```
Dashboard: 
  Clicks: 3
  Conversions: 1
  Commission: 2,370,000đ
  
Question: Có 3 orders thật không?
```

---

### **Decision Tree:**

```
Start Here
    ↓
┌───────────────────────────────────┐
│  A) Check PayPal Transactions    │
│  How many orders COMPLETED?       │
└───────────┬───────────────────────┘
            ↓
      ┌─────┴─────┐
      ↓           ↓
   1 Order     3 Orders
      ↓           ↓
   ✅ Done    ┌─────────────────────┐
   Correct   │ B) Create JSON File │
   Dashboard │ For 2 missing orders │
             └─────────┬─────────────┘
                       ↓
             ┌─────────────────────────┐
             │ C) Setup MongoDB        │
             │ Run Migration & Verify  │
             └─────────┬───────────────┘
                       ↓
                 ✅ Updated!
                 Commission: 7,110,000đ
```

---

## 📝 Part A: Check PayPal

### **Goal:** Determine actual number of successful orders

### **Methods:**
1. PayPal Business Dashboard
2. Vercel Webhook Logs
3. Email Receipts
4. MongoDB Compass

### **Commands:**
```bash
# Check database (if have MongoDB URI)
node scripts/check-paypal-orders.js
node scripts/check-hoangkim-conversions.js
```

### **Output:**
Count of:
- Completed transactions
- With affiliate code `AFF-HOANGKIM-IBQ095`
- Amount and dates

### **Decision:**
- **If 1 order:** Dashboard correct, done! ✅
- **If 3 orders:** Proceed to Part B 🔄

**→ [Full Guide: PART A](./CHECK_PAYPAL_TRANSACTIONS_GUIDE.md)**

---

## 📝 Part B: Create JSON

### **Goal:** Create migration file with missing orders

### **Prerequisites:**
- Completed Part A
- Have order details (IDs, emails, dates)

### **Quick Method:**
```bash
# Interactive script (easiest)
node scripts/create-migration-json.js
```

Follow prompts to enter:
- Affiliate code: `AFF-HOANGKIM-IBQ095`
- Number of orders
- Details for each order

**Output:** `scripts/paypal-orders-hoangkim.json`

### **Manual Method:**
```bash
# Copy template
cp scripts/paypal-orders-hoangkim-template.json scripts/paypal-orders-hoangkim.json

# Edit file with real data
# Follow guide for field-by-field instructions
```

### **Validate:**
```powershell
Get-Content scripts/paypal-orders-hoangkim.json | ConvertFrom-Json
```

### **Dry Run:**
```bash
node scripts/migrate-paypal-commissions.js --file=scripts/paypal-orders-hoangkim.json
```

Review output before applying!

**→ [Full Guide: PART B](./PART_B_CREATE_JSON.md)**

---

## 📝 Part C: Setup MongoDB & Verify

### **Goal:** 
1. Setup MongoDB connection
2. Run migration
3. Verify results

### **Quick Method:**
```bash
# Get URI from Vercel
vercel env pull .env.local

# Or manually copy from Vercel Dashboard:
# Settings → Environment Variables → MONGODB_URI
```

### **Test Connection:**
```bash
node scripts/check-paypal-orders.js
```

### **Check Current State:**
```bash
node scripts/check-hoangkim-conversions.js
```

**Expected output:**
```
Total Commission Earned: 2,370,000đ  (before)
Converted: 1
```

### **Apply Migration:**
```bash
node scripts/migrate-paypal-commissions.js --file=scripts/paypal-orders-hoangkim.json --apply
```

### **Verify After:**
```bash
node scripts/check-hoangkim-conversions.js
```

**Expected output:**
```
Total Commission Earned: 7,110,000đ  (after) ✅
Converted: 3  ✅
```

### **Check Dashboard:**
```
https://thebenchmarktrader.com/affiliate/dashboard

Should show:
- Conversions: 3
- Commission: 7,110,000đ
```

**→ [Full Guide: PART C](./PART_C_SETUP_MONGODB.md)**

---

## 🎯 Scenarios & Solutions

### **Scenario 1: Only 1 Real Order**

```
Part A Result: 1 completed PayPal order

Action: None needed
Reason: Dashboard is correct
  - 3 clicks = 3 people viewed
  - 1 conversion = 1 person bought
  - 2,370,000đ = correct commission

✅ Done!
```

---

### **Scenario 2: 3 Real Orders, 1 Tracked**

```
Part A Result: 3 completed PayPal orders

Action: Migrate 2 missing orders
Steps:
  1. Part B: Create JSON with 3 orders
  2. Part C: Run migration
  3. Verify commission = 7,110,000đ

Expected Result:
  - Conversions: 1 → 3
  - Commission: 2,370,000 → 7,110,000đ

✅ Migration successful!
```

---

### **Scenario 3: 3 Orders, All Different Affiliates**

```
Part A Result: 
  - Order 1: AFF-HOANGKIM-IBQ095
  - Order 2: AFF-ANOTHER-ABC123
  - Order 3: AFF-ANOTHER-ABC123

Action: Only migrate orders with YOUR affiliate code
  - Include order 1 only
  - Orders 2-3 belong to different affiliate

Result:
  - Dashboard stays at 2,370,000đ
  - Only 1 order is yours

✅ Correct!
```

---

## 📊 Commission Calculator

| Orders | Product | Rate | Per Order | Total |
|--------|---------|------|-----------|-------|
| 1 | EA Full | 30% | 2,370,000đ | **2,370,000đ** |
| 2 | EA Full | 30% | 2,370,000đ | **4,740,000đ** |
| 3 | EA Full | 30% | 2,370,000đ | **7,110,000đ** |
| 3 | EA Full | 35% | 2,765,000đ | **8,295,000đ** |

**Your case (free member, EA Full):**
```
3 orders × 7,900,000đ × 30% = 7,110,000đ
```

---

## 🛠️ All Commands Reference

```bash
# === PART A: CHECK ===

# Check database
node scripts/check-paypal-orders.js

# Check specific affiliate
node scripts/check-hoangkim-conversions.js

# === PART B: CREATE JSON ===

# Interactive (recommended)
node scripts/create-migration-json.js

# Manual
cp scripts/paypal-orders-hoangkim-template.json scripts/paypal-orders-hoangkim.json
# Then edit file

# Validate JSON
Get-Content scripts/paypal-orders-hoangkim.json | ConvertFrom-Json

# Dry run migration
node scripts/migrate-paypal-commissions.js --file=scripts/paypal-orders-hoangkim.json

# === PART C: MIGRATE & VERIFY ===

# Setup MongoDB URI
vercel env pull .env.local
# Or manually update .env.local

# Test connection
node scripts/check-paypal-orders.js

# Apply migration
node scripts/migrate-paypal-commissions.js --file=scripts/paypal-orders-hoangkim.json --apply

# Verify results
node scripts/check-hoangkim-conversions.js
```

---

## ✅ Success Checklist

### **Part A Complete:**
- [ ] Checked PayPal transactions
- [ ] Counted completed orders
- [ ] Verified affiliate codes
- [ ] Decided: Need migration? Yes/No

### **Part B Complete (If needed):**
- [ ] Created JSON file
- [ ] All fields filled correctly
- [ ] JSON syntax validated
- [ ] Dry run successful
- [ ] Reviewed output

### **Part C Complete:**
- [ ] MongoDB URI configured
- [ ] Connection tested
- [ ] Migration applied
- [ ] Results verified
- [ ] Dashboard updated

---

## 🚨 Common Issues & Solutions

### **Issue: Can't connect to MongoDB**

**Solution:**
```bash
# Get URI from Vercel
vercel login
vercel env pull .env.local

# Test
node scripts/check-paypal-orders.js
```

---

### **Issue: "Already processed"**

**Meaning:** Order was already migrated
**Action:** Normal, safe to skip
**Verify:** Check other orders in list

---

### **Issue: Dashboard not updating**

**Solutions:**
1. Hard refresh: Ctrl+F5
2. Clear cache
3. Check console logs
4. Verify migration completed
5. Run check script again

---

### **Issue: Commission doesn't match**

**Check:**
1. Number of orders migrated
2. Commission rate (30% or 35%)
3. Product amounts correct
4. No duplicate migrations

**Verify:**
```bash
node scripts/check-hoangkim-conversions.js
```

---

## 💡 Pro Tips

1. **Always start with dry run**
   - Never apply directly
   - Review output carefully

2. **Keep backups**
   ```bash
   cp scripts/paypal-orders-hoangkim.json paypal-orders-backup.json
   ```

3. **Document everything**
   - Where data came from
   - What was migrated
   - Results

4. **Verify at each step**
   - Don't rush
   - Check before proceeding

5. **Test with 1 order first**
   - If unsure, start small
   - Verify it works
   - Then add more

---

## 📞 Support

### **If you get stuck:**

1. **Re-read the relevant guide**
   - Part A, B, or C
   - Follow step-by-step

2. **Check command output**
   - Look for specific error messages
   - Search in guides for solutions

3. **Verify prerequisites**
   - MongoDB URI set?
   - JSON valid?
   - Affiliate code correct?

4. **Use check scripts**
   ```bash
   node scripts/check-paypal-orders.js
   node scripts/check-hoangkim-conversions.js
   ```

---

## 🎯 Final Goal

**Before:**
```
Conversions: 1
Commission: 2,370,000đ
Status: Unknown if correct
```

**After (if 3 orders):**
```
Conversions: 3
Commission: 7,110,000đ
Status: Verified & correct ✅
```

**Or (if 1 order):**
```
Conversions: 1
Commission: 2,370,000đ
Status: Confirmed correct ✅
```

---

## 🚀 Ready to Start?

1. **Begin with Part A**
   - [Check PayPal Transactions](./CHECK_PAYPAL_TRANSACTIONS_GUIDE.md)
   - Determine actual number of orders

2. **If need migration, do Part B**
   - [Create JSON File](./PART_B_CREATE_JSON.md)
   - Prepare migration data

3. **Finish with Part C**
   - [Setup & Verify](./PART_C_SETUP_MONGODB.md)
   - Apply and verify

---

## 📚 All Files Created

```
scripts/
├── MASTER_GUIDE_ABC.md                    ← You are here
├── CHECK_PAYPAL_TRANSACTIONS_GUIDE.md     ← Part A
├── PART_B_CREATE_JSON.md                  ← Part B
├── PART_C_SETUP_MONGODB.md                ← Part C
├── create-migration-json.js               ← Interactive helper
├── check-hoangkim-conversions.js          ← Check script
├── paypal-orders-hoangkim-template.json   ← Template
└── (Other existing files...)
```

---

## ✨ Good Luck!

**Remember:**
- Take it step by step
- Verify at each stage
- Don't rush
- Backup important files

🎉 **You got this!** 🚀

