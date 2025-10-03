# 📘 Facebook Button - Quick Setup (5 Phút)

## ✅ Đã Hoàn Thành

Tất cả các nút Facebook đã được cấu hình để:
- ✅ Mở trong tab mới (`target="_blank"`)
- ✅ Security headers (`rel="noopener noreferrer"`)
- ✅ Accessibility (`aria-label="Facebook"`)
- ✅ Hiển thị ở 2 vị trí: **Header** và **Footer**

---

## 🎯 Cách Setup Nhanh

### **Bước 1: Tạo Facebook Page** (3 phút)

1. Truy cập: [facebook.com/pages/create](https://www.facebook.com/pages/create)
2. Chọn: **Business or Brand**
3. Nhập thông tin:
   - **Tên:** EA Forex LeopardSmart
   - **Category:** Financial Service
   - **Bio:** EA Forex tự động với quản trị rủi ro thông minh
4. Click **Create Page**
5. Copy URL (sẽ có dạng: `https://www.facebook.com/YourPageName-123456789`)

---

### **Bước 2: Tùy Chỉnh Username** (Optional, 1 phút)

1. Vào **Page Settings** → **Page Info**
2. Click **Edit** bên cạnh **Username**
3. Nhập username ngắn: `LeopardSmartEA` hoặc `leopardsmart`
4. Check availability → Save

**Result:** URL đẹp hơn `https://www.facebook.com/LeopardSmartEA`

---

### **Bước 3: Cập Nhật Code** (1 phút)

#### **Method 1: Find & Replace (Nhanh nhất)**

Trong VS Code/Cursor, nhấn `Ctrl+Shift+H` (hoặc `Cmd+Shift+H`):

```
Find:    YOUR_PAGE_NAME
Replace: LeopardSmartEA    (hoặc tên page của bạn)
```

Click **Replace All**

✅ Done! Sẽ tự động thay đổi ở cả Header và Footer.

---

#### **Method 2: Manual (Nếu muốn khác nhau)**

**File:** `components/Header.tsx` (Dòng 71)
```tsx
href="https://www.facebook.com/YOUR_PAGE_NAME"
     ↓ Thay bằng
href="https://www.facebook.com/LeopardSmartEA"
```

**File:** `components/Footer.tsx` (Dòng 48)
```tsx
href="https://www.facebook.com/YOUR_PAGE_NAME"
     ↓ Thay bằng
href="https://www.facebook.com/LeopardSmartEA"
```

---

### **Bước 4: Test** (30 giây)

```bash
npm run dev
```

1. Mở website local
2. Click icon Facebook ở **Header** (top bar)
3. Click icon Facebook ở **Footer**
4. Verify: Mở đúng page trong tab mới

✅ **Success!**

---

## 🔗 Format URL

Các format URL hợp lệ:

✅ **Username-based (Best):**
```
https://www.facebook.com/LeopardSmartEA
```

✅ **Page ID-based:**
```
https://www.facebook.com/profile.php?id=100012345678901
```

✅ **Custom vanity URL:**
```
https://www.facebook.com/leopardsmart
```

❌ **Không dùng:**
```
https://facebook.com/...        (thiếu www)
https://fb.me/...                (short link, không professional)
https://m.facebook.com/...       (mobile link)
```

---

## 📍 Vị Trí Hiển Thị

### **1. Header - Top Bar**
- Icon Facebook nhỏ (16px)
- Màu trắng trên background xanh
- Cùng hàng với: Instagram, Twitter
- **File:** `components/Header.tsx` dòng 70-78

### **2. Footer**
- Icon Facebook lớn hơn (20px)
- Màu gray, hover thành white
- Cùng hàng với: Instagram, Twitter, YouTube, Telegram
- **File:** `components/Footer.tsx` dòng 47-55

---

## 💡 Tips

### **Content cho Facebook Page:**

**Post đầu tiên (Welcome Post):**
```
🎉 Chào mừng đến với EA Forex LeopardSmart!

🤖 EA tự động với quản trị rủi ro thông minh
📊 5+ tài khoản verified
✅ Backtest 5 năm
💰 Copy trading available

👉 Xem kết quả thực tế: [link website]/live-results

#ForexEA #AutoTrading #ForexVietnam
```

**Cover Photo (820x312px):**
- Logo + tagline
- Key stats (Profit Factor, Win Rate)
- CTA: "Xem Kết Quả Thực Tế"

**Profile Picture (180x180px):**
- Logo EA LeopardSmart
- Background: Blue theme
- Simple, recognizable

---

## 🎨 Instagram & Twitter (Bonus)

Nếu bạn cũng muốn setup Instagram và Twitter, placeholder đã sẵn sàng:

**Instagram:**
```
Find:    YOUR_INSTAGRAM_NAME
Replace: leopardsmart_ea
```

**Twitter:**
```
Find:    YOUR_TWITTER_NAME
Replace: LeopardSmartEA
```

Tương tự như Facebook, chỉ cần Find & Replace!

---

## ✅ Checklist

- [ ] Tạo Facebook Page
- [ ] Setup username (optional)
- [ ] Upload logo & cover photo
- [ ] Viết About section
- [ ] Update code (Find & Replace)
- [ ] Test local (`npm run dev`)
- [ ] Test production (sau deploy)
- [ ] Post 3-5 posts đầu tiên
- [ ] Add website link vào page
- [ ] Announce page trên các channels khác

---

## 📞 Quick Reference

**Files cần edit:**
- `components/Header.tsx` - Dòng 71
- `components/Footer.tsx` - Dòng 48

**Find:**
```
YOUR_PAGE_NAME
```

**Replace:**
```
TênPageCuaBan    (không có spaces)
```

**Full documentation:**
- `SOCIAL_MEDIA_SETUP.md` - Hướng dẫn chi tiết

---

## 🚀 After Setup

### **Promote Page:**
1. Share trên personal profile
2. Invite friends/colleagues
3. Add page link vào email signature
4. Cross-promote trên YouTube, Telegram
5. Consider Facebook Ads (nếu budget cho phép)

### **Content Schedule:**
- Post 3-5 lần/tuần
- Best times: 7-9 AM, 12-2 PM, 7-9 PM
- Mix: Educational, Results, Engagement

---

**Est. Total Time:** 5 minutes
**Difficulty:** ⭐ Easy
**Status:** 🟢 Ready to Use

---

**Last Updated:** October 3, 2025

