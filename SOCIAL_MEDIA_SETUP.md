# 📱 Social Media Links - Setup Guide

## 🎯 Tổng Quan

Tất cả các nút social media (Facebook, Instagram, Twitter, YouTube, Telegram) đã được cấu hình để mở trong tab mới và sẵn sàng link đến pages của bạn.

---

## 📍 Vị Trí Social Media Links

### 1. **Header - Top Bar** (`components/Header.tsx`)
**Vị trí:** Top bar phía trên navigation
**Icons:** Facebook, Instagram, Twitter (size 16px)
**Màu:** White text trên background xanh

**Dòng code:**
- **Facebook:** Dòng 71
- **Instagram:** Dòng 80
- **Twitter:** Dòng 89

---

### 2. **Footer** (`components/Footer.tsx`)
**Vị trí:** Footer section, cột đầu tiên dưới logo
**Icons:** Facebook, Instagram, Twitter, YouTube, Telegram (size 20px)
**Màu:** Gray với hover white

**Dòng code:**
- **Facebook:** Dòng 48
- **Instagram:** Dòng 57
- **Twitter:** Dòng 66
- **YouTube:** Dòng 75
- **Telegram:** Dòng 84

---

## 🔗 Cách Lấy Link Facebook

### **Option 1: Facebook Page (Khuyến nghị)**

#### Bước 1: Tạo Facebook Page
1. Truy cập [facebook.com/pages/create](https://www.facebook.com/pages/create)
2. Chọn loại: **Business or Brand**
3. Nhập tên: **EA Forex LeopardSmart** (hoặc tên bạn muốn)
4. Category: **Financial Service** hoặc **Software**
5. Thêm mô tả về EA

#### Bước 2: Lấy Page URL
Sau khi tạo xong, URL sẽ có dạng:
```
https://www.facebook.com/YourPageName
```

**Ví dụ:**
- `https://www.facebook.com/LeopardSmartEA`
- `https://www.facebook.com/EAForexLeopard`

#### Bước 3: Tùy Chỉnh Username (Optional)
1. Vào Page Settings
2. Chọn **Page Info** → **Username**
3. Chọn username ngắn gọn, dễ nhớ
4. Save

**Result:** `https://www.facebook.com/leopardsmart`

---

### **Option 2: Facebook Profile (Cá nhân)**
Nếu bạn muốn dùng profile cá nhân:

1. Vào profile của bạn
2. Copy URL từ address bar
3. Sẽ có dạng: `https://www.facebook.com/your.name.123`

**⚠️ Lưu ý:** Page tốt hơn cho business vì:
- Có analytics
- Có Facebook Ads
- Professional hơn
- Không giới hạn followers

---

## 📝 Cách Cập Nhật Links

### **Method 1: Find & Replace (Nhanh nhất)**

#### Trong VS Code/Cursor:
1. Mở **Find & Replace** (`Ctrl+Shift+H` hoặc `Cmd+Shift+H`)
2. Search và replace từng platform:

**Facebook:**
```
Find:    https://www.facebook.com/YOUR_PAGE_NAME
Replace: https://www.facebook.com/LeopardSmartEA
```

**Instagram:**
```
Find:    https://www.instagram.com/YOUR_INSTAGRAM_NAME
Replace: https://www.instagram.com/leopardsmart_ea
```

**Twitter:**
```
Find:    https://twitter.com/YOUR_TWITTER_NAME
Replace: https://twitter.com/LeopardSmartEA
```

3. Click **Replace All**

---

### **Method 2: Manual Update**

#### **File 1: `components/Header.tsx`**

**Facebook (Dòng ~71):**
```tsx
<a 
  href="https://www.facebook.com/YOUR_PAGE_NAME"  // ⬅️ THAY ĐỔI Ở ĐÂY
  target="_blank"
  rel="noopener noreferrer"
  className="hover:text-accent-100 transition-colors"
  aria-label="Facebook"
>
```

**Instagram (Dòng ~80):**
```tsx
<a 
  href="https://www.instagram.com/YOUR_INSTAGRAM_NAME"  // ⬅️ THAY ĐỔI
  target="_blank"
  ...
>
```

**Twitter (Dòng ~89):**
```tsx
<a 
  href="https://twitter.com/YOUR_TWITTER_NAME"  // ⬅️ THAY ĐỔI
  target="_blank"
  ...
>
```

---

#### **File 2: `components/Footer.tsx`**

Tương tự Header, update 3 links:
- Facebook (Dòng ~48)
- Instagram (Dòng ~57)
- Twitter (Dòng ~66)

**YouTube & Telegram** đã được setup trước đó:
- YouTube: `https://www.youtube.com/@LeopardSmartEA`
- Telegram: `https://t.me/LeopardSmartSupport`

---

## 🎨 Social Media Content Strategy

### **Facebook Page:**

#### **Nên Post:**
✅ Video backtest results
✅ Live trading screenshots (blur sensitive info)
✅ Educational content về EA
✅ Success stories từ users
✅ Market analysis
✅ Updates & new features
✅ Blog post shares

#### **Posting Schedule:**
- **3-5 posts/week** là ideal
- Best times: 7-9 AM, 12-2 PM, 7-9 PM (GMT+7)
- Use Facebook Insights để tối ưu timing

#### **Content Mix:**
- 40% Educational
- 30% Results/Proof
- 20% Engagement (questions, polls)
- 10% Promotional

---

### **Instagram:**

#### **Content Ideas:**
✅ Infographics về trading stats
✅ Behind-the-scenes
✅ Quick tips (carousel posts)
✅ Reels về EA features (15-30s)
✅ Stories với polls/questions
✅ Testimonials

#### **Hashtags:**
```
#ForexTrading #ForexEA #AutoTrading #TradingBot
#ForexVietnam #EAForex #AlgoTrading #ForexRobot
#MT4EA #MT5EA #ForexStrategy #TradingAutomation
```

---

### **Twitter/X:**

#### **Tweet Ideas:**
✅ Daily/weekly performance updates
✅ Market insights
✅ Quick tips threads
✅ Retweet industry news
✅ Engage với Forex community
✅ Live trade updates

#### **Best Practices:**
- Tweet 2-3 times/day
- Use hashtags (max 2-3)
- Engage with followers
- Retweet relevant content
- Share YouTube videos

---

## 📊 Tracking & Analytics

### **Facebook:**
1. Install **Facebook Pixel** trên website
2. Track conversions từ Facebook ads
3. Setup custom audiences
4. Monitor Page Insights

### **Add Facebook Pixel:**
Thêm vào `app/layout.tsx` trong `<head>`:

```tsx
{/* Facebook Pixel */}
<script
  dangerouslySetInnerHTML={{
    __html: `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', 'YOUR_PIXEL_ID');
      fbq('track', 'PageView');
    `,
  }}
/>
```

---

## 🔄 Cross-Platform Strategy

### **Link Website trên Social Media:**

#### **Facebook Page:**
- **Website field:** https://leopardsmart.com
- **About section:** Mô tả EA + link website
- **Pinned post:** Video intro + link đến /live-results

#### **Instagram Bio:**
```
🤖 EA Forex LeopardSmart
📊 Auto Trading | Risk Management
✅ 5+ Verified Accounts
👇 Live Results & Copy Trading
🔗 leopardsmart.com/live-results
```

#### **Twitter Bio:**
```
EA Forex LeopardSmart 🤖 
Auto Trading with Smart Risk Management
📊 Verified Results | Copy Trading Available
🔗 leopardsmart.com
```

---

## 📱 Social Proof Integration

### **Embed Facebook Reviews:**
Nếu có reviews tốt trên Facebook Page, có thể embed:

```tsx
// Thêm component mới
<div className="fb-page" 
  data-href="https://www.facebook.com/YourPageName"
  data-tabs="timeline"
  data-width="500"
  data-height="300"
  data-small-header="false"
  data-adapt-container-width="true"
  data-hide-cover="false"
  data-show-facepile="true">
</div>
```

---

## ✅ Setup Checklist

### **Facebook:**
- [ ] Tạo Facebook Page
- [ ] Setup username/vanity URL
- [ ] Upload cover photo (820x312px)
- [ ] Upload profile picture (logo, 180x180px)
- [ ] Fill out About section
- [ ] Add website link
- [ ] Create first 3-5 posts
- [ ] Update link trong code
- [ ] Test link hoạt động

### **Instagram:**
- [ ] Tạo Instagram Business Account
- [ ] Link với Facebook Page
- [ ] Setup bio với link
- [ ] Upload 9-12 posts đầu tiên
- [ ] Create highlights (About, Results, Tutorials)
- [ ] Update link trong code
- [ ] Test link

### **Twitter:**
- [ ] Tạo Twitter/X account
- [ ] Setup bio
- [ ] Upload header (1500x500px)
- [ ] Upload profile picture
- [ ] Tweet 5-10 tweets đầu
- [ ] Follow relevant accounts
- [ ] Update link trong code
- [ ] Test link

### **YouTube:**
- [ ] ✅ Đã setup (từ integration trước)
- [ ] Link: `@LeopardSmartEA`

### **Telegram:**
- [ ] ✅ Đã setup
- [ ] Link: `@LeopardSmartSupport`

---

## 🎯 Quick Start (5 Minutes)

Nếu chưa có social media accounts, tạm thời:

1. **Tạo Facebook Page nhanh** (3 phút):
   - Vào facebook.com/pages/create
   - Business/Brand → Financial Service
   - Tên: EA Forex LeopardSmart
   - Skip các bước optional
   - Copy URL

2. **Update code** (1 phút):
   - Find & Replace `YOUR_PAGE_NAME` với page name thực tế
   - Save files

3. **Test** (1 phút):
   - Run `npm run dev`
   - Click Facebook icon
   - Verify mở đúng page

**Done!** Instagram & Twitter có thể setup sau.

---

## 🔧 Testing

Sau khi update, test:

### **Header (Top Bar):**
- [ ] Click Facebook icon → Mở page đúng trong tab mới
- [ ] Click Instagram icon → Mở profile đúng
- [ ] Click Twitter icon → Mở profile đúng

### **Footer:**
- [ ] Tất cả 5 icons hoạt động
- [ ] Mở đúng platform
- [ ] Target="_blank" working (tab mới)

### **Cross-Browser:**
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Mobile Chrome
- [ ] Mobile Safari

---

## 💡 Pro Tips

### **Consistency:**
- Dùng cùng **username** trên tất cả platforms nếu được
- Ví dụ: `LeopardSmartEA` hoặc `leopardsmart`
- Giúp branding và dễ tìm

### **Branding:**
- Same logo trên tất cả platforms
- Consistent color scheme (blue theme)
- Similar bio/description

### **Cross-Promotion:**
- Link Instagram trong Facebook
- Link Twitter trong YouTube description
- Link tất cả trong website footer (✅ Done)

### **Content Repurposing:**
- YouTube video → Facebook post
- Blog post → Twitter thread
- Instagram carousel → Facebook album
- Save time, maximize reach

---

## 📞 Support

Nếu gặp vấn đề:
- **Facebook help:** facebook.com/help
- **Instagram help:** help.instagram.com
- **Twitter help:** help.twitter.com

---

## 📝 Update Log Template

Khi tạo/update social media:

```
feat: add Facebook page integration

- Created Facebook Page: LeopardSmartEA
- URL: https://www.facebook.com/LeopardSmartEA
- Updated Header.tsx (line 71)
- Updated Footer.tsx (line 48)
- Tested on Chrome, Firefox, Safari
- All links opening correctly in new tab
```

---

**Status:** 🟢 Code Ready - Waiting for Real Links
**Est. Setup Time:** 5-30 minutes (depending on existing accounts)
**Priority:** ⭐⭐⭐⭐ High

---

**Last Updated:** October 3, 2025
**Version:** 1.0

