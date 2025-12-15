# 📖 Hướng Dẫn Quản Lý Nội Dung Song Ngữ (Bilingual Content Guide)

## 🎯 Tổng Quan

Website ThebenchmarkTrader hiện đã hỗ trợ **song ngữ Việt-Anh** với 2 loại nội dung:

1. **Nội dung tĩnh (Static Content)**: Được quản lý qua file JSON trong thư mục `locales/`
2. **Nội dung động (Dynamic Content)**: Được quản lý qua Admin Dashboard với tự động dịch

---

## 📊 Trạng Thái Bilingual Của Từng Phần

### ✅ ĐÃ CÓ TỰ ĐỘNG DỊCH (Auto-translate)

Các phần này khi bạn cập nhật tiếng Việt sẽ **TỰ ĐỘNG DỊCH** sang tiếng Anh:

#### 1. **Blog Posts** (Bài viết Blog)
- **Nơi cập nhật**: Admin Dashboard → Blog Management
- **Các trường tự động dịch**:
  - `title` → `title_en`
  - `excerpt` → `excerpt_en`
  - `content` → `content_en`
- **Công nghệ**: Google Translate API
- **Cách hoạt động**: 
  - Nhập nội dung tiếng Việt
  - Click nút "Dịch tự động" (🌐) bên cạnh mỗi trường
  - Hệ thống tự động dịch và điền vào trường tiếng Anh
  - Bạn có thể chỉnh sửa bản dịch trước khi lưu

#### 2. **Trading Accounts** (Tài khoản Live Results)
- **Nơi cập nhật**: File `data/tradingAccounts.ts`
- **Các trường cần cập nhật thủ công**:
  - `badge` → `badge_en`
  - `description` → `description_en`
  - `highlights` → `highlights_en` (mảng)
- **Lưu ý**: Phần này CHƯA có tự động dịch, cần nhập thủ công cả 2 ngôn ngữ

#### 3. **Partners** (Broker đối tác)
- **Nơi cập nhật**: File `data/partners.ts`
- **Các trường cần cập nhật thủ công**:
  - `spread` → `spread_en`
  - `license` → `license_en`
  - `deposit` → `deposit_en`
  - `support` → `support_en`
  - `notes` → `notes_en`
- **Lưu ý**: Phần này CHƯA có tự động dịch, cần nhập thủ công cả 2 ngôn ngữ

---

### 🔧 NỘI DUNG TĨNH (Cần cập nhật file JSON)

Các phần này được quản lý qua file `locales/vi.json` và `locales/en.json`:

#### ✅ Đã hoàn thành bilingual:
1. **Header & Navigation** - Menu, nút đăng nhập/đăng ký
2. **Footer** - Links, copyright, social media
3. **Homepage** - Hero, features, testimonials, FAQ
4. **Login Page** - Form đăng nhập
5. **Register Page** - Form đăng ký
6. **Pricing Page** - Bảng giá, FAQ, form liên hệ
7. **About EA Page** - Giới thiệu về EA
8. **Live Results Page** - Trang kết quả live
9. **Downloads Page** - Trang tải xuống
10. **Partners Page** - Trang đối tác
11. **Blog Page** - Trang danh sách blog
12. **Affiliate Pages** - Tất cả trang affiliate (overview, ban-ea, copy-social, ban-khoa-hoc)

#### 📝 Cách cập nhật nội dung tĩnh:

```bash
# 1. Mở file locales/vi.json
# 2. Tìm key tương ứng (ví dụ: "pricing.hero.title")
# 3. Cập nhật giá trị tiếng Việt
# 4. Mở file locales/en.json
# 5. Cập nhật giá trị tiếng Anh tương ứng
# 6. Lưu cả 2 file
```

**Ví dụ**:
```json
// locales/vi.json
{
  "pricing": {
    "hero": {
      "title": "Bảng Giá EA ThebenchmarkTrader"
    }
  }
}

// locales/en.json
{
  "pricing": {
    "hero": {
      "title": "EA ThebenchmarkTrader Pricing"
    }
  }
}
```

---

## 🚀 Hướng Dẫn Cập Nhật Nội Dung

### 📝 Cập Nhật Blog Post (Có tự động dịch)

1. **Đăng nhập Admin Dashboard**: `/admin`
2. **Vào Blog Management**: Menu bên trái
3. **Tạo/Sửa bài viết**:
   - Nhập **Title** (tiếng Việt)
   - Click nút **🌐 Dịch tự động** → Tự động điền `Title (English)`
   - Nhập **Excerpt** (tiếng Việt)
   - Click nút **🌐 Dịch tự động** → Tự động điền `Excerpt (English)`
   - Nhập **Content** (tiếng Việt) trong Rich Text Editor
   - Click nút **🌐 Dịch tự động** → Tự động điền `Content (English)`
4. **Kiểm tra và chỉnh sửa** bản dịch tự động nếu cần
5. **Lưu bài viết**

**Lưu ý quan trọng**:
- Bản dịch tự động có thể không hoàn hảo 100%
- Nên kiểm tra và chỉnh sửa các thuật ngữ chuyên môn
- Đối với nội dung quan trọng, nên review kỹ bản tiếng Anh

---

### 📊 Cập Nhật Trading Accounts (Live Results)

**File**: `data/tradingAccounts.ts`

```typescript
{
  id: "tickmill-social",
  name: "Tickmill Social Trading",
  badge: "50+ Investors",
  badge_en: "50+ Investors", // ← Cập nhật thủ công
  description: "Copy trading trên nền tảng Tickmill Social",
  description_en: "Copy trading on Tickmill Social platform", // ← Cập nhật thủ công
  highlights: [
    "Profit share 20%",
    "Min $200 để copy"
  ],
  highlights_en: [ // ← Cập nhật thủ công
    "20% profit share",
    "Min $200 to copy"
  ],
  // ... các trường khác
}
```

**Quy trình**:
1. Mở file `data/tradingAccounts.ts`
2. Tìm tài khoản cần cập nhật
3. Cập nhật trường tiếng Việt (ví dụ: `description`)
4. Cập nhật trường tiếng Anh tương ứng (ví dụ: `description_en`)
5. Lưu file
6. Commit và push lên Git

---

### 🤝 Cập Nhật Partners (Broker)

**File**: `data/partners.ts`

```typescript
{
  id: "tickmill",
  name: "Tickmill",
  spread: "Từ 0.0 pips (Raw account)",
  spread_en: "From 0.0 pips (Raw account)", // ← Cập nhật thủ công
  license: "FCA (UK), CySEC (Cyprus), FSA (Seychelles)",
  license_en: "FCA (UK), CySEC (Cyprus), FSA (Seychelles)", // ← Cập nhật thủ công
  // ... các trường khác
}
```

**Quy trình**: Tương tự như Trading Accounts

---

### 🎨 Cập Nhật Nội Dung Tĩnh (Static Content)

**Files**: `locales/vi.json` và `locales/en.json`

#### Ví dụ: Cập nhật giá EA trên Pricing Page

1. **Mở `locales/vi.json`**:
```json
{
  "pricing": {
    "plans": [
      {
        "name": "EA Demo",
        "price": "Miễn phí",
        "description": "Dùng thử trên tài khoản demo"
      }
    ]
  }
}
```

2. **Mở `locales/en.json`**:
```json
{
  "pricing": {
    "plans": [
      {
        "name": "EA Demo",
        "price": "Free",
        "description": "Try on demo account"
      }
    ]
  }
}
```

3. **Lưu cả 2 file và commit**

---

## 🔍 Checklist Khi Cập Nhật Nội Dung

### ✅ Cho Blog Posts (Có auto-translate):
- [ ] Nhập nội dung tiếng Việt
- [ ] Click nút "Dịch tự động" cho mỗi trường
- [ ] Kiểm tra và chỉnh sửa bản dịch tự động
- [ ] Lưu bài viết
- [ ] Test hiển thị cả 2 ngôn ngữ trên frontend

### ✅ Cho Trading Accounts/Partners (Chưa có auto-translate):
- [ ] Cập nhật trường tiếng Việt
- [ ] Cập nhật trường `_en` tương ứng
- [ ] Lưu file
- [ ] Commit và push
- [ ] Test hiển thị cả 2 ngôn ngữ trên frontend

### ✅ Cho Static Content (JSON files):
- [ ] Cập nhật `locales/vi.json`
- [ ] Cập nhật `locales/en.json` (cùng key)
- [ ] Lưu cả 2 file
- [ ] Commit và push
- [ ] Test hiển thị cả 2 ngôn ngữ trên frontend

---

## 🛠️ Công Cụ Hỗ Trợ

### 1. **BilingualInput Component**
- Dùng cho các trường input text ngắn
- Có nút "Dịch tự động" tích hợp
- Tự động gọi Google Translate API

### 2. **BilingualRichTextEditor Component**
- Dùng cho nội dung dài (blog content)
- Hỗ trợ HTML formatting
- Có nút "Dịch tự động" tích hợp
- Xử lý chunking cho nội dung dài

### 3. **Translation API**
- **File**: `lib/translation.ts`
- **Functions**:
  - `translateWithGoogle(text, targetLang)`: Dịch text sang ngôn ngữ đích
  - Hỗ trợ: vi → en, en → vi

---

## 📋 Danh Sách Trang Cần Theo Dõi

| Trang | Bilingual Status | Cách Cập Nhật | Auto-translate |
|-------|------------------|---------------|----------------|
| Homepage | ✅ Hoàn thành | JSON files | ❌ |
| Login | ✅ Hoàn thành | JSON files | ❌ |
| Register | ✅ Hoàn thành | JSON files | ❌ |
| Pricing | ✅ Hoàn thành | JSON files | ❌ |
| About EA | ✅ Hoàn thành | JSON files | ❌ |
| Live Results | ✅ Hoàn thành | JSON + `tradingAccounts.ts` | ❌ |
| Downloads | ✅ Hoàn thành | JSON files | ❌ |
| Partners | ✅ Hoàn thành | JSON + `partners.ts` | ❌ |
| Blog List | ✅ Hoàn thành | JSON files | ❌ |
| Blog Detail | ✅ Hoàn thành | Admin Dashboard | ✅ |
| Affiliate Overview | ✅ Hoàn thành | JSON files | ❌ |
| Affiliate - Bán EA | ✅ Hoàn thành | JSON files | ❌ |
| Affiliate - Copy Social | ✅ Hoàn thành | JSON files | ❌ |
| Affiliate - Bán Khóa Học | ✅ Hoàn thành | JSON files | ❌ |
| Affiliate - Apply | ⏳ Chưa hoàn thành | Cần migrate | ❌ |

---

## 🚨 Lưu Ý Quan Trọng

### 1. **Đồng bộ nội dung**
- Khi cập nhật tiếng Việt, **PHẢI** cập nhật tiếng Anh tương ứng
- Nếu thiếu bản dịch, hệ thống sẽ fallback về tiếng Việt

### 2. **Kiểm tra sau khi cập nhật**
- Luôn test cả 2 ngôn ngữ trên frontend
- Click nút chuyển ngôn ngữ (🌐 VI / 🌐 EN) để kiểm tra
- Kiểm tra trên cả desktop và mobile

### 3. **Thuật ngữ chuyên môn**
- Một số thuật ngữ forex/trading nên giữ nguyên tiếng Anh
- Ví dụ: "EA", "Spread", "Pip", "Lot", "Leverage"
- Bản dịch tự động có thể dịch sai các thuật ngữ này

### 4. **Backup trước khi sửa**
- Luôn commit code trước khi sửa file JSON
- Có thể rollback nếu sửa sai

---

## 🎯 Kế Hoạch Tương Lai

### Cần bổ sung auto-translate cho:
1. **Trading Accounts** (`data/tradingAccounts.ts`)
2. **Partners** (`data/partners.ts`)
3. **Downloads items** (nếu có thêm sản phẩm mới)

### Cần hoàn thành bilingual:
1. **Affiliate Apply Page** (`/referral/apply`)
2. **Admin Dashboard** (nếu cần đa ngôn ngữ cho admin)

---

## 📞 Hỗ Trợ

Nếu gặp vấn đề khi cập nhật nội dung song ngữ:

1. **Kiểm tra file log**: Console browser (F12)
2. **Kiểm tra API response**: Network tab trong DevTools
3. **Kiểm tra translation keys**: Đảm bảo key trong JSON files khớp với code
4. **Test auto-translate**: Thử dịch một đoạn text ngắn trước

---

## 📚 Tài Liệu Liên Quan

- `lib/i18n/LocaleContext.tsx` - Context quản lý ngôn ngữ
- `lib/translation.ts` - API dịch tự động
- `components/admin/BilingualInput.tsx` - Component input song ngữ
- `components/admin/BilingualRichTextEditor.tsx` - Component editor song ngữ
- `locales/vi.json` - Translation tiếng Việt
- `locales/en.json` - Translation tiếng Anh

---

**Cập nhật lần cuối**: December 15, 2024
**Version**: 1.0

