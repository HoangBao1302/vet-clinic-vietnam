# Chỉ dán thêm phần HÌNH — không thay toàn bộ agent

API blog trước đây **bỏ qua field `image`** nên mọi bài đều ra `/vet-images/1.png`. Phần này đã được mở để nhận `image`. Bạn chỉ cần **thêm khối dưới vào cuối Agent Instructions** (Roundup và Daily đều thêm).

Không xóa instruction hiện tại.

---

## Dán thêm vào cuối instruction

```
IMAGE RULES (cover photo for the blog card — do not change the rest of the workflow):

Add this field to the JSON body when calling POST https://thebenchmarktrader.com/api/admin/blog:
  "image": "{chosen cover}"

Priority:
1) Prefer an image YOU already host (safe, no copyright issue).
2) Do NOT download/rehost Bloomberg, Reuters, Yahoo, Investing.com, Slack unfurl photos. Slack shows those via Open Graph; republishing them as our cover is not allowed.
3) NewsAPI urlToImage: do NOT use it as the blog cover. Link to the article instead (already in content).

How to pick from our library (match the MAIN topic of THIS post). Never default to /vet-images/1.png unless nothing else fits.

Topic → image:
- Vàng / gold / XAU              → /vet-images/5.png
- Dầu / oil / WTI / OPEC         → /vet-images/4.png
- Euro / EUR / ECB               → /vet-images/euro1.jpg
- Bảng Anh / GBP / BoE           → /vet-images/gbp1.jpg
- Yên / JPY / BoJ                → /vet-images/jpy1.jpeg
- USD / Fed / lãi suất Mỹ        → /vet-images/6.png
- Chứng khoán / S&P / Dow / Nasdaq → /vet-images/2.png
- Forex tổng hợp / nhiều chủ đề  → rotate by hour so consecutive posts differ:
    00–03 → /vet-images/2.png
    04–07 → /vet-images/3.png
    08–11 → /vet-images/euro1.jpg
    12–15 → /vet-images/4.png
    16–19 → /vet-images/5.png
    20–23 → /vet-images/6.png

If two posts in a row would get the same file, pick the next one in the list:
/vet-images/2.png, /vet-images/3.png, /vet-images/4.png, /vet-images/5.png, /vet-images/6.png, /vet-images/euro1.jpg, /vet-images/gbp1.jpg, /vet-images/jpy1.jpeg, /vet-images/jpy2.jpg

Do not put the cover <img> inside HTML content. Cover is only the "image" JSON field.
```

---

## Làm trên Cursor

1. Automations → News Roundup → kéo xuống cuối Agent Instructions → paste khối `IMAGE RULES...` → Save  
2. Làm y vậy với Daily Market Summary  
3. Chờ deploy API (push `app/api/admin/blog/route.ts`) xong rồi mới Run Now  

Bài cũ vẫn giữ ảnh laptop — chỉ bài mới đổi ảnh.
