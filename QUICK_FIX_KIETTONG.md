# ⚡ Quick Fix Guide - Kiettong Issue

## 🎯 3 Bước Nhanh Để Fix

### 1️⃣ Deploy Code (5 phút)

```bash
git add app/api/webhooks/paypal/route.ts
git commit -m "fix: PayPal webhook productId detection"
git push origin main
```

Đợi Vercel auto-deploy (~2 phút)

---

### 2️⃣ Fix Database (2 phút)

```bash
# Set MongoDB URI
export MONGODB_URI="your-mongodb-uri-here"

# Run fix
node fix-kiettong-order.js
```

Script sẽ tự động:
- Tìm order có vấn đề
- Update đúng productId, productName, amount
- Show info để gửi email

---

### 3️⃣ Send Email (3 phút)

1. Mở `KIETTONG_CORRECTED_EMAIL_TEMPLATE.html`
2. Replace:
   - `[CUSTOMER_NAME]` → Tên khách hàng
   - `[ORDER_ID]` → Order ID (2 chỗ)
3. Send email với subject: `✅ Đơn hàng EA ThebenchmarkTrader đã được cập nhật`

---

## ✅ Verify Fix

1. Vào https://thebenchmarktrader.com/downloads
2. Nhập order code
3. Click "Xác thực"
4. **Expected**: Download bắt đầu ✅

---

## 📋 What Was Fixed?

### Before (❌):
```
ProductID: ea-full-mt4 (WRONG)
ProductName: EA Full Version (WRONG)  
Amount: 79.000đ (WRONG)
→ Download FAILED
```

### After (✅):
```
ProductID: ea-pro-source-mt4 (CORRECT)
ProductName: EA Pro + Source Code (MT4) (CORRECT)
Amount: 14.900.000đ (CORRECT)
→ Download WORKS ✅
```

---

## 🔍 Root Cause

**PayPal webhook không detect được productId từ custom_id**

**Fix**: Thêm 3 fallback strategies:
1. Try custom_id (primary)
2. Try reference_id (fallback 1)
3. Detect from amount (fallback 2)
+ Auto-correct nếu productId sai

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `app/api/webhooks/paypal/route.ts` | ✅ Fixed - Better productId detection |
| `fix-kiettong-order.js` | 🛠️ Script to fix database |
| `KIETTONG_CORRECTED_EMAIL_TEMPLATE.html` | 📧 Email template |
| `PAYPAL_DOWNLOAD_FIX_SUMMARY.md` | 📖 Full documentation |
| `test-paypal-download-flow.js` | 🧪 Test script |

---

## 🆘 Troubleshooting

**Issue**: MongoDB connection failed  
**Fix**: Set correct MONGODB_URI

**Issue**: Order not found  
**Fix**: Check customer email/name in script

**Issue**: Email not sent  
**Fix**: Check RESEND_API_KEY in Vercel

**Issue**: Download still fails  
**Fix**: Verify DB was updated, check Vercel logs

---

## 📞 Support

- 📧 support@thebenchmarktrader.com
- 📱 t.me/+0ETUdIuYUzdhZWQ1  
- 📞 +84 765 452 515

---

**Total Time**: ~10 minutes  
**Risk Level**: Low (only fixes existing bug)  
**Impact**: High (fixes customer issue + prevents future issues)  
**Status**: ✅ Ready to execute

