# 📋 QUY TRÌNH QUẢN LÝ SẢN PHẨM - HƯỚNG DẪN CHI TIẾT

**Date:** October 30, 2025  
**Purpose:** Hướng dẫn thay đổi giá, tên, nội dung email, chuyển từ sandbox → live

---

## 🎯 1. THÔNG TIN SẢN PHẨM HIỆN TẠI

### **MT4 Products (3 sản phẩm):**
```
1. Multi-Indicator Pro Pack (MT4)
   - Product ID: indicator-pro-mt4
   - Giá: 1.990.000đ
   
2. EA ThebenchmarkTrader Full Version (MT4)
   - Product ID: ea-full-mt4
   - Giá: 7.900.000đ
   
3. EA ThebenchmarkTrader Pro + Source Code (MT4)
   - Product ID: ea-pro-source-mt4
   - Giá: 14.900.000đ
```

### **MT5 Products (3 sản phẩm):**
```
1. Multi-Indicator Pro Pack (MT5)
   - Product ID: indicator-pro-mt5
   - Giá: 1.990.000đ
   
2. EA ThebenchmarkTrader Full Version (MT5)
   - Product ID: ea-full-mt5
   - Giá: 7.900.000đ
   
3. EA ThebenchmarkTrader Pro + Source Code (MT5)
   - Product ID: ea-pro-source-mt5
   - Giá: 14.900.000đ
```

---

## 📝 2. THAY ĐỔI GIÁ SẢN PHẨM

### **Bước 1: Frontend (Hiển thị giá cho khách)**

**File cần sửa:** `app/pricing/page.tsx`

**Tìm đoạn:**
```typescript
const products = [
  {
    id: "indicator-pro-mt4",
    name: "Multi-Indicator Pro Pack",
    price: 1990000, // ← THAY ĐỔI GIÁ TẠI ĐÂY
    ...
  }
]
```

**Cách sửa:**
1. Mở file `app/pricing/page.tsx`
2. Tìm array `products`
3. Thay đổi `price: 1990000` → `price: 2500000` (ví dụ)
4. Lưu file

---

### **Bước 2: Backend - Webhook Validation (Quan trọng!)**

**Các file cần sửa:**

#### **File 1: PayPal Webhook**
**Đường dẫn:** `app/api/webhooks/paypal/route.ts`

**Tìm đoạn:**
```typescript
const expectedPrices: Record<string, number> = {
  'ea-pro-source-mt4': 14900000, // ← THAY ĐỔI GIÁ
  'ea-pro-source-mt5': 14900000,
  'ea-full-mt4': 7900000,
  'ea-full-mt5': 7900000,
  'indicator-pro-mt4': 1990000,
  'indicator-pro-mt5': 1990000,
};
```

**Tại dòng:** ~242-248

---

#### **File 2: Stripe Webhook**
**Đường dẫn:** `app/api/webhooks/stripe/route.ts`

**Tìm đoạn:**
```typescript
const expectedPrices: Record<string, number> = {
  'ea-pro-source-mt4': 14900000, // ← THAY ĐỔI GIÁ
  'ea-pro-source-mt5': 14900000,
  'ea-full-mt4': 7900000,
  'ea-full-mt5': 7900000,
  'indicator-pro-mt4': 1990000,
  'indicator-pro-mt5': 1990000,
};
```

**Tại dòng:** ~64-71

---

#### **File 3: Stripe Create Payment**
**Đường dẫn:** `app/api/create-payment/route.ts`

**Tìm đoạn:**
```typescript
// Validate amount matches expected price
const expectedPrices: Record<string, number> = {
  'ea-pro-source-mt4': 14900000,
  'ea-pro-source-mt5': 14900000,
  'ea-full-mt4': 7900000,
  'ea-full-mt5': 7900000,
  'indicator-pro-mt4': 1990000,
  'indicator-pro-mt5': 1990000,
};
```

**Tại dòng:** ~22-29

---

### **Bước 3: Affiliate Commission Rates**

**Nếu thay đổi commission %**, sửa trong:

#### **PayPal Webhook:**
```typescript
const commissionRates: Record<string, number> = {
  'indicator-pro-mt4': affiliate.isPaid ? 0.35 : 0.30, // 35% hoặc 30%
  'ea-full-mt4': affiliate.isPaid ? 0.35 : 0.30,
  'ea-pro-source-mt4': affiliate.isPaid ? 0.35 : 0.30,
  ...
};
```

**Tại:** `app/api/webhooks/paypal/route.ts` dòng ~506-521

#### **Stripe Webhook:**
```typescript
const commissionRates = {
  'indicator-pro-mt4': affiliate.isPaid ? 0.35 : 0.30,
  'ea-full-mt4': affiliate.isPaid ? 0.35 : 0.30,
  'ea-pro-source-mt4': affiliate.isPaid ? 0.35 : 0.30,
  ...
};
```

**Tại:** `app/api/webhooks/stripe/route.ts` dòng ~255-270

---

## 🏷️ 3. THAY ĐỔI TÊN SẢN PHẨM

### **Bước 1: Frontend (Pricing Page)**

**File:** `app/pricing/page.tsx`

**Tìm:**
```typescript
{
  name: "EA ThebenchmarkTrader Full Version", // ← THAY ĐỔI TÊN
  description: "Phiên bản đầy đủ...",
  ...
}
```

---

### **Bước 2: Product Name Mapping (Webhooks & Emails)**

**Cần sửa ở 2 webhooks:**

#### **PayPal Webhook:**
**File:** `app/api/webhooks/paypal/route.ts`

**Tìm 2 chỗ:**

**Chỗ 1** (dòng ~313-330):
```typescript
const productNames: Record<string, string> = {
  // MT4 Products
  'indicator-pro-mt4': 'Multi-Indicator Pro Pack (MT4)', // ← THAY TÊN
  'ea-full-mt4': 'EA ThebenchmarkTrader Full Version (MT4)',
  'ea-pro-source-mt4': 'EA ThebenchmarkTrader Pro + Source Code (MT4)',
  // MT5 Products
  'indicator-pro-mt5': 'Multi-Indicator Pro Pack (MT5)',
  'ea-full-mt5': 'EA ThebenchmarkTrader Full Version (MT5)',
  'ea-pro-source-mt5': 'EA ThebenchmarkTrader Pro + Source Code (MT5)',
};
```

**Chỗ 2** (dòng ~527-542) - Giống y chang, sửa luôn!

---

#### **Stripe Webhook:**
**File:** `app/api/webhooks/stripe/route.ts`

**Tìm 3 chỗ:**

**Chỗ 1** (dòng ~89-96):
```typescript
const productNames: Record<string, string> = {
  'indicator-pro-mt4': 'Multi-Indicator Pro Pack (MT4)',
  'ea-full-mt4': 'EA ThebenchmarkTrader Full Version (MT4)',
  ...
};
```

**Chỗ 2** (dòng ~326-338) - Trong virtual click

**Chỗ 3** (dòng ~337-351) - Email template

---

## 📧 4. CHỈNH SỬA NỘI DUNG EMAIL

### **Email được gửi từ 2 webhooks:**

#### **PayPal Email Template**
**File:** `app/api/webhooks/paypal/route.ts`
**Dòng:** ~590-669

**Tìm đoạn HTML:**
```html
<h1 style="margin: 0; font-size: 32px;">🎉 Thanh toán thành công!</h1>
```

**Có thể sửa:**
- Tiêu đề email
- Nội dung cảm ơn
- Hướng dẫn cài đặt
- Thông tin liên hệ
- Button "Tải xuống ngay"

**Lưu ý:** Email có 2 phần:
- **MT4 version:** Hướng dẫn copy file `.ex4` vào `MT4/MQL4/Experts`
- **MT5 version:** Hướng dẫn copy file `.ex5` vào `MT5/MQL5/Experts`

Code tự động detect MT5 qua:
```typescript
${productId?.includes('mt5') ? `... MT5 instructions ...` : `... MT4 instructions ...`}
```

---

#### **Stripe Email Template**
**File:** `app/api/webhooks/stripe/route.ts`
**Dòng:** ~358-420

**Tương tự PayPal**, có thể sửa:
- Tiêu đề
- Nội dung
- Hướng dẫn cài đặt (MT4/MT5)
- Link download
- Thông tin support

---

### **Nội dung có thể tùy chỉnh:**

```html
<!-- Tiêu đề -->
<h1>🎉 Thanh toán thành công!</h1>

<!-- Cảm ơn -->
<h2>Cảm ơn bạn đã mua hàng!</h2>

<!-- Hướng dẫn -->
<h3>📋 Hướng dẫn cài đặt:</h3>
<ol>
  <li>Giải nén file (nếu là .zip)</li>
  <li>Copy file .ex4/.ex5 vào thư mục...</li>
  <li>Restart MetaTrader</li>
  <li>Drag EA lên chart</li>
</ol>

<!-- Support -->
<h3>Cần hỗ trợ?</h3>
<ul>
  <li>📧 Email: support@thebenchmarktrader.com</li>
  <li>📱 Telegram: t.me/+0ETUdIuYUzdhZWQ1</li>
  <li>📞 Hotline: +84 765 452 515</li>
</ul>
```

---

## 📦 5. THAY ĐỔI FILE DOWNLOAD

### **Download Files Location**

**File:** `app/downloads/page.tsx`
**Dòng:** ~20-107

**Tìm array `downloads`:**
```typescript
const downloads = [
  {
    id: "indicator-pro-mt4",
    name: "Multi-Indicator Pro Pack",
    platform: "MT4",
    version: "v5.0 Pro",
    size: "2.8 MB",
    downloadUrl: "/files/ThebenchmarkTrader-Indicators-Pro-MT4.ex4", // ← THAY ĐỔI LINK
    description: "Bộ 10 indicators chuyên nghiệp...",
    icon: "📊",
  },
  {
    id: "ea-full-mt4",
    name: "EA ThebenchmarkTrader Full Version",
    platform: "MT4",
    version: "v2.0 Full",
    size: "680 KB",
    downloadUrl: "/files/ThebenchmarkTrader-Full-MT4.ex4", // ← THAY ĐỔI LINK
    description: "Phiên bản đầy đủ...",
    icon: "🤖",
  },
  // ... các sản phẩm khác
];
```

---

### **Cách upload file mới:**

**Bước 1:** Chuẩn bị file
```
- ThebenchmarkTrader-Full-MT4.ex4
- ThebenchmarkTrader-Full-MT5.ex5
- ThebenchmarkTrader-Pro-Source-MT4.zip
- etc.
```

**Bước 2:** Upload vào `/public/files/`
```
public/
  files/
    ThebenchmarkTrader-Full-MT4.ex4
    ThebenchmarkTrader-Full-MT5.ex5
    ThebenchmarkTrader-Pro-Source-MT4.zip
    ThebenchmarkTrader-Pro-Source-MT5.zip
    ThebenchmarkTrader-Indicators-Pro-MT4.ex4
    ThebenchmarkTrader-Indicators-Pro-MT5.ex5
```

**Bước 3:** Cập nhật `downloadUrl` trong `app/downloads/page.tsx`

**Bước 4:** Commit và push lên GitHub

---

## 🔄 6. CHUYỂN TỪ SANDBOX → LIVE (PRODUCTION)

### **QUAN TRỌNG: Checklist trước khi chuyển live**

#### **A. PayPal Setup**

**Bước 1: Tạo PayPal Business Account (Live)**
1. Truy cập: https://www.paypal.com/businessmanage
2. Tạo Business Account (nếu chưa có)
3. Xác thực thông tin doanh nghiệp
4. Thêm tài khoản ngân hàng

**Bước 2: Lấy Live API Credentials**
1. Truy cập: https://developer.paypal.com/dashboard
2. Chuyển từ "Sandbox" → "Live" (toggle ở góc trên)
3. Click "Apps & Credentials"
4. Tạo hoặc chọn app của bạn
5. Copy:
   - **Client ID** (live)
   - **Secret** (live)

**Bước 3: Setup Webhook Live**
1. Vẫn trong dashboard PayPal
2. Click "Webhooks" (bên trái)
3. Click "Add Webhook"
4. Webhook URL: `https://thebenchmarktrader.com/api/webhooks/paypal`
5. Event types chọn:
   - ✅ `CHECKOUT.ORDER.APPROVED`
   - ✅ `PAYMENT.CAPTURE.COMPLETED`
6. Save → Copy **Webhook ID**

**Bước 4: Cập nhật Environment Variables**

**Trên Vercel:**
1. Vào project → Settings → Environment Variables
2. Sửa:
   ```
   PAYPAL_CLIENT_ID=<Live Client ID>
   PAYPAL_CLIENT_SECRET=<Live Secret>
   PAYPAL_MODE=live  ← QUAN TRỌNG! Đổi từ "sandbox" sang "live"
   NEXT_PUBLIC_PAYPAL_CLIENT_ID=<Live Client ID>
   ```
3. Redeploy project

---

#### **B. Stripe Setup**

**Bước 1: Activate Stripe Account**
1. Truy cập: https://dashboard.stripe.com
2. Click "Activate your account"
3. Điền thông tin:
   - Business details
   - Bank account (nhận tiền)
   - Tax information
4. Submit for review

**Bước 2: Lấy Live API Keys**
1. Sau khi được approved
2. Dashboard → Developers → API Keys
3. Chuyển từ "Test mode" → "Live mode" (toggle góc trên)
4. Copy:
   - **Publishable key** (pk_live_...)
   - **Secret key** (sk_live_...)

**Bước 3: Setup Webhook Live**
1. Developers → Webhooks
2. Add endpoint: `https://thebenchmarktrader.com/api/webhooks/stripe`
3. Select events:
   - ✅ `checkout.session.completed`
4. Save → Copy **Signing secret** (whsec_...)

**Bước 4: Cập nhật Environment Variables**

**Trên Vercel:**
1. Settings → Environment Variables
2. Sửa:
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_... ← LIVE KEY
   STRIPE_SECRET_KEY=sk_live_... ← LIVE KEY
   STRIPE_WEBHOOK_SECRET=whsec_... ← LIVE WEBHOOK SECRET
   ```
3. Redeploy

---

### **C. Testing Checklist (SAU KHI CHUYỂN LIVE)**

**Test PayPal:**
- [ ] Checkout flow works
- [ ] Real payment deducted from real bank account
- [ ] Webhook received and logged in Vercel
- [ ] Order saved to MongoDB with correct data
- [ ] Email sent to customer with correct order ID
- [ ] Download works on `/downloads` page
- [ ] Affiliate commission tracked (if applicable)

**Test Stripe:**
- [ ] Checkout flow works
- [ ] Real payment deducted from real card
- [ ] Webhook received and logged in Vercel
- [ ] Order saved to MongoDB
- [ ] Email sent correctly
- [ ] Download works
- [ ] Affiliate commission tracked

**QUAN TRỌNG:**
- ⚠️ Test với số tiền NHỎ trước (sản phẩm rẻ nhất)
- ⚠️ Kiểm tra Vercel Logs: Logs → Runtime Logs
- ⚠️ Kiểm tra MongoDB: Database có order mới
- ⚠️ Kiểm tra email: Nội dung, link, format

---

## 📋 7. CHECKLIST TOÀN BỘ (KHI THAY ĐỔI SẢN PHẨM)

### **Khi thêm/sửa sản phẩm mới:**

#### **Frontend:**
- [ ] `app/pricing/page.tsx` - Thêm sản phẩm vào array
- [ ] `app/downloads/page.tsx` - Thêm download info
- [ ] Upload file mới vào `/public/files/`

#### **Backend (Price Validation):**
- [ ] `app/api/webhooks/paypal/route.ts` - expectedPrices (dòng ~242)
- [ ] `app/api/webhooks/stripe/route.ts` - expectedPrices (dòng ~64)
- [ ] `app/api/create-payment/route.ts` - expectedPrices (dòng ~22)

#### **Backend (Product Names):**
- [ ] `app/api/webhooks/paypal/route.ts` - productNames (2 chỗ: dòng ~313, ~527)
- [ ] `app/api/webhooks/stripe/route.ts` - productNames (3 chỗ: dòng ~89, ~326, ~337)

#### **Backend (Commission Rates):**
- [ ] `app/api/webhooks/paypal/route.ts` - commissionRates (dòng ~506)
- [ ] `app/api/webhooks/stripe/route.ts` - commissionRates (dòng ~255)

#### **Email Templates:**
- [ ] `app/api/webhooks/paypal/route.ts` - HTML email (dòng ~590-669)
- [ ] `app/api/webhooks/stripe/route.ts` - HTML email (dòng ~358-420)

#### **Testing:**
- [ ] Test sandbox payment
- [ ] Check Vercel logs
- [ ] Check MongoDB order data
- [ ] Check email received
- [ ] Test download
- [ ] Test affiliate commission

---

## 🚨 8. LƯU Ý QUAN TRỌNG

### **Khi thay đổi GIÁ:**
✅ **PHẢI SỬA Ở 3 NƠI:**
1. Frontend (pricing page) - Hiển thị cho khách
2. Backend webhooks - Validate price
3. Create payment API - Validate price

❌ **Nếu không sửa cả 3:**
- Khách thấy giá mới nhưng checkout giá cũ
- Hoặc webhook reject vì price mismatch
- Hoặc order bị lưu sai giá

---

### **Khi thay đổi TÊN:**
✅ **PHẢI SỬA Ở 5 NƠI:**
1. Frontend (pricing page)
2. Frontend (downloads page)
3. PayPal webhook productNames (2 chỗ)
4. Stripe webhook productNames (3 chỗ)

❌ **Nếu không sửa:**
- Email gửi cho khách có tên cũ
- Download page hiển thị tên cũ

---

### **Khi chuyển LIVE:**
✅ **PHẢI LÀM:**
1. Lấy Live API keys từ PayPal và Stripe
2. Setup Live webhooks trên cả 2 platforms
3. Update tất cả environment variables trên Vercel
4. Redeploy
5. Test với real money (số tiền nhỏ)

❌ **KHÔNG ĐƯỢC:**
- Dùng sandbox keys trên production
- Skip testing trước khi announce
- Quên update webhook URLs

---

## 📂 9. FILE STRUCTURE SUMMARY

```
Thebenchmarktrader/
├── app/
│   ├── pricing/page.tsx               ← GIÁ + TÊN sản phẩm (Frontend)
│   ├── downloads/page.tsx             ← Download links
│   └── api/
│       ├── webhooks/
│       │   ├── paypal/route.ts        ← Price validation, Product names, Email, Commission
│       │   └── stripe/route.ts        ← Price validation, Product names, Email, Commission
│       └── create-payment/route.ts    ← Price validation
├── public/
│   └── files/                         ← Upload file download tại đây
│       ├── ThebenchmarkTrader-Full-MT4.ex4
│       ├── ThebenchmarkTrader-Full-MT5.ex5
│       └── ...
└── .env                                ← KHÔNG commit file này!
```

---

## 🔑 10. ENVIRONMENT VARIABLES (LIVE)

**Tạo file `.env.local` (LOCAL) hoặc config trên Vercel (PRODUCTION):**

```bash
# MongoDB
MONGODB_URI=mongodb+srv://...

# Email (Nodemailer - Gmail hoặc SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=support@thebenchmarktrader.com

# PayPal LIVE
PAYPAL_CLIENT_ID=<Live Client ID từ dashboard>
PAYPAL_CLIENT_SECRET=<Live Secret từ dashboard>
PAYPAL_MODE=live  ← QUAN TRỌNG!
NEXT_PUBLIC_PAYPAL_CLIENT_ID=<Live Client ID>

# Stripe LIVE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...  ← LIVE KEY
STRIPE_SECRET_KEY=sk_live_...  ← LIVE KEY
STRIPE_WEBHOOK_SECRET=whsec_...  ← LIVE WEBHOOK SECRET

# Site URL
NEXT_PUBLIC_SITE_URL=https://thebenchmarktrader.com

# JWT (cho authentication)
JWT_SECRET=<random-string-very-secure>
```

---

## 📞 11. SUPPORT & TROUBLESHOOTING

### **Nếu gặp vấn đề:**

**1. Order không lưu vào MongoDB:**
- Check Vercel logs
- Check MongoDB connection string
- Check collection name: `orders`

**2. Email không gửi:**
- Check SMTP credentials
- Check Vercel logs for email errors
- Test với Gmail App Password

**3. Webhook không nhận:**
- Check webhook URL đúng chưa
- Check webhook secret đúng chưa
- Check Vercel deployment logs

**4. Giá bị sai:**
- Check 3 nơi: pricing page, webhooks, create-payment
- Redeploy sau khi sửa

**5. Download không work:**
- Check file có trong `/public/files/` không
- Check `downloadUrl` path đúng chưa
- Check order ID có trong database không

---

## ✅ 12. FINAL CHECKLIST (GO LIVE)

### **Pre-Launch:**
- [ ] Tất cả giá đã đúng ở 3 nơi
- [ ] Tất cả tên sản phẩm đã đúng ở 5 nơi
- [ ] File download đã upload và test
- [ ] Email template đã đẹp và đúng nội dung
- [ ] PayPal Live keys đã setup
- [ ] Stripe Live keys đã setup
- [ ] Webhooks đã setup cho cả 2
- [ ] Environment variables đã update trên Vercel
- [ ] Đã test sandbox một lần cuối

### **Launch:**
- [ ] Redeploy Vercel với Live keys
- [ ] Test PayPal với real money (nhỏ)
- [ ] Test Stripe với real card (nhỏ)
- [ ] Check logs không có error
- [ ] Check MongoDB có order
- [ ] Check email nhận được
- [ ] Check download works
- [ ] Check affiliate commission (nếu có)

### **Post-Launch:**
- [ ] Monitor Vercel logs 24h đầu
- [ ] Check email support
- [ ] Check MongoDB orders đều đúng
- [ ] Announce trên social media
- [ ] Update documentation nếu cần

---

**Chúc bạn thành công! 🚀**

---

**Created:** October 30, 2025  
**Last Updated:** October 30, 2025  
**Version:** 1.0

