# 🚨 KIETTONG ORDER ISSUE - FULL ANALYSIS & FIX PLAN

## 📊 Issue Summary

**Customer**: kiettong  
**Order Date**: Recent (need to check MongoDB)  
**Expected Purchase**: EA ThebenchmarkTrader Pro + Source Code (MT4) - 14.900.000đ  
**PayPal Payment**: $620.83 USD (≈ 14.9M VND)  
**Payment Status**: ✅ SUCCESS  

**Problems**:
1. ❌ Order code nhập vào không download được
2. ❌ Email nhận được báo sai sản phẩm: "EA ThebenchmarkTrader Full Version"
3. ❌ Email hiển thị sai số tiền: 79.000đ thay vì 14.900.000đ

---

## 🔍 Root Cause Analysis

### Issue #1: PayPal Webhook Lưu Sai ProductID và ProductName

**File**: `app/api/webhooks/paypal/route.ts`

**Problem**: 
- PayPal webhook nhận được order data từ PayPal
- Extract `productId` from `custom_id`: `body.resource?.purchase_units?.[0]?.custom_id`
- Format của custom_id là: `${productId}|${affiliateCode}`
- Nếu PayPal không trả về đúng custom_id, code sẽ set `productId = 'unknown'`
- Sau đó webhook dùng `productId` để lookup `productName` từ hardcoded mapping
- Nếu productId sai → productName sai → lưu vào DB sai → email sai

**Current Code** (lines 26-75):
```typescript
const customId = body.resource?.purchase_units?.[0]?.custom_id || 
                 body.resource?.custom_id || '';

const [productId, affiliateCode] = customId.split('|');

// Get product name with MT4/MT5 distinction
const productNames: Record<string, string> = {
  'indicator-pro-mt4': 'Multi-Indicator Pro Pack (MT4)',
  'ea-full-mt4': 'EA ThebenchmarkTrader Full Version (MT4)',
  'ea-pro-source-mt4': 'EA ThebenchmarkTrader Pro + Source Code (MT4)',
  ...
};
orderData.productName = productNames[productId] || 'Unknown Product';
```

**Issue**: Nếu `customId` là empty hoặc PayPal không gửi đúng format, `productId` sẽ undefined hoặc wrong value.

---

### Issue #2: Email Template Hiển Thị Sai Amount

**File**: `app/api/webhooks/paypal/route.ts` (lines 239-299)

**Problem**: 
```typescript
${amount > 0 ? `<p><strong>Số tiền:</strong> ${(amount / 100).toLocaleString('vi-VN')}₫</p>` : ''}
```

Amount trong PayPal webhook được tính:
```typescript
const amount = body.resource?.amount?.value 
  ? parseFloat(body.resource.amount.value) * 24000 * 100  // USD to VND cents
  : ...
```

Vấn đề: 
- PayPal trả về amount theo USD: $620.83
- Code convert: 620.83 * 24000 * 100 = 1,489,992,000 (cents)
- Email hiển thị: 1,489,992,000 / 100 = 14,899,920₫ ✅ (Đúng!)

NHƯNG nếu PayPal trả về amount theo VND hoặc có vấn đề conversion:
- 79.000đ = 7,900,000 cents → Có nghĩa là amount được lưu = 7,900,000 (không phải cents)
- Điều này cho thấy PayPal trả về amount theo format khác!

---

### Issue #3: Download Code Verification Fails

**File**: `app/api/verify-order/route.ts` (lines 64-423)

**Problem**: 
- User nhập order code → API verify order
- API check MongoDB → Found order với `productId = "ea-full-mt4"`
- User expect `productId = "ea-pro-source-mt4"`
- Validation at line 94-100:
  ```typescript
  if (requestedProductId !== order.productId) {
    return NextResponse.json(
      { verified: false, error: "Order is for a different product" },
      { status: 403 }
    );
  }
  ```
- Kết quả: Download FAILED vì productId không match!

---

## 🔧 FIX PLAN

### Fix #1: Improve PayPal Webhook ProductID Detection

**File**: `app/api/webhooks/paypal/route.ts`

**Strategy**: 
1. ✅ Try to get productId from custom_id (current)
2. ✅ If not found, try to get from reference_id
3. ✅ If still not found, detect from amount (USD or VND)
4. ✅ Add extensive logging for debugging

**Implementation**:
```typescript
// IMPROVED productId detection with multiple fallbacks
let productId = '';
const customId = body.resource?.purchase_units?.[0]?.custom_id || '';
const referenceId = body.resource?.purchase_units?.[0]?.reference_id || '';

// Strategy 1: Extract from custom_id
if (customId) {
  [productId] = customId.split('|');
}

// Strategy 2: Fallback to reference_id
if (!productId && referenceId) {
  productId = referenceId;
}

// Strategy 3: Detect from amount
if (!productId) {
  const amountUSD = parseFloat(body.resource?.purchase_units?.[0]?.amount?.value || '0');
  const amountVND = amountUSD * 24000;
  
  // Amount-based detection
  if (Math.abs(amountVND - 14900000) < 100000) {
    // Could be ea-pro-source, need to check if MT4 or MT5
    // Default to MT4 for backward compatibility
    productId = 'ea-pro-source-mt4';
    console.warn(`⚠️ ProductId detected from amount: ${productId} (${amountVND}đ)`);
  } else if (Math.abs(amountVND - 7900000) < 100000) {
    productId = 'ea-full-mt4';
    console.warn(`⚠️ ProductId detected from amount: ${productId} (${amountVND}đ)`);
  } else if (Math.abs(amountVND - 1990000) < 100000) {
    productId = 'indicator-pro-mt4';
    console.warn(`⚠️ ProductId detected from amount: ${productId} (${amountVND}đ)`);
  }
}

console.log('PayPal Webhook ProductID Detection:', {
  customId,
  referenceId,
  finalProductId: productId,
  detectionMethod: customId ? 'custom_id' : referenceId ? 'reference_id' : 'amount'
});
```

### Fix #2: Fix Email Amount Display

**File**: `app/api/webhooks/paypal/route.ts`

**Current Issue**: Amount calculation có thể sai vì PayPal có thể trả về nhiều format khác nhau.

**Fix**: 
```typescript
// Get amount with multiple strategies
const amountUSD = parseFloat(body.resource?.purchase_units?.[0]?.amount?.value || '0');
const amountVND = amountUSD * 24000; // Convert to VND
const amountCents = Math.round(amountVND * 100); // Convert to cents for storage

// In email, always display from VND directly (not from cents)
${amountVND > 0 ? `<p><strong>Số tiền:</strong> ${amountVND.toLocaleString('vi-VN')}₫</p>` : ''}
```

### Fix #3: Add Amount Validation in Webhook

**File**: `app/api/webhooks/paypal/route.ts`

**New Feature**: Validate that amount matches expected product price

```typescript
// After determining productId, validate amount
const expectedPrices: Record<string, number> = {
  'ea-pro-source-mt4': 14900000,
  'ea-pro-source-mt5': 14900000,
  'ea-full-mt4': 7900000,
  'ea-full-mt5': 7900000,
  'indicator-pro-mt4': 1990000,
  'indicator-pro-mt5': 1990000,
};

const expectedPrice = expectedPrices[productId];
if (expectedPrice && Math.abs(amountVND - expectedPrice) > 100000) {
  console.error('⚠️ PRICE MISMATCH:', {
    productId,
    expectedPrice,
    actualAmount: amountVND,
    difference: Math.abs(amountVND - expectedPrice)
  });
  
  // Auto-correct productId based on amount
  for (const [pid, price] of Object.entries(expectedPrices)) {
    if (Math.abs(amountVND - price) < 100000) {
      console.log(`✅ Auto-correcting productId from ${productId} to ${pid}`);
      productId = pid;
      break;
    }
  }
}
```

### Fix #4: Manual Database Fix for Kiettong's Order

**Action**: Update existing order in MongoDB

```javascript
// Run this script to fix kiettong's order
await Order.updateOne(
  { 
    customerEmail: 'kiettong@example.com', // Replace with actual email
    amount: 7900000 // Wrong amount
  },
  {
    $set: {
      productId: 'ea-pro-source-mt4',
      productName: 'EA ThebenchmarkTrader Pro + Source Code (MT4)',
      amount: 1489900000 // 14.899M VND in cents
    }
  }
);
```

---

## 📝 Implementation Checklist

- [ ] Fix PayPal webhook productId detection (multiple fallbacks)
- [ ] Fix email amount display
- [ ] Add amount validation in webhook
- [ ] Add extensive logging for debugging
- [ ] Manually fix kiettong's order in database
- [ ] Send correct email to kiettong manually
- [ ] Test entire flow with sandbox
- [ ] Deploy fixes to production

---

## 🧪 Testing Plan

1. **Test Case 1**: PayPal sandbox payment với custom_id đúng
2. **Test Case 2**: PayPal sandbox payment mà custom_id empty (test fallback)
3. **Test Case 3**: Verify order code sau khi thanh toán
4. **Test Case 4**: Check email content và amount
5. **Test Case 5**: Download file sau khi verify code

---

## 📧 Manual Email to Kiettong

After fixing the database:

```
Subject: ✅ Đơn hàng EA ThebenchmarkTrader Pro + Source Code đã được cập nhật

Xin chào kiettong,

Cảm ơn bạn đã mua EA ThebenchmarkTrader Pro + Source Code (MT4)!

Chúng tôi đã phát hiện và fix lỗi trong hệ thống. Đơn hàng của bạn đã được cập nhật đúng:

**Thông tin đơn hàng:**
- Sản phẩm: EA ThebenchmarkTrader Pro + Source Code (MT4)
- Mã đơn hàng: [ORDER_ID]
- Số tiền: 14.900.000đ
- Trạng thái: ✅ Đã thanh toán

**Download ngay:**
Truy cập: https://thebenchmarktrader.com/downloads
Nhập mã đơn hàng: [ORDER_ID]
Hoặc click link: [DIRECT_DOWNLOAD_LINK]

Xin lỗi vì sự bất tiện này!

Cần hỗ trợ? Liên hệ:
📧 support@thebenchmarktrader.com
📱 Telegram: t.me/+0ETUdIuYUzdhZWQ1
📞 Hotline: +84 765 452 515
```

---

**Status**: Ready to implement fixes
**Priority**: HIGH - Customer issue
**Estimated Time**: 30 minutes

