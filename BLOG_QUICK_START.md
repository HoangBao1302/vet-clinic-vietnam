# 🚀 Blog CMS - Quick Start Guide

## ⚡ Setup Nhanh (5 phút)

### **Bước 1: Cài đặt dependencies**

```bash
npm install
```

Hoặc nếu thiếu packages:

```bash
npm install react-quill mongoose
npm install --save-dev @types/react-quill ts-node
```

### **Bước 2: Kiểm tra MongoDB connection**

File `.env.local` cần có:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-secret-key-change-in-production
```

### **Bước 3: Migrate dữ liệu vào MongoDB**

```bash
npx ts-node scripts/migrate-blog-to-mongodb.ts
```

**Kết quả mong đợi:**
```
🚀 Starting blog migration to MongoDB...
✅ Connected to MongoDB
✅ Migrated: 18 posts
📂 Category Breakdown:
   📰 Tin Tức: 6 posts
   🎓 Đào Tạo: 6 posts
   🤖 EA ThebenchmarkTrader: 6 posts
✨ Migration completed successfully!
```

### **Bước 4: Promote user thành Admin**

**Option A: Sử dụng HTML file**

Mở `promote-admin.html` trong browser và nhập:
- Email: `your-email@gmail.com`
- Secret Key: `PROMOTE_ADMIN_2024`

**Option B: Sử dụng curl**

```bash
curl -X POST https://thebenchmarktrader.com/api/admin/promote \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@gmail.com","secretKey":"PROMOTE_ADMIN_2024"}'
```

### **Bước 5: Truy cập Admin Dashboard**

1. Đăng nhập: `http://localhost:3000/login`
2. Dashboard: `http://localhost:3000/admin/blog`
3. Tạo bài mới: Click "Tạo bài viết mới"

---

## 📝 Tạo Bài Viết Đầu Tiên

### **1. Truy cập Create Page**

URL: `http://localhost:3000/admin/blog/create`

### **2. Điền thông tin:**

- **Tiêu đề:** "Bài viết test đầu tiên"
- **Mô tả ngắn:** "Đây là bài viết test để kiểm tra hệ thống blog CMS"
- **Nội dung:** Viết nội dung bằng rich text editor
- **Danh mục:** Chọn "📰 Tin Tức"
- **Hình ảnh:** `/vet-images/1.png`
- **Tags:** Thêm "Test", "Blog"

### **3. Xuất bản:**

Click "Xuất bản" → Bài viết sẽ xuất hiện trên `/blog`

---

## 🎯 URLs Quan Trọng

### **Frontend (Public):**
- Blog listing: `http://localhost:3000/blog`
- Blog detail: `http://localhost:3000/blog/[slug]`

### **Admin (Cần đăng nhập):**
- Dashboard: `http://localhost:3000/admin/blog`
- Create post: `http://localhost:3000/admin/blog/create`
- Edit post: `http://localhost:3000/admin/blog/edit/[id]`

### **API Endpoints:**
- Public posts: `GET /api/blog/posts`
- Post detail: `GET /api/blog/posts/[slug]`
- Admin posts: `GET /api/admin/blog/posts`
- Create post: `POST /api/admin/blog/posts`
- Update post: `PATCH /api/admin/blog/posts/[id]`
- Delete post: `DELETE /api/admin/blog/posts/[id]`
- Stats: `GET /api/admin/blog/stats`

---

## 🔐 Phân Quyền

### **Admin** (role: "admin")
✅ Tất cả quyền

### **Staff** (role: "staff")
✅ Tạo/sửa bài viết
❌ Không xóa được

### **User** (role: "user")
❌ Không truy cập admin

---

## 📚 Documentation Đầy Đủ

- **Chi tiết:** `BLOG_ADMIN_DASHBOARD_GUIDE.md`
- **Tóm tắt:** `BLOG_SYSTEM_SUMMARY.md`
- **Quick start:** File này

---

## ✅ Checklist

- [ ] Cài đặt dependencies
- [ ] Check MongoDB connection
- [ ] Run migration script
- [ ] Promote user thành admin
- [ ] Đăng nhập vào admin dashboard
- [ ] Tạo bài viết test
- [ ] Xem bài viết trên frontend
- [ ] Test edit/delete

---

## 🐛 Troubleshooting

### **Migration fails:**
```bash
# Check MongoDB URI
echo $MONGODB_URI

# Check file exists
ls -la scripts/migrate-blog-to-mongodb.ts
```

### **Can't access admin:**
```bash
# Check user role in MongoDB
# Should be "admin" or "staff"
```

### **Rich text editor not loading:**
```bash
npm install react-quill
npm install --save-dev @types/react-quill
```

---

## 📞 Support

- Email: support@thebenchmarktrader.com
- Telegram: https://t.me/thebenchmarktrader

---

**Status:** 🟢 Ready to Use
**Time to setup:** ~5 minutes
**Last updated:** October 31, 2025

**Happy Blogging! 🎉**

