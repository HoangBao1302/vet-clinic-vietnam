# 🧹 Cleanup & Maintenance Scripts

Scripts for database cleanup and system maintenance.

---

## 📋 **AVAILABLE SCRIPTS**

### **1. Clean Test Database**

**File:** `clean-test-database.js`

**Purpose:** Remove all test orders from MongoDB

**When to use:**
- After testing PayPal/Stripe flows
- Before deploying to production
- When database has corrupt test data

**Usage:**
```bash
$env:MONGODB_URI="your-mongodb-uri"
node clean-test-database.js
```

**What it does:**
- ✅ Lists all orders before deletion
- ✅ Deletes all orders from database
- ✅ Verifies deletion success
- ✅ Shows summary

**Output:**
```
📊 Total orders in database: 35
🗑️  DELETING ALL TEST ORDERS...
✅ Successfully deleted 35 orders!
📊 Remaining orders: 0
```

---

### **2. Fix Specific Orders**

**File:** `fix-specific-orders-now.js`

**Purpose:** View and diagnose specific problematic orders

**When to use:**
- When user reports wrong order data
- To check specific order details
- Before manually fixing orders

**Usage:**
```bash
$env:MONGODB_URI="your-mongodb-uri"
node fix-specific-orders-now.js
```

**What it shows:**
- Current data in database
- What's wrong (amount, productId, etc.)
- Update command template
- Manual fix instructions

---

### **3. Fix Kiettong & Haitong Orders**

**File:** `fix-kiettong-haitong-orders.js`

**Purpose:** Fix specific test orders (example script)

**When to use:**
- As a template for fixing specific orders
- When you know exact order IDs and correct data

**Usage:**
```bash
$env:MONGODB_URI="your-mongodb-uri"
node fix-kiettong-haitong-orders.js
```

---

### **4. Resend Correct Emails**

**File:** `resend-correct-emails.js`

**Purpose:** Resend emails with correct information

**When to use:**
- After fixing database orders
- When email was sent with wrong info
- When user didn't receive email

**Requirements:**
- SMTP credentials configured

**Usage:**
```bash
$env:SMTP_HOST="smtp.gmail.com"
$env:SMTP_PORT="587"
$env:SMTP_USER="your-email@gmail.com"
$env:SMTP_PASS="your-app-password"
node resend-correct-emails.js
```

**Note:** Modify script to include correct customer orders

---

### **5. Test PayPal Flow**

**File:** `test-all-6-products-paypal.js`

**Purpose:** Comprehensive PayPal testing for all 6 products

**When to use:**
- After code changes to PayPal webhook
- Before deploying to production
- To verify all products work

**Usage:**
```bash
node test-all-6-products-paypal.js
```

**Tests:**
- ✅ All 6 products (3 MT4 + 3 MT5)
- ✅ 4 scenarios per product (24 total)
- ✅ Normal flow
- ✅ Fallback to reference_id
- ✅ Fallback to amount detection
- ✅ Wrong custom_id with auto-correction

---

### **6. Test Stripe Flow**

**File:** `test-all-6-products-stripe.js`

**Purpose:** Comprehensive Stripe testing for all 6 products

**When to use:**
- After code changes to Stripe webhook
- Before deploying to production
- To verify all products work

**Usage:**
```bash
node test-all-6-products-stripe.js
```

**Tests:**
- ✅ All 6 products (3 MT4 + 3 MT5)
- ✅ 4 scenarios per product (24 total)
- ✅ Normal flow
- ✅ Missing productName
- ✅ Wrong productId with auto-correction
- ✅ All metadata present

---

## 🔄 **MAINTENANCE WORKFLOW**

### **After Testing:**

```bash
# 1. Clean database
$env:MONGODB_URI="your-uri"
node clean-test-database.js

# 2. Verify clean
node fix-specific-orders-now.js
# Should show: 0 orders

# 3. Run tests again (optional)
node test-all-6-products-paypal.js
node test-all-6-products-stripe.js
```

---

### **After Production Issues:**

```bash
# 1. Check problematic orders
$env:MONGODB_URI="your-uri"
node fix-specific-orders-now.js

# 2. Fix specific orders manually
# (Use MongoDB commands from output)

# 3. Resend emails
# (Modify resend-correct-emails.js first)
node resend-correct-emails.js
```

---

## 🗑️ **SAFE CLEANUP CHECKLIST**

Before running cleanup scripts:

- [ ] Verify you're using correct MongoDB URI
- [ ] Backup production data if needed
- [ ] Check if orders are real customers or test data
- [ ] Confirm with team before deleting production data

### **Production vs Test:**

**Test Environment:**
- ✅ Safe to delete all orders
- ✅ PayPal sandbox orders
- ✅ Stripe test mode orders

**Production Environment:**
- ❌ DO NOT delete real customer orders
- ✅ Only fix incorrect data
- ✅ Keep audit trail

---

## 📊 **MONGODB COMMANDS**

### **Backup orders before cleanup:**

```javascript
// Export to JSON
mongoexport --uri="your-mongodb-uri" --collection=orders --out=orders_backup.json

// Or in Node.js
const orders = await Order.find({});
fs.writeFileSync('backup.json', JSON.stringify(orders, null, 2));
```

### **Restore from backup:**

```javascript
// Import from JSON
mongoimport --uri="your-mongodb-uri" --collection=orders --file=orders_backup.json

// Or in Node.js
const backup = JSON.parse(fs.readFileSync('backup.json'));
await Order.insertMany(backup);
```

---

## 🔍 **VERIFICATION QUERIES**

### **Check for wrong amounts:**

```javascript
// Find orders with suspiciously low amounts
db.orders.find({
  amount: { $lt: 1000000 }  // Less than 1M cents (10K VND)
}).pretty()
```

### **Check for invalid productIds:**

```javascript
// Find orders with old/invalid productIds
db.orders.find({
  productId: { 
    $nin: [
      'indicator-pro-mt4', 'indicator-pro-mt5',
      'ea-full-mt4', 'ea-full-mt5',
      'ea-pro-source-mt4', 'ea-pro-source-mt5'
    ]
  }
}).pretty()
```

### **Check recent orders:**

```javascript
// Show last 10 orders
db.orders.find()
  .sort({ createdAt: -1 })
  .limit(10)
  .pretty()
```

---

## 🚨 **EMERGENCY PROCEDURES**

### **If database corrupted:**

1. **Stop all webhooks** (disable in PayPal/Stripe dashboard)
2. **Backup current state:**
   ```bash
   mongoexport --uri="your-uri" --collection=orders --out=corrupted_backup.json
   ```
3. **Analyze corruption:**
   ```bash
   node fix-specific-orders-now.js
   ```
4. **Restore from last good backup** or **fix individually**
5. **Re-enable webhooks**

---

### **If cleanup script fails:**

1. **Check MongoDB connection:**
   ```bash
   # Test connection
   mongosh "your-mongodb-uri"
   ```

2. **Check script errors:**
   - Verify `MONGODB_URI` is correct
   - Check network connectivity
   - Verify MongoDB permissions

3. **Manual cleanup:**
   ```javascript
   // In mongosh
   use leopardsmart
   db.orders.deleteMany({})  // ⚠️ DANGEROUS
   ```

---

## 📝 **LOGGING**

All scripts log to console. For production:

### **Redirect to file:**

```bash
# Windows PowerShell
node clean-test-database.js > cleanup-log-$(Get-Date -Format "yyyy-MM-dd-HHmm").txt

# Linux/Mac
node clean-test-database.js > cleanup-log-$(date +%Y-%m-%d-%H%M).txt
```

### **Example log file:**

```
cleanup-log-2024-10-29-2030.txt
```

---

## ✅ **BEST PRACTICES**

1. **Always backup before cleanup**
2. **Test scripts on sandbox first**
3. **Verify database after operations**
4. **Keep logs for audit trail**
5. **Document any manual fixes**
6. **Inform team before production cleanup**

---

## 🎯 **QUICK COMMANDS**

### **Clean everything (test only):**

```bash
$env:MONGODB_URI="your-uri"; node clean-test-database.js
```

### **Check orders:**

```bash
$env:MONGODB_URI="your-uri"; node fix-specific-orders-now.js
```

### **Full test suite:**

```bash
node test-all-6-products-paypal.js && node test-all-6-products-stripe.js
```

---

**Last Updated:** 2024-10-29  
**For Questions:** Check `PAYMENT_SYSTEM_REFERENCE.md`

