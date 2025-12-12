# 🌐 Kế Hoạch Triển Khai i18n (Client-Side Approach)

## ✅ Phương Án Được Chọn: Client-Side i18n

**Lý do:** An toàn, nhanh, phù hợp với cấu trúc hiện tại

## 📋 Các Bước Thực Hiện

### Bước 1: Setup Infrastructure ✅
- [x] Translation files (messages/vi.json, messages/en.json)
- [x] i18n configuration
- [x] Language provider

### Bước 2: Tạo Client-Side Locale Context
- [ ] LocaleProvider component với React Context
- [ ] Hook useLocale() để access current locale
- [ ] Persist locale trong localStorage/cookie

### Bước 3: Update Layout
- [ ] Wrap app với LocaleProvider
- [ ] Keep structure giống như hiện tại

### Bước 4: Migrate Key Components
- [ ] Header (thêm LanguageSwitcher)
- [ ] Footer
- [ ] Navigation text

### Bước 5: Migrate Pages (Important Ones)
- [ ] Homepage
- [ ] Pricing
- [ ] About
- [ ] Blog
- [ ] Contact forms

### Bước 6: Admin Panel
- [x] Giữ nguyên 100% tiếng Việt (không migrate)

### Bước 7: Test & Deploy
- [ ] Test switching languages
- [ ] Test all major features
- [ ] Build and deploy
- [ ] Verify production

## 🎯 Mục Tiêu

✅ **Website chạy được 2 ngôn ngữ: Tiếng Việt & English**  
✅ **Admin panel 100% tiếng Việt**  
✅ **Code structure giữ nguyên**  
✅ **Có thể rollback dễ dàng**

---

**Status: ĐANG THỰC HIỆN...**

