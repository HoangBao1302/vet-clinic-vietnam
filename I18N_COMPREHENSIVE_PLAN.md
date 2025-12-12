# 🌍 Kế Hoạch Song Ngữ Toàn Diện (Vietnamese ⇄ English)

## 📊 Tổng Quan Audit

### ✅ Đã Hoàn Thành (100%)
1. **Homepage** - Header, Hero, SloganBanner, Features, Footer, Strategy, Proof, LiveResults, ForexContact, StickyCallToAction, Newsletter
2. **Blog System** - Listing, Detail pages, Admin forms với auto-translation
3. **Content Dashboard** - Partners, Trading Accounts, Featured Accounts forms với auto-translation

### ⏳ Cần Triển Khai (Chưa có i18n)

#### 🔐 **1. Authentication Pages** (Ưu tiên CAO)
- **`app/login/page.tsx`** - Trang đăng nhập
  - Form labels: Email, Mật khẩu
  - Buttons: Đăng Nhập, Quên mật khẩu?, Đăng ký ngay
  - Error messages: "Đăng nhập thất bại", "Email hoặc mật khẩu không đúng"
  - Success: "Đăng nhập thành công!"
  
- **`app/register/page.tsx`** - Trang đăng ký
  - Form labels: Username, Email, Password, Confirm Password
  - Validation errors: "Username phải có ít nhất 3 ký tự", "Email không hợp lệ", "Mật khẩu xác nhận không khớp"
  - Success: "Đăng ký thành công!"
  - Links: "Đã có tài khoản? Đăng nhập", "Chính sách bảo mật"

#### 💰 **2. Pricing Page** (Ưu tiên CAO)
- **`app/pricing/page.tsx`**
  - Pricing plans (3 tiers): Demo, Full Version, Pro + Source
  - Features lists (mỗi plan ~8-10 features)
  - Limitations
  - CTA buttons: "Tải Demo", "Mua ngay", "Liên hệ"
  - FAQ section (6 questions)
  - Contact form với các topic options

#### 📥 **3. Downloads Page** (Ưu tiên CAO)
- **`app/downloads/page.tsx`**
  - Download items (~15 items):
    - PDF guides: "Hướng dẫn cài đặt EA", "Hướng dẫn tối ưu tham số", "Hướng dẫn chọn broker"
    - Free indicators: "Support & Resistance Indicator", "Auto Trend Lines Indicator"
    - Paid products: EA Full Version, EA Pro + Source
  - Buttons: "Tải xuống miễn phí", "Mua ngay", "Xác thực đơn hàng"
  - Messages: "Đăng nhập để tải", "Yêu cầu thanh toán"

#### 📖 **4. About EA Page** (Ưu tiên TRUNG BÌNH)
- **`app/about/page.tsx`**
  - Hero: "Về EA Forex ThebenchmarkTrader", subtitle, badges
  - Philosophy section: "Triết lý giao dịch", "Minh bạch & Khoa học"
  - Strategy sections: "Chiến lược giao dịch", "Quản trị rủi ro", "Backtest"
  - Technical specs: "Thông số kỹ thuật", "Nền tảng hỗ trợ", "Yêu cầu broker"
  - Risk warnings: "Cảnh báo rủi ro"

#### 📊 **5. Live Results Page** (Ưu tiên TRUNG BÌNH)
- **`app/live-results/page.tsx`**
  - Hero: "Kết Quả Giao Dịch Thực Tế", "100% Verified Real Money Accounts"
  - Stats: "Tổng lợi nhuận", "Verified accounts", "Followers/Copiers"
  - Trust badges: "100% Verified", "Real-Time", "Live Data", "Copy Trading"
  - Account cards (5 accounts) với stats
  - Copy trading instructions
  - Disclaimer

#### 🤝 **6. Partners Page** (Ưu tiên THẤP)
- **`app/partners/page.tsx`**
  - Hero: "Đối Tác Broker Uy Tín"
  - Partner cards với:
    - Highlights: "Spread thấp", "Nạp rút nhanh", "Hỗ trợ 24/7"
    - Stats: Min Deposit, Spread, Leverage
    - Pros/Cons lists
  - Buttons: "Mở tài khoản", "Xem chi tiết"

#### 💼 **7. Affiliate/Referral Pages** (Ưu tiên THẤP)
- **`app/referral/page.tsx`** - Trang giới thiệu affiliate
  - Hero: "Chương Trình Affiliate", "Kiếm thu nhập thụ động"
  - 3 programs: "Bán EA" (30%), "Copy Social Trading" (10%), "Courses" (20%)
  - Benefits lists
  - How it works steps
  - CTA: "Đăng ký ngay"

- **`app/referral/apply/page.tsx`** - Form đăng ký affiliate
  - Form fields: Họ tên, Email, Phone, Website/Social, Lý do tham gia
  - Validation & success messages

---

## 🎯 Chiến Lược Triển Khai

### **Phase 1: Critical Pages (Ngày 1-2)** ⚡
**Mục tiêu:** User có thể dùng website hoàn chỉnh bằng tiếng Anh

1. ✅ Login/Register pages
2. ✅ Pricing page
3. ✅ Downloads page

**Lý do ưu tiên:**
- Login/Register: User phải đăng nhập để dùng nhiều tính năng
- Pricing: Trang chuyển đổi quan trọng nhất (conversion)
- Downloads: Trang quan trọng thứ 2 (user download EA/indicators)

---

### **Phase 2: Content Pages (Ngày 3-4)** 📚
**Mục tiêu:** Thông tin đầy đủ về sản phẩm

1. ✅ About EA page
2. ✅ Live Results page

**Lý do ưu tiên:**
- About: Giải thích chi tiết về EA (SEO quan trọng)
- Live Results: Social proof, tăng trust

---

### **Phase 3: Partnership Pages (Ngày 5)** 🤝
**Mục tiêu:** Hoàn thiện ecosystem

1. ✅ Partners page
2. ✅ Affiliate/Referral pages

**Lý do ưu tiên thấp:**
- Ít user truy cập
- Không ảnh hưởng conversion chính

---

## 🛠️ Phương Pháp Triển Khai

### **A. Static Content (Không cần Admin Panel)**
**Áp dụng cho:** Login, Register, Pricing, Downloads, About, Live Results, Partners, Affiliate

**Cách làm:**
1. ✅ Thêm translations vào `locales/en.json` và `locales/vi.json`
2. ✅ Update component để dùng `useLocale()` và `t()` function
3. ✅ Test trên localhost
4. ✅ Push lên GitHub → Auto-deploy Vercel

**Ưu điểm:**
- Nhanh, đơn giản
- Không cần database changes
- Không cần admin UI

**Nhược điểm:**
- Admin không thể tự edit translations (phải edit code)

---

### **B. Dynamic Content (Cần Admin Panel)** ✨
**Áp dụng cho:** Blog, Content Dashboard (Partners, Trading Accounts, Featured Accounts)

**Đã triển khai:**
- ✅ `BilingualInput` component (text/textarea)
- ✅ `BilingualRichTextEditor` component (rich text)
- ✅ Auto-translation API (`/api/translate`)
- ✅ Google Translate fallback
- ✅ Database schema updates (`_en` fields)

**Cách dùng:**
1. Admin tạo/edit content trong admin panel
2. Nhập tiếng Việt
3. Click "🌍 Dịch sang Tiếng Anh" → Auto-translate
4. Review và edit bản dịch nếu cần
5. Save → Cả 2 ngôn ngữ được lưu vào database

---

## 📝 Translation Keys Structure

### **Login Page** (`login.*`)
```json
{
  "login.title": "Đăng Nhập",
  "login.subtitle": "Chào mừng trở lại! Đăng nhập để tiếp tục",
  "login.email": "Email",
  "login.password": "Mật khẩu",
  "login.rememberMe": "Ghi nhớ đăng nhập",
  "login.forgotPassword": "Quên mật khẩu?",
  "login.submit": "Đăng Nhập",
  "login.noAccount": "Chưa có tài khoản?",
  "login.register": "Đăng ký ngay",
  "login.terms": "Điều khoản sử dụng",
  "login.privacy": "Chính sách bảo mật",
  "login.error.invalid": "Email hoặc mật khẩu không đúng",
  "login.error.failed": "Đăng nhập thất bại",
  "login.success": "Đăng nhập thành công!"
}
```

### **Register Page** (`register.*`)
```json
{
  "register.title": "Đăng Ký Tài Khoản",
  "register.subtitle": "Tạo tài khoản để truy cập đầy đủ tính năng",
  "register.username": "Tên đăng nhập",
  "register.email": "Email",
  "register.password": "Mật khẩu",
  "register.confirmPassword": "Xác nhận mật khẩu",
  "register.submit": "Đăng Ký",
  "register.hasAccount": "Đã có tài khoản?",
  "register.login": "Đăng nhập",
  "register.error.usernameShort": "Username phải có ít nhất 3 ký tự",
  "register.error.emailInvalid": "Email không hợp lệ",
  "register.error.passwordShort": "Mật khẩu phải có ít nhất 6 ký tự",
  "register.error.passwordMismatch": "Mật khẩu xác nhận không khớp",
  "register.success": "Đăng ký thành công!"
}
```

### **Pricing Page** (`pricing.*`)
```json
{
  "pricing.title": "Bảng Giá",
  "pricing.subtitle": "Chọn gói phù hợp với nhu cầu của bạn",
  "pricing.demo.name": "Demo",
  "pricing.demo.price": "0đ",
  "pricing.demo.period": "Miễn phí",
  "pricing.demo.description": "Dùng thử EA với tài khoản demo",
  "pricing.demo.cta": "Tải Demo",
  "pricing.full.name": "Full Version",
  "pricing.full.price": "7.900.000đ",
  "pricing.full.period": "Một lần",
  "pricing.full.description": "Phiên bản đầy đủ cho tài khoản thực",
  "pricing.full.cta": "Mua ngay",
  "pricing.pro.name": "Pro + Source",
  "pricing.pro.price": "14.900.000đ",
  "pricing.pro.period": "Một lần",
  "pricing.pro.description": "Phiên bản Pro với source code",
  "pricing.pro.cta": "Liên hệ",
  "pricing.faq.title": "Câu Hỏi Thường Gặp",
  // ... 50+ more keys
}
```

### **Downloads Page** (`downloads.*`)
```json
{
  "downloads.title": "Tải Xuống",
  "downloads.subtitle": "EA, Indicators, và tài liệu hướng dẫn",
  "downloads.free": "Miễn phí",
  "downloads.premium": "Premium",
  "downloads.download": "Tải xuống",
  "downloads.purchase": "Mua ngay",
  "downloads.loginRequired": "Đăng nhập để tải",
  "downloads.requiresPayment": "Yêu cầu thanh toán",
  // ... 30+ more keys
}
```

### **About Page** (`about.*`)
```json
{
  "about.title": "Về EA Forex ThebenchmarkTrader",
  "about.subtitle": "Expert Advisor được thiết kế với triết lý minh bạch...",
  "about.philosophy.title": "Triết Lý Giao Dịch",
  "about.strategy.title": "Chiến Lược Giao Dịch",
  "about.risk.title": "Quản Trị Rủi Ro",
  "about.backtest.title": "Backtest & Kết Quả",
  "about.specs.title": "Thông Số Kỹ Thuật",
  // ... 40+ more keys
}
```

### **Live Results Page** (`liveResults.*`)
```json
{
  "liveResults.title": "Kết Quả Giao Dịch Thực Tế",
  "liveResults.subtitle": "100% Verified Real Money Accounts",
  "liveResults.verified": "100% Verified",
  "liveResults.realtime": "Real-Time",
  "liveResults.copyable": "Copy Trading",
  "liveResults.viewProfile": "Xem Profile",
  "liveResults.copyNow": "Copy Ngay",
  "liveResults.watchVideo": "Video Hướng Dẫn",
  // ... 30+ more keys
}
```

### **Partners Page** (`partners.*`)
```json
{
  "partners.title": "Đối Tác Broker Uy Tín",
  "partners.subtitle": "Danh sách các broker được khuyến nghị...",
  "partners.openAccount": "Mở tài khoản",
  "partners.viewDetails": "Xem chi tiết",
  "partners.minDeposit": "Nạp tối thiểu",
  "partners.spread": "Spread",
  "partners.leverage": "Đòn bẩy",
  // ... 20+ more keys
}
```

### **Affiliate Page** (`affiliate.*`)
```json
{
  "affiliate.title": "Chương Trình Affiliate",
  "affiliate.subtitle": "Kiếm thu nhập thụ động với hoa hồng hấp dẫn",
  "affiliate.eaSales.title": "Bán EA",
  "affiliate.eaSales.commission": "30%",
  "affiliate.copySocial.title": "Copy Social Trading",
  "affiliate.copySocial.commission": "10%",
  "affiliate.courses.title": "Courses",
  "affiliate.courses.commission": "20%",
  "affiliate.apply": "Đăng ký ngay",
  // ... 40+ more keys
}
```

---

## 📅 Timeline Chi Tiết

### **Ngày 1 (Hôm nay)** - Login & Register
- [ ] Thêm ~30 translation keys cho login/register
- [ ] Migrate `app/login/page.tsx`
- [ ] Migrate `app/register/page.tsx`
- [ ] Test & push

**Ước tính:** 2-3 giờ

---

### **Ngày 2** - Pricing & Downloads
- [ ] Thêm ~80 translation keys cho pricing/downloads
- [ ] Migrate `app/pricing/page.tsx` (complex, nhiều content)
- [ ] Migrate `app/downloads/page.tsx` (complex, nhiều items)
- [ ] Test & push

**Ước tính:** 4-5 giờ

---

### **Ngày 3** - About EA
- [ ] Thêm ~50 translation keys
- [ ] Migrate `app/about/page.tsx` (nhiều sections)
- [ ] Test & push

**Ước tính:** 2-3 giờ

---

### **Ngày 4** - Live Results
- [ ] Thêm ~40 translation keys
- [ ] Migrate `app/live-results/page.tsx`
- [ ] Test & push

**Ước tính:** 2 giờ

---

### **Ngày 5** - Partners & Affiliate
- [ ] Thêm ~60 translation keys
- [ ] Migrate `app/partners/page.tsx`
- [ ] Migrate `app/referral/page.tsx`
- [ ] Migrate `app/referral/apply/page.tsx`
- [ ] Test & push

**Ước tính:** 3-4 giờ

---

## ✅ Checklist Hoàn Thành

### Phase 1: Critical Pages
- [ ] Login page
- [ ] Register page
- [ ] Pricing page
- [ ] Downloads page

### Phase 2: Content Pages
- [ ] About EA page
- [ ] Live Results page

### Phase 3: Partnership Pages
- [ ] Partners page
- [ ] Affiliate/Referral pages

### Final Steps
- [ ] Test toàn bộ website (cả VI và EN)
- [ ] Check responsive (mobile/tablet/desktop)
- [ ] SEO check (meta tags, titles)
- [ ] Performance check (Lighthouse)
- [ ] Deploy to production
- [ ] Create user guide for switching languages

---

## 🎉 Kết Quả Mong Đợi

Sau khi hoàn thành:
1. ✅ **100% website** có bản tiếng Anh
2. ✅ User có thể switch ngôn ngữ ở bất kỳ trang nào
3. ✅ Admin có thể tự dịch blog & content dashboard
4. ✅ Static pages dùng translation files (nhanh, SEO-friendly)
5. ✅ Dynamic content dùng database (`_en` fields)
6. ✅ Google Translate fallback nếu không có DeepL API key
7. ✅ Mobile-friendly language switcher
8. ✅ Locale persistence (localStorage)

---

## 📞 Support

Nếu có vấn đề:
1. Check Browser Console (F12) để xem lỗi
2. Verify translation keys exist trong `locales/en.json`
3. Check component có dùng `useLocale()` và `t()` đúng không
4. Test với `localStorage.setItem('locale', 'en')` để force English

---

**Tổng thời gian ước tính:** 5 ngày (15-20 giờ làm việc)

**Bắt đầu:** Ngày 1 - Login & Register pages ⚡

