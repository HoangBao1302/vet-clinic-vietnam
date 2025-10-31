# ========================================
# Git Commands để Push Blog CMS lên GitHub (PowerShell)
# ========================================

Write-Host "🚀 Starting Git Push Process..." -ForegroundColor Green
Write-Host ""

# Check git status
Write-Host "📋 Checking git status..." -ForegroundColor Cyan
git status
Write-Host ""

# Add all new files
Write-Host "➕ Adding new files..." -ForegroundColor Cyan

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
git add git-push-commands.ps1

# Updated files
git add app/blog/page.tsx
git add package.json

Write-Host "✅ All files added!" -ForegroundColor Green
Write-Host ""

# Commit
Write-Host "💾 Committing changes..." -ForegroundColor Cyan
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

Write-Host "✅ Commit successful!" -ForegroundColor Green
Write-Host ""

# Push
Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Cyan
git push origin main

Write-Host ""
Write-Host "✅ Push completed!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Yellow
Write-Host "1. Wait for Vercel auto-deploy (2-3 minutes)"
Write-Host "2. Run migration: npx ts-node scripts/migrate-blog-to-mongodb.ts"
Write-Host "3. Promote admin: Use promote-admin.html"
Write-Host "4. Test: https://yourdomain.com/admin/blog"
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Yellow
Write-Host "- Quick start: BLOG_QUICK_START.md"
Write-Host "- Full guide: BLOG_ADMIN_DASHBOARD_GUIDE.md"
Write-Host "- Deploy guide: DEPLOY_INSTRUCTIONS.md"
Write-Host ""
Write-Host "🎉 Done! Happy blogging!" -ForegroundColor Green

