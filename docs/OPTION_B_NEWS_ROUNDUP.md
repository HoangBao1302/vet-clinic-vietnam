# 📰 Option B: News Roundup Blog Post (Automation #5 Enhanced)

## 🎯 Mục Tiêu

Modify **Automation #5 (News API Integration)** để tự động tạo blog post tổng hợp tin tức Forex mỗi 2 giờ.

---

## 📋 Current vs. New Behavior

### **Before (Current):**
```
Automation #5 chạy mỗi 2 giờ
→ Fetch forex headlines từ NewsAPI
→ Post headlines vào Slack
→ ❌ Không tạo blog post
```

### **After (Enhanced):**
```
Automation #5 chạy mỗi 2 giờ
→ Fetch forex headlines từ NewsAPI
→ ✅ Tạo blog post "News Roundup"
→ Post vào MongoDB via API
→ Notify Slack
→ ✅ Blog xuất hiện trên website
```

---

## 🔧 Implementation Steps

### **Step 1: Open Automation #5**

1. Mở **Cursor IDE**
2. Click **Automations** (sidebar)
3. Tìm **"News API Integration"** hoặc **"Forex News Automation"**
4. Click vào để mở

---

### **Step 2: Update Agent Instructions**

Click **"Edit"** hoặc **"Settings"**, tìm phần **"Agent Instructions"** và thay thế bằng:

```
TASK: Fetch forex news headlines and create a blog post roundup

STEPS:
1. Fetch top 5-10 forex news headlines from NewsAPI
   - Query: "forex OR currency OR EUR/USD OR trading"
   - Language: English
   - Sort by: publishedAt (most recent)

2. Create a blog post with format:
   Title: "Forex News Roundup - [Date]"
   Author: "News Bot"
   Category: "news"
   Tags: ["forex-news", "headlines", "market-news"]
   
3. Content structure:
   ---
   # Forex News Roundup - [Date]
   
   Tổng hợp tin tức Forex nổi bật trong 2 giờ qua:
   
   ## 📰 Tin Tức Chính
   
   ### [Headline 1]
   **Nguồn:** [Source Name]  
   **Thời gian:** [Time]  
   🔗 [Đọc thêm]([URL])
   
   ### [Headline 2]
   **Nguồn:** [Source Name]  
   **Thời gian:** [Time]  
   🔗 [Đọc thêm]([URL])
   
   [... repeat for all headlines ...]
   
   ---
   
   💡 **Lưu ý:** Đây là tổng hợp tin tức từ các nguồn uy tín. 
   Click vào link để đọc bài viết đầy đủ từ nguồn gốc.
   ---

4. Publish blog post:
   - Method: POST
   - Endpoint: https://[your-domain]/api/admin/blog
   - Headers:
     - Authorization: Bearer {AUTOMATION_BLOG_API_KEY}
     - Content-Type: application/json
   - Body:
     {
       "title": "Forex News Roundup - [Date]",
       "slug": "forex-news-roundup-[date-slug]",
       "content": "[Full markdown content]",
       "excerpt": "Tổng hợp tin tức Forex nổi bật: [top 3 headlines]",
       "author": "News Bot",
       "category": "news",
       "tags": ["forex-news", "headlines"],
       "date": "[ISO date]",
       "status": "published"
     }

5. Post Slack notification:
   - Channel: #all-thebenchmarktrader
   - Format:
     "📰 News Roundup Published!
     
     🗞️ [Number] forex headlines compiled
     🔗 View post: /blog/forex-news-roundup-[date]
     
     Top stories:
     • [Headline 1]
     • [Headline 2]
     • [Headline 3]"

IMPORTANT NOTES:
- Use NEWS_API_KEY from secrets for NewsAPI calls
- Use AUTOMATION_BLOG_API_KEY for blog API authentication
- Only include headlines + links (NO full article content - copyright!)
- Add proper attribution (source name + link)
- If NewsAPI returns < 3 articles, skip creating blog post (post Slack notification only)
- Handle API errors gracefully
- Each news roundup is a separate blog post (don't update existing posts)

LEGAL COMPLIANCE:
- ✅ Headlines + links = Fair Use
- ✅ Source attribution included
- ❌ DO NOT copy full article content
- ✅ Only aggregating with links to original
```

---

### **Step 3: Verify Secrets**

Ensure these secrets are configured in **Cursor → Settings → Cloud Agents → Secrets**:

| Secret Name | Type | Value | Purpose |
|-------------|------|-------|---------|
| `NEWS_API_KEY` | Runtime Secret | 7dcc920848834c919e195c8da05f91c0 | NewsAPI access |
| `AUTOMATION_BLOG_API_KEY` | Runtime Secret | f8a7e3d2c9b4f1a6e8d5c2b9f7a4e1d8... | Blog API auth |

---

### **Step 4: Update Trigger (Optional)**

**Current:** Every 2 hours

**Options:**
- Keep 2 hours (12 posts/day)
- Change to 4 hours (6 posts/day) ← Recommended
- Change to 6 hours (4 posts/day)

To change:
1. In Automation settings → **Triggers**
2. Click on schedule trigger
3. Change cron: `0 */4 * * *` (every 4 hours)
4. Save

---

### **Step 5: Save & Test**

1. Click **"Save"** automation
2. Click **"Run Now"** để test ngay (optional)
3. Check:
   - Slack notification
   - Blog post on `/blog`
   - MongoDB record in `/admin/blog`

---

## 📊 Expected Output

### **Blog Post Example:**

```markdown
---
title: "Forex News Roundup - 13/09/2026 7:00 PM"
date: "2026-09-13T19:00:00Z"
author: "News Bot"
category: "news"
tags: ["forex-news", "headlines", "market-news"]
excerpt: "Tổng hợp tin tức Forex nổi bật: EUR/USD breaks resistance, Fed hints at rate hold, Gold surges to new highs"
status: "published"
---

# Forex News Roundup - 13/09/2026 7:00 PM

Tổng hợp tin tức Forex nổi bật trong 2 giờ qua:

## 📰 Tin Tức Chính

### EUR/USD Breaks Above 1.16 Resistance Level
**Nguồn:** FXStreet  
**Thời gian:** 2 giờ trước  
🔗 [Đọc thêm](https://fxstreet.com/news/...)

### Federal Reserve Signals Potential Rate Hold in December
**Nguồn:** Reuters  
**Thời gian:** 3 giờ trước  
🔗 [Đọc thêm](https://reuters.com/markets/...)

### Gold Surges Past $2,400 Amid Safe-Haven Demand
**Nguồn:** Investing.com  
**Thời gian:** 1 giờ trước  
🔗 [Đọc thêm](https://investing.com/news/...)

### Japanese Yen Strengthens on BOJ Policy Speculation
**Nguồn:** ForexLive  
**Thời gian:** 4 giờ trước  
🔗 [Đọc thêm](https://forexlive.com/news/...)

### Oil Prices Dip as OPEC+ Production Concerns Ease
**Nguồn:** Bloomberg  
**Thời gian:** 2 giờ trước  
🔗 [Đọc thêm](https://bloomberg.com/news/...)

---

💡 **Lưu ý:** Đây là tổng hợp tin tức từ các nguồn uy tín. 
Click vào link để đọc bài viết đầy đủ từ nguồn gốc.

---

**Tags:** #forex-news #headlines #market-news  
**Category:** News  
**Published:** 13/09/2026 7:00 PM
```

---

### **Slack Notification Example:**

```
📰 News Roundup Published!

🗞️ 5 forex headlines compiled
🔗 View post: /blog/forex-news-roundup-13092026-1900

Top stories:
• EUR/USD Breaks Above 1.16 Resistance Level
• Federal Reserve Signals Potential Rate Hold
• Gold Surges Past $2,400 Amid Safe-Haven Demand

Open in Cursor · Composer 2.5 · News API · View Post
```

---

## 📋 Testing Checklist

After implementing:

- [ ] Automation saved successfully
- [ ] Run "Test Now" or wait for next scheduled run
- [ ] Check Slack notification appears
- [ ] Check blog post on website `/blog`
- [ ] Verify post in `/admin/blog`
- [ ] Check MongoDB record created
- [ ] Click links in blog post → Should go to original sources
- [ ] Verify no copyright violations (only headlines + links)

---

## ⚙️ Configuration Options

### **Frequency:**
```
Every 2 hours: 0 */2 * * *  (12 posts/day)
Every 4 hours: 0 */4 * * *  (6 posts/day)  ← Recommended
Every 6 hours: 0 */6 * * *  (4 posts/day)
```

### **Number of Headlines:**
```
Minimum: 3 articles
Recommended: 5-7 articles
Maximum: 10 articles
```

### **Language:**
```
English: Default (more sources)
Vietnamese: Fewer sources, might need different API
Mixed: Fetch English, translate titles to Vietnamese (future enhancement)
```

---

## 🛠️ Troubleshooting

### **Issue: No blog post created**
**Check:**
- NEWS_API_KEY configured in Cursor Secrets?
- AUTOMATION_BLOG_API_KEY configured in Cursor Secrets?
- NewsAPI returned >= 3 articles?
- API endpoint `/api/admin/blog` returns 200?

**Fix:**
```
1. Cursor → Automations → Run History → Check logs
2. Verify both secrets configured
3. Test NewsAPI key: curl https://newsapi.org/v2/everything?q=forex&apiKey=YOUR_KEY
4. Test blog API: curl -X POST https://yoursite.com/api/admin/blog -H "Authorization: Bearer KEY"
```

---

### **Issue: Slack notification but no blog**
**Check:**
- Automation created blog post JSON?
- Blog API call succeeded (200 response)?
- MongoDB connection working?

**Fix:**
```
1. Check Run History → View logs
2. Check Vercel deployment logs
3. Verify MongoDB connection in Vercel
4. Test manual POST to /api/admin/blog
```

---

### **Issue: Copyright concerns**
**Safe:**
- ✅ Headlines only
- ✅ Source attribution
- ✅ Links to original
- ✅ No full content

**Not Safe:**
- ❌ Copying full articles
- ❌ Copying article body
- ❌ No attribution
- ❌ Rewriting/paraphrasing without permission

**Current Implementation:**
✅ Fully compliant - only headlines + links + attribution

---

## 📊 Performance & Limits

### **NewsAPI Free Tier:**
- 100 requests/day
- Each automation run = 1 request
- Every 2 hours = 12 requests/day ✅
- Every 4 hours = 6 requests/day ✅ (safer)

### **Blog Storage:**
- Each post: ~2-5 KB
- 12 posts/day = 24-60 KB/day
- 30 days = 720 KB - 1.8 MB/month
- MongoDB M0 Free: 512 MB ✅ No concerns

### **Website Performance:**
- More blog posts = better SEO
- More content = more engagement
- Automatic updates = fresh content

---

## 🎯 Success Metrics

After 1 day:
- [ ] 12 news roundup posts created (if every 2 hours)
- [ ] All posts visible on `/blog`
- [ ] Slack notifications working
- [ ] No API errors

After 1 week:
- [ ] ~84 posts (2h) or ~42 posts (4h)
- [ ] SEO improvement (more indexed pages)
- [ ] User engagement metrics

---

## 📝 Next Steps (Future Enhancements)

1. **Add filtering:** Only forex-specific news (filter out irrelevant)
2. **Add categories:** Separate by currency pairs (EUR/USD, GBP/USD, etc.)
3. **Add summaries:** Use AI to create brief Vietnamese summaries
4. **Add images:** Fetch featured images from articles
5. **Add sentiment:** Bullish/Bearish indicators per headline

---

## ✅ Completion

When done:
- ✅ Agent instructions updated
- ✅ Secrets verified
- ✅ Automation saved
- ✅ Test run successful
- ✅ Blog posts appearing
- ✅ Slack notifications working

---

**Status:** Ready for implementation  
**Difficulty:** Easy (just update agent instructions)  
**Time Required:** 10 minutes  
**Impact:** High (automatic content generation)

---

🎉 **Option B Complete! Now proceed to Option C!** →
