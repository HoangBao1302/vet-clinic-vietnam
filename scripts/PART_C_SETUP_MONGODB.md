# 🗄️ PART C: Setup MongoDB URI & Verify

## 🎯 Mục Đích

Setup MongoDB connection để có thể:
1. Check database trực tiếp
2. Verify migration results
3. Debug issues if any

---

## 🚀 Quick Method: Get URI From Vercel

### **Bước 1: Login Vercel**

1. Go to: https://vercel.com/
2. Login with your account
3. Select project: **thebenchmarktrader**

---

### **Bước 2: Find MongoDB URI**

1. Click **"Settings"** tab
2. Click **"Environment Variables"** in sidebar
3. Find: `MONGODB_URI`
4. Click eye icon (👁️) to reveal
5. Click **"Copy"** button

**You should see something like:**
```
mongodb+srv://username:password@cluster0.abc123.mongodb.net/thebenchmarktrader?retryWrites=true&w=majority
```

---

### **Bước 3: Update Local .env.local**

**Option A: Edit file manually**

1. Open `.env.local` in project root
2. Find line with `MONGODB_URI=`
3. Replace with URI from Vercel
4. Save file

**Example:**
```bash
# Before
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/...

# After (with real values from Vercel)
MONGODB_URI=mongodb+srv://realuser:RealP@ss123@cluster0.abc123.mongodb.net/thebenchmarktrader?retryWrites=true&w=majority
```

**Option B: Using PowerShell**

```powershell
# Backup current .env.local
Copy-Item .env.local .env.local.backup

# Set new URI (replace with your actual URI)
$uri = "mongodb+srv://user:pass@cluster0.abc123.mongodb.net/thebenchmarktrader?retryWrites=true&w=majority"

# Update .env.local
(Get-Content .env.local) -replace 'MONGODB_URI=.*', "MONGODB_URI=$uri" | Set-Content .env.local
```

---

### **Bước 4: Test Connection**

```bash
node scripts/check-paypal-orders.js
```

**Expected output (SUCCESS):**
```
🔍 Connecting to MongoDB...
✅ Connected to MongoDB

📦 Checking PayPal Orders...
Found X PayPal orders
```

**If error:**
```
❌ Error: querySrv ENOTFOUND
```
→ Check URI is correct
→ Verify no typos in password

---

### **Bước 5: Check HOANGKIM Affiliate**

```bash
node scripts/check-hoangkim-conversions.js
```

**Expected output:**
```
👤 Affiliate User:
   Username: hoangkim
   Affiliate Code: AFF-HOANGKIM-IBQ095
   Total Commission Earned: 2,370,000đ (or 7,110,000đ if migrated)
   Total Commission Paid: 0đ
   Available: 2,370,000đ

📊 All Clicks:
═══════════════════════════════════════════════════════

1. Click ID: 6789...
   Status: ✅ CONVERTED
   Product: EA ThebenchmarkTrader Full Version
   Commission: 2,370,000đ
   Customer: customer1@gmail.com

2. Click ID: 5678...
   Status: ⏳ CLICKED
   IP: 123.45.67.89

3. Click ID: 4567...
   Status: ⏳ CLICKED
   IP: 98.76.54.32

📈 SUMMARY:
Total Clicks: 3
Converted: 1
Not Converted: 2
Conversion Rate: 33.33%
Total Commission: 2,370,000đ
```

---

## 🔍 Understand the Output

### **Scenario 1: Correct (1 Order)**

```
Total Clicks: 3
Converted: 1
Commission: 2,370,000đ

→ This is CORRECT
→ 3 people clicked link
→ 1 person bought
→ No migration needed
```

---

### **Scenario 2: Need Migration (3 Orders)**

```
Total Clicks: 3
Converted: 1
Commission: 2,370,000đ

But you found 3 PayPal orders in Part A!

→ Need to migrate 2 missing orders
→ Expected after migration:
   Converted: 3
   Commission: 7,110,000đ
```

---

## 🔧 Alternative: Vercel CLI Method

### **Install Vercel CLI**

```bash
npm install -g vercel
```

---

### **Login**

```bash
vercel login
```

Follow prompts to authenticate.

---

### **Pull Environment Variables**

```bash
vercel env pull .env.local
```

This downloads ALL env variables from Vercel to `.env.local`.

**Benefits:**
- ✅ Automatic - no manual copy/paste
- ✅ Gets all variables
- ✅ Always up-to-date

---

### **Test Connection**

```bash
node scripts/check-paypal-orders.js
```

---

## 🛠️ Troubleshooting

### **Error: Authentication Failed**

```
MongoServerError: Authentication failed
```

**Solutions:**

1. **Check password:**
   - Copy URI again from Vercel
   - Passwords with special chars need encoding:
     ```
     @ → %40
     : → %3A
     / → %2F
     ? → %3F
     # → %23
     ```

2. **Example encoding:**
   ```
   Password: MyP@ss#123
   Encoded: MyP%40ss%23123
   ```

3. **Use Vercel CLI instead:**
   ```bash
   vercel env pull .env.local
   ```

---

### **Error: Connection Timeout**

```
Error: connect ETIMEDOUT
```

**Solutions:**

1. **Check internet connection**

2. **Check MongoDB Atlas Network Access:**
   - Login MongoDB Atlas
   - Network Access
   - Verify 0.0.0.0/0 is whitelisted
   - Or add your current IP

3. **Check firewall:**
   - Corporate firewall may block MongoDB ports
   - Try from different network

---

### **Error: Database Not Found**

```
Error: Database not found
```

**Solutions:**

1. **Check database name in URI:**
   ```
   mongodb+srv://...mongodb.net/thebenchmarktrader?...
                                 ↑ database name must be here
   ```

2. **Correct format:**
   ```
   ...mongodb.net/DATABASE_NAME?retryWrites...
   ```

---

### **Error: Cannot Find Module**

```
Error: Cannot find module 'dotenv'
```

**Solution:**
```bash
npm install dotenv
```

---

## 📊 After Migration Verification

### **Check 1: Database Changes**

```bash
node scripts/check-hoangkim-conversions.js
```

**Before migration:**
```
Converted: 1
Commission: 2,370,000đ
```

**After migration (expected):**
```
Converted: 3  ← Should increase
Commission: 7,110,000đ  ← Should increase
```

---

### **Check 2: Dashboard**

1. Open: https://thebenchmarktrader.com/affiliate/dashboard
2. Verify:
   - Conversions increased
   - Commission updated
   - Balance correct

---

### **Check 3: Affiliate Clicks Detail**

```bash
node scripts/check-paypal-orders.js
```

Look for:
```
👥 Affiliate Clicks Breakdown:
Affiliate: AFF-HOANGKIM-IBQ095 (hoangkim)
  Clicks: 3
  Converted: 3  ← Should match orders
  Total Commission: 7,110,000đ
```

---

## 💡 Using MongoDB Compass (GUI)

### **Bước 1: Download**

https://www.mongodb.com/products/compass

Install MongoDB Compass.

---

### **Bước 2: Connect**

1. Open Compass
2. Paste connection string from Vercel
3. Click "Connect"

---

### **Bước 3: Browse Collections**

1. Database: `thebenchmarktrader`
2. Collections:
   - `users` - Find HOANGKIM user
   - `affiliateclicks` - See all clicks/conversions
   - `orders` - See PayPal orders (if saved)

---

### **Bước 4: Query Data**

**Find HOANGKIM user:**
```javascript
{ affiliateCode: "AFF-HOANGKIM-IBQ095" }
```

**Find converted clicks:**
```javascript
{
  affiliateCode: "AFF-HOANGKIM-IBQ095",
  status: "converted"
}
```

**Count conversions:**
```javascript
// In aggregation pipeline
[
  { $match: { affiliateCode: "AFF-HOANGKIM-IBQ095" } },
  { $group: { _id: "$status", count: { $sum: 1 } } }
]
```

---

## 🎯 Final Verification Checklist

After migration, verify:

- [ ] Connected to MongoDB successfully
- [ ] Ran check script
- [ ] User `totalCommissionEarned` updated
- [ ] AffiliateClicks have correct status
- [ ] Conversions count matches orders
- [ ] Commission amount correct
- [ ] Dashboard displays correctly
- [ ] No duplicate commissions

---

## 📊 Expected Values

### **Before Migration:**
```javascript
User:
  totalCommissionEarned: 2,370,000
  totalCommissionPaid: 0

AffiliateClicks:
  { status: "converted", commissionAmount: 2,370,000 }
  { status: "clicked", commissionAmount: null }
  { status: "clicked", commissionAmount: null }

Dashboard:
  Conversions: 1
  Commission: 2,370,000đ
```

---

### **After Migration (If 3 Orders):**
```javascript
User:
  totalCommissionEarned: 7,110,000  ← Updated!
  totalCommissionPaid: 0

AffiliateClicks:
  { status: "converted", commissionAmount: 2,370,000 }
  { status: "converted", commissionAmount: 2,370,000 }  ← New!
  { status: "converted", commissionAmount: 2,370,000 }  ← New!

Dashboard:
  Conversions: 3  ← Updated!
  Commission: 7,110,000đ  ← Updated!
```

---

## 🚀 Commands Summary

```bash
# Get MongoDB URI from Vercel CLI
vercel env pull .env.local

# Or manually update .env.local
# Then test connection:

# Check all PayPal orders
node scripts/check-paypal-orders.js

# Check HOANGKIM specific data
node scripts/check-hoangkim-conversions.js

# After creating JSON (Part B), dry run:
node scripts/migrate-paypal-commissions.js --file=scripts/paypal-orders-hoangkim.json

# Apply migration:
node scripts/migrate-paypal-commissions.js --file=scripts/paypal-orders-hoangkim.json --apply

# Verify after migration:
node scripts/check-hoangkim-conversions.js
```

---

## ✅ Success Indicators

You're done when:

1. ✅ MongoDB connection works
2. ✅ Can see affiliate data in database
3. ✅ Commission amounts match expectations
4. ✅ Dashboard displays correctly
5. ✅ No errors in logs

---

## 🎉 Complete Flow Summary

```
Part A: Check PayPal
  ↓ Found 3 orders
  
Part B: Create JSON
  ↓ Created paypal-orders-hoangkim.json
  
Part C: Setup MongoDB & Verify
  ↓ Connected successfully
  ↓ Run migration
  ↓ Verify results
  
✅ DONE!
  - Dashboard: 3 conversions
  - Commission: 7,110,000đ
  - Can request payment (> 500k threshold)
```

---

## 📞 Still Need Help?

If issues persist:

1. **Check Vercel logs:**
   - Look for webhook errors
   - Check if orders were received

2. **Verify affiliate code:**
   - Must be exactly: `AFF-HOANGKIM-IBQ095`
   - Case sensitive!

3. **Check PayPal webhooks:**
   - Vercel → Settings → Domains
   - Webhook URL should be set

4. **Contact support:**
   - If can't resolve, may need admin access
   - Check with project owner

---

## 🎯 Next Steps

After successful migration:

1. **Monitor new orders:**
   - Check if tracking works automatically
   - Test with new purchase

2. **Request payment:**
   - If balance > 500,000đ
   - Go to affiliate dashboard
   - Click "Yêu Cầu Thanh Toán"

3. **Share more:**
   - Keep promoting affiliate link
   - Earn more commissions!

🚀 **Chúc mừng! You're all set!**

