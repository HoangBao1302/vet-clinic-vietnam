# 🚀 Automation Quick Start - Cheat Sheet

## 📝 Cách Publish Blog Post Tự Động

### **3 Bước Đơn Giản:**

```bash
# 1. Tạo file blog post
/app/blog/posts/tieu-de-blog.md

# 2. Commit & Push → Tạo PR → Merge
git checkout -b feature/new-post
git add app/blog/posts/tieu-de-blog.md
git commit -m "feat: Add blog post"
git push

# 3. Đợi 10 phút → Check Slack ✅
```

---

## 📋 Blog Post Template

```markdown
---
title: "Tiêu đề bài viết"
date: "2026-09-13"
author: "Your Name"
category: "forex"  # forex, trading, analysis, news
tags: ["forex", "EUR/USD"]
excerpt: "Mô tả ngắn"
status: "published"
---

# Nội dung

Viết content ở đây...
```

---

## 🔑 Secrets Configured

| Secret | Location | Status |
|--------|----------|--------|
| `AUTOMATION_BLOG_API_KEY` | Cursor + Vercel | ✅ |
| `NEWS_API_KEY` | Cursor (pending) | ⏳ |

---

## ⏰ Automation Schedule

| Automation | Run Time | Frequency |
|------------|----------|-----------|
| Daily Reminder | 9:00 AM | Daily |
| RSS News | Every 6 hours | 4x/day |
| Auto-publish Blog | Every 10 minutes | 144x/day |
| Market Summary | 5:00 PM | Daily |
| News API | Every 2 hours | 12x/day |

---

## ✅ Testing Checklist

**After Publishing Blog Post:**
- [ ] PR merged successfully
- [ ] Slack notification within 10 min
- [ ] Post visible on `/blog`
- [ ] MongoDB has record (`/admin/blog`)

**Daily Monitoring:**
- [ ] Check Slack notifications
- [ ] Verify automations in Run History
- [ ] Review published content

---

## 🛠️ Quick Fixes

**No Slack notification?**
```
→ Check Cursor → Automations → Run History
→ Verify PR merged < 15 minutes ago
→ Check AUTOMATION_BLOG_API_KEY in Cursor Secrets
```

**API endpoint 404?**
```
→ Check Vercel deployment status
→ Verify PR #7 merged
→ Redeploy if needed
```

**Secret not found?**
```
Cursor → Settings → Cloud Agents → Secrets → Add:
Name: AUTOMATION_BLOG_API_KEY
Type: Runtime Secret
Value: [from .env.local]
```

---

## 📊 Quick Access

| Resource | Link |
|----------|------|
| Slack | `#all-thebenchmarktrader` |
| Automations | Cursor → Automations |
| Blog Admin | `/admin/blog` |
| GitHub | HoangBao1302/vet-clinic-vietnam |
| Vercel | vercel.com/dashboard |

---

## 📞 Help

**Full Documentation:**
- `/docs/AUTOMATION_FINAL_SUMMARY.md`
- `/docs/CURSOR_AUTOMATIONS_COMPLETE_GUIDE.md`

**Issues?** Check Run History first!

---

✅ **Setup Complete! Automations Running!** 🚀
