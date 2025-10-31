# 🚀 Deploy Instructions - Blog CMS

## 📋 Files Mới Đã Tạo

### **Total: 18 new files + 2 updated files**

### Models (2 files):
```
lib/models/BlogPost.ts
lib/models/BlogCategory.ts
```

### Admin Pages (3 files):
```
app/admin/blog/page.tsx
app/admin/blog/create/page.tsx
app/admin/blog/edit/[id]/page.tsx
```

### API Routes (5 files):
```
app/api/blog/posts/route.ts
app/api/blog/posts/[slug]/route.ts
app/api/admin/blog/posts/route.ts
app/api/admin/blog/posts/[id]/route.ts
app/api/admin/blog/stats/route.ts
```

### Scripts (1 file):
```
scripts/migrate-blog-to-mongodb.ts
```

### Documentation (5 files):
```
BLOG_QUICK_START.md
BLOG_ADMIN_DASHBOARD_GUIDE.md
BLOG_SYSTEM_SUMMARY.md
BLOG_IMPLEMENTATION_COMPLETE.md
README_BLOG_CMS.md
DEPLOY_INSTRUCTIONS.md (this file)
```

### Updated Files (2):
```
app/blog/page.tsx (Updated to use MongoDB)
package.json (Added react-quill, ts-node)
```

---

## 🔧 **BƯỚC 1: Commit Code**

Chạy các lệnh sau trong terminal:

```bash
# Check status
git status

# Add all new files
git add lib/models/BlogPost.ts
git add lib/models/BlogCategory.ts
git add app/admin/blog/page.tsx
git add app/admin/blog/create/page.tsx
git add app/admin/blog/edit/[id]/page.tsx
git add app/api/blog/posts/route.ts
git add app/api/blog/posts/[slug]/route.ts
git add app/api/admin/blog/posts/route.ts
git add app/api/admin/blog/posts/[id]/route.ts
git add app/api/admin/blog/stats/route.ts
git add scripts/migrate-blog-to-mongodb.ts
git add BLOG_QUICK_START.md
git add BLOG_ADMIN_DASHBOARD_GUIDE.md
git add BLOG_SYSTEM_SUMMARY.md
git add BLOG_IMPLEMENTATION_COMPLETE.md
git add README_BLOG_CMS.md
git add DEPLOY_INSTRUCTIONS.md

# Add updated files
git add app/blog/page.tsx
git add package.json

# Commit
git commit -m "feat: Add complete Blog CMS system with admin dashboard

- Add MongoDB models (BlogPost, BlogCategory)
- Add admin dashboard pages (list, create, edit)
- Add API routes for blog CRUD operations
- Add rich text editor (React Quill)
- Add role-based access control (Admin/Staff)
- Add analytics and views tracking
- Add migration script for existing blog posts
- Update blog frontend to use MongoDB
- Add comprehensive documentation

Features:
- Admin dashboard with stats
- WYSIWYG rich text editor
- Role-based permissions
- Views tracking and analytics
- Category filtering
- Search functionality
- Draft/Published system
- Featured posts
- Related posts
- Responsive design

Tech stack:
- React Quill for editor
- MongoDB + Mongoose
- JWT authentication
- Next.js 15 App Router
"
```

---

## 🚀 **BƯỚC 2: Push lên GitHub**

```bash
# Push to main branch
git push origin main

# Hoặc nếu branch của bạn khác:
git push origin <your-branch-name>
```

---

## ☁️ **BƯỚC 3: Deploy lên Vercel**

### **Option A: Auto Deploy (Recommended)**

Nếu bạn đã connect GitHub với Vercel:
1. ✅ Vercel sẽ tự động detect push mới
2. ✅ Tự động build và deploy
3. ✅ Chờ 2-3 phút để hoàn tất

### **Option B: Manual Deploy**

```bash
# Install Vercel CLI (nếu chưa có)
npm install -g vercel

# Deploy
vercel --prod
```

---

## 🔐 **BƯỚC 4: Cấu hình Environment Variables trên Vercel**

Đảm bảo các biến sau đã được set trong Vercel Dashboard:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-secret-key-change-in-production
RESEND_API_KEY=your-resend-api-key
STRIPE_SECRET_KEY=your-stripe-key
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-secret
```

**Cách set:**
1. Vào Vercel Dashboard
2. Chọn project
3. Settings → Environment Variables
4. Add các biến trên

---

## 📦 **BƯỚC 5: Install Dependencies trên Vercel**

Vercel sẽ tự động chạy `npm install` và cài:
- ✅ `react-quill@^2.0.0`
- ✅ `@types/react-quill@^1.3.10`
- ✅ `ts-node@^10.9.2`

Nếu build fail, check build logs trong Vercel Dashboard.

---

## 🗄️ **BƯỚC 6: Migrate Data sang MongoDB**

Sau khi deploy thành công:

### **Option A: Chạy script local (Recommended)**

```bash
# Ensure MONGODB_URI is set in .env.local
npx ts-node scripts/migrate-blog-to-mongodb.ts
```

### **Option B: Chạy trên server**

Tạo API endpoint để trigger migration:

```typescript
// app/api/admin/migrate-blog/route.ts
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import BlogPost from "@/lib/models/BlogPost";
import { allBlogPosts } from "@/data/blogPosts";

export async function POST(request: NextRequest) {
  try {
    // Verify secret key
    const { secretKey } = await request.json();
    if (secretKey !== "MIGRATE_BLOG_2024") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    
    // Clear existing
    await BlogPost.deleteMany({});
    
    // Migrate
    for (const post of allBlogPosts) {
      const newPost = new BlogPost({
        title: post.title,
        slug: post.id,
        excerpt: post.excerpt,
        content: post.content || post.previewContent || post.excerpt,
        author: {
          id: "admin",
          name: post.author,
          email: "admin@thebenchmarktrader.com",
        },
        category: post.category,
        tags: post.tags || [],
        image: post.image,
        featured: post.featured || false,
        isPremium: post.isPremium || false,
        status: "published",
        views: 0,
        readTime: post.readTime,
        publishedAt: new Date(post.date),
      });
      await newPost.save();
    }

    return NextResponse.json({
      success: true,
      message: `Migrated ${allBlogPosts.length} posts`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

Sau đó gọi:
```bash
curl -X POST https://yourdomain.com/api/admin/migrate-blog \
  -H "Content-Type: application/json" \
  -d '{"secretKey":"MIGRATE_BLOG_2024"}'
```

---

## 👤 **BƯỚC 7: Promote Admin User**

### **Option A: Sử dụng promote-admin.html**

1. Upload `promote-admin.html` lên GitHub
2. Deploy sẽ có file này tại: `https://yourdomain.com/promote-admin.html`
3. Mở trong browser và nhập:
   - Email: `truong.cdk0405@gmail.com`
   - Secret: `PROMOTE_ADMIN_2024`

### **Option B: Sử dụng curl**

```bash
curl -X POST https://thebenchmarktrader.com/api/admin/promote \
  -H "Content-Type: application/json" \
  -d '{
    "email": "truong.cdk0405@gmail.com",
    "secretKey": "PROMOTE_ADMIN_2024"
  }'
```

---

## ✅ **BƯỚC 8: Test Hệ Thống**

### **1. Test Blog Frontend:**
```
https://yourdomain.com/blog
```

Kiểm tra:
- ✅ Hiển thị bài viết từ MongoDB
- ✅ Category tabs hoạt động
- ✅ Featured post hiển thị
- ✅ Click vào bài viết xem chi tiết
- ✅ Views counter tăng

### **2. Test Admin Dashboard:**
```
https://yourdomain.com/login
→ Login với admin account
→ https://yourdomain.com/admin/blog
```

Kiểm tra:
- ✅ Stats cards hiển thị đúng
- ✅ Posts table load
- ✅ Search hoạt động
- ✅ Filters hoạt động

### **3. Test Create Post:**
```
https://yourdomain.com/admin/blog/create
```

Kiểm tra:
- ✅ Rich text editor load
- ✅ Tạo bài viết mới
- ✅ Lưu nháp
- ✅ Xuất bản

### **4. Test Edit Post:**
```
https://yourdomain.com/admin/blog/edit/[id]
```

Kiểm tra:
- ✅ Load existing post
- ✅ Cập nhật nội dung
- ✅ Lưu thay đổi

### **5. Test API Endpoints:**

```bash
# Public API
curl https://yourdomain.com/api/blog/posts

# Admin API (cần token)
curl https://yourdomain.com/api/admin/blog/stats \
  -H "Cookie: token=your-jwt-token"
```

---

## 🐛 **Troubleshooting**

### **Build fails trên Vercel:**

**Check 1: Dependencies**
```bash
# Ensure package.json has:
"react-quill": "^2.0.0"
"@types/react-quill": "^1.3.10"
"ts-node": "^10.9.2"
```

**Check 2: Environment Variables**
- MONGODB_URI phải có
- JWT_SECRET phải có

**Check 3: Build Logs**
- Vào Vercel Dashboard → Deployments → View Build Logs
- Tìm error message

### **MongoDB connection fails:**

```bash
# Check MONGODB_URI format
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

### **Admin dashboard không load:**

1. Check user role trong MongoDB:
```javascript
db.users.findOne({email: "truong.cdk0405@gmail.com"})
// Should have role: "admin"
```

2. Check JWT token:
```bash
# Clear cookies và login lại
```

### **Rich text editor không hiển thị:**

1. Check browser console cho errors
2. Ensure React Quill CSS loaded:
```typescript
import "react-quill/dist/quill.snow.css";
```

---

## 📊 **Expected Results**

Sau khi deploy thành công:

### **Database:**
- ✅ 18 blog posts trong MongoDB
- ✅ 3 categories (news, education, ea-leopard)
- ✅ All posts status = "published"

### **Admin Dashboard:**
- ✅ Stats: Total 18, Published 18, Draft 0, Views 0
- ✅ Posts table hiển thị 18 bài
- ✅ Create/Edit forms hoạt động

### **Frontend:**
- ✅ Blog listing hiển thị 18 bài
- ✅ Category filtering hoạt động
- ✅ Featured post hiển thị
- ✅ Post detail pages hoạt động
- ✅ Views tracking hoạt động

---

## 🎯 **Quick Commands Summary**

```bash
# 1. Commit
git add .
git commit -m "feat: Add Blog CMS system"

# 2. Push
git push origin main

# 3. Wait for Vercel auto-deploy (2-3 minutes)

# 4. Migrate data
npx ts-node scripts/migrate-blog-to-mongodb.ts

# 5. Promote admin
# Use promote-admin.html or curl

# 6. Test
# Open https://yourdomain.com/admin/blog
```

---

## 📞 **Support**

Nếu gặp vấn đề:
1. Check Vercel build logs
2. Check browser console
3. Check MongoDB connection
4. Contact: support@thebenchmarktrader.com

---

## ✅ **Deployment Checklist**

- [ ] Commit all files
- [ ] Push to GitHub
- [ ] Vercel auto-deploy success
- [ ] Environment variables set
- [ ] Run migration script
- [ ] Promote admin user
- [ ] Test blog frontend
- [ ] Test admin dashboard
- [ ] Test create post
- [ ] Test edit post
- [ ] Test delete post
- [ ] Test mobile responsive

---

**Status:** 🟢 Ready to Deploy
**Estimated Time:** 10-15 minutes
**Last Updated:** October 31, 2025

**Good luck with deployment! 🚀**

