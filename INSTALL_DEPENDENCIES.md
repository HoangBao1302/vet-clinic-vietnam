# 📦 Install Required Dependencies

## ⚠️ Lỗi Hiện Tại

Bạn đang thấy linter errors vì chưa cài đặt packages cần thiết:

```
Cannot find module 'stripe'
Cannot find module '@paypal/checkout-server-sdk'
```

---

## 🚀 Cách Sửa (2 Phút)

### **Chạy lệnh sau:**

```bash
npm install stripe @paypal/checkout-server-sdk resend
```

**Giải thích:**
- `stripe` - Stripe payment integration
- `@paypal/checkout-server-sdk` - PayPal payment integration
- `resend` - Email service (đã có, reinstall để ensure)

---

## ✅ Sau Khi Install

### **1. Lỗi sẽ biến mất**
All linter errors sẽ được fix

### **2. Create `.env.local`**

```bash
# Stripe Keys (Get from https://stripe.com → Dashboard → API Keys)
STRIPE_SECRET_KEY=sk_test_51...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51...
STRIPE_WEBHOOK_SECRET=whsec_...

# PayPal Keys (Get from https://developer.paypal.com)
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
PAYPAL_MODE=sandbox

# Resend Email (Already have)
RESEND_API_KEY=re_...
RESEND_FROM=downloads@thebenchmarktrader.com

# App Config
NEXT_PUBLIC_BASE_URL=http://localhost:3000
DOWNLOAD_SECRET=random-secret-key-123
```

### **3. Test System**

```bash
npm run dev
```

Visit:
- Downloads page: `http://localhost:3000/downloads`
- Test free download: Click any PDF
- Test checkout: Click "Mua với Stripe"

---

## 🔑 Get Stripe Keys (Free)

### **Step 1: Create Account**
1. Go to https://stripe.com
2. Sign up (free)
3. Complete verification

### **Step 2: Get Test Keys**
1. Dashboard → Developers → API Keys
2. **Publishable key:** `pk_test_51...` (starts with pk_test)
3. **Secret key:** `sk_test_51...` (starts with sk_test)

### **Step 3: Get Webhook Secret**
1. Dashboard → Webhooks
2. Add endpoint: `http://localhost:3000/api/webhooks/stripe` (local testing)
3. Select event: `checkout.session.completed`
4. Copy **Signing secret:** `whsec_...`

### **For Production:**
- Use live keys: `pk_live_...` and `sk_live_...`
- Update webhook to production URL

---

## 💰 Get PayPal Keys (Optional)

### **Step 1: Developer Account**
1. Go to https://developer.paypal.com
2. Login with PayPal account
3. Create App

### **Step 2: Get Credentials**
1. Dashboard → My Apps & Credentials
2. Create App → Name: "EA ThebenchmarkTrader"
3. Copy **Client ID** and **Secret**

### **Step 3: Test**
- Sandbox mode for testing
- Live mode for production
- Create sandbox buyer account for testing

---

## 📁 File Upload

Upload your files to: `public/downloads/files/`

**Required files:**

### PDF Guides (Free):
- `Installation-Guide.pdf`
- `Parameter-Guide.pdf`
- `Broker-Setup-Guide.pdf`

### Free Products:
- `SR-Indicator-Free.ex4`
- `TrendLines-Free.ex4`
- `ThebenchmarkTrader-Demo.ex4`

### Paid Products:
- `Indicator-Pro-Pack.zip`
- `ThebenchmarkTrader-Full.ex4`
- `ThebenchmarkTrader-Pro-Source.zip`

---

## 🧪 Testing

### **Test Free Downloads:**
1. Go to `/downloads`
2. Click "Tải xuống" on any PDF
3. File should download immediately

### **Test Stripe Payment:**
1. Go to `/downloads`
2. Click "Mua với Stripe" on EA Full
3. Fill checkout form
4. Use test card: `4242 4242 4242 4242`
5. Expiry: Any future date
6. CVC: Any 3 digits
7. Complete payment
8. Should redirect to success page
9. Check email for order code
10. Go back to `/downloads`
11. Enter order code → Download

### **Test Order Verification:**
1. Copy order ID from email
2. Go to `/downloads`
3. Scroll to paid product
4. Enter order code
5. Click "Xác thực"
6. Should allow download

---

## 🎯 Quick Commands

```bash
# Install dependencies
npm install stripe @paypal/checkout-server-sdk resend

# Run dev server
npm run dev

# Build production
npm run build

# Start production
npm start
```

---

## 📊 Payment Test Cards

### **Stripe Test Cards:**

| Card Number         | Scenario              |
|---------------------|-----------------------|
| 4242 4242 4242 4242 | Success              |
| 4000 0000 0000 0002 | Declined             |
| 4000 0027 6000 3184 | 3D Secure required   |
| 4000 0000 0000 9995 | Insufficient funds   |

**Expiry:** Any future date (e.g., 12/25)
**CVC:** Any 3 digits (e.g., 123)
**ZIP:** Any 5 digits (e.g., 12345)

---

## ✅ Checklist Before Production

- [ ] Install npm packages
- [ ] Add environment variables
- [ ] Upload all files
- [ ] Test free downloads
- [ ] Test Stripe payment (test mode)
- [ ] Test PayPal payment (sandbox)
- [ ] Test order verification
- [ ] Test email delivery
- [ ] Switch to live keys
- [ ] Update webhook URLs to production
- [ ] Test one real payment
- [ ] Monitor webhook logs
- [ ] Set up refund policy
- [ ] Set up customer support

---

## 📞 Support Resources

**Documentation:**
- Full setup: `PAYMENT_DOWNLOADS_SETUP.md`
- Summary: This file
- Stripe docs: https://stripe.com/docs/payments/checkout
- PayPal docs: https://developer.paypal.com/docs/checkout

**Need Help?**
- Stripe support: https://support.stripe.com
- PayPal support: https://developer.paypal.com/support
- Email: support@thebenchmarktrader.com

---

## 💡 Pro Tips

### **Testing:**
- Always test with Stripe test mode first
- Use webhook localhost forwarding (Stripe CLI)
- Check webhook logs in Stripe dashboard

### **Production:**
- Enable Stripe Radar (fraud detection)
- Set up email notifications
- Monitor failed payments
- Review refund requests

### **UX:**
- Clear payment flow
- Multiple payment methods
- Instant download after payment
- Good error messages
- Support contact visible

---

## 🎁 Bonus Features Included

✅ **Email notifications** with download link
✅ **Order verification** system
✅ **Dual payment** (Stripe + PayPal)
✅ **Success page** with order info
✅ **File storage** structure
✅ **Security** - webhook verification
✅ **Database** - orders tracking

---

**Status:** 🟡 Needs npm install
**Time to Fix:** 2 minutes
**Command:** `npm install stripe @paypal/checkout-server-sdk resend`

---

**Last Updated:** October 3, 2025

