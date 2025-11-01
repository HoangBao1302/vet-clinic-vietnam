# 🔐 Environment Variables Template

Copy this content to `.env.local` file in project root:

```bash
# ============================================
# STRIPE PAYMENT
# ============================================
# Get from: https://stripe.com → Dashboard → API Keys
STRIPE_SECRET_KEY=sk_test_51xxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51xxxxxxxxxxxxx

# Get from: Dashboard → Webhooks → Add Endpoint
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# ============================================
# PAYPAL PAYMENT  
# ============================================
# Get from: https://developer.paypal.com
PAYPAL_CLIENT_ID=xxxxxxxxxxxxx
PAYPAL_CLIENT_SECRET=xxxxxxxxxxxxx
PAYPAL_MODE=sandbox

# ============================================
# EMAIL (RESEND)
# ============================================
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM=downloads@thebenchmarktrader.com
RESEND_TO=support@thebenchmarktrader.com

# ============================================
# APP CONFIGURATION
# ============================================
NEXT_PUBLIC_BASE_URL=http://localhost:3000
DOWNLOAD_SECRET=your-random-secret-key-here

# ============================================
# GOOGLE RECAPTCHA v3 (Bot Protection)
# ============================================
# Get from: https://www.google.com/recaptcha/admin/create
# Type: v3 (Invisible)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Lcxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
RECAPTCHA_SECRET_KEY=6Lcxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ============================================
# EMAIL VERIFICATION SERVICE (Optional - Cấp 3)
# ============================================
# Choose one: ZeroBounce, NeverBounce, or EmailListVerify
ZEROBOUNCE_API_KEY=your-zerobounce-api-key
# OR
NEVERBOUNCE_API_KEY=your-neverbounce-api-key
# OR
EMAILLISTVERIFY_API_KEY=your-emaillistverify-api-key

# ============================================
# ADMIN (Optional)
# ============================================
ADMIN_SECRET=your-admin-password
```

---

## 📝 How to Use

1. Create file `.env.local` in project root
2. Copy content above
3. Replace `xxxxx` with your actual keys
4. Never commit `.env.local` to git (already in .gitignore)

---

## 🔑 Get API Keys

### **Stripe:**
→ https://stripe.com → Sign up → Dashboard → API Keys

### **PayPal:**
→ https://developer.paypal.com → Create App → Get credentials

### **Resend:**
→ https://resend.com → Sign up → API Keys

### **Google reCAPTCHA:**
→ https://www.google.com/recaptcha/admin/create
→ Select **v3** type
→ Add domains: `localhost`, `thebenchmarktrader.com`

### **Email Verification Services (Optional):**
- **ZeroBounce:** https://www.zerobounce.net/ (Free 100/month)
- **NeverBounce:** https://neverbounce.com/ (Free 1,000/month)
- **EmailListVerify:** https://www.emaillistverify.com/ (Rẻ nhất)

---

**File:** `.env.local` (create in project root)
**Security:** Never share or commit this file

---

## 📚 Xem thêm:
- `BOT_PROTECTION_SETUP.md` - Hướng dẫn chi tiết bảo vệ bot

