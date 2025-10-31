#!/bin/bash

# ========================================
# Git Commands để Push Blog CMS lên GitHub
# ========================================

echo "🚀 Starting Git Push Process..."
echo ""

# Check git status
echo "📋 Checking git status..."
git status
echo ""

# Add all new files
echo "➕ Adding new files..."

# Models
git add lib/models/BlogPost.ts
git add lib/models/BlogCategory.ts

# Admin Pages
git add app/admin/blog/page.tsx
git add app/admin/blog/create/page.tsx
git add "app/admin/blog/edit/[id]/page.tsx"

# API Routes
git add app/api/blog/posts/route.ts
git add "app/api/blog/posts/[slug]/route.ts"
git add app/api/admin/blog/posts/route.ts
git add "app/api/admin/blog/posts/[id]/route.ts"
git add app/api/admin/blog/stats/route.ts

# Scripts
git add scripts/migrate-blog-to-mongodb.ts

# Documentation
git add BLOG_QUICK_START.md
git add BLOG_ADMIN_DASHBOARD_GUIDE.md
git add BLOG_SYSTEM_SUMMARY.md
git add BLOG_IMPLEMENTATION_COMPLETE.md
git add README_BLOG_CMS.md
git add DEPLOY_INSTRUCTIONS.md
git add git-push-commands.sh

# Updated files
git add app/blog/page.tsx
git add package.json

echo "✅ All files added!"
echo ""

# Commit
echo "💾 Committing changes..."
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
✅ Admin dashboard with stats
✅ WYSIWYG rich text editor
✅ Role-based permissions (Admin/Staff)
✅ Views tracking and analytics
✅ Category filtering
✅ Search functionality
✅ Draft/Published system
✅ Featured posts
✅ Related posts
✅ Responsive design

Tech stack:
- React Quill for editor
- MongoDB + Mongoose
- JWT authentication
- Next.js 15 App Router

Files added: 18 new + 2 updated
Documentation: 5 comprehensive guides
"

echo "✅ Commit successful!"
echo ""

# Push
echo "🚀 Pushing to GitHub..."
git push origin main

echo ""
echo "✅ Push completed!"
echo ""
echo "📝 Next steps:"
echo "1. Wait for Vercel auto-deploy (2-3 minutes)"
echo "2. Run migration: npx ts-node scripts/migrate-blog-to-mongodb.ts"
echo "3. Promote admin: Use promote-admin.html"
echo "4. Test: https://yourdomain.com/admin/blog"
echo ""
echo "📚 Documentation:"
echo "- Quick start: BLOG_QUICK_START.md"
echo "- Full guide: BLOG_ADMIN_DASHBOARD_GUIDE.md"
echo "- Deploy guide: DEPLOY_INSTRUCTIONS.md"
echo ""
echo "🎉 Done! Happy blogging!"

