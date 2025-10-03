# YouTube Integration - EA Forex LeopardSmart

## 📺 Tổng Quan

Website đã được tích hợp các liên kết YouTube để khách hàng có thể xem:
- Video backtest chi tiết
- Hướng dẫn cài đặt EA
- Tutorial và video khác

## 🔗 Vị Trí Các Liên Kết YouTube

### 1. **Homepage - Proof Section** (`components/Proof.tsx`)
**Nội dung:** Hiển thị button "Xem Video Backtest" và "Video Hướng Dẫn Khác"

**Dòng code cần cập nhật:**
```tsx
// Dòng ~147
href="https://www.youtube.com/@LeopardSmartEA"

// Dòng ~156
href="https://www.youtube.com/@LeopardSmartEA/playlists"
```

---

### 2. **About Page** (`app/about/page.tsx`)
**Nội dung:** Section riêng về video backtest với 2 button lớn

**Dòng code cần cập nhật:**
```tsx
// Dòng ~202
href="https://www.youtube.com/@LeopardSmartEA"

// Dòng ~210
href="https://www.youtube.com/@LeopardSmartEA/playlists"
```

---

### 3. **Pricing Page** (`app/pricing/page.tsx`)
**Nội dung:** Section "Hướng Dẫn Cài Đặt EA" với video installation guide

**Dòng code cần cập nhật:**
```tsx
// Dòng ~319 - Video cụ thể về installation
href="https://www.youtube.com/watch?v=INSTALLATION_VIDEO_ID"
// ⚠️ Thay INSTALLATION_VIDEO_ID bằng ID video thực tế

// Dòng ~328 - Link playlist
href="https://www.youtube.com/@LeopardSmartEA/playlists"
```

---

### 4. **Footer** (`components/Footer.tsx`)
**Nội dung:** 
- Icon YouTube trong social media links
- Section "Tài Nguyên" với link đến kênh và playlist

**Dòng code cần cập nhật:**
```tsx
// Dòng ~57 - YouTube icon trong social media
href="https://www.youtube.com/@LeopardSmartEA"

// Dòng ~122 - Link "Kênh YouTube"
href="https://www.youtube.com/@LeopardSmartEA"

// Dòng ~133 - Link "Video Backtest"
href="https://www.youtube.com/@LeopardSmartEA/playlists"

// Dòng ~143 - Link "Hướng dẫn cài đặt"
href="https://www.youtube.com/@LeopardSmartEA/playlists"
```

---

## 🎬 Cách Cập Nhật Link YouTube

### Bước 1: Tạo Kênh YouTube
1. Truy cập [YouTube Studio](https://studio.youtube.com)
2. Tạo kênh mới với tên: **EA Forex LeopardSmart** (hoặc tên bạn muốn)
3. Lấy URL kênh (thường có dạng: `https://www.youtube.com/@TenKenh`)

### Bước 2: Upload Video
**Video cần upload:**
1. **Video Backtest** - Chi tiết về backtest EA
2. **Video Cài Đặt** - Hướng dẫn installation từng bước
3. **Video Cấu Hình** - Hướng dẫn setting parameters
4. **Video Demo** - Demo EA hoạt động

### Bước 3: Tạo Playlist
Tạo các playlist để tổ chức video:
- **Backtest Results** - Tất cả video backtest
- **Installation Guide** - Hướng dẫn cài đặt
- **Configuration** - Hướng dẫn cấu hình
- **FAQ & Support** - Video giải đáp thắc mắc

### Bước 4: Lấy Link Video/Playlist
- **Link kênh:** `https://www.youtube.com/@TenKenh`
- **Link playlist:** `https://www.youtube.com/@TenKenh/playlists`
- **Link video cụ thể:** `https://www.youtube.com/watch?v=VIDEO_ID`

### Bước 5: Thay Thế Link trong Code
Sử dụng tính năng Find & Replace trong editor:

**Find:** `https://www.youtube.com/@LeopardSmartEA`
**Replace with:** `https://www.youtube.com/@TenKenhThucTe`

**Find:** `INSTALLATION_VIDEO_ID`
**Replace with:** ID video thực tế (ví dụ: `dQw4w9WgXcQ`)

---

## 📋 Checklist Sau Khi Cập Nhật

- [ ] Đã tạo kênh YouTube
- [ ] Đã upload video backtest
- [ ] Đã upload video hướng dẫn cài đặt
- [ ] Đã tạo playlist
- [ ] Đã cập nhật link kênh trong code
- [ ] Đã cập nhật link video cài đặt cụ thể
- [ ] Đã test tất cả link (click để kiểm tra)
- [ ] Đã deploy lên production

---

## 💡 Gợi Ý Nội Dung Video

### Video 1: Backtest Results (10-15 phút)
- Giới thiệu EA và strategy
- Hiển thị backtest report chi tiết
- Phân tích các chỉ số quan trọng (PF, DD, Win Rate)
- Giải thích equity curve
- Thảo luận về các periợd khác nhau

### Video 2: Installation Guide (8-10 phút)
- Download EA file
- Mở MT4/MT5
- Navigate đến Data Folder
- Copy file vào thư mục đúng
- Restart platform
- Kích hoạt EA trên chart
- Verify EA hoạt động

### Video 3: Configuration (10-12 phút)
- Giới thiệu các tham số chính
- Risk management settings
- Timeframe và pair recommendations
- Spread/slippage settings
- Time filter settings
- Tùy chỉnh theo vốn

### Video 4: FAQ & Troubleshooting (8-10 phút)
- EA không xuất hiện trong Navigator
- Lỗi "DLL not allowed"
- Lỗi "Auto trading is disabled"
- EA không mở lệnh
- Cách kiểm tra log file

---

## 🎨 Thumbnail Suggestions

**Phong cách:** Professional, clean, có chữ tiếng Việt

**Màu sắc:** Blue (#3b82f6) và Red (#dc2626) - match với website

**Text overlay:**
- "BACKTEST 5 NĂM"
- "PROFIT FACTOR 2.4"
- "HƯỚNG DẪN CÀI ĐẶT EA"
- "FOREX EA LeopardSmart"

**Tools:** Canva, Photoshop, hoặc Figma

---

## 📊 Tracking & Analytics

Sau khi có YouTube channel:
1. Bật YouTube Analytics
2. Theo dõi views, engagement
3. Xem video nào được xem nhiều nhất
4. Cập nhật nội dung dựa trên feedback

---

## ⚠️ Lưu Ý Quan Trọng

1. **Không xóa placeholder links** cho đến khi có link thực tế
2. **Test tất cả links** sau khi cập nhật
3. **Giữ consistency** - tất cả link phải point đến cùng kênh
4. **Update sitemap** nếu cần (không bắt buộc cho external links)
5. **Đảm bảo video là Public** hoặc Unlisted (không phải Private)

---

## 🔄 Cập Nhật Link Nhanh

Nếu bạn đã có kênh YouTube, chạy lệnh sau trong terminal/PowerShell từ thư mục gốc project:

### PowerShell (Windows):
```powershell
# Thay YOUR_CHANNEL_NAME bằng tên kênh thực tế
$oldUrl = "@LeopardSmartEA"
$newUrl = "@YOUR_CHANNEL_NAME"

Get-ChildItem -Recurse -Include *.tsx,*.ts | ForEach-Object {
    (Get-Content $_.FullName) -replace $oldUrl, $newUrl | Set-Content $_.FullName
}
```

### Bash (Mac/Linux):
```bash
# Thay YOUR_CHANNEL_NAME bằng tên kênh thực tế
find . -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/@LeopardSmartEA/@YOUR_CHANNEL_NAME/g'
```

---

## 📞 Hỗ Trợ

Nếu cần hỗ trợ tích hợp YouTube hoặc tạo video content, liên hệ:
- Email: support@leopardsmart.com
- Telegram: @LeopardSmartSupport

---

**Document Version:** 1.0
**Last Updated:** October 3, 2025

