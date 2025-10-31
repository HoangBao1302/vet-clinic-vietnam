# 👥 HƯỚNG DẪN QUẢN LÝ STAFF - BLOG CMS

## 📋 **Tổng Quan**

Hệ thống có **3 cấp độ người dùng:**

| Role | Quyền Hạn | Mô Tả |
|------|-----------|-------|
| **User** | Đọc blog, tải demo | Người dùng thường |
| **Staff** | Quản lý blog | Biên tập viên, có thể tạo/sửa/xóa bài viết |
| **Admin** | Full access | Quản trị viên, toàn quyền |

---

## 🎯 **Quyền Hạn Staff**

### ✅ **Staff CÓ THỂ:**
- Truy cập `/admin/blog`
- Tạo bài viết mới
- Chỉnh sửa bài viết
- Xóa bài viết
- Quản lý categories và tags
- Upload hình ảnh
- Set featured/premium posts

### ❌ **Staff KHÔNG THỂ:**
- Truy cập Admin Dashboard chính (`/admin`)
- Quản lý users
- Quản lý affiliates
- Xem analytics
- Thay đổi settings hệ thống

---

## 🚀 **CÁCH PROMOTE USER THÀNH STAFF**

### **Bước 1: Đảm bảo user đã đăng ký**

User cần có tài khoản trên hệ thống:
```
https://thebenchmarktrader.com/register
```

### **Bước 2: Truy cập trang Promote Staff**

```
https://thebenchmarktrader.com/promote-staff.html
```

### **Bước 3: Nhập thông tin**

1. **Email của user:** Email đã đăng ký
2. **Secret Key:** `PROMOTE_STAFF_2024`

### **Bước 4: Click "Promote to Staff"**

✅ Thành công → User có thể login và truy cập `/admin/blog`

---

## 🔐 **Secret Keys**

### **Promote Staff:**
```
Secret Key: PROMOTE_STAFF_2024
```

### **Promote Admin:**
```
Secret Key: PROMOTE_ADMIN_2024
```

**⚠️ LƯU Ý:** Giữ bí mật các keys này!

---

## 📝 **WORKFLOW CHO STAFF**

### **1. Staff Login:**
```
https://thebenchmarktrader.com/login
```
Dùng email/password đã đăng ký

### **2. Truy cập Blog Dashboard:**
```
https://thebenchmarktrader.com/admin/blog
```

### **3. Tạo bài viết mới:**
- Click "Tạo bài viết mới"
- Điền tiêu đề, nội dung
- Chọn category
- Thêm tags
- Upload hình ảnh
- Click "Xuất bản" hoặc "Lưu nháp"

### **4. Chỉnh sửa bài viết:**
- Click icon ✏️ bên cạnh bài viết
- Sửa nội dung
- Click "Lưu thay đổi"

### **5. Xóa bài viết:**
- Click icon 🗑️ bên cạnh bài viết
- Confirm deletion

---

## 🎨 **FEATURES DÀNH CHO STAFF**

### **Rich Text Editor:**
- Bold, Italic, Underline
- Headers (H1-H6)
- Lists (ordered/unordered)
- Links & Images
- Code blocks
- Text alignment
- Colors

### **Post Management:**
- **Status:** Draft / Published / Archived
- **Featured:** Đánh dấu bài nổi bật
- **Premium:** Bài viết Premium (chỉ paid members)
- **Categories:** News, Education, EA ThebenchmarkTrader
- **Tags:** Tự do thêm tags

### **Media:**
- Upload hình ảnh đại diện
- Embed images trong content
- Embed videos (YouTube, Vimeo)

---

## 🔧 **QUẢN LÝ STAFF (DÀNH CHO ADMIN)**

### **Xem danh sách Staff:**

```javascript
// Trong MongoDB hoặc Admin Dashboard
db.users.find({ role: "staff" })
```

### **Promote User → Staff:**

**Option 1: Dùng Web Interface**
```
https://thebenchmarktrader.com/promote-staff.html
```

**Option 2: Dùng API**
```bash
curl -X POST https://thebenchmarktrader.com/api/admin/promote-staff \
  -H "Content-Type: application/json" \
  -d '{
    "email": "staff@example.com",
    "secretKey": "PROMOTE_STAFF_2024"
  }'
```

### **Demote Staff → User:**

```javascript
// Trong MongoDB
db.users.updateOne(
  { email: "staff@example.com" },
  { $set: { role: "user" } }
)
```

### **Remove Staff:**

```javascript
// Trong MongoDB
db.users.deleteOne({ email: "staff@example.com" })
```

---

## 📊 **MONITORING STAFF ACTIVITY**

### **Xem bài viết của Staff:**

Mỗi bài viết có field `author` với thông tin:
```json
{
  "author": {
    "id": "user_id",
    "name": "Staff Name",
    "email": "staff@example.com"
  }
}
```

### **Track Changes:**

Mỗi bài viết có timestamps:
- `createdAt`: Thời gian tạo
- `updatedAt`: Thời gian cập nhật cuối
- `publishedAt`: Thời gian xuất bản

---

## 🛡️ **BẢO MẬT**

### **Authentication:**
- JWT tokens
- Cookie-based sessions
- Auto logout sau 7 ngày

### **Authorization:**
- Role-based access control
- Middleware protection
- API route guards

### **Best Practices:**
1. Đổi secret keys định kỳ
2. Chỉ promote staff tin cậy
3. Monitor staff activity
4. Backup database thường xuyên
5. Review bài viết trước khi publish

---

## 🚨 **TROUBLESHOOTING**

### **Staff không thể login:**
✅ Kiểm tra email/password đúng chưa
✅ Kiểm tra role trong database: `db.users.findOne({ email: "..." })`
✅ Clear browser cache và cookies

### **Staff không thấy Admin Blog:**
✅ Kiểm tra role = "staff" trong database
✅ Kiểm tra middleware.ts đã include `/admin/blog`
✅ Logout và login lại

### **Staff không thể tạo bài:**
✅ Kiểm tra MongoDB connection
✅ Kiểm tra API route `/api/admin/blog/posts`
✅ Check browser console for errors

---

## 📞 **HỖ TRỢ**

### **Admin Contact:**
- Email: admin@thebenchmarktrader.com
- Dashboard: `/admin`

### **Technical Issues:**
- Check logs: Vercel Dashboard
- MongoDB: Atlas Dashboard
- Browser Console: F12

---

## 🎉 **HOÀN TẤT!**

Bây giờ bạn có thể:
1. ✅ Promote users thành Staff
2. ✅ Staff có thể quản lý blog
3. ✅ Phân quyền rõ ràng
4. ✅ Bảo mật tốt

**Happy Blogging! 📝✨**

