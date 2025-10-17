# 🔧 Migration Scripts - Quick Reference

## 📚 Available Guides

| Guide | Description | Link |
|-------|-------------|------|
| **Main Guide** | Complete migration instructions | [PAYPAL_MIGRATION_README.md](./PAYPAL_MIGRATION_README.md) |
| **Get MongoDB URI** | How to get connection string from Vercel | [GET_MONGODB_URI_FROM_VERCEL.md](./GET_MONGODB_URI_FROM_VERCEL.md) |
| **Create JSON** | Manual order data entry guide | [CREATE_PAYPAL_ORDERS_JSON.md](./CREATE_PAYPAL_ORDERS_JSON.md) |
| **Setup MongoDB** | MongoDB Atlas setup from scratch | [SETUP_MONGODB_ATLAS.md](./SETUP_MONGODB_ATLAS.md) |

---

## 🚀 Quick Start

### **Step 1: Setup Connection**

Choose one:

**A) Use existing Vercel MongoDB:**
```bash
# Follow: GET_MONGODB_URI_FROM_VERCEL.md
# Copy MONGODB_URI from Vercel → .env.local
```

**B) Setup new MongoDB Atlas:**
```bash
# Follow: SETUP_MONGODB_ATLAS.md
# Create cluster → Get connection string
```

---

### **Step 2: Check Database**

```bash
node scripts/check-paypal-orders.js
```

**Expected output:**
```
🔍 Connecting to MongoDB...
✅ Connected to MongoDB

📦 Checking PayPal Orders...
Found X PayPal orders

📊 Checking Affiliate Clicks...
Total Affiliate Clicks: Y
  - Converted: Z
  - Clicked (not converted): W
```

---

### **Step 3: Prepare Data**

Choose one:

**A) Orders in database:**
```bash
# Ready to migrate directly
node scripts/migrate-paypal-commissions.js
```

**B) Create JSON manually:**
```bash
# Follow: CREATE_PAYPAL_ORDERS_JSON.md
# Create: scripts/paypal-orders-real.json
node scripts/migrate-paypal-commissions.js --file=scripts/paypal-orders-real.json
```

---

### **Step 4: Run Migration**

**Dry run first (safe, no changes):**
```bash
node scripts/migrate-paypal-commissions.js
```

**Review output, then apply:**
```bash
node scripts/migrate-paypal-commissions.js --apply
```

**With custom file:**
```bash
node scripts/migrate-paypal-commissions.js --file=scripts/paypal-orders-real.json --apply
```

---

## 📋 Scripts Overview

### **check-paypal-orders.js**

**Purpose:** Check database for PayPal orders and affiliate data

**Usage:**
```bash
node scripts/check-paypal-orders.js
```

**Output:**
- PayPal orders count
- Affiliate clicks statistics
- Commission breakdown by affiliate
- Potential missing conversions

---

### **migrate-paypal-commissions.js**

**Purpose:** Migrate affiliate commissions for old PayPal orders

**Usage:**
```bash
# Dry run (no changes)
node scripts/migrate-paypal-commissions.js

# Apply changes
node scripts/migrate-paypal-commissions.js --apply

# From file
node scripts/migrate-paypal-commissions.js --file=paypal-orders.json --apply
```

**What it does:**
1. Load orders (DB or JSON file)
2. Parse affiliate codes from `customId`
3. Calculate commissions
4. Create/update AffiliateClick records
5. Update User.totalCommissionEarned

---

## 💰 Commission Rates

| Product | Free Member | Paid Member |
|---------|-------------|-------------|
| EA Full | 30% | 35% |
| EA Pro + Source | 30% | 35% |
| Indicator Pro | 30% | 35% |
| Course | 25% | 25% |
| Social Copy | 10% | 10% |

**Example:**
```
Order: 7,900,000đ (EA Full)
Free member: 7,900,000 × 30% = 2,370,000đ
Paid member: 7,900,000 × 35% = 2,765,000đ
```

---

## 🛠️ Troubleshooting

### **Connection Issues**

```bash
❌ Error: querySrv ENOTFOUND
```

**Solutions:**
1. Check `.env.local` has valid `MONGODB_URI`
2. Verify connection string format
3. Check network/firewall
4. Verify IP whitelist in MongoDB Atlas

---

### **No Orders Found**

```bash
⚠️ No PayPal orders found in database
```

**Solutions:**
1. Orders might not be saved in DB
2. Check Vercel logs for webhook events
3. Create JSON file manually (see CREATE_PAYPAL_ORDERS_JSON.md)

---

### **No Affiliate Code**

```bash
⚠️ No affiliate code found - skipping
```

**Solutions:**
1. Check `customId` format: `productId|affiliateCode`
2. Verify order has affiliate data
3. Contact customer to get affiliate link used

---

### **Already Processed**

```bash
✅ Already processed (Click ID: ...)
```

**Solution:**
- This is normal and safe
- Order was already migrated
- Script prevents duplicates

---

## 📁 Files Structure

```
scripts/
├── README.md                           # This file
├── PAYPAL_MIGRATION_README.md          # Main migration guide
├── GET_MONGODB_URI_FROM_VERCEL.md      # Get connection string
├── CREATE_PAYPAL_ORDERS_JSON.md        # Manual JSON creation
├── SETUP_MONGODB_ATLAS.md              # MongoDB setup guide
├── check-paypal-orders.js              # Check database script
├── migrate-paypal-commissions.js       # Migration script
├── paypal-orders-example.json          # JSON template
└── paypal-orders-real.json             # Your data (create this)
```

---

## 🔐 Security Notes

1. **Never commit:**
   - `.env.local`
   - `paypal-orders-real.json` (if contains real data)
   - MongoDB connection strings

2. **Safe to commit:**
   - `paypal-orders-example.json` (template only)
   - All `.md` guide files
   - Scripts (`.js` files)

3. **Gitignore already includes:**
   - `.env.local`
   - `*.real.json`
   - `*-real.json`

---

## 📊 Expected Results

### **Example Migration (3 orders):**

**Before:**
```
Total Commission Earned: 0đ
Conversions: 0
Available Balance: 0đ
```

**After:**
```
Total Commission Earned: 7,110,000đ
Conversions: 3
Available Balance: 7,110,000đ
```

### **For your specific case (1 order = 2,370,000đ):**

**Before:**
```
Total Commission Earned: 0đ
```

**After:**
```
Total Commission Earned: 2,370,000đ
Conversions: 1
Available Balance: 2,370,000đ
```

---

## ✅ Post-Migration Checklist

- [ ] Run check script to verify
- [ ] Login affiliate dashboard
- [ ] Verify total commission displayed correctly
- [ ] Check conversions count
- [ ] Test payment request (if balance > 500k)
- [ ] Check email notification works

---

## 🚀 Next Steps After Migration

1. **Verify Dashboard:**
   - Login as affiliate
   - Check commission updated
   - Verify conversions count

2. **Test New Orders:**
   - Create test order with affiliate link
   - Verify webhook tracks correctly
   - Check dashboard updates in real-time

3. **Document Process:**
   - Note which orders were migrated
   - Keep backup of JSON file
   - Document any issues encountered

---

## 📞 Need Help?

1. **Check Logs:**
   ```bash
   # Scripts output detailed logs
   # Review for specific error messages
   ```

2. **Verify Data:**
   ```bash
   node scripts/check-paypal-orders.js
   ```

3. **Review Guides:**
   - Main guide: [PAYPAL_MIGRATION_README.md](./PAYPAL_MIGRATION_README.md)
   - Specific issues: Check other `.md` files

4. **Common Solutions:**
   - MongoDB connection: Check `.env.local`
   - No affiliate code: Verify `customId` format
   - Already processed: Normal, skip it

---

## 🎯 Goals

✅ **Primary Goal:**
- Migrate affiliate commissions for old PayPal orders
- Update dashboard to show correct commission amounts

✅ **Success Criteria:**
- Total commission matches actual earnings
- Dashboard displays correctly
- Email notifications work
- No duplicate commissions

✅ **Safety:**
- Dry run prevents accidents
- Duplicate prevention built-in
- Safe to run multiple times
- No data loss risk

---

## 📈 Monitoring

After migration, monitor:

1. **Affiliate Dashboard:**
   - Commission totals
   - Conversion rates
   - Available balance

2. **MongoDB Atlas:**
   - Storage usage
   - Connection count
   - Query performance

3. **Vercel Logs:**
   - Webhook events
   - Error rates
   - Response times

---

## 🎉 Success!

If you see this after migration:

```
════════════════════════════════════════════════════════════════════════════════
📊 MIGRATION SUMMARY
════════════════════════════════════════════════════════════════════════════════
✅ MIGRATION COMPLETE:
   Successfully processed: 3 orders
   Total commission added: 7,110,000đ
════════════════════════════════════════════════════════════════════════════════
```

**Congratulations! 🎊 Migration successful!**

Now your affiliate can:
- See correct commission balance
- Request payment (if > 500k)
- Track earnings accurately

