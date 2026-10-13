# Dán vào Automation #5 — News Roundup

Thay **toàn bộ Agent Instructions** bằng nội dung dưới đây.

Website hiển thị EN và VI **song song**. Bài published phải gửi đủ 6 field. Thiếu bản Anh thì API trả 400, bài không lên.

---

```
TASK: Fetch forex/market headlines and publish TWO clean HTML versions in one API call: Vietnamese + English. Then send a Slack notification.

CRITICAL — BLOG CONTENT FORMAT (this is why the old posts looked broken):
- The website renders content with dangerouslySetInnerHTML (HTML only).
- Markdown is NOT rendered. NEVER send markdown in content or content_en.
- Forbidden in content/content_en: **, ##, ###, ---, *, `, # headings, [text](url)
- content and content_en MUST be valid HTML with real line breaks (use \n between tags in JSON).
- Do not concatenate everything into one paragraph.

LANGUAGE — TWO COMPLETE VERSIONS, NO MIXING:
- title, excerpt, content: Vietnamese only.
- title_en, excerpt_en, content_en: English only. No Vietnamese words or accents.
- Same headlines, same URLs, same facts in both versions.
- Vietnamese cards: Vietnamese headline + original English headline as italic subtitle.
- English cards: original English headline only.
- Source name stays original (Yahoo, Reuters, etc.).
- Links stay original URLs.

STEPS:

1) Fetch 4–6 headlines from NewsAPI
   - Use NEWS_API_KEY
   - GET https://newsapi.org/v2/everything
   - q: forex OR "EUR/USD" OR gold OR oil OR "federal reserve" OR "stock market"
   - language: en
   - sortBy: publishedAt
   - pageSize: 10
   - Prefer last 6 hours. Filter out unrelated topics (healthcare, entertainment, local politics).
   - If fewer than 3 relevant articles: Slack only, do not create a blog post.

2) For each headline:
   - Write a natural Vietnamese title and 1–2 sentence Vietnamese summary.
   - Keep the original English headline.
   - Write a 1–2 sentence English summary. Do not copy the full article.

3) Build TWO HTML bodies.

VIETNAMESE content:

<p style="font-size:1.05rem;color:#374151;margin:0 0 1.5rem 0;">Tổng hợp tin nổi bật về Forex và thị trường trong vài giờ qua. Chỉ gồm tiêu đề + tóm tắt ngắn, kèm link bài gốc.</p>

<h2 style="font-size:1.25rem;margin:0 0 1rem 0;padding-bottom:0.5rem;border-bottom:2px solid #2563eb;">Tin tức chính</h2>

ARTICLE CARD — repeat for each headline:
<div style="margin:0 0 1.25rem 0;padding:1.25rem 1.5rem;border:1px solid #e5e7eb;border-radius:12px;background:#f9fafb;">
  <p style="margin:0 0 0.35rem 0;font-size:0.75rem;color:#2563eb;font-weight:600;">TIN {n}</p>
  <h3 style="margin:0 0 0.35rem 0;font-size:1.1rem;line-height:1.4;">{Tiêu đề tiếng Việt}</h3>
  <p style="margin:0 0 0.75rem 0;font-size:0.85rem;color:#6b7280;font-style:italic;">{Original English headline}</p>
  <p style="margin:0 0 0.5rem 0;font-size:0.9rem;color:#4b5563;"><strong>Nguồn:</strong> {Source} · {thời gian tương đối, ví dụ "2 giờ trước"}</p>
  <p style="margin:0 0 0.85rem 0;color:#111827;line-height:1.7;">{Tóm tắt 1-2 câu tiếng Việt}</p>
  <p style="margin:0;"><a href="{url}" target="_blank" rel="noopener noreferrer" style="color:#2563eb;font-weight:600;text-decoration:none;">Đọc bài gốc →</a></p>
</div>

AFTER ALL CARDS:
<p style="margin:1.5rem 0 0 0;padding:1rem 1.25rem;background:#eff6ff;border-radius:10px;color:#1e3a8a;font-size:0.95rem;">Đây là bản tổng hợp tiêu đề từ nguồn quốc tế, không sao chép nội dung gốc. Click link để đọc bài đầy đủ.</p>

ENGLISH content_en:

<p style="font-size:1.05rem;color:#374151;margin:0 0 1.5rem 0;">A short roundup of notable Forex and market headlines from the past few hours. Titles, brief summaries, and original links only.</p>

<h2 style="font-size:1.25rem;margin:0 0 1rem 0;padding-bottom:0.5rem;border-bottom:2px solid #2563eb;">Top stories</h2>

ARTICLE CARD — repeat for each headline:
<div style="margin:0 0 1.25rem 0;padding:1.25rem 1.5rem;border:1px solid #e5e7eb;border-radius:12px;background:#f9fafb;">
  <p style="margin:0 0 0.35rem 0;font-size:0.75rem;color:#2563eb;font-weight:600;">STORY {n}</p>
  <h3 style="margin:0 0 0.35rem 0;font-size:1.1rem;line-height:1.4;">{Original English headline}</h3>
  <p style="margin:0 0 0.5rem 0;font-size:0.9rem;color:#4b5563;"><strong>Source:</strong> {Source} · {relative time, e.g. "2 hours ago"}</p>
  <p style="margin:0 0 0.85rem 0;color:#111827;line-height:1.7;">{1-2 sentence English summary}</p>
  <p style="margin:0;"><a href="{url}" target="_blank" rel="noopener noreferrer" style="color:#2563eb;font-weight:600;text-decoration:none;">Read original →</a></p>
</div>

AFTER ALL CARDS:
<p style="margin:1.5rem 0 0 0;padding:1rem 1.25rem;background:#eff6ff;border-radius:10px;color:#1e3a8a;font-size:0.95rem;">This is a headline roundup from international sources. It does not copy original articles. Follow the link to read the full story.</p>

4) Publish blog via API
   POST https://thebenchmarktrader.com/api/admin/blog
   Headers:
     Authorization: Bearer {AUTOMATION_BLOG_API_KEY}
     Content-Type: application/json
   Body:
   {
     "title": "Tổng hợp tin Forex - {DD/MM/YYYY HH:mm}",
     "title_en": "Forex News Roundup - {Month DD, YYYY HH:mm}",
     "slug": "tong-hop-tin-forex-{ddmmyyyy}-{hhmm}",
     "excerpt": "Tóm tắt 1 câu tiếng Việt gồm 2-3 tiêu đề nổi bật",
     "excerpt_en": "One English sentence covering 2-3 standout headlines",
     "content": "{Vietnamese HTML from step 3}",
     "content_en": "{English HTML from step 3}",
     "author": "ThebenchmarkTrader",
     "category": "news",
     "tags": ["forex", "tin-tuc", "tong-hop"],
     "date": "{ISO datetime}",
     "status": "published"
   }

   If the API returns 400 about title_en / excerpt_en / content_en, fix those fields and retry once. Do not publish Vietnamese-only.
   If 409 duplicate: skip and Slack "already published".

5) Slack notification — KEEP the current clean format (Slack CAN use markdown). Vietnamese titles:
   📰 Tổng hợp tin Forex đã đăng!

   🗞️ {n} tin nổi bật
   📅 {DD/MM/YYYY HH:mm} (GMT+7)
   🔗 https://thebenchmarktrader.com/blog/{slug}

   Tin chính:
   • {Tiêu đề Việt 1}
   • {Tiêu đề Việt 2}
   • {Tiêu đề Việt 3}

QUALITY RULES:
- HTML only in content and content_en. If you are unsure, wrap text in <p>.
- No raw markdown dumped into content.
- Vietnamese fields stay Vietnamese. English fields stay English.
- Do not invent news. Do not copy full article body.
- Prefer forex, USD, EUR, vàng, dầu, Fed, chứng khoán. Skip off-topic.
```
---

## Checklist sau khi dán

1. Cursor → Automations → **News API / News Roundup**
2. Dán toàn bộ khối `TASK: ...` vào Agent Instructions
3. Save
4. Run Now
5. Check Slack vẫn đẹp
6. Check `/blog` ở VI và EN: cùng bài, hai ngôn ngữ, không lẫn
