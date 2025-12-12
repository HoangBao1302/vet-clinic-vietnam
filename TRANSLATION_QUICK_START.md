# 🚀 Auto-Translation - Quick Start Guide

## ✅ Đã Hoàn Thành

Hệ thống dịch tự động đã được setup xong! Bạn chỉ cần:
1. Đăng ký DeepL API (FREE)
2. Thêm API key vào `.env.local`
3. Sử dụng components trong admin forms

---

## 📝 Bước 1: Đăng Ký DeepL API (5 phút)

### **1.1. Truy cập DeepL:**
```
https://www.deepl.com/pro-api
```

### **1.2. Sign Up:**
- Click **"Sign up for free"**
- Email: `your-email@gmail.com`
- Password: Tạo password mạnh
- Company: `ThebenchmarkTrader` (hoặc "Personal Use")
- Click **"Create account"**

### **1.3. Verify Email:**
- Check email inbox
- Click link xác nhận

### **1.4. Get API Key:**
- Login vào DeepL account
- Vào **Account Settings** → **API Keys**
- Click **"Create new API key"**
- Copy API key (dạng: `12345678-90ab-cdef-1234-567890abcdef:fx`)

**⚠️ Lưu ý:** Free API keys kết thúc bằng `:fx`

---

## 🔧 Bước 2: Configure Project (2 phút)

### **2.1. Tạo file `.env.local`:**

Trong thư mục root project, tạo file `.env.local` (nếu chưa có):

```bash
# DeepL Translation API (FREE: 500K chars/month)
DEEPL_API_KEY=paste-your-api-key-here:fx

# Example:
# DEEPL_API_KEY=12345678-90ab-cdef-1234-567890abcdef:fx
```

### **2.2. Restart Server:**

```bash
# Stop server (Ctrl+C)
# Start lại
npm run dev
```

---

## 🧪 Bước 3: Test Translation (2 phút)

### **3.1. Test API Endpoint:**

Mở browser, vào:
```
http://localhost:3000/api/translate
```

Bạn sẽ thấy usage statistics:
```json
{
  "used": 0,
  "limit": 500000,
  "remaining": 500000,
  "percentage": 0
}
```

✅ **Nếu thấy JSON này = Setup thành công!**

### **3.2. Test Translation:**

Mở Terminal mới, chạy:

```bash
curl -X POST http://localhost:3000/api/translate -H "Content-Type: application/json" -d "{\"type\":\"text\",\"data\":{\"text\":\"Xin chào, đây là test dịch tự động\"},\"sourceLang\":\"vi\",\"targetLang\":\"en\"}"
```

Kết quả mong đợi:
```json
{
  "translatedText": "Hello, this is an automatic translation test"
}
```

✅ **Nếu thấy kết quả dịch = Hoạt động hoàn hảo!**

---

## 🎨 Bước 4: Sử Dụng Trong Admin Forms

### **Example 1: Blog Form với BilingualInput**

```typescript
"use client";

import { useState } from 'react';
import BilingualInput from '@/components/admin/BilingualInput';

export default function BlogForm() {
  const [titleVi, setTitleVi] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [excerptVi, setExcerptVi] = useState('');
  const [excerptEn, setExcerptEn] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save blog post with both languages
    const blogPost = {
      title_vi: titleVi,
      title_en: titleEn,
      excerpt_vi: excerptVi,
      excerpt_en: excerptEn,
      // ... other fields
    };

    // API call to save
    await fetch('/api/admin/blogs', {
      method: 'POST',
      body: JSON.stringify(blogPost),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold">Tạo Bài Viết Mới</h2>

      {/* Bilingual Title Input */}
      <BilingualInput
        label="Tiêu đề"
        valueVi={titleVi}
        valueEn={titleEn}
        onChangeVi={setTitleVi}
        onChangeEn={setTitleEn}
        type="text"
        placeholderVi="Nhập tiêu đề bài viết..."
        placeholderEn="Enter article title..."
        required
        showAutoTranslate
      />

      {/* Bilingual Excerpt Input */}
      <BilingualInput
        label="Mô tả ngắn"
        valueVi={excerptVi}
        valueEn={excerptEn}
        onChangeVi={setExcerptVi}
        onChangeEn={setExcerptEn}
        type="textarea"
        rows={4}
        placeholderVi="Mô tả ngắn về bài viết..."
        placeholderEn="Short description..."
        required
        showAutoTranslate
      />

      <button
        type="submit"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg"
      >
        Lưu Bài Viết
      </button>
    </form>
  );
}
```

### **Example 2: Partner Form**

```typescript
"use client";

import { useState } from 'react';
import BilingualInput from '@/components/admin/BilingualInput';

export default function PartnerForm() {
  const [nameVi, setNameVi] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [descVi, setDescVi] = useState('');
  const [descEn, setDescEn] = useState('');

  return (
    <form className="space-y-6">
      <BilingualInput
        label="Tên Partner"
        valueVi={nameVi}
        valueEn={nameEn}
        onChangeVi={setNameVi}
        onChangeEn={setNameEn}
        required
      />

      <BilingualInput
        label="Mô tả"
        valueVi={descVi}
        valueEn={descEn}
        onChangeVi={setDescVi}
        onChangeEn={setDescEn}
        type="textarea"
        rows={3}
      />

      <button type="submit">Lưu Partner</button>
    </form>
  );
}
```

### **Example 3: Standalone Auto-Translate Button**

```typescript
import AutoTranslateButton from '@/components/admin/AutoTranslateButton';

export default function MyForm() {
  const [viText, setViText] = useState('');
  const [enText, setEnText] = useState('');

  return (
    <div>
      <input
        value={viText}
        onChange={(e) => setViText(e.target.value)}
        placeholder="Tiếng Việt"
      />

      <AutoTranslateButton
        text={viText}
        onTranslated={(translated) => setEnText(translated)}
        variant="primary"
        size="md"
      />

      <input
        value={enText}
        onChange={(e) => setEnText(e.target.value)}
        placeholder="English"
      />
    </div>
  );
}
```

---

## 📊 Workflow Thực Tế

### **Khi Admin Tạo Blog Post Mới:**

1. **Viết nội dung TIẾNG VIỆT** trong tab "🇻🇳 Tiếng Việt"
2. Click **"🌍 Dịch sang Tiếng Anh"** button
3. Hệ thống tự động dịch → Hiển thị trong tab "🇬🇧 English"
4. **Review bản dịch** trong tab English
5. **Chỉnh sửa nếu cần** (optional)
6. Click **"Lưu Bài Viết"** → Lưu cả 2 phiên bản

### **Khi User Xem Website:**

- User chọn **🇻🇳 Tiếng Việt** → Hiển thị `title_vi`, `excerpt_vi`, `content_vi`
- User chọn **🇬🇧 English** → Hiển thị `title_en`, `excerpt_en`, `content_en`

---

## 💰 Chi Phí & Giới Hạn

### **DeepL Free Tier:**
- ✅ **500,000 characters/month** (FREE)
- ✅ ~200 blog posts/month
- ✅ ~50 partners/month
- ✅ Không cần credit card

### **Ví dụ tính toán:**

**1 Blog Post trung bình:**
- Title: 50 chars
- Excerpt: 150 chars
- Content: 2,000 chars
- **Total: ~2,200 chars**

**Monthly capacity:**
- 500,000 / 2,200 = **~227 blog posts/month**

**Nếu viết 30 bài/tháng:**
- 30 × 2,200 = 66,000 chars
- **Chỉ dùng 13% quota** ✅

---

## 🔍 Monitoring Usage

### **Check Usage via API:**

```bash
curl http://localhost:3000/api/translate
```

Response:
```json
{
  "used": 125430,
  "limit": 500000,
  "remaining": 374570,
  "percentage": 25.09
}
```

### **Check Usage trên DeepL Dashboard:**

1. Login vào https://www.deepl.com/account
2. Vào **Usage** tab
3. Xem biểu đồ usage theo tháng

---

## 🛠️ Troubleshooting

### **❌ Error: "DEEPL_API_KEY not configured"**

**Nguyên nhân:** API key chưa được thêm vào `.env.local`

**Giải pháp:**
1. Check file `.env.local` có tồn tại không
2. Check API key có đúng format không (phải kết thúc bằng `:fx`)
3. Restart server: `npm run dev`

---

### **❌ Error: "Translation failed"**

**Nguyên nhân:** 
- Internet connection issue
- API key không hợp lệ
- DeepL service down

**Giải pháp:**
1. Check internet connection
2. Verify API key trên DeepL dashboard
3. Hệ thống sẽ tự động fallback sang Google Translate
4. Nếu vẫn lỗi, dịch thủ công

---

### **❌ Error: "API quota exceeded"**

**Nguyên nhân:** Đã dùng hết 500K chars/month

**Giải pháp:**
1. Đợi đến tháng sau (quota reset)
2. Hoặc upgrade lên DeepL Pro ($5.49/month)
3. Tạm thời dịch thủ công

---

### **⚠️ Chất lượng dịch không tốt**

**Giải pháp:**
1. **Review và edit** bản dịch trong tab English
2. Dịch từng phần nhỏ thay vì cả đoạn dài
3. Với technical terms, có thể giữ nguyên tiếng Anh

---

## ✅ Checklist Hoàn Thành

- [ ] Đăng ký DeepL API account
- [ ] Copy API key
- [ ] Thêm `DEEPL_API_KEY` vào `.env.local`
- [ ] Restart server
- [ ] Test API endpoint: `GET /api/translate`
- [ ] Test translation: `POST /api/translate`
- [ ] Integrate `BilingualInput` vào admin forms
- [ ] Test workflow: Vietnamese → Auto-translate → Review → Save
- [ ] Deploy to Vercel (remember to add env var!)

---

## 🚀 Next Steps

### **Phase 1: Blog (This Week)**
1. ✅ Translation service setup
2. [ ] Update blog admin form với `BilingualInput`
3. [ ] Migrate existing blog posts
4. [ ] Update blog display logic
5. [ ] Test thoroughly

### **Phase 2: Content Dashboard (Next Week)**
1. [ ] Update Partners form
2. [ ] Update Trading Accounts form
3. [ ] Update Featured Results form
4. [ ] Test all forms

### **Phase 3: Other Pages**
1. [ ] Downloads page
2. [ ] About page
3. [ ] Any other dynamic content

---

## 📞 Support

**Nếu gặp vấn đề:**
1. Check `.env.local` file
2. Check server logs
3. Test API endpoint
4. Check DeepL dashboard

**DeepL Documentation:**
- https://www.deepl.com/docs-api

---

## 🎯 Summary

✅ **Setup time:** 5-10 phút
✅ **Cost:** FREE (500K chars/month)
✅ **Capacity:** ~200 blog posts/month
✅ **Quality:** High (DeepL is best-in-class)
✅ **Workflow:** Viết 1 lần → Auto-translate → Review → Done

**Bạn chỉ cần:**
1. Đăng ký DeepL (5 phút)
2. Add API key (1 phút)
3. Restart server (30 giây)
4. Sử dụng `BilingualInput` component

**Thế là xong! 🎉**

