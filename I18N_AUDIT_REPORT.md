# 🌍 Báo Cáo Rà Soát Song Ngữ (i18n Audit Report)

**Ngày:** 12/12/2025  
**Trạng thái:** ✅ Hoàn tất rà soát  
**Mục tiêu:** Hoàn thiện 100% website song ngữ (Tiếng Việt + English)

---

## 📊 Tổng Quan

| Hạng Mục | Trạng Thái | Ưu Tiên | Ước Lượng |
|----------|-----------|---------|-----------|
| ✅ Homepage (Header, Footer, Hero, Features) | **HOÀN TẤT** | - | - |
| ✅ Blog (Frontend + Admin) | **HOÀN TẤT** | - | - |
| ✅ Content Dashboard (Admin) | **HOÀN TẤT** | - | - |
| ❌ Login/Register Pages | **CHƯA LÀM** | 🔴 CAO | 2-3 giờ |
| ❌ Pricing Page | **CHƯA LÀM** | 🔴 CAO | 3-4 giờ |
| ❌ Downloads Page | **CHƯA LÀM** | 🟡 TRUNG BÌNH | 4-5 giờ |
| ❌ About EA Page | **CHƯA LÀM** | 🟡 TRUNG BÌNH | 3-4 giờ |
| ❌ Live Results Page | **CHƯA LÀM** | 🟡 TRUNG BÌNH | 2-3 giờ |
| ❌ Partners Page | **CHƯA LÀM** | 🟢 THẤP | 2-3 giờ |
| ❌ Affiliate/Referral Page | **CHƯA LÀM** | 🟢 THẤP | 3-4 giờ |

**Tổng ước lượng:** 22-30 giờ làm việc (3-4 ngày)

---

## 🔍 Chi Tiết Từng Trang

### 1. ❌ Login Page (`/login`)

**File:** `app/login/page.tsx`

**Nội dung cần dịch:**
- ✅ Tiêu đề: "Đăng Nhập"
- ✅ Subtitle: "Chào mừng trở lại! Đăng nhập để tiếp tục"
- ✅ Form labels: "Email", "Mật khẩu"
- ✅ Buttons: "Đăng Nhập", "Quên mật khẩu?"
- ✅ Links: "Chưa có tài khoản? Đăng ký ngay"
- ✅ Error messages: "Đăng nhập thất bại", "Email hoặc mật khẩu không đúng"
- ✅ Success messages: "Đăng nhập thành công"

**Số lượng strings:** ~15-20

**Độ phức tạp:** ⭐ Thấp (chỉ có text, không có rich content)

---

### 2. ❌ Register Page (`/register`)

**File:** `app/register/page.tsx`

**Nội dung cần dịch:**
- ✅ Tiêu đề: "Đăng Ký"
- ✅ Subtitle: "Tạo tài khoản để truy cập đầy đủ tính năng"
- ✅ Form labels: "Username", "Email", "Mật khẩu", "Xác nhận mật khẩu"
- ✅ Buttons: "Đăng Ký", "Đã có tài khoản? Đăng nhập"
- ✅ Validation errors: "Username phải có ít nhất 3 ký tự", "Email không hợp lệ", "Mật khẩu không khớp"
- ✅ Success messages: "Đăng ký thành công"
- ✅ Terms: "Bằng cách đăng ký, bạn đồng ý với Điều khoản sử dụng"

**Số lượng strings:** ~20-25

**Độ phức tạp:** ⭐ Thấp

---

### 3. ❌ Pricing Page (`/pricing`)

**File:** `app/pricing/page.tsx`

**Nội dung cần dịch:**
- ✅ Hero section: Tiêu đề, subtitle
- ✅ 3 Pricing plans:
  - Demo (Miễn phí)
  - Full Version (7.900.000đ)
  - Pro + Source Code (15.900.000đ)
- ✅ Features list cho mỗi plan (~8-10 items/plan)
- ✅ Limitations list
- ✅ CTA buttons: "Tải Demo", "Mua Ngay", "Liên Hệ"
- ✅ FAQ section (~8-10 câu hỏi)
- ✅ Video tutorial section
- ✅ Contact form: labels, placeholders, messages

**Số lượng strings:** ~80-100

**Độ phức tạp:** ⭐⭐⭐ Cao (nhiều content, có FAQ, form)

**Giải pháp auto-translate:** ❌ KHÔNG (vì là static data trong code, không có admin form)

---

### 4. ❌ Downloads Page (`/downloads`)

**File:** `app/downloads/page.tsx`

**Nội dung cần dịch:**
- ✅ Hero section
- ✅ 3 sections:
  - Hướng dẫn PDF (3 items)
  - Indicators miễn phí (3 items)
  - EA Demo (1 item)
  - Sản phẩm trả phí (3 items)
- ✅ Mỗi item có: name, description, version, size
- ✅ Buttons: "Tải Miễn Phí", "Mua Ngay"
- ✅ Login gate messages
- ✅ Download limit warnings

**Số lượng strings:** ~60-80

**Độ phức tạp:** ⭐⭐⭐ Cao (nhiều items, có logic gating)

**Giải pháp auto-translate:** ❌ KHÔNG (static data trong code)

---

### 5. ❌ About EA Page (`/about`)

**File:** `app/about/page.tsx`

**Nội dung cần dịch:**
- ✅ Hero section: Tiêu đề, description
- ✅ 3 badges: "Đa chiến lược", "Quản trị rủi ro", "Minh bạch"
- ✅ Strategy sections (~4-5 sections)
- ✅ Features list
- ✅ Risk management section
- ✅ Backtest results section
- ✅ Video tutorials section
- ✅ Disclaimer

**Số lượng strings:** ~50-70

**Độ phức tạp:** ⭐⭐ Trung bình

---

### 6. ❌ Live Results Page (`/live-results`)

**File:** `app/live-results/page.tsx`

**Nội dung cần dịch:**
- ✅ Hero section: "Kết Quả Giao Dịch Thực Tế"
- ✅ Stats: "Tổng lợi nhuận", "Verified accounts", "Followers/Copiers"
- ✅ Account cards (~5 accounts):
  - Labels: "Lợi nhuận", "Drawdown", "Win Rate", "Profit Factor"
  - Buttons: "Xem Chi Tiết", "Copy Giao Dịch"
- ✅ Copy trading guide section
- ✅ Video tutorials section
- ✅ Disclaimer

**Số lượng strings:** ~40-50

**Độ phức tạp:** ⭐⭐ Trung bình

**Giải pháp auto-translate:** ✅ CÓ THỂ (nếu data từ admin dashboard)

---

### 7. ❌ Partners Page (`/partners`)

**File:** `app/partners/page.tsx`

**Nội dung cần dịch:**
- ✅ Hero section: "Đối Tác Broker Uy Tín"
- ✅ 3 broker partners (Tickmill, ThinkMarkets, PuPrime):
  - 5 columns mỗi broker: Spread & Phí, Giấy phép, Nạp & Rút, Hỗ trợ, Lưu ý
- ✅ FAQ section
- ✅ Disclaimer

**Số lượng strings:** ~50-60

**Độ phức tạp:** ⭐⭐ Trung bình

**Giải pháp auto-translate:** ✅ CÓ THỂ (nếu data từ admin dashboard - đã có form)

---

### 8. ❌ Affiliate/Referral Page (`/referral`)

**File:** `app/referral/page.tsx`

**Nội dung cần dịch:**
- ✅ Hero section
- ✅ 3 affiliate programs:
  - Bán EA (30% commission)
  - Copy Social Trading (10%)
  - Broker Referral (25%)
- ✅ Benefits list cho mỗi program
- ✅ How it works section (4-5 steps)
- ✅ FAQ section
- ✅ Application form (nếu có)

**Số lượng strings:** ~60-80

**Độ phức tạp:** ⭐⭐⭐ Cao

---

## 🎯 Kế Hoạch Thực Hiện (3-4 Ngày)

### **Ngày 1: Login/Register + Pricing (Ưu tiên CAO)**

**Buổi sáng (3-4 giờ):**
1. ✅ Tạo translation keys cho Login/Register trong `locales/vi.json` và `locales/en.json`
2. ✅ Migrate `app/login/page.tsx` sang i18n
3. ✅ Migrate `app/register/page.tsx` sang i18n
4. ✅ Test login/register flow với cả 2 ngôn ngữ

**Buổi chiều (3-4 giờ):**
5. ✅ Tạo translation keys cho Pricing page
6. ✅ Migrate `app/pricing/page.tsx` sang i18n
7. ✅ Migrate FAQ section
8. ✅ Migrate contact form
9. ✅ Test pricing page với cả 2 ngôn ngữ

**Deliverable:** Login, Register, Pricing pages hoàn tất song ngữ

---

### **Ngày 2: About EA + Live Results (Ưu tiên TRUNG BÌNH)**

**Buổi sáng (3-4 giờ):**
1. ✅ Tạo translation keys cho About EA page
2. ✅ Migrate `app/about/page.tsx` sang i18n
3. ✅ Migrate strategy sections
4. ✅ Migrate video tutorials section
5. ✅ Test about page

**Buổi chiều (2-3 giờ):**
6. ✅ Tạo translation keys cho Live Results page
7. ✅ Migrate `app/live-results/page.tsx` sang i18n
8. ✅ Migrate account cards
9. ✅ Migrate copy trading guide
10. ✅ Test live results page

**Deliverable:** About EA, Live Results pages hoàn tất song ngữ

---

### **Ngày 3: Downloads + Partners (Ưu tiên TRUNG BÌNH/THẤP)**

**Buổi sáng (4-5 giờ):**
1. ✅ Tạo translation keys cho Downloads page
2. ✅ Migrate `app/downloads/page.tsx` sang i18n
3. ✅ Migrate download items (PDF, Indicators, EA)
4. ✅ Migrate gating messages
5. ✅ Test downloads page với login/logout

**Buổi chiều (2-3 giờ):**
6. ✅ Tạo translation keys cho Partners page
7. ✅ Migrate `app/partners/page.tsx` sang i18n
8. ✅ Migrate broker info (3 partners)
9. ✅ Migrate FAQ section
10. ✅ Test partners page

**Deliverable:** Downloads, Partners pages hoàn tất song ngữ

---

### **Ngày 4: Affiliate/Referral + Final Testing**

**Buổi sáng (3-4 giờ):**
1. ✅ Tạo translation keys cho Affiliate/Referral page
2. ✅ Migrate `app/referral/page.tsx` sang i18n
3. ✅ Migrate affiliate programs (3 programs)
4. ✅ Migrate how it works section
5. ✅ Migrate FAQ section
6. ✅ Test referral page

**Buổi chiều (2-3 giờ):**
7. ✅ **FINAL TESTING:** Test toàn bộ website với cả 2 ngôn ngữ
8. ✅ Check language switcher trên mọi trang
9. ✅ Check responsive trên mobile
10. ✅ Fix bugs nếu có
11. ✅ Deploy lên Vercel
12. ✅ Test trên production

**Deliverable:** Website 100% song ngữ, sẵn sàng production

---

## 🛠️ Phương Pháp Thực Hiện

### **Option A: Manual Translation (Cho Static Pages)**

**Áp dụng cho:** Login, Register, Pricing, Downloads, About, Live Results, Partners, Affiliate

**Quy trình:**
1. Tạo translation keys trong `locales/vi.json` và `locales/en.json`
2. Migrate component sang sử dụng `useLocale()` và `t()` function
3. Thay thế hardcoded strings bằng `t('key')`
4. Test với cả 2 ngôn ngữ

**Ưu điểm:**
- ✅ Kiểm soát hoàn toàn chất lượng dịch
- ✅ Không phụ thuộc vào API
- ✅ Nhanh, ổn định

**Nhược điểm:**
- ❌ Phải dịch thủ công (hoặc dùng Google Translate rồi paste)
- ❌ Không tự động khi update content

---

### **Option B: Auto-Translation (Cho Dynamic Content)**

**Áp dụng cho:** Blog posts, Content Dashboard, Featured Accounts (đã làm xong)

**Quy trình:**
1. Thêm `_en` fields vào database schema
2. Tạo admin form với `BilingualInput` / `BilingualRichTextEditor`
3. Integrate translation API
4. Frontend hiển thị theo locale

**Ưu điểm:**
- ✅ Tự động dịch khi admin tạo content
- ✅ Có thể review và edit bản dịch
- ✅ Phù hợp cho content thường xuyên update

**Nhược điểm:**
- ❌ Phụ thuộc vào Google Translate API
- ❌ Cần thêm database fields
- ❌ Phức tạp hơn

---

## 📝 Checklist Hoàn Thiện

### **Đã Hoàn Tất ✅**
- [x] Homepage (Header, Footer, Hero, SloganBanner, Features, Strategy, Proof, LiveResults, ForexContact, StickyCallToAction, Pricing, Newsletter)
- [x] Blog (Frontend listing + detail pages)
- [x] Blog (Admin create + edit forms với auto-translation)
- [x] Content Dashboard (Partners, Trading Accounts, Featured Accounts forms)

### **Cần Làm ❌**
- [ ] Login Page
- [ ] Register Page
- [ ] Pricing Page
- [ ] Downloads Page
- [ ] About EA Page
- [ ] Live Results Page
- [ ] Partners Page
- [ ] Affiliate/Referral Page

### **Final Testing ❌**
- [ ] Test language switcher trên mọi trang
- [ ] Test responsive mobile
- [ ] Test login/logout flow
- [ ] Test download flow
- [ ] Test pricing/checkout flow
- [ ] Deploy production
- [ ] Test trên live website

---

## 💡 Khuyến Nghị

### **1. Ưu tiên làm trước:**
- 🔴 **Login/Register** (vì user cần login để download, xem premium content)
- 🔴 **Pricing** (vì là trang conversion chính)

### **2. Có thể làm sau:**
- 🟢 **Partners** (ít người truy cập)
- 🟢 **Affiliate** (chỉ dành cho affiliates)

### **3. Phương pháp:**
- **Static pages:** Dùng manual translation (Option A)
- **Dynamic content:** Đã có auto-translation (Option B)

### **4. Timeline:**
- **Nhanh nhất:** 3 ngày (8-10 giờ/ngày)
- **An toàn:** 4 ngày (6-8 giờ/ngày)
- **Thoải mái:** 5-6 ngày (4-5 giờ/ngày)

---

## 🎯 Mục Tiêu Cuối Cùng

✅ **100% website song ngữ (Tiếng Việt + English)**  
✅ **Language switcher hoạt động mượt mà trên mọi trang**  
✅ **Responsive tốt trên mobile**  
✅ **SEO-friendly với proper lang attributes**  
✅ **Admin có thể tự update content với auto-translation**

---

**Prepared by:** AI Assistant  
**Date:** 12/12/2025  
**Next Action:** Bắt đầu với Login/Register pages (Ngày 1 - Buổi sáng)

