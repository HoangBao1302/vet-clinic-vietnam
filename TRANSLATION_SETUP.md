# 🌍 Auto-Translation System - Setup Guide

## ✅ Hoàn Thành

### 🎯 **Tính Năng:**
- ✅ Auto-translate Vietnamese → English
- ✅ Hybrid: AI translate + Manual review
- ✅ Support HTML content
- ✅ Batch translation
- ✅ Usage monitoring
- ✅ Fallback to Google Translate

---

## 🔧 Setup Instructions

### **Bước 1: Đăng ký DeepL API (FREE)**

1. Truy cập: https://www.deepl.com/pro-api
2. Click **"Sign up for free"**
3. Điền thông tin:
   - Email
   - Password
   - Company (có thể để "Personal Use")
4. Xác nhận email
5. Vào **Account Settings** → **API Keys**
6. Copy API Key (dạng: `xxxxx-xxxx-xxxx:fx`)

**Free Tier:**
- ✅ 500,000 characters/month
- ✅ ~200 blog posts/month
- ✅ No credit card required
- ✅ High-quality translation

---

### **Bước 2: Configure Environment**

Thêm vào file `.env.local`:

```bash
# DeepL Translation API
DEEPL_API_KEY=your-api-key-here:fx
```

**Example:**
```bash
DEEPL_API_KEY=12345678-90ab-cdef-1234-567890abcdef:fx
```

---

### **Bước 3: Test Translation API**

```bash
# Start development server
npm run dev

# Test translation endpoint
curl -X POST http://localhost:3000/api/translate \
  -H "Content-Type: application/json" \
  -d '{
    "type": "text",
    "data": { "text": "Xin chào, đây là bài test" },
    "sourceLang": "vi",
    "targetLang": "en"
  }'

# Expected response:
# {"translatedText":"Hello, this is a test article"}
```

---

## 📚 Usage Examples

### **1. Translate Simple Text**

```typescript
import { translateText } from '@/lib/translation';

const vietnameseText = "EA Forex ThebenchmarkTrader";
const englishText = await translateText(vietnameseText, {
  sourceLang: 'vi',
  targetLang: 'en'
});

console.log(englishText); // "EA Forex ThebenchmarkTrader"
```

---

### **2. Translate Blog Post**

```typescript
import { translateBlogPost } from '@/lib/translation';

const blogPost = {
  title: "Phân tích NFP tháng 12/2024",
  excerpt: "Dữ liệu việc làm Mỹ tăng mạnh...",
  content: "<h2>Giới thiệu</h2><p>Nội dung...</p>"
};

const translated = await translateBlogPost(blogPost);

console.log(translated);
// {
//   title_en: "December 2024 NFP Analysis",
//   excerpt_en: "US employment data surges...",
//   content_en: "<h2>Introduction</h2><p>Content...</p>"
// }
```

---

### **3. Translate Partner Info**

```typescript
import { translatePartner } from '@/lib/translation';

const partner = {
  name: "Tickmill",
  description: "Sàn giao dịch forex uy tín hàng đầu"
};

const translated = await translatePartner(partner);

console.log(translated);
// {
//   name_en: "Tickmill",
//   description_en: "Leading trusted forex trading platform"
// }
```

---

### **4. Batch Translation**

```typescript
import { translateBatch } from '@/lib/translation';

const texts = [
  "Trang chủ",
  "Giới thiệu",
  "Liên hệ"
];

const translated = await translateBatch(texts, {
  sourceLang: 'vi',
  targetLang: 'en'
});

console.log(translated);
// ["Home", "About", "Contact"]
```

---

### **5. Check Usage Statistics**

```typescript
import { getTranslationUsage } from '@/lib/translation';

const usage = await getTranslationUsage();

console.log(usage);
// {
//   characterCount: 125430,
//   characterLimit: 500000
// }
```

Or via API:

```bash
curl http://localhost:3000/api/translate

# Response:
# {
#   "used": 125430,
#   "limit": 500000,
#   "remaining": 374570,
#   "percentage": 25.09
# }
```

---

## 🎨 Admin UI Integration

### **Add Auto-Translate Button to Blog Form:**

```typescript
"use client";

import { useState } from 'react';

export default function BlogForm() {
  const [titleVi, setTitleVi] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [translating, setTranslating] = useState(false);

  const handleAutoTranslate = async () => {
    setTranslating(true);
    
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'text',
          data: { text: titleVi },
          sourceLang: 'vi',
          targetLang: 'en'
        })
      });

      const data = await response.json();
      setTitleEn(data.translatedText);
    } catch (error) {
      console.error('Translation failed:', error);
      alert('Dịch tự động thất bại. Vui lòng thử lại.');
    } finally {
      setTranslating(false);
    }
  };

  return (
    <div>
      {/* Vietnamese Input */}
      <div>
        <label>Tiêu đề (Tiếng Việt)</label>
        <input
          value={titleVi}
          onChange={(e) => setTitleVi(e.target.value)}
          placeholder="Nhập tiêu đề tiếng Việt"
        />
      </div>

      {/* Auto-Translate Button */}
      <button
        onClick={handleAutoTranslate}
        disabled={!titleVi || translating}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {translating ? '⏳ Đang dịch...' : '🌍 Dịch tự động'}
      </button>

      {/* English Input (Editable) */}
      <div>
        <label>Title (English)</label>
        <input
          value={titleEn}
          onChange={(e) => setTitleEn(e.target.value)}
          placeholder="Auto-translated or manual input"
        />
        <small className="text-gray-500">
          ✏️ Có thể chỉnh sửa sau khi dịch tự động
        </small>
      </div>
    </div>
  );
}
```

---

## 📊 Database Schema Migration

### **Blog Posts:**

```typescript
// Before
interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  // ... other fields
}

// After (Bilingual)
interface BlogPost {
  id: string;
  title_vi: string;
  title_en: string;
  excerpt_vi: string;
  excerpt_en: string;
  content_vi: string;
  content_en: string;
  author: string;      // Shared
  date: string;        // Shared
  category: string;    // Shared
  image: string;       // Shared
  featured: boolean;   // Shared
  tags: string[];      // Shared
}
```

### **Partners:**

```typescript
interface Partner {
  id: string;
  name_vi: string;
  name_en: string;
  description_vi?: string;
  description_en?: string;
  url: string;         // Shared
  rating: number;      // Shared
  status: string;      // Shared
}
```

### **Trading Accounts:**

```typescript
interface TradingAccount {
  id: string;
  account_id: string;
  description_vi?: string;
  description_en?: string;
  gain: string;        // Shared
  drawdown: string;    // Shared
  days: number;        // Shared
}
```

---

## 🔄 Migration Workflow

### **Step 1: Backup Existing Data**

```bash
# Export current data
node scripts/export-content.js > backup-content.json
```

### **Step 2: Auto-Translate Existing Content**

```typescript
import { translateBlogPost } from '@/lib/translation';
import { allBlogPosts } from '@/data/blogPosts';

async function migrateExistingBlogs() {
  const translated = [];
  
  for (const post of allBlogPosts) {
    const result = await translateBlogPost({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content
    });
    
    translated.push({
      ...post,
      title_vi: post.title,
      title_en: result.title_en,
      excerpt_vi: post.excerpt,
      excerpt_en: result.excerpt_en,
      content_vi: post.content,
      content_en: result.content_en,
    });
    
    // Wait 500ms between requests to avoid rate limit
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  return translated;
}
```

### **Step 3: Update Display Logic**

```typescript
import { useLocale } from '@/lib/i18n/LocaleContext';

export default function BlogPost({ post }) {
  const { locale } = useLocale();
  
  const title = locale === 'en' ? post.title_en : post.title_vi;
  const excerpt = locale === 'en' ? post.excerpt_en : post.excerpt_vi;
  const content = locale === 'en' ? post.content_en : post.content_vi;
  
  return (
    <article>
      <h1>{title}</h1>
      <p>{excerpt}</p>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </article>
  );
}
```

---

## 💰 Cost Estimation

### **DeepL Free Tier:**
- **Limit:** 500,000 characters/month
- **Average blog post:** 2,500 characters
- **Capacity:** ~200 blog posts/month
- **Cost:** **$0/month** (FREE)

### **If exceeding Free Tier:**

**DeepL Pro:**
- **Cost:** $5.49/month + $0.000025/character
- **Example:** 1,000,000 chars/month = $5.49 + $25 = **$30.49/month**

**Alternative - OpenAI GPT-4:**
- **Cost:** ~$0.03/request for translation
- **30 posts/month:** ~$0.90/month
- **Very affordable!**

---

## 🚀 Next Steps

### **Phase 1: Blog (Week 1)**
- [x] Setup translation service
- [x] Create API endpoint
- [ ] Add auto-translate button to admin blog form
- [ ] Migrate existing blog posts
- [ ] Update blog display logic
- [ ] Test thoroughly

### **Phase 2: Content Dashboard (Week 2)**
- [ ] Add auto-translate for Partners
- [ ] Add auto-translate for Trading Accounts
- [ ] Add auto-translate for Featured Results
- [ ] Update admin UI
- [ ] Test all forms

### **Phase 3: Other Content (Week 3)**
- [ ] Downloads page
- [ ] About page
- [ ] Any other dynamic content

---

## 🛠️ Troubleshooting

### **Error: "DEEPL_API_KEY not configured"**
**Solution:** Add API key to `.env.local` and restart server

### **Error: "API quota exceeded"**
**Solution:** 
- Check usage: `GET /api/translate`
- Wait until next month
- Or upgrade to DeepL Pro

### **Error: "Translation failed"**
**Solution:**
- Check internet connection
- Verify API key is valid
- Check DeepL service status
- Fallback to manual translation

### **Poor translation quality**
**Solution:**
- Review and manually edit translations
- Add context/glossary to DeepL (Pro feature)
- Use GPT-4 for better context understanding

---

## 📞 Support

**DeepL Support:**
- Website: https://www.deepl.com/support
- Docs: https://www.deepl.com/docs-api

**Questions?**
- Check documentation
- Test with simple text first
- Monitor usage statistics

---

## ✅ Checklist

- [ ] DeepL API key obtained
- [ ] API key added to `.env.local`
- [ ] Server restarted
- [ ] Test translation API works
- [ ] Translation usage monitored
- [ ] Admin UI updated
- [ ] Existing content migrated
- [ ] Display logic updated
- [ ] Tested on production

**Estimated setup time:** 1-2 hours
**Estimated migration time:** 2-3 hours (depending on content volume)

