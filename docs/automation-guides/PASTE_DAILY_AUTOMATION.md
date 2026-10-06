# Dán vào Automation #4 — Daily Market Summary

Daily summary đã có tiếng Việt, nhưng blog vẫn xấu vì content đang gửi **markdown** trong khi website chỉ render **HTML**. Thay Agent Instructions bằng nội dung dưới đây. Slack giữ format đẹp hiện tại.

---

```
TASK: Create the daily Forex market summary as a clean Vietnamese HTML blog post + Slack notification.

CRITICAL — BLOG CONTENT FORMAT:
- Website uses dangerouslySetInnerHTML. Markdown is NOT rendered.
- NEVER put **, ##, ###, ---, *, ` or [text](url) in the "content" field.
- content MUST be HTML with real newlines between tags.
- Do not dump the whole article into one <p>.

LANGUAGE:
- Entire post in Vietnamese (title, excerpt, analysis, news headlines).
- News: Vietnamese title + English original as italic subtitle + original URL.
- Source names stay original.

STEPS:

1) Fetch market data (end of day, GMT+7):
   EUR/USD, XAU/USD (Vàng), WTI, S&P 500, Dow Jones
   Include price and % change.

2) Fetch top 5 relevant headlines (NewsAPI, NEWS_API_KEY):
   q: forex OR gold OR oil OR "federal reserve" OR "EUR/USD"
   Last 24 hours. Skip off-topic.

3) HTML content template:

<p style="font-size:1.05rem;color:#374151;margin:0 0 1.75rem 0;">Cập nhật thị trường Forex và tài chính ngày {DD/MM/YYYY}.</p>

<h2 style="font-size:1.25rem;margin:0 0 1rem 0;padding-bottom:0.5rem;border-bottom:2px solid #2563eb;">Tổng quan thị trường</h2>

<div style="display:grid;gap:0.75rem;margin:0 0 1.75rem 0;">
  <div style="padding:1rem 1.25rem;border:1px solid #e5e7eb;border-radius:12px;background:#f9fafb;">
    <p style="margin:0 0 0.25rem 0;font-size:0.8rem;color:#6b7280;font-weight:600;">EUR/USD</p>
    <p style="margin:0 0 0.5rem 0;font-size:1.25rem;font-weight:700;">{price} <span style="color:{green or red};font-size:0.95rem;">{+/-X.XX%}</span></p>
    <p style="margin:0;color:#374151;line-height:1.6;">{2 câu phân tích tiếng Việt}</p>
  </div>
  <!-- Repeat the same card for Vàng, Dầu WTI, S&P 500, Dow Jones -->
</div>

<h2 style="font-size:1.25rem;margin:0 0 1rem 0;padding-bottom:0.5rem;border-bottom:2px solid #2563eb;">Tin tức nổi bật</h2>

NEWS CARD — repeat 5 times:
<div style="margin:0 0 1rem 0;padding:1.1rem 1.35rem;border:1px solid #e5e7eb;border-radius:12px;">
  <h3 style="margin:0 0 0.3rem 0;font-size:1.05rem;">{Tiêu đề tiếng Việt}</h3>
  <p style="margin:0 0 0.5rem 0;font-size:0.85rem;color:#6b7280;font-style:italic;">{English headline}</p>
  <p style="margin:0 0 0.6rem 0;font-size:0.9rem;color:#4b5563;"><strong>Nguồn:</strong> {Source} · {thời gian}</p>
  <p style="margin:0;"><a href="{url}" target="_blank" rel="noopener noreferrer" style="color:#2563eb;font-weight:600;text-decoration:none;">Đọc bài gốc →</a></p>
</div>

<h2 style="font-size:1.25rem;margin:1.5rem 0 0.75rem 0;padding-bottom:0.5rem;border-bottom:2px solid #2563eb;">Nhận định</h2>
<p style="line-height:1.8;">{Đoạn phân tích tổng hợp tiếng Việt, 3-5 câu, nối data với tin tức. Không copy bài gốc.}</p>
<ul style="line-height:1.8;">
  <li><strong>Điểm nhấn:</strong> {1-3 ý}</li>
  <li><strong>Theo dõi ngày mai:</strong> {sự kiện}</li>
</ul>
<p style="margin:1.5rem 0 0 0;padding:1rem 1.25rem;background:#eff6ff;border-radius:10px;color:#1e3a8a;font-size:0.95rem;">Dữ liệu cập nhật lúc 17:00 GMT+7. Đây là phân tích tham khảo, không phải lời khuyên đầu tư.</p>

4) POST https://thebenchmarktrader.com/api/admin/blog
   Authorization: Bearer {AUTOMATION_BLOG_API_KEY}
   {
     "title": "Thị trường Forex hôm nay - {DD/MM/YYYY}",
     "slug": "thi-truong-forex-hom-nay-{ddmmyyyy}",
     "excerpt": "Tóm tắt 1 câu: EUR/USD {price} ({change}%), Vàng {price} ({change}%)",
     "content": "{HTML from step 3}",
     "author": "ThebenchmarkTrader",
     "category": "news",
     "tags": ["forex", "thi-truong", "tong-hop"],
     "date": "{ISO}",
     "status": "published"
   }

5) Slack — keep current nice layout, Vietnamese headlines:
   📊 Daily market summary published!
   Thị trường Forex hôm nay - {date}
   Market Data: bullets
   Tin tức nổi bật: Vietnamese titles
   Link: https://thebenchmarktrader.com/blog/{slug}
```
---

Sau khi dán: Save → lần chạy 17:00 hôm sau sẽ ra giao diện mới. Post cũ vẫn xấu (đã lưu HTML/markdown cũ); chỉ post mới được sửa.
