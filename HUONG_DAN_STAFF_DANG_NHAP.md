# 👋 HƯỚNG DẪN ĐĂNG NHẬP VÀ QUẢN LÝ BÀI VIẾT

Chào **hoangkim.helen**! Bạn đã được cấp quyền **Staff** để quản lý blog. Dưới đây là hướng dẫn chi tiết:

---

## 🔐 BƯỚC 1: ĐĂNG NHẬP

### **1.1. Truy cập trang đăng nhập**
Mở trình duyệt và vào:
```
https://thebenchmarktrader.com/login
```

### **1.2. Nhập thông tin đăng nhập**
- **Email:** `hoangkim.helen@gmail.com`
- **Password:** (mật khẩu bạn đã đăng ký)
- Nhấn **"Đăng nhập"** hoặc **"Login"**

✅ Nếu đăng nhập thành công, bạn sẽ thấy trang dashboard.

---

## 📝 BƯỚC 2: TRUY CẬP TRANG ADMIN BLOG

Sau khi đăng nhập, vào:
```
https://thebenchmarktrader.com/admin/blog
```

Hoặc click **"Blog"** trong menu Admin.

✅ Trang sẽ hiển thị:
- **Stats cards:** Tổng bài viết, đã xuất bản, bản nháp, lượt xem
- **Danh sách bài viết:** bảng với title, excerpt, category, status, views, date, actions

---

## ✏️ BƯỚC 3: CHỈNH SỬA BÀI VIẾT

### **3.1. Mở trang chỉnh sửa**
Trên dashboard, tại cột **"Thao tác"** của bài viết cần sửa:
1. Tìm bài viết trong bảng
2. Click icon ✏️ Edit

### **3.2. Biên tập nội dung**
Trang soạn thảo gồm:

#### **A. Tiêu đề và Slug**
- Tiêu đề: tự sinh slug
- Slug: có thể tùy chỉnh (ví dụ: `my-article-title`)

#### **B. Mô tả**
- 150–200 ký tự
- Mục tiêu: tóm tắt ngắn, hấp dẫn
- Giới hạn: 500

#### **C. Nội dung (Rich Text Editor)**
- Toolbar: định dạng văn bản, header, danh sách, liên kết, ảnh, màu, căn chỉnh
- Có preview khi gõ

#### **D. Sidebar (bên phải)**

##### **Danh mục**
Chọn một:
- **📰 Tin Tức** - thông tin thị trường, dữ liệu
- **🎓 Đào Tạo & Phân Tích** - hướng dẫn, chiến lược
- **🤖 EA ThebenchmarkTrader** - tính năng, cập nhật

##### **Hình đại diện**
URL ảnh (ví dụ: `/vet-images/1.png`)

##### **Tags**
- Nhập tag → Enter hoặc "Thêm"
- Xóa tag: click ✖

##### **Tùy chọn**
- **Bài viết nổi bật** - hiển thị ở đầu
- **Premium** - dành cho paid

##### **Trạng thái**
Chọn một:
- **Bản nháp** - chưa publish
- **Đã xuất bản** - hiển thị công khai
- **Lưu trữ** - ẩn

### **3.3. Lưu**
Nhấn **"Lưu thay đổi"** (góc trên bên phải)

✅ **Thông báo:** "Cập nhật bài viết thành công!"
✅ **Tự chuyển về:** danh sách bài viết

---

## ➕ BƯỚC 4: TẠO BÀI VIẾT MỚI

### **4.1. Mở trang tạo mới**
Vào `/admin/blog`, nhấn **"+ Tạo bài viết mới"**

### **4.2. Điền thông tin**
Giống bước 3.2

### **4.3. Xuất bản**

#### **A. Lưu nháp**
- Nhấn **"Lưu nháp"** → `status: "draft"`

#### **B. Xuất bản**
- Nhấn **"Xuất bản"** → `status: "published"` → hiển thị công khai

✅ **Thông báo:** "Tạo bài viết thành công!"

---

## 👁️ BƯỚC 5: XEM BÀI VIẾT TRÊN TRANG CHỦ

Sau khi xuất bản:
```
https://thebenchmarktrader.com/blog
```
- Bài viết hiển thị đúng category
- Click bài để xem chi tiết

---

## 📊 BƯỚC 6: XEM THỐNG KÊ

Trên Admin dashboard:

| Card | Ý nghĩa |
|------|---------|
| **Tổng bài viết** | Tất cả (draft + published + archived) |
| **Đã xuất bản** | `status: "published"` |
| **Bản nháp** | `status: "draft"` |
| **Tổng lượt xem** | Cộng dồn views |

---

## 🔍 BƯỚC 7: TÌM KIẾM VÀ LỌC

Trên dashboard:
- Search: tìm theo title
- Dropdown "Danh mục": lọc category
- Dropdown "Trạng thái": lọc status

---

## ⚠️ QUYỀN HẠN CỦA STAFF

✅ Được phép:
- Đăng nhập vào `/admin/blog`
- Xem dashboard và thống kê
- Tạo bài mới
- Sửa bài (title, content, category, image, tags, status, featured, premium)
- Xem danh sách bài viết

❌ Không được phép:
- Xóa bài viết
- Quản lý users
- Promote/demote users
- Đổi cài đặt hệ thống

---

## 🎨 TIPS

### Viết content
- Tiêu đề: ngắn, rõ
- Mô tả: nêu vấn đề/lợi ích
- Nội dung: cấu trúc với headings/danh sách/ảnh
- Tags: 3–5 tags liên quan
- Ảnh: đúng tỉ lệ, <100KB

### SEO
- Dùng `H2` để cấu trúc
- Giữ slug ngắn, dễ đọc
- Thêm ảnh có alt text

### UI/UX
- Nhóm thông tin trong editor
- Preview trên mobile

---

## 🐛 XỬ LÝ LỖI

### 1. "Unauthorized"
- Kiểm tra đăng nhập, Cookie
- Đăng xuất rồi đăng nhập lại

### 2. "Bài viết không tồn tại"
- Kiểm tra URL slug
- Đảm bảo chưa bị xóa bởi admin

### 3. Biên tập không lưu
- Kiểm tra network (F12 → Console/Network)
- Thông báo lỗi nếu có
- Liên hệ admin

### 4. Không mở Dashboard
- Thử `/login`, sau đó `/admin/blog`
- Kiểm tra `role: "staff"`
- Liên hệ admin

---

## 📞 HỖ TRỢ

Liên hệ:
- Email: support@thebenchmarktrader.com
- Phone: +84 765 452 515
- Facebook: [ThebenchmarkTrader](https://facebook.com/thebenchmarktrader)

---

## ✅ CHECKLIST

- [ ] Đăng nhập `/admin/blog`
- [ ] Đọc stats và danh sách bài
- [ ] Tạo bài mới, đăng
- [ ] Sửa bài cũ, lưu
- [ ] Chọn category, thêm tags
- [ ] Đặt featured
- [ ] Xem trên `/blog`
- [ ] Search/lọc
- [ ] Tạo nháp
- [ ] Không thấy nút xóa

---

Chúc bạn làm việc hiệu quả!

