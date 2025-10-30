# 💳 Payment System Reference Guide

Quick reference for payment system maintenance and troubleshooting.

---

## 📦 **PRODUCTS & PRICING**

| Product ID | Name | MT4 Price | MT5 Price |
|-----------|------|-----------|-----------|
| `indicator-pro-mt4` / `indicator-pro-mt5` | Multi-Indicator Pro Pack | 1.990.000đ | 1.990.000đ |
| `ea-full-mt4` / `ea-full-mt5` | EA Full Version | 7.900.000đ | 7.900.000đ |
| `ea-pro-source-mt4` / `ea-pro-source-mt5` | EA Pro + Source Code | 14.900.000đ | 14.900.000đ |

**USD Conversion Rate:** 1 USD ≈ 24.000 VND

---

## 🔄 **PAYMENT FLOW**

### **1. User clicks "Buy Now":**
```
Frontend → /api/create-payment
├─ Stripe: Creates checkout session
└─ PayPal: Redirects to /api/paypal/create-order
```

### **2. Payment processed:**
```
Payment Gateway → Webhook
├─ PayPal: /api/webhooks/paypal
└─ Stripe: /api/webhooks/stripe
```

### **3. Webhook saves order:**
```
Webhook → MongoDB
├─ productId (e.g., 'ea-full-mt4')
├─ productName (e.g., 'EA Full Version (MT4)')
├─ amount (in cents, e.g., 790000000 = 7.9M VND)
├─ customerEmail
└─ orderId
```

### **4. Email sent:**
```
Webhook → nodemailer
└─ Email with download link
```

### **5. User downloads:**
```
User → /downloads → Click product
├─ Redirects to /api/verify-order?orderId=xxx
└─ Returns download URL
```

---

## 🔧 **KEY FILES**

| File | Purpose | Critical Code |
|------|---------|---------------|
| `app/api/create-payment/route.ts` | Creates payment sessions | Stripe metadata, PayPal order data |
| `app/api/paypal/create-order/route.ts` | PayPal order creation | `custom_id`, `reference_id`, amount conversion |
| `app/api/webhooks/paypal/route.ts` | PayPal webhook handler | Multi-strategy productId detection |
| `app/api/webhooks/stripe/route.ts` | Stripe webhook handler | Amount validation, auto-correction |
| `app/api/verify-order/route.ts` | Download verification | Checks MongoDB → Returns download URL |
| `lib/models/Order.ts` | MongoDB schema | Order structure |

---

## 🎯 **WEBHOOK LOGIC**

### **PayPal ProductId Detection (4 Strategies):**

```typescript
// 1. From custom_id (primary)
custom_id = "ea-full-mt4|affiliate123"
productId = "ea-full-mt4"

// 2. From reference_id (fallback)
reference_id = "ea-full-mt4"
productId = "ea-full-mt4"

// 3. From amount (last resort)
amountVND = 7900000
→ productId = "ea-full-mt4" (default to MT4)

// 4. MT5 detection from description
description = "EA Full Version MT5"
→ productId = "ea-full-mt5" (corrected from mt4)
```

### **Amount Validation:**

```typescript
const expectedPrices = {
  'ea-pro-source-mt4': 14900000,
  'ea-full-mt4': 7900000,
  'indicator-pro-mt4': 1990000,
  // ... MT5 versions
};

// If mismatch > 100K VND → Auto-correct productId
```

---

## 🧪 **TESTING**

### **Run Full Tests:**

```bash
# PayPal (24 scenarios)
node test-all-6-products-paypal.js

# Stripe (24 scenarios)
node test-all-6-products-stripe.js
```

### **Clean Test Database:**

```bash
$env:MONGODB_URI="your-mongodb-uri"
node clean-test-database.js
```

### **Check Specific Order:**

```bash
$env:MONGODB_URI="your-mongodb-uri"
node fix-specific-orders-now.js
```

---

## 🐛 **TROUBLESHOOTING**

### **Issue: Wrong amount in database**

**Symptoms:**
- Database shows 79.000đ instead of 7.900.000đ
- Email shows wrong amount

**Solution:**
1. Check webhook logs in Vercel
2. Look for "PRICE MISMATCH DETECTED"
3. Verify PayPal/Stripe sent correct amount
4. If webhook code is correct, old orders need manual fix

**Prevention:** Current code has amount validation ✅

---

### **Issue: Wrong product in database**

**Symptoms:**
- User bought MT5 but database shows MT4
- Download link doesn't match purchase

**Solution:**
1. Check PayPal order description for "MT5"
2. Check Stripe metadata for `productId`
3. Verify `custom_id` or `reference_id` correct

**Prevention:** 4-layer detection + MT5 description check ✅

---

### **Issue: Download link broken**

**Symptoms:**
- User clicks download → 404 or wrong file

**Solution:**
1. Check `productId` in database (must be valid)
2. Verify `/api/verify-order` returns correct URL
3. Check `downloads/page.tsx` has correct product mapping

**Valid productIds:**
```typescript
'indicator-pro-mt4', 'indicator-pro-mt5',
'ea-full-mt4', 'ea-full-mt5',
'ea-pro-source-mt4', 'ea-pro-source-mt5'
```

---

### **Issue: No email received**

**Symptoms:**
- Payment successful but no email

**Solution:**
1. Check webhook received by Vercel
2. Check SMTP credentials in env vars
3. Check spam folder
4. Re-send email manually using `resend-correct-emails.js`

---

## 📊 **DATABASE QUERIES**

### **Find order by email:**

```javascript
db.orders.find({ customerEmail: "user@example.com" })
```

### **Find orders with wrong amounts:**

```javascript
db.orders.find({
  $or: [
    { amount: { $lt: 1000000 } },  // Less than 1M cents
    { amount: { $eq: 7900000 } }   // 79K instead of 7.9M
  ]
})
```

### **Fix specific order:**

```javascript
db.orders.updateOne(
  { orderId: "ORDER_ID_HERE" },
  {
    $set: {
      productId: "ea-full-mt4",
      productName: "EA ThebenchmarkTrader Full Version (MT4)",
      amount: 790000000  // 7.9M in cents
    }
  }
)
```

---

## 🔐 **ENVIRONMENT VARIABLES**

### **Required:**

```bash
# MongoDB
MONGODB_URI=mongodb+srv://...

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...

# PayPal
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
PAYPAL_MODE=sandbox  # or 'live'

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=app-password
```

---

## 📝 **COMMON TASKS**

### **Add new product:**

1. Add to `downloads/page.tsx`:
```typescript
{
  id: 'new-product-mt4',
  name: 'New Product',
  price: 5000000,
  // ...
}
```

2. Add to webhook price validation:
```typescript
const expectedPrices = {
  'new-product-mt4': 5000000,
  'new-product-mt5': 5000000,
  // ...
};
```

3. Update `getProductById()` function

4. Test with both PayPal & Stripe

---

### **Change product price:**

1. Update `downloads/page.tsx`
2. Update webhook `expectedPrices`
3. Update frontend display
4. Test payment flow

---

### **Switch PayPal to production:**

1. Change `PAYPAL_MODE=live` in `.env.local`
2. Update `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET` to production keys
3. Test with small amount first
4. Monitor webhook logs

---

## 🚨 **MONITORING CHECKLIST**

### **Daily:**
- [ ] Check Vercel logs for webhook errors
- [ ] Check email delivery rate
- [ ] Monitor customer support for download issues

### **Weekly:**
- [ ] Verify database data integrity
- [ ] Check for price mismatches
- [ ] Review auto-correction logs

### **Monthly:**
- [ ] Run comprehensive tests
- [ ] Clean test data if any
- [ ] Update documentation

---

## 📞 **EMERGENCY CONTACTS**

### **If payment system down:**

1. Check Vercel deployment status
2. Check PayPal/Stripe dashboard for outages
3. Check MongoDB connection
4. Review recent code changes
5. Rollback if necessary: `git revert HEAD`

### **If customer can't download:**

1. Verify payment in PayPal/Stripe dashboard
2. Check MongoDB for order
3. If missing → Create manual order
4. Send email with download link manually

---

**Last Updated:** 2024-10-29  
**Maintained by:** Development Team

