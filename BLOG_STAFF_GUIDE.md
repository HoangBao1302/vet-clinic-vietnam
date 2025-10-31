# 👥 HƯỚNG DẪN PHÂN QUYỀN STAFF - QUẢN LÝ BLOG

## 📋 TỔNG QUAN VỀ PHÂN QUYỀN

### **3 Vai trò trong hệ thống:**

| Role | Quyền hạn | Sử dụng cho |
|------|-----------|-------------|
| **User** | Chỉ xem blog công khai | Khách hàng thông thường |
| **Staff** | Đăng bài, sửa bài, KHÔNG xóa | Nhân viên/Content writers |
| **Admin** | Full quyền (tạo, sửa, xóa, quản lý users) | Quản trị viên |

---

## 🎯 CÁCH PROMOTE USER THÀNH STAFF

### **Method 1: Qua trang Web (Đơn giản nhất)**

#### **Bước 1: Mở trang Promote**
```
https://thebenchmarktrader.com/promote-staff.html
```

#### **Bước 2: Điền thông tin**
- **Email:** Nhập email của user muốn promote
- **Secret Key:** `PROMOTE_STAFF_2024`

#### **Bước 3: Click "Promote to Staff"**
- Thông báo thành công sẽ hiển thị
- User đã được promote thành Staff

---

### **Method 2: Qua MongoDB Atlas (Manual)**

#### **Bước 1: Login MongoDB Atlas**
1. Truy cập: https://cloud.mongodb.com
2. Login vào account

#### **Bước 2: Tìm user**
1. Chọn cluster: `Cluster0`
2. Database: `leopardsmart` hoặc `thebenchmarktrader`
3. Collection: `users`
4. Tìm user bằng email

#### **Bước 3: Update role**
Tìm document của user và sửa:
```json
{
  "email": "staff@example.com",
  "role": "staff",  // ← Thay đổi từ "user" sang "staff"
  ...
}
```

Click **Update** để lưu.

---

### **Method 3: Qua API (Programmatic)**

#### **Endpoint:**
```
POST /api/admin/promote-staff
```

#### **Request Body:**
```json
{
  "email": "staff@example.com",
  "secretKey": "PROMOTE_STAFF_2024"
}
```

#### **Response Success:**
```json
{
  "success": true,
  "message": "User promoted to Staff successfully",
  "user": {
    "email": "staff@example.com",
    "role": "staff",
    "name": "Staff Name"
  }
}
```

#### **Example using cURL:**
```bash
curl -X POST https://thebenchmarktrader.com/api/admin/promote-staff \
  -H "Content-Type: application/json" \
  -d '{
    "email": "staff@example.com",
    "secretKey": "PROMOTE_STAFF_2024"
  }'
```

---

## ✅ QUYỀN HẠN CỦA STAFF

### **ĐƯỢC PHÉP:**

✅ **Tạo bài viết mới**
- Vào `/admin/blog/create`
- Viết nội dung với rich text editor
- Chọn category, tags, featured
- Publish hoặc lưu nháp

✅ **Chỉnh sửa bài viết**
- Vào `/admin/blog`
- Click icon ✏️ Edit
- Sửa nội dung, category, tags
- Update bài viết

✅ **Xem thống kê**
- Dashboard hiển thị stats
- Xem tổng bài viết, lượt xem

---

### **KHÔNG ĐƯỢC:**

❌ **Xóa bài viết**
- Icon 🗑️ Delete bị ẩn
- API trả về 403 Forbidden

❌ **Quản lý users**
- Không thể promote/demote users
- Không thể xóa users

❌ **Thay đổi cài đặt hệ thống**
- Không có quyền admin

---

## 🔐 LUỒNG ĐĂNG NHẬP VÀ PHÂN QUYỀN

### **1. User đăng nhập:**

```
POST /api/auth/login
Body: { email, password }
Response: { token, user }
```

### **2. Access Admin Dashboard:**

```
GET /admin/blog
Headers: { Cookie: token=... }
```

### **3. Verification Flow:**

```
┌─────────────────┐
│  User Login     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Check Role     │
│  - admin ✅     │
│  - staff ✅     │
│  - user ❌      │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
   Admin    Staff
    │         │
    ▼         ▼
 Full      Limited
Access     Access
```

---

## 📝 VÍ DỤ SỬ DỤNG

### **Scenario 1: Content Writer mới**

**Bước 1: Tạo account cho writer**
```
Email: writer@company.com
Password: [password]
Role: user (mặc định)
```

**Bước 2: Promote lên Staff**
```
Mở: /promote-staff.html
Email: writer@company.com
Secret: PROMOTE_STAFF_2024
→ Promote thành công
```

**Bước 3: Writer đăng nhập**
```
Login với writer@company.com
→ Access /admin/blog
→ Có thể tạo/sửa bài viết
→ KHÔNG thể xóa bài viết
```

---

### **Scenario 2: Kiểm tra quyền hạn**

**Test Case 1: Staff tạo bài**
```
✅ POST /api/admin/blog/posts
Body: { title, content, ... }
Response: 200 OK
```

**Test Case 2: Staff sửa bài**
```
✅ PATCH /api/admin/blog/posts/[id]
Body: { title: "Updated" }
Response: 200 OK
```

**Test Case 3: Staff xóa bài**
```
❌ DELETE /api/admin/blog/posts/[id]
Response: 403 Forbidden
Message: "Only admins can delete posts"
```

---

## 🛡️ SECURITY NOTES

### **1. Secret Key Security**

⚠️ **DEFAULT SECRET KEY:**
```
PROMOTE_STAFF_2024
```

✅ **NÊN ĐỔI THÀNH:**
```
# .env.local
PROMOTE_STAFF_SECRET=your-random-secure-key-here
```

### **2. Authentication Flow**

```
User → JWT Token (from login)
     ↓
API → Verify JWT
     ↓
Check → Role (admin || staff)
     ↓
Allow/Deny Access
```

### **3. Cookie Security**

Token được lưu trong HTTP-only cookie:
- ✅ Không accessible từ JavaScript
- ✅ Auto-sent với requests
- ✅ Secure trong production (HTTPS)

---

## 🐛 TROUBLESHOOTING

### **Lỗi 1: "Unauthorized" khi truy cập admin**

**Nguyên nhân:**
- User chưa login
- Token expired
- Role không đúng (user thay vì staff/admin)

**Giải pháp:**
1. Login lại: `/login`
2. Kiểm tra role trong database
3. Promote user lên staff lại

---

### **Lỗi 2: "Only admins can delete posts"**

**Đây KHÔNG PHẢI lỗi!**
- Đây là security feature
- Staff **KHÔNG THỂ** xóa bài viết
- Chỉ Admin mới có quyền xóa

---

### **Lỗi 3: Không tìm thấy user khi promote**

**Nguyên nhân:**
- Email không tồn tại trong database
- Email sai chính tả

**Giải pháp:**
1. Kiểm tra user đã đăng ký chưa
2. User phải register trước khi promote
3. Nếu chưa có, tạo mới qua `/register`

---

## 📊 DANH SÁCH CHECKLIST

### **Setup Staff mới:**

- [ ] User đã register account
- [ ] Login thành công ít nhất 1 lần
- [ ] Promote user lên staff
- [ ] Verify role trong database = "staff"
- [ ] Test login và truy cập /admin/blog
- [ ] Test tạo bài viết mới
- [ ] Test sửa bài viết cũ
- [ ] Verify KHÔNG thể xóa bài viết

---

## 📚 CÁC FILE LIÊN QUAN

```
app/
├── api/
│   └── admin/
│       ├── promote-staff/
│       │   └── route.ts          # API promote staff
│       └── blog/
│           ├── posts/
│           │   ├── route.ts      # List, Create
│           │   └── [id]/
│           │       └── route.ts  # Get, Update, Delete
│           └── stats/
│               └── route.ts      # Stats
├── admin/
│   └── blog/
│       ├── page.tsx              # Dashboard (staff OK)
│       ├── create/
│       │   └── page.tsx          # Create post (staff OK)
│       └── edit/
│           └── [id]/
│               └── page.tsx      # Edit post (staff OK)
public/
└── promote-staff.html            # UI promote staff
```

---

## 🎉 TÓM TẮT

**Staff có thể:**
- ✅ Đăng nhập vào admin dashboard
- ✅ Tạo bài viết mới
- ✅ Chỉnh sửa bài viết
- ✅ Xem thống kê

**Staff KHÔNG thể:**
- ❌ Xóa bài viết
- ❌ Quản lý users
- ❌ Thay đổi cài đặt hệ thống

**Để promote user:**
1. Vào `/promote-staff.html`
2. Nhập email + secret key
3. Click promote
4. ✅ Done!

---

## 📞 HỖ TRỢ

Nếu gặp vấn đề:
1. Kiểm tra console logs (F12)
2. Verify role trong MongoDB
3. Check JWT token hợp lệ
4. Test lại promotion flow

**Chúc bạn quản lý blog hiệu quả!** 🚀📝

