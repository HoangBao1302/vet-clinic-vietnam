# ✅ Checklist Cập Nhật Nội Dung Song Ngữ

## 🎯 Quick Reference Guide

### 📝 Blog Posts (CÓ TỰ ĐỘNG DỊCH ✨)

**Nơi cập nhật**: Admin Dashboard → Blog Management

```
✅ Bước 1: Nhập Title tiếng Việt
✅ Bước 2: Click 🌐 "Dịch tự động" → Kiểm tra Title (English)
✅ Bước 3: Nhập Excerpt tiếng Việt
✅ Bước 4: Click 🌐 "Dịch tự động" → Kiểm tra Excerpt (English)
✅ Bước 5: Nhập Content tiếng Việt
✅ Bước 6: Click 🌐 "Dịch tự động" → Kiểm tra Content (English)
✅ Bước 7: Lưu bài viết
✅ Bước 8: Test trên frontend (VI/EN)
```

---

### 📊 Live Results - Trading Accounts (CHƯA CÓ TỰ ĐỘNG DỊCH)

**File**: `data/tradingAccounts.ts`

```
✅ Cập nhật trường tiếng Việt (description, badge, highlights)
✅ Cập nhật trường _en tương ứng (description_en, badge_en, highlights_en)
✅ Lưu file
✅ Commit & Push
✅ Test trên frontend (VI/EN)
```

**Ví dụ**:
```typescript
description: "Copy trading trên Tickmill",
description_en: "Copy trading on Tickmill", // ← Nhập thủ công
```

---

### 🤝 Partners - Brokers (CHƯA CÓ TỰ ĐỘNG DỊCH)

**File**: `data/partners.ts`

```
✅ Cập nhật spread (VI) → spread_en (EN)
✅ Cập nhật license (VI) → license_en (EN)
✅ Cập nhật deposit (VI) → deposit_en (EN)
✅ Cập nhật support (VI) → support_en (EN)
✅ Cập nhật notes (VI) → notes_en (EN)
✅ Lưu file
✅ Commit & Push
✅ Test trên frontend (VI/EN)
```

---

### 🎨 Static Content - Pricing, Homepage, etc. (CHƯA CÓ TỰ ĐỘNG DỊCH)

**Files**: `locales/vi.json` + `locales/en.json`

```
✅ Mở locales/vi.json
✅ Tìm key cần sửa (ví dụ: pricing.hero.title)
✅ Cập nhật giá trị tiếng Việt
✅ Mở locales/en.json
✅ Tìm CÙNG key (pricing.hero.title)
✅ Cập nhật giá trị tiếng Anh
✅ Lưu CẢ 2 file
✅ Commit & Push
✅ Test trên frontend (VI/EN)
```

---

## 🚀 Quick Commands

### Test trên local:
```bash
npm run dev
# Mở http://localhost:3000
# Click nút 🌐 VI / 🌐 EN để test
```

### Deploy lên production:
```bash
git add .
git commit -m "update: [mô tả thay đổi]"
git push origin main
# Vercel tự động deploy
```

---

## 🔍 Kiểm Tra Nhanh

### ✅ Blog có dịch đúng không?
1. Vào `/blog`
2. Click 🌐 EN
3. Kiểm tra:
   - [ ] Tiêu đề trang
   - [ ] Tên categories
   - [ ] Tiêu đề bài viết
   - [ ] Excerpt bài viết

### ✅ Live Results có dịch đúng không?
1. Vào `/live-results`
2. Click 🌐 EN
3. Kiểm tra:
   - [ ] Badge của từng tài khoản
   - [ ] Description
   - [ ] Highlights

### ✅ Partners có dịch đúng không?
1. Vào `/partners`
2. Click 🌐 EN
3. Kiểm tra:
   - [ ] Spread & Phí
   - [ ] Giấy phép
   - [ ] Nạp/Rút
   - [ ] Hỗ trợ
   - [ ] Ghi chú

---

## ⚠️ Lưu Ý Quan Trọng

### ❌ KHÔNG nên:
- Chỉ cập nhật tiếng Việt mà quên tiếng Anh
- Dùng Google Translate cho thuật ngữ chuyên môn mà không kiểm tra
- Deploy mà chưa test cả 2 ngôn ngữ

### ✅ NÊN:
- Luôn cập nhật CẢ 2 ngôn ngữ
- Kiểm tra thuật ngữ forex/trading
- Test trên local trước khi deploy
- Backup (commit) trước khi sửa file JSON

---

## 📊 Bảng Tham Chiếu Nhanh

| Loại Nội Dung | Nơi Cập Nhật | Auto-translate? | Độ Ưu Tiên |
|---------------|--------------|-----------------|------------|
| Blog Posts | Admin Dashboard | ✅ CÓ | 🔥 Cao |
| Trading Accounts | `data/tradingAccounts.ts` | ❌ KHÔNG | 🔥 Cao |
| Partners | `data/partners.ts` | ❌ KHÔNG | 🟡 Trung bình |
| Pricing | `locales/*.json` | ❌ KHÔNG | 🟡 Trung bình |
| Homepage | `locales/*.json` | ❌ KHÔNG | 🔵 Thấp |
| Other Pages | `locales/*.json` | ❌ KHÔNG | 🔵 Thấp |

---

## 🎯 Template Email Cho Team

**Subject**: Cập nhật nội dung website - Cần dịch sang tiếng Anh

```
Hi team,

Tôi vừa cập nhật nội dung sau trên website:
- [ ] Blog post mới: [Tên bài viết]
- [ ] Trading account: [Tên tài khoản]
- [ ] Partner info: [Tên broker]
- [ ] Pricing: [Thay đổi gì]

Checklist đã làm:
✅ Cập nhật tiếng Việt
✅ Cập nhật tiếng Anh
✅ Test cả 2 ngôn ngữ
✅ Deploy lên production

Link kiểm tra: [URL]

Thanks!
```

---

**Cập nhật**: Dec 15, 2024

