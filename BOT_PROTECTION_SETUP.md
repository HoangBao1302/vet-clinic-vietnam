# 🛡️ Hướng Dẫn Bảo Vệ Hệ Thống Khỏi Bot & Email Ảo

## 📋 Tổng Quan

Hệ thống được bảo vệ theo 3 cấp độ từ thấp đến cao:

### **Cấp 1: Bảo Vệ Cơ Bản (Dễ triển khai - Miễn phí)**
✅ Google reCAPTCHA v3 (Invisible)  
✅ Honeypot Fields  
✅ Rate Limiting

### **Cấp 2: Xác Thực Email (Trung bình - Miễn phí/Có phí)**
✅ Double Opt-in Email Verification  
✅ Email Domain Validation

### **Cấp 3: Kiểm Tra Chuyên Nghiệp (Cao - Có phí)**
✅ Real-time Email Verification Service  
✅ IP Tracking & VPN Detection

---

## 🚀 Cấp 1: Bảo Vệ Cơ Bản

### 1.1 Google reCAPTCHA v3 (Invisible)

#### **Bước 1: Đăng Ký reCAPTCHA**

1. Truy cập: https://www.google.com/recaptcha/admin/create
2. Đăng nhập với Google Account
3. Điền thông tin:
   - **Label:** EA ThebenchmarkTrader
   - **reCAPTCHA type:** Chọn **v3**
   - **Domains:** 
     - `localhost` (để test)
     - `thebenchmarktrader.com`
     - `*.thebenchmarktrader.com` (nếu dùng subdomain)
   - Đồng ý Terms of Service
4. Click **Submit**

#### **Bước 2: Lấy Keys**

Sau khi tạo, bạn sẽ nhận được:
- **Site Key:** `6Lc...` (public key)
- **Secret Key:** `6Lc...` (private key)

#### **Bước 3: Thêm vào `.env.local`**

```bash
# Google reCAPTCHA v3
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Lcxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
RECAPTCHA_SECRET_KEY=6Lcxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

#### **Bước 4: Test**

1. Chạy `npm run dev`
2. Vào trang `/register`
3. Điền form và submit
4. Kiểm tra console để xem reCAPTCHA score

**Score Threshold:**
- `0.9 - 1.0`: Rất có thể là người thật ✅
- `0.5 - 0.9`: Có thể là người thật ⚠️
- `0.0 - 0.5`: Rất có thể là bot ❌

Điều chỉnh threshold trong `app/api/verify-recaptcha/route.ts`:

```typescript
const threshold = 0.5; // Điều chỉnh theo nhu cầu (0.5 = vừa phải)
```

---

### 1.2 Honeypot Fields

✅ **Đã tự động tích hợp** - Không cần setup gì thêm!

Honeypot là field ẩn mà chỉ bot mới điền vào. Nếu field này có giá trị → chắc chắn là bot.

**Cách hoạt động:**
- Field được ẩn hoàn toàn (CSS: `left: -9999px`)
- User thật không thể thấy → không điền
- Bot tự động điền → bị chặn

---

### 1.3 Rate Limiting

#### **Cài đặt:**

```bash
npm install express-rate-limit
```

#### **Tạo API Rate Limiter:**

```typescript
// lib/rateLimit.ts
import rateLimit from 'express-rate-limit';

export const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 5, // Giới hạn 5 requests per IP
  message: 'Quá nhiều lần thử. Vui lòng thử lại sau 15 phút.',
  standardHeaders: true,
  legacyHeaders: false,
});
```

#### **Áp dụng vào API:**

```typescript
// app/api/auth/register/route.ts
import { registerLimiter } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
  // Apply rate limit
  // ... existing code
}
```

---

## 📧 Cấp 2: Xác Thực Email

### 2.1 Double Opt-in Email Verification

**Yêu cầu:** User phải click link trong email để kích hoạt tài khoản.

#### **Bước 1: Update User Model**

```typescript
// lib/models/User.ts
emailVerified: {
  type: Boolean,
  default: false,
},
emailVerificationToken: String,
emailVerificationExpire: Date,
```

#### **Bước 2: Tạo Email Verification API**

```typescript
// app/api/auth/verify-email/route.ts
export async function GET(request: NextRequest) {
  const { token } = await request.json();
  
  // Verify token
  // Update emailVerified = true
}
```

#### **Bước 3: Gửi Email Verification**

Khi user đăng ký, gửi email với link verification:
```
https://thebenchmarktrader.com/verify-email?token=xxxxx
```

#### **Bước 4: Block Unverified Users**

Trong các API quan trọng (download demo), check:

```typescript
if (!user.emailVerified) {
  return NextResponse.json(
    { error: 'Vui lòng xác thực email trước khi download' },
    { status: 403 }
  );
}
```

---

## 🔍 Cấp 3: Kiểm Tra Chuyên Nghiệp

### 3.1 Real-time Email Verification

#### **Tùy chọn 1: EmailListVerify** (Rẻ nhất)
- **Pricing:** $0.0025/email
- **API:** https://www.emaillistverify.com/
- **Free tier:** 100 emails/month

#### **Tùy chọn 2: ZeroBounce** (Phổ biến)
- **Pricing:** $0.008/email
- **API:** https://www.zerobounce.net/
- **Free tier:** 100 emails/month

#### **Tùy chọn 3: NeverBounce** (Chính xác nhất)
- **Pricing:** $0.008/email
- **API:** https://neverbounce.com/
- **Free tier:** 1,000 credits/month

#### **Implementation Example (ZeroBounce):**

```typescript
// app/api/verify-email-service/route.ts
export async function POST(request: NextRequest) {
  const { email } = await request.json();
  
  const response = await fetch(
    `https://api.zerobounce.net/v2/validate?api_key=${process.env.ZEROBOUNCE_API_KEY}&email=${email}`
  );
  
  const data = await response.json();
  
  // Check status
  if (data.status === 'valid') {
    return NextResponse.json({ valid: true });
  } else {
    return NextResponse.json({ valid: false, reason: data.status });
  }
}
```

#### **Áp dụng vào Register:**

```typescript
// app/api/auth/register/route.ts
// Before creating user, verify email:
const emailCheck = await fetch('/api/verify-email-service', {
  method: 'POST',
  body: JSON.stringify({ email }),
});

if (!emailCheck.valid) {
  return NextResponse.json(
    { error: 'Email không hợp lệ hoặc là email ảo' },
    { status: 400 }
  );
}
```

---

### 3.2 IP Tracking & VPN Detection

#### **Tùy chọn 1: ipapi.co** (Miễn phí 1,000 req/day)
- API: `https://ipapi.co/{ip}/json/`

#### **Tùy chọn 2: ip-api.com** (Miễn phí 45 req/min)
- API: `http://ip-api.com/json/{ip}`

#### **Tùy chọn 3: MaxMind GeoIP2** (Có phí, chính xác)
- Pricing: $20/month
- API: MaxMind GeoIP2 Database

#### **Implementation Example:**

```typescript
// app/api/check-ip/route.ts
export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'unknown';
  
  // Check IP với ip-api.com
  const response = await fetch(`http://ip-api.com/json/${ip}`);
  const data = await response.json();
  
  // Check VPN/Proxy
  if (data.proxy === true || data.hosting === true) {
    return NextResponse.json({ 
      blocked: true, 
      reason: 'VPN/Proxy detected' 
    });
  }
  
  return NextResponse.json({ blocked: false, data });
}
```

---

## 📊 Monitoring & Analytics

### **Theo dõi Bot Attempts:**

```typescript
// lib/models/BotAttempt.ts
{
  ip: String,
  email: String,
  reason: String, // 'honeypot', 'recaptcha_low_score', 'vpn_detected'
  timestamp: Date,
}
```

### **Dashboard để xem:**

- Số lượng bot bị chặn/ngày
- Top IP bị block
- Top email domains bị reject
- reCAPTCHA score distribution

---

## ✅ Checklist Triển Khai

### **Cấp 1 (Ưu tiên cao):**
- [ ] Đăng ký Google reCAPTCHA v3
- [ ] Thêm keys vào `.env.local`
- [ ] Test register form
- [ ] Setup Rate Limiting
- [ ] Monitor logs

### **Cấp 2 (Ưu tiên trung bình):**
- [ ] Implement Double Opt-in
- [ ] Update User model
- [ ] Tạo verification email template
- [ ] Block unverified users từ download

### **Cấp 3 (Tùy chọn):**
- [ ] Đăng ký Email Verification Service
- [ ] Integrate vào register flow
- [ ] Setup IP Tracking
- [ ] Block VPN/Proxy IPs

---

## 🎯 Kết Quả Mong Đợi

Sau khi triển khai:

**Cấp 1:**
- ✅ Block 80-90% bots cơ bản
- ✅ Giảm spam registrations 70-80%

**Cấp 2:**
- ✅ Block email ảo không verify
- ✅ Tăng chất lượng users 50-60%

**Cấp 3:**
- ✅ Block 95%+ bots và email ảo
- ✅ Chỉ còn users thật, chất lượng cao

---

## 🆘 Troubleshooting

### **reCAPTCHA không hoạt động:**
- Kiểm tra Site Key trong `.env.local`
- Kiểm tra domain được thêm vào reCAPTCHA console
- Xem console browser có lỗi không

### **Honeypot block user thật:**
- Kiểm tra CSS ẩn field đúng chưa
- User có dùng screen reader không? (Cần thêm `aria-hidden="true"`)

### **Rate limit quá chặt:**
- Tăng `windowMs` hoặc `max` trong rateLimiter
- Whitelist IP admin

---

**Last Updated:** 2025-01-11  
**Version:** 1.0

