# 🚨 FORCE VERCEL REBUILD - URGENT

## ❌ **PROBLEM:**

Code đã push nhưng webhook vẫn chạy OLD CODE:
- Order lúc 20:12 vẫn lưu `amount: 7900000` (SAI)
- Webhook không có log "PayPal Webhook ProductID Detection"
- Nghĩa là: File `app/api/webhooks/paypal/route.ts` CHƯA được deploy!

---

## 🔧 **SOLUTION: FORCE VERCEL REDEPLOY**

### **Option 1: Vercel Dashboard (FASTEST):**

1. Go to: https://vercel.com/your-project/deployments
2. Find deployment `7a03869`
3. Click **"..."** → **"Redeploy"**
4. Check **"Use existing Build Cache"** = **OFF** ← IMPORTANT!
5. Click **"Redeploy"**

This will force rebuild everything.

---

### **Option 2: Delete .vercel cache + Redeploy:**

```bash
# Delete Vercel cache folder
rm -rf .vercel

# Push again
git commit --allow-empty -m "chore: Force rebuild without cache"
git push origin main
```

---

### **Option 3: Change webhook file directly:**

Add a comment to force file change detection:

```typescript
// File: app/api/webhooks/paypal/route.ts
// Add at top:
// Force rebuild: 2024-10-29-21:15
```

Then push:
```bash
git add app/api/webhooks/paypal/route.ts
git commit -m "chore: Force webhook rebuild"
git push origin main
```

---

## 🔍 **VERIFY DEPLOYMENT:**

After redeploy, check Vercel logs for NEW order:

**Should see:**
```
🔍 PayPal Webhook ProductID Detection:
customId: ea-full-mt4|...
finalProductId: ea-full-mt4
amountVND: 7.900.000đ
detectionMethod: custom_id
```

**If you still see:**
```
productId: ea-full
amount: 7900000
```

Then: Vercel build cache is corrupted, need to contact Vercel support.

---

## 🎯 **ALTERNATIVE: Manual serverless function deployment:**

If nothing works, try:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy specific function
vercel --prod --force
```

This forces complete redeployment without cache.

---

## ⚠️ **ROOT CAUSE:**

Vercel sometimes caches serverless functions even when code changes.

**Common causes:**
1. Build cache not cleared
2. Edge cache holding old function
3. Incremental builds missing file changes
4. Serverless function cache not invalidated

**Solution:** Force complete rebuild without cache.

---

**DO THIS NOW:**
1. Go to Vercel Dashboard
2. Redeploy with cache OFF
3. Wait 2 minutes
4. Test new order
5. Check logs




