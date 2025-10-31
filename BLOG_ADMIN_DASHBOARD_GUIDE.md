# 📝 Blog Admin Dashboard - Hướng Dẫn Sử Dụng

## 🎯 Tổng Quan

Hệ thống quản lý blog hoàn chỉnh với dashboard admin, rich text editor, phân quyền người dùng và tích hợp MongoDB.

---

## ✨ Tính Năng Chính

### 1. **Admin Dashboard** (`/admin/blog`)
- ✅ Xem tổng quan thống kê blog
- ✅ Quản lý tất cả bài viết (CRUD)
- ✅ Lọc theo danh mục và trạng thái
- ✅ Tìm kiếm bài viết
- ✅ Xem analytics (views, published, draft)

### 2. **Tạo Bài Viết** (`/admin/blog/create`)
- ✅ Rich text editor (React Quill)
- ✅ Auto-generate slug từ tiêu đề
- ✅ Upload hình ảnh
- ✅ Thêm tags
- ✅ Chọn danh mục
- ✅ Đánh dấu featured/premium
- ✅ Lưu nháp hoặc xuất bản ngay

### 3. **Chỉnh Sửa Bài Viết** (`/admin/blog/edit/[id]`)
- ✅ Cập nhật toàn bộ nội dung
- ✅ Thay đổi trạng thái
- ✅ Xem trước bài viết
- ✅ Lưu thay đổi

### 4. **Blog Frontend** (`/blog`)
- ✅ Hiển thị bài viết từ MongoDB
- ✅ Lọc theo category
- ✅ Featured post nổi bật
- ✅ Đếm lượt xem tự động
- ✅ Related posts
- ✅ Responsive design

---

## 🔐 Phân Quyền Người Dùng

### **Admin** (role: "admin")
- ✅ Full access tất cả tính năng
- ✅ Tạo, sửa, xóa bài viết
- ✅ Publish/Unpublish bài viết
- ✅ Xóa bài viết của bất kỳ ai
- ✅ Quản lý users
- ✅ Xem analytics

### **Staff/Editor** (role: "staff")
- ✅ Tạo bài viết mới
- ✅ Sửa bài viết của mình
- ✅ Sửa bài viết của người khác (nếu được phân quyền)
- ✅ Publish/Unpublish bài viết
- ❌ Không thể xóa bài viết
- ❌ Không thể quản lý users

### **User** (role: "user")
- ❌ Không có quyền truy cập admin dashboard
- ✅ Chỉ xem blog frontend

---

## 🚀 Cài Đặt & Sử Dụng

### **Bước 1: Cài đặt dependencies**

```bash
npm install react-quill mongoose
npm install --save-dev @types/react-quill
```

### **Bước 2: Cấu hình MongoDB**

Đảm bảo `MONGODB_URI` đã được set trong `.env.local`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-secret-key-change-in-production
```

### **Bước 3: Migrate dữ liệu từ file sang MongoDB**

Chạy script migration để chuyển 18 bài viết sample từ `blogPosts.ts` sang MongoDB:

```bash
npx ts-node scripts/migrate-blog-to-mongodb.ts
```

**Output mong đợi:**
```
🚀 Starting blog migration to MongoDB...
✅ Connected to MongoDB
✅ Migrated: Non-Farm Payroll tháng 12/2024...
✅ Migrated: FED giữ nguyên lãi suất...
...
📊 Migration Summary:
✅ Successfully migrated: 18 posts
❌ Failed: 0 posts
📝 Total processed: 18 posts
✅ Total posts in MongoDB: 18

📂 Category Breakdown:
   📰 Tin Tức: 6 posts
   🎓 Đào Tạo: 6 posts
   🤖 EA ThebenchmarkTrader: 6 posts
```

### **Bước 4: Promote user thành Admin**

Sử dụng file `promote-admin.html` hoặc gọi API:

```bash
curl -X POST https://yourdomain.com/api/admin/promote \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@gmail.com",
    "secretKey": "PROMOTE_ADMIN_2024"
  }'
```

### **Bước 5: Truy cập Admin Dashboard**

1. Đăng nhập với tài khoản admin
2. Truy cập: `https://yourdomain.com/admin/blog`
3. Bắt đầu quản lý blog!

---

## 📝 Hướng Dẫn Tạo Bài Viết Mới

### **Cách 1: Qua Admin Dashboard (Khuyến nghị)**

1. **Truy cập:** `/admin/blog`
2. **Click:** "Tạo bài viết mới"
3. **Điền thông tin:**
   - **Tiêu đề:** Nhập tiêu đề bài viết (slug tự động generate)
   - **Mô tả ngắn:** 150-200 ký tự
   - **Nội dung:** Sử dụng rich text editor
   - **Danh mục:** Chọn News/Education/EA
   - **Hình ảnh:** URL hình ảnh
   - **Tags:** Thêm các tags liên quan
   - **Options:**
     - ⭐ Featured: Bài viết nổi bật
     - 🔒 Premium: Nội dung premium
4. **Lưu:**
   - **Lưu nháp:** Để review sau
   - **Xuất bản:** Publish ngay lập tức

### **Cách 2: Qua API (Cho developers)**

```javascript
const response = await fetch('/api/admin/blog/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Cookie': 'token=your-jwt-token'
  },
  body: JSON.stringify({
    title: "Tiêu đề bài viết",
    excerpt: "Mô tả ngắn",
    content: "<p>Nội dung HTML</p>",
    category: "news",
    tags: ["NFP", "USD"],
    image: "/vet-images/1.png",
    featured: false,
    isPremium: false,
    status: "published"
  })
});
```

---

## 🎨 Rich Text Editor

### **Toolbar Features:**

- **Headers:** H1-H6
- **Text Formatting:** Bold, Italic, Underline, Strike
- **Lists:** Ordered, Bullet
- **Colors:** Text color, Background color
- **Alignment:** Left, Center, Right, Justify
- **Media:** Links, Images, Videos
- **Code:** Blockquote, Code blocks
- **Clear Formatting**

### **Tips:**

1. **Paste từ Word/Google Docs:** Sử dụng "Clear Formatting" sau khi paste
2. **Images:** Nhập URL trực tiếp hoặc upload lên CDN trước
3. **Videos:** Nhúng YouTube/Vimeo bằng embed URL
4. **Code:** Sử dụng code block cho code snippets

---

## 📊 Analytics & Statistics

### **Dashboard Stats:**

- **Tổng bài viết:** Tất cả bài viết trong DB
- **Đã xuất bản:** Bài viết status = "published"
- **Bản nháp:** Bài viết status = "draft"
- **Tổng lượt xem:** Sum của views từ tất cả bài viết

### **Trending Posts:**

- Tự động sắp xếp theo views
- Top 5 bài viết được xem nhiều nhất
- Hiển thị trong admin dashboard

### **Category Stats:**

- Số lượng bài viết theo từng category
- Hiển thị trong filters

---

## 🔧 API Endpoints

### **Public Endpoints (Không cần auth):**

#### GET `/api/blog/posts`
Lấy danh sách bài viết đã publish

**Query params:**
- `category`: Filter theo category (news/education/ea-leopard)
- `featured`: Filter featured posts (true/false)
- `limit`: Số bài viết per page (default: 50)
- `page`: Page number (default: 1)

**Response:**
```json
{
  "success": true,
  "posts": [...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 18,
    "pages": 1
  }
}
```

#### GET `/api/blog/posts/[slug]`
Lấy chi tiết 1 bài viết và tự động tăng views

**Response:**
```json
{
  "success": true,
  "post": {...},
  "relatedPosts": [...]
}
```

### **Admin Endpoints (Cần auth + admin/staff role):**

#### GET `/api/admin/blog/posts`
Lấy tất cả bài viết (bao gồm draft)

**Query params:**
- `category`: Filter category
- `status`: Filter status (draft/published/archived)
- `search`: Tìm kiếm theo title/excerpt/author
- `page`, `limit`: Pagination

#### POST `/api/admin/blog/posts`
Tạo bài viết mới

**Body:**
```json
{
  "title": "string",
  "slug": "string (optional)",
  "excerpt": "string",
  "content": "string (HTML)",
  "category": "news|education|ea-leopard",
  "tags": ["string"],
  "image": "string (URL)",
  "featured": boolean,
  "isPremium": boolean,
  "status": "draft|published|archived"
}
```

#### GET `/api/admin/blog/posts/[id]`
Lấy chi tiết bài viết theo ID

#### PATCH `/api/admin/blog/posts/[id]`
Cập nhật bài viết

**Body:** Giống POST, chỉ cần fields muốn update

#### DELETE `/api/admin/blog/posts/[id]`
Xóa bài viết (chỉ admin)

#### GET `/api/admin/blog/stats`
Lấy thống kê blog

**Response:**
```json
{
  "total": 18,
  "published": 15,
  "draft": 3,
  "archived": 0,
  "views": 1234,
  "categoryStats": [...],
  "trendingPosts": [...],
  "recentPosts": [...]
}
```

---

## 🗄️ Database Schema

### **BlogPost Model:**

```typescript
{
  title: String (required, max 200)
  slug: String (required, unique, indexed)
  excerpt: String (required, max 500)
  content: String (required, HTML)
  author: {
    id: String
    name: String
    email: String
  }
  category: Enum ["news", "education", "ea-leopard"]
  tags: [String] (max 10)
  image: String (URL)
  featured: Boolean (default: false)
  isPremium: Boolean (default: false)
  status: Enum ["draft", "published", "archived"]
  views: Number (default: 0)
  readTime: String (auto-calculated)
  publishedAt: Date (auto-set when published)
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

### **Indexes:**

- `slug` (unique)
- `status + publishedAt`
- `category + status + publishedAt`
- `featured + status + publishedAt`
- `views` (descending)
- `createdAt` (descending)

---

## 🎯 Best Practices

### **Content Writing:**

1. **Tiêu đề:** 60-80 ký tự, có keywords
2. **Excerpt:** 150-200 ký tự, compelling
3. **Content:** 800-2000 từ, có structure rõ ràng
4. **Images:** 1200x630px, optimize size
5. **Tags:** 3-5 tags relevant
6. **SEO:** Sử dụng H2, H3, internal links

### **Publishing Workflow:**

1. **Draft:** Viết và lưu nháp
2. **Review:** Kiểm tra lại nội dung, hình ảnh
3. **Preview:** Xem trước trên frontend
4. **Publish:** Xuất bản khi ready
5. **Monitor:** Theo dõi views và engagement

### **Categories:**

- **📰 Tin Tức:** Current events, market data, news
- **🎓 Đào Tạo:** Evergreen content, tutorials, strategies
- **🤖 EA ThebenchmarkTrader:** Product-specific content, updates

---

## 🔒 Security

### **Authentication:**

- JWT token trong cookies
- Verify token trên mỗi admin request
- Role-based access control

### **Authorization:**

- Admin: Full access
- Staff: Limited access (no delete)
- User: No admin access

### **Input Validation:**

- Required fields validation
- Max length validation
- Slug uniqueness check
- XSS protection (sanitize HTML)

---

## 🐛 Troubleshooting

### **Problem: Không thể tạo bài viết**

**Solution:**
1. Check JWT token còn valid không
2. Check role = "admin" hoặc "staff"
3. Check MongoDB connection
4. Check console errors

### **Problem: Slug already exists**

**Solution:**
1. Thay đổi tiêu đề một chút
2. Hoặc edit slug manually
3. Hoặc xóa bài viết cũ có slug trùng

### **Problem: Images không hiển thị**

**Solution:**
1. Check URL hợp lệ
2. Check CORS settings
3. Upload lên CDN (Cloudinary, AWS S3)

### **Problem: Rich text editor không load**

**Solution:**
1. Check React Quill installed
2. Check dynamic import (SSR issue)
3. Check CSS imported

---

## 📈 Roadmap & Future Features

### **Phase 1: Current** ✅
- [x] MongoDB schema
- [x] Admin dashboard
- [x] CRUD operations
- [x] Rich text editor
- [x] Role-based access
- [x] Analytics basic

### **Phase 2: Next (1-2 tháng)**
- [ ] Image upload (Cloudinary integration)
- [ ] SEO optimization (meta tags, sitemap)
- [ ] Comments system
- [ ] Like/Share functionality
- [ ] Email notifications
- [ ] Draft auto-save

### **Phase 3: Advanced (3-6 tháng)**
- [ ] Multi-language support
- [ ] Advanced analytics (Google Analytics)
- [ ] A/B testing
- [ ] Content scheduling
- [ ] Revision history
- [ ] Bulk operations

---

## 📞 Support

**Nếu cần hỗ trợ:**

1. Check documentation này
2. Check console errors
3. Check MongoDB logs
4. Contact: support@thebenchmarktrader.com

---

## 📚 Resources

### **React Quill:**
- Docs: https://github.com/zenoamaro/react-quill
- Toolbar customization: https://quilljs.com/docs/modules/toolbar/

### **MongoDB:**
- Mongoose docs: https://mongoosejs.com/docs/
- Schema design: https://mongoosejs.com/docs/guide.html

### **Next.js:**
- API routes: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
- Dynamic routes: https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes

---

**Status:** 🟢 Production Ready
**Version:** 1.0
**Last Updated:** October 31, 2025

---

**Happy Blogging! 📝✨**

