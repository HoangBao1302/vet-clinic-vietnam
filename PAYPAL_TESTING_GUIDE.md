# 🧪 PayPal Fix Testing Guide

## 📋 Quick Test Steps

### 1. **Make a Test Purchase**

1. Go to: `https://thebenchmarktrader.com/downloads`
2. Select a paid product (e.g., EA Pro + Source Code)
3. Click "Mua ngay"
4. Fill in checkout form:
   ```
   Email: haidangtong2612@gmail.com  ← Your REAL email
   Name: Hai Dang Tong
   Phone: 0900000000
   ```
5. Select **PayPal** payment method
6. Click "Thanh toán"

### 2. **Complete PayPal Payment**

1. Login to PayPal sandbox with test buyer account:
   ```
   Email: sb-xapgt47022791@personal.example.com
   Password: [sandbox password]
   ```
2. Approve payment
3. You'll be redirected to success page

### 3. **Verify Webhook Processing**

Go to Vercel Dashboard → Logs and look for:

#### ✅ Success Indicators:

```
📋 Customer info extracted from custom_id: {
  productId: 'ea-pro-source-mt4',
  affiliateCode: '',
  realCustomerEmail: 'haidangtong2612@gmail.com',  ← CORRECT
  realCustomerName: 'Hai Dang Tong',               ← CORRECT
  realCustomerPhone: '0900000000'                   ← CORRECT
}
```

```
✅ Using customer info: {
  email: 'haidangtong2612@gmail.com',
  name: 'Hai Dang Tong',
  phone: '0900000000',
  source: 'custom_id (real customer)'  ← CORRECT SOURCE
}
```

```
✅ PayPal order saved to MongoDB successfully: {
  orderId: '64N55898ED360661F',
  productId: 'ea-pro-source-mt4',
  customerEmail: 'haidangtong2612@gmail.com',  ← CORRECT
  customerName: 'Hai Dang Tong',
  amount: 1489920000
}
```

```
📧 Sending email to: haidangtong2612@gmail.com (real customer email)
```

```
✅ Email sent successfully to: haidangtong2612@gmail.com
```

#### ❌ Old Errors (Should NOT appear):

```
❌ Failed to save PayPal order to MongoDB  ← Should be FIXED
```

```
Email sent to: sb-xapgt47022791@personal.example.com  ← Should NOT happen
```

### 4. **Check Email Inbox**

1. Open email inbox: `haidangtong2612@gmail.com`
2. Look for email with subject: "✅ Thanh toán thành công - Download EA ThebenchmarkTrader"
3. Verify email contains:
   - Order ID: `64N55898ED360661F`
   - Product name: "EA ThebenchmarkTrader Pro + Source Code (MT4)"
   - Download button

### 5. **Verify MongoDB**

Check MongoDB database for the order:

```javascript
// MongoDB query
db.orders.findOne({ orderId: "64N55898ED360661F" })

// Expected result:
{
  _id: ObjectId("..."),
  orderId: "64N55898ED360661F",
  productId: "ea-pro-source-mt4",
  productName: "EA ThebenchmarkTrader Pro + Source Code (MT4)",
  customerEmail: "haidangtong2612@gmail.com",  ← CORRECT
  customerName: "Hai Dang Tong",                ← CORRECT
  customerPhone: "0900000000",                   ← CORRECT
  amount: 1489920000,
  paymentMethod: "paypal",
  status: "paid",
  createdAt: ISODate("..."),
  paidAt: ISODate("...")
}
```

---

## 🔍 Detailed Verification

### A. **Check custom_id Format**

In Vercel logs, look for the PayPal order creation:

```
PayPal order created with custom_id:
"ea-pro-source-mt4||haidangtong2612@gmail.com|Hai Dang Tong|0900000000"
```

**Format**: `productId|affiliateCode|email|name|phone`

### B. **Check Webhook Parsing**

Verify the webhook correctly parses custom_id:

```javascript
const parts = customId.split('|');
// parts[0] = 'ea-pro-source-mt4'
// parts[1] = ''
// parts[2] = 'haidangtong2612@gmail.com'  ← Real email
// parts[3] = 'Hai Dang Tong'              ← Real name
// parts[4] = '0900000000'                  ← Real phone
```

### C. **Check Email Recipient**

Verify email is sent to correct address:

```
📧 Sending email to: haidangtong2612@gmail.com (real customer email)
NOT: sb-xapgt47022791@personal.example.com
```

---

## 🐛 Troubleshooting

### Issue: Email still goes to sandbox email

**Check**:
1. Is `custom_id` being set correctly in create-order?
2. Is webhook parsing `custom_id` correctly?
3. Check logs for: `"📋 Customer info extracted from custom_id"`

**Solution**:
- Verify `app/api/paypal/create-order/route.ts` has the fix
- Deploy latest changes to Vercel
- Clear any caching

### Issue: MongoDB save still fails

**Check**:
1. Is `customerName` field optional in schema?
2. Check detailed error in logs
3. Verify MongoDB connection

**Solution**:
- Verify `lib/models/Order.ts` has updated schema
- Check MongoDB connection string
- Look for duplicate order errors (this is OK, means order already exists)

### Issue: No logs appearing

**Check**:
1. Is webhook URL configured in PayPal?
2. Is webhook being triggered?
3. Check Vercel function logs

**Solution**:
- Verify webhook URL: `https://thebenchmarktrader.com/api/webhooks/paypal`
- Check PayPal webhook events are enabled
- Test webhook manually from PayPal dashboard

---

## 📊 Test Results Template

```
✅ Test Date: [DATE]
✅ Order ID: [ORDER_ID]
✅ Customer Email Used: haidangtong2612@gmail.com

Results:
[ ] custom_id contains customer info
[ ] Webhook extracts customer info correctly
[ ] Order saved to MongoDB with correct email
[ ] Email sent to correct address (haidangtong2612@gmail.com)
[ ] Email received in inbox
[ ] No MongoDB save errors

Status: ✅ PASS / ❌ FAIL

Notes:
[Any additional observations]
```

---

## 🚀 Production Checklist

Before going live:

- [ ] Test with sandbox (multiple times)
- [ ] Verify all emails go to correct addresses
- [ ] Verify MongoDB saves correctly
- [ ] Check no errors in Vercel logs
- [ ] Update PayPal webhook URL to production
- [ ] Switch PayPal mode from sandbox to live
- [ ] Test with real PayPal account (small amount)
- [ ] Verify production email delivery

---

## 📞 Support

If issues persist:
- Check Vercel logs: `https://vercel.com/[project]/logs`
- Check MongoDB: `https://cloud.mongodb.com`
- Check PayPal webhooks: `https://developer.paypal.com/dashboard/webhooks`

**Contact**: support@thebenchmarktrader.com

