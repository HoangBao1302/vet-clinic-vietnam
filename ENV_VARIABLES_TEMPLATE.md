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
RESEND_FROM=downloads@leopardsmart.com
RESEND_TO=support@leopardsmart.com

# ============================================
# APP CONFIGURATION
# ============================================
NEXT_PUBLIC_BASE_URL=http://localhost:3000
DOWNLOAD_SECRET=your-random-secret-key-here

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

---

**File:** `.env.local` (create in project root)
**Security:** Never share or commit this file

