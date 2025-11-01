# 🛡️ Bảo Vệ Contact Forms Khỏi Spam & Bot

## ✅ Đã Triển Khai

### **1. Email Validation Nghiêm Ngặt**

#### **Block Temporary/Disposable Email Domains:**
- ✅ `tempmail.com`, `guerrillamail.com`, `10minutemail.com`
- ✅ `mailinator.com`, `throwaway.email`, `disposablemail.com`
- ✅ `fakeinbox.com`, `trashmail.com`, `temp-mail.org`
- ✅ `getnada.com`, `mohmal.com`, `yopmail.com`
- ✅ Và 30+ domains khác

#### **Block Suspicious Patterns:**
- ✅ Email có quá nhiều số (60%+ là số)
- ✅ Random string patterns (quá nhiều phụ âm, ít nguyên âm)
- ✅ Domain ngắn với keywords: temp, fake, throwaway, disposable, trash, spam, test, example
- ✅ Free domains: `.tk`, `.ml`, `.ga`, `.cf`, `.gq`
- ✅ Email quá dài (>254 ký tự)
- ✅ Format không hợp lệ (RFC 5322)

### **2. Rate Limiting**
- ✅ **3 requests / 1 phút / IP** (giảm từ 8)
- ✅ Dual rate limiting (API limiter + backup limiter)
- ✅ Automatic blocking khi vượt quá

### **3. Honeypot Fields**
- ✅ Field ẩn hoàn toàn (user không thấy)
- ✅ Bot tự động điền → Bị chặn ngay
- ✅ Silent fail (không báo lỗi cho bot)

### **4. Client-Side Validation**
- ✅ Real-time email validation
- ✅ Hiển thị lỗi ngay khi nhập sai
- ✅ Ngăn submit nếu email không hợp lệ

### **5. Server-Side Validation**
- ✅ Comprehensive email check (format + domain + pattern)
- ✅ Logging suspicious emails
- ✅ Clear error messages cho user

---

## 📁 Files Đã Cập Nhật

### **New Files:**
- `lib/emailValidation.ts` - Email validation utilities

### **Updated Files:**
- `components/ForexContact.tsx` - Homepage contact form
- `app/pricing/page.tsx` - Pricing page contact form
- `app/api/contact/route.ts` - Contact API với validation

---

## 🔒 Tính Năng Bảo Vệ

### **Layer 1: Client-Side (Frontend)**
1. **Email Format Check** - Real-time validation
2. **Honeypot Check** - Silent bot detection
3. **Prevent Invalid Submit** - Block before API call

### **Layer 2: Server-Side (Backend)**
1. **Honeypot Verification** - Double-check
2. **Rate Limiting** - 3 requests/minute/IP
3. **Email Domain Blocking** - Block 30+ temp email services
4. **Pattern Detection** - Detect spam patterns
5. **Comprehensive Validation** - RFC 5322 compliant

---

## 📊 Kết Quả Mong Đợi

- ✅ **Block 95%+ spam emails** (temp/disposable)
- ✅ **Block 90%+ bots** (honeypot + rate limiting)
- ✅ **Giảm spam requests 80-90%**
- ✅ **Bảo vệ hệ thống email** khỏi spam flood
- ✅ **User experience tốt** (real-time validation, clear errors)

---

## 🎯 Email Validation Rules

### **✅ Allowed:**
- `user@gmail.com`
- `name@company.com.vn`
- `trader123@yahoo.com`

### **❌ Blocked:**
- `test@tempmail.com` (temp email)
- `abc123456789@fakeinbox.com` (temp + random)
- `asdfghjkl@test.com` (random string)
- `123456789@example.com` (too many numbers)
- `spam@mail.tk` (free domain)

---

## ⚙️ Configuration

### **Rate Limiting:**
Edit `lib/rateLimit.ts`:
```typescript
export const apiLimiter = (ip: string) =>
  rateLimit(ip, {
    windowMs: 60 * 1000, // 1 minute
    max: 3, // 3 requests per minute
    message: 'Quá nhiều requests. Vui lòng thử lại sau.',
  });
```

### **Blocked Domains:**
Edit `lib/emailValidation.ts`:
```typescript
const BLOCKED_EMAIL_DOMAINS = [
  // Add more domains here
  'new-spam-domain.com',
];
```

---

## 📝 Monitoring

Server logs sẽ hiển thị:
- `🚫 Invalid email blocked: [email] (IP: [ip])`
- `⚠️ Suspicious email detected: [email] (IP: [ip])`
- `🚫 Bot detected via honeypot field (IP: [ip])`
- `🚫 Rate limit exceeded for IP: [ip]`

---

**Status:** ✅ Hoàn thành  
**Protection Level:** High - Multi-layer defense

