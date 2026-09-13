# 📰 Option B: News Roundup Blog Post (Automation #5 Enhanced)

## 🎯 Mục Tiêu

Modify **Automation #5 (News API Integration)** để tự động tạo blog post tổng hợp tin tức Forex mỗi 2-4 giờ.

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
Automation #5 chạy mỗi 4 giờ (recommended)
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

Click **"Edit"** hoặc **"Settings"**, tìm phần **"Agent Instructions"** và thay thế bằng đầy đủ instructions sau:

```markdown
TASK: Fetch forex news headlines and create a blog post roundup

SCHEDULE: Every 4 hours (0 */4 * * *)

STEPS:

1. Fetch top 5-7 forex news headlines from NewsAPI:
   - Use NEWS_API_KEY from Cursor secrets
   - Endpoint: https://newsapi.org/v2/everything
   - Query parameters:
     * q: "forex OR currency OR EUR/USD OR GBP/USD OR trading OR gold OR oil"
     * language: en
     * sortBy: publishedAt
     * pageSize: 7
   - Response: Extract title, source name, publishedAt, url

2. Filter and validate news:
   - Keep only forex-related headlines
   - Remove duplicates
   - Ensure at least 3 valid articles
   - If < 3 articles, skip blog post creation (only post Slack notification)

3. Create blog post content (Markdown format):

Title: "Forex News Roundup - [DD/MM/YYYY HH:mm]"
Author: "News Bot"
Category: "news"
Tags: ["forex-news", "headlines", "market-news", "forex-roundup"]
Excerpt: "Tổng hợp tin tức Forex nổi bật: [first 3 headline titles]"

Content template:
```markdown
---
# Forex News Roundup - [Date and Time]

Tổng hợp tin tức Forex và thị trường tài chính nổi bật trong [timeframe] giờ qua:

## 📰 Tin Tức Chính

### 1. [Headline Title]
**Nguồn:** [Source Name] | **Thời gian:** [relative time, e.g. "2 giờ trước"]  
🔗 [Đọc bài viết gốc]([article URL])

**Tóm tắt:** [Optional 1-sentence summary if available]

---

### 2. [Headline Title]
**Nguồn:** [Source Name] | **Thời gian:** [relative time]  
🔗 [Đọc bài viết gốc]([article URL])

---

[... repeat for all headlines ...]

---

## 💡 Lưu Ý

📌 **Nguồn tin cậy:** Tin tức được tổng hợp từ các nguồn uy tín quốc tế  
📌 **Đọc đầy đủ:** Click vào link để đọc bài viết chi tiết từ nguồn gốc  
📌 **Cập nhật liên tục:** Roundup mới mỗi 4 giờ với tin tức mới nhất

---

**Thời gian tổng hợp:** [ISO timestamp]  
**Tags:** #forex-news #headlines #market-news #forex-roundup
```

4. Publish to MongoDB via API:
   - Method: POST
   - Endpoint: https://[your-domain].vercel.app/api/admin/blog
   - Headers:
     ```
     Authorization: Bearer {AUTOMATION_BLOG_API_KEY}
     Content-Type: application/json
     ```
   - Body (JSON):
     ```json
     {
       "title": "Forex News Roundup - [DD/MM/YYYY HH:mm]",
       "slug": "forex-news-roundup-[ddmmyyyy-hhmm]",
       "content": "[Full markdown content]",
       "excerpt": "Tổng hợp tin tức Forex nổi bật: [first 3 headlines]",
       "author": "News Bot",
       "category": "news",
       "tags": ["forex-news", "headlines", "market-news", "forex-roundup"],
       "date": "[ISO 8601 datetime]",
       "status": "published"
     }
     ```

5. Post Slack notification:
   - Channel: #all-thebenchmarktrader
   - Message format:
     ```
     📰 **News Roundup Published!**
     
     🗞️ [Number] forex headlines compiled
     📅 [Date Time]
     🔗 View post: /blog/forex-news-roundup-[slug]
     
     **Top stories:**
     • [Headline 1]
     • [Headline 2]
     • [Headline 3]
     
     🔗 https://thebenchmarktrader.com/blog/forex-news-roundup-[slug]
     ```

---

## IMPORTANT NOTES

### Legal & Copyright:
- ✅ **Headlines only** - no full article content
- ✅ **Source attribution** - always include source name and link
- ✅ **Fair Use** - linking to original articles
- ❌ **DO NOT copy** full article text or body
- ✅ **Original presentation** - our own formatting and organization

### Technical:
- Use **NEWS_API_KEY** from Cursor Cloud Agents secrets
- Use **AUTOMATION_BLOG_API_KEY** for blog API authentication
- Handle API errors gracefully (retry once, then skip and notify)
- Each roundup is a **separate blog post** (don't update existing)
- Slug format: `forex-news-roundup-ddmmyyyy-hhmm` (unique per run)

### Quality:
- Filter out non-forex news (sports, entertainment, etc.)
- Prefer headlines with clear forex/trading relevance
- Remove duplicate headlines from different sources
- Ensure all links are valid before publishing
- If < 3 quality articles, skip blog post (only Slack notification)

---

## SECRETS REQUIRED

Ensure these are configured in **Cursor → Settings → Cloud Agents → Secrets**:

1. **NEWS_API_KEY**
   - Type: Runtime Secret
   - Value: 7dcc920848834c919e195c8da05f91c0
   - Purpose: NewsAPI access

2. **AUTOMATION_BLOG_API_KEY**
   - Type: Runtime Secret
   - Value: f8a7e3d2c9b4f1a6e8d5c2b9f7a4e1d8c6b3f9a7e5d2c0b8f6a4e2d9c7b5f3a1
   - Purpose: Blog API authentication

---

## ERROR HANDLING

### If NewsAPI fails:
```
1. Log error to console
2. Retry once after 5 seconds
3. If still fails, post Slack notification:
   "⚠️ News Roundup Failed - NewsAPI unavailable. Will retry next run."
4. Exit gracefully (don't crash automation)
```

### If Blog API fails:
```
1. Log error + response
2. Save news data to temporary storage (optional)
3. Post Slack notification with error details
4. Don't retry (to avoid duplicates)
```

### If < 3 articles found:
```
1. Skip blog post creation
2. Post Slack notification:
   "ℹ️ News Roundup Skipped - Insufficient articles ([count] found, need 3+)"
```

---

## WORKFLOW DIAGRAM

```
┌─────────────────┐
│  Trigger:       │
│  Every 4 hours  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Fetch News     │
│  from NewsAPI   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Filter &       │
│  Validate       │
│  (min 3 items)  │
└────────┬────────┘
         │
         ├─── < 3? ──┐
         │            │
         ▼            ▼
┌─────────────────┐  ┌──────────────┐
│  Create         │  │  Skip Post   │
│  Blog Post      │  │  Notify Slack│
│  (Markdown)     │  └──────────────┘
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  POST to        │
│  /api/admin/blog│
└────────┬────────┘
         │
         ├─── Success? ─┐
         │               │
         ▼               ▼
┌─────────────────┐  ┌──────────────┐
│  ✅ Published   │  │  ❌ Failed   │
│  Notify Slack   │  │  Notify Error│
└─────────────────┘  └──────────────┘
```

---

## TESTING

After updating automation:

1. Click **"Save"**
2. Click **"Run Now"** to test immediately
3. Check Slack for notification (within 30-60 seconds)
4. Check `/blog` for new post
5. Click into post → Verify:
   - Headlines display correctly
   - Links work (open in new tab)
   - Source attribution present
   - Formatting looks good
6. Check `/admin/blog` → Verify post in MongoDB
7. Check Run History → Should show "✅ Success"

---

## EXAMPLE OUTPUT

### Blog Post Example:

**Title:** Forex News Roundup - 13/09/2026 20:00

**Content:**
```markdown
# Forex News Roundup - 13/09/2026 20:00

Tổng hợp tin tức Forex và thị trường tài chính nổi bật trong 4 giờ qua:

## 📰 Tin Tức Chính

### 1. EUR/USD Breaks Above 1.16 as ECB Signals Rate Pause
**Nguồn:** FXStreet | **Thời gian:** 2 giờ trước  
🔗 [Đọc bài viết gốc](https://fxstreet.com/news/eur-usd-breaks-1-16)

---

### 2. Gold Hits Record High Above $4,500 Amid Geopolitical Tensions
**Nguồn:** Investing.com | **Thời gian:** 1 giờ trước  
🔗 [Đọc bài viết gốc](https://investing.com/news/gold-record-high)

---

### 3. Fed Minutes Show Division on Future Rate Path
**Nguồn:** Reuters | **Thời gian:** 3 giờ trước  
🔗 [Đọc bài viết gốc](https://reuters.com/markets/fed-minutes)

---

### 4. Oil Prices Drop 2% on China Demand Concerns
**Nguồn:** Bloomberg | **Thời gian:** 2 giờ trước  
🔗 [Đọc bài viết gốc](https://bloomberg.com/news/oil-prices)

---

### 5. Japanese Yen Strengthens as BOJ Maintains Hawkish Stance
**Nguồn:** ForexLive | **Thời gian:** 4 giờ trước  
🔗 [Đọc bài viết gốc](https://forexlive.com/news/jpy-strengthens)

---

## 💡 Lưu Ý

📌 **Nguồn tin cậy:** Tin tức được tổng hợp từ các nguồn uy tín quốc tế  
📌 **Đọc đầy đủ:** Click vào link để đọc bài viết chi tiết từ nguồn gốc  
📌 **Cập nhật liên tục:** Roundup mới mỗi 4 giờ với tin tức mới nhất

---

**Thời gian tổng hợp:** 2026-09-13T20:00:00+07:00  
**Tags:** #forex-news #headlines #market-news #forex-roundup
```

### Slack Notification:
```
📰 **News Roundup Published!**

🗞️ 5 forex headlines compiled
📅 13/09/2026 20:00
🔗 View post: /blog/forex-news-roundup-13092026-2000

**Top stories:**
• EUR/USD Breaks Above 1.16 as ECB Signals Rate Pause
• Gold Hits Record High Above $4,500
• Fed Minutes Show Division on Future Rate Path

🔗 https://thebenchmarktrader.com/blog/forex-news-roundup-13092026-2000
```

---

## SCHEDULE CONFIGURATION

### Current (Default):
```
Cron: 0 */2 * * *
Frequency: Every 2 hours
Posts per day: 12
```

### Recommended:
```
Cron: 0 */4 * * *
Frequency: Every 4 hours
Posts per day: 6
```

Why 4 hours?
- ✅ More quality content per post (4 hours of news)
- ✅ Less API usage (6 calls/day vs 12)
- ✅ Reduces newsletter fatigue
- ✅ Still frequent enough for timely updates

---

## FAQ

### Q: What if NewsAPI returns non-English articles?
**A:** Filter by language=en in API request. NewsAPI will only return English articles.

### Q: Can we add Vietnamese translation?
**A:** Yes, future enhancement. Would need translation API (Google Translate or DeepL).

### Q: What if same headline appears in multiple roundups?
**A:** Unlikely with 4-hour frequency + sortBy=publishedAt. But we could add de-duplication by tracking published URLs in database.

### Q: Can users filter by currency pair?
**A:** Future enhancement. Would add tags like "EUR-USD", "Gold", "Oil" and allow filtering.

### Q: What about images?
**A:** NewsAPI provides image URLs. Could add featured image to blog posts in future.

---

## PERFORMANCE

### API Calls per Day:
- NewsAPI: 6 calls (every 4 hours)
- Blog API: 6 calls (one per roundup)
- **Total:** 12 API calls/day

### NewsAPI Quota:
- Free tier: 100 requests/day
- Usage: 6/day = 6% of quota
- ✅ Well within limits

### Content Generation:
- 6 posts/day × ~600 words = 3,600 words/day
- 6 posts/day × ~3 KB = ~18 KB/day
- Monthly: 180 posts, ~108 MB, ~540 KB storage
- ✅ Negligible impact

---

## TROUBLESHOOTING

### "NEWS_API_KEY not configured"
**Solution:**
```
Cursor → Settings → Cloud Agents → Secrets → Add:
Name: NEWS_API_KEY
Type: Runtime Secret
Value: 7dcc920848834c919e195c8da05f91c0
```

### "No articles found"
**Check:**
- NewsAPI quota not exceeded?
- Query terms too restrictive?
- Internet connection OK?

**Fix:**
- Check NewsAPI dashboard: https://newsapi.org/account
- Try broader query: "forex OR currency OR trading"
- Test API manually: `curl "https://newsapi.org/v2/everything?q=forex&apiKey=YOUR_KEY"`

### "Blog post not created"
**Check:**
- AUTOMATION_BLOG_API_KEY configured?
- API endpoint returns 200?
- MongoDB connection OK?

**Fix:**
- Verify secrets in Cursor
- Test endpoint: `curl -X POST https://yoursite.com/api/admin/blog -H "Authorization: Bearer KEY"`
- Check Vercel deployment logs

### "Slack notification not sent"
**Check:**
- Slack MCP connected?
- Channel #all-thebenchmarktrader exists?
- Cursor Bot invited to channel?

**Fix:**
- Reconnect Slack in Cursor Automations
- Invite @Cursor Bot to channel
- Check automation permissions

---

## SUCCESS METRICS

Track these after 1 week:

- ✅ Roundup posts published: 42 (6/day × 7 days)
- ✅ No API errors
- ✅ All Slack notifications sent
- ✅ All blog posts on website
- ✅ Links working (spot check)
- ✅ User engagement (views, clicks)

---

## FUTURE ENHANCEMENTS

1. **Add Vietnamese translations** (auto-translate headlines)
2. **Add featured images** (from NewsAPI imageUrl)
3. **Add sentiment analysis** (Bullish/Bearish/Neutral tags)
4. **Add currency pair tags** (EUR/USD, GBP/USD, etc.)
5. **Add de-duplication** (track published URLs, avoid repeats)
6. **Add summaries** (use AI to generate brief summaries)
7. **Add email digest** (send daily email with all roundups)

---

## LEGAL & ETHICS

### What We're Doing (✅ Legal):
- Aggregating headlines (Fair Use)
- Providing source attribution
- Linking to original articles
- Not copying full content
- Helping users discover content

### What We're NOT Doing (❌ Illegal):
- Copying full articles
- Removing attribution
- Claiming content as ours
- Republishing without permission
- Competing with original publishers

### Best Practices:
- Always link to original
- Always credit source
- Never copy body text
- Never remove author names
- Be a good internet citizen

---

**Status:** Ready for implementation  
**Difficulty:** Easy (just update agent instructions)  
**Time:** 10 minutes  
**Impact:** High (6 blog posts/day)  
**Legal:** ✅ Compliant (headlines + links only)

---

🎉 **Ready to implement Option B!** 

Copy the agent instructions above into Automation #5 and you're done! 🚀
```

---

### **Step 3: Verify Secrets**

Make sure these are configured:

| Secret | Location | Value | Status |
|--------|----------|-------|--------|
| NEWS_API_KEY | Cursor Secrets | 7dcc920848834c919e195c8da05f91c0 | ⏳ Add now |
| AUTOMATION_BLOG_API_KEY | Cursor Secrets | f8a7e3d2c9b4f1a6e8d5c2b9... | ✅ Should exist |

---

### **Step 4: Update Schedule**

Recommended: Every 4 hours instead of 2

```
Current: 0 */2 * * * (12 posts/day)
New: 0 */4 * * * (6 posts/day) ← Better!
```

---

### **Step 5: Save & Test**

1. Click **"Save"** automation
2. Click **"Run Now"** to test
3. Check Slack within 1 minute
4. Check `/blog` for new post
5. Verify links work

---

✅ **Done! Option B ready!**
