# User Promotion System - Admin & Staff Guide
**Project**: ThebenchmarkTrader  
**Date**: Aug 31, 2026  
**Purpose**: Guide for promoting users to Admin or Staff roles

---

## 🔐 Overview

Hệ thống có 2 endpoints để promote users:

1. **`/api/admin/promote`** - Promote user to **Admin** role
2. **`/api/admin/promote-staff`** - Promote user to **Staff** role

---

## 👨‍💼 User Roles

| Role | Permissions | Description |
|------|-------------|-------------|
| **Admin** | Full access | Toàn quyền quản lý: Users, Products, Content, Blog, Orders, Settings |
| **Staff** | Limited access | Quản lý: Blog posts (create, edit, publish) |
| **User** | Public access | Người dùng thông thường: Xem nội dung, mua hàng, đọc blog |

---

## 🎯 Endpoint 1: Promote to Admin

### API Details
```
POST /api/admin/promote
```

### Required Parameters
```json
{
  "email": "user@example.com",
  "secretKey": "PROMOTE_ADMIN_2024"
}
```

### Secret Key
- **Hardcoded in code**: `PROMOTE_ADMIN_2024`
- **Location**: `app/api/admin/promote/route.ts` line 12
- **Security**: ⚠️ This is hardcoded for initial setup only

### How to Use

#### Method 1: Using cURL (Command Line)
```bash
curl -X POST https://yourdomain.com/api/admin/promote \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@thebenchmarktrader.com",
    "secretKey": "PROMOTE_ADMIN_2024"
  }'
```

#### Method 2: Using Postman
1. Open Postman
2. Create new POST request
3. URL: `https://yourdomain.com/api/admin/promote`
4. Headers: `Content-Type: application/json`
5. Body (raw JSON):
   ```json
   {
     "email": "admin@thebenchmarktrader.com",
     "secretKey": "PROMOTE_ADMIN_2024"
   }
   ```
6. Click **Send**

#### Method 3: Using Browser Console
```javascript
fetch('https://yourdomain.com/api/admin/promote', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@thebenchmarktrader.com',
    secretKey: 'PROMOTE_ADMIN_2024'
  })
})
.then(r => r.json())
.then(console.log);
```

### Success Response
```json
{
  "success": true,
  "message": "username has been promoted to admin!",
  "user": {
    "username": "admin",
    "email": "admin@thebenchmarktrader.com",
    "role": "admin"
  }
}
```

### Error Responses

**Invalid Secret Key**:
```json
{
  "success": false,
  "message": "Invalid secret key"
}
// HTTP 403 Forbidden
```

**User Not Found**:
```json
{
  "success": false,
  "message": "User not found"
}
// HTTP 404 Not Found
```

**Already Admin**:
```json
{
  "success": true,
  "message": "User is already an admin"
}
```

---

## 🧑‍💼 Endpoint 2: Promote to Staff

### API Details
```
POST /api/admin/promote-staff
```

### Required Parameters
```json
{
  "email": "staff@example.com",
  "secretKey": "PROMOTE_STAFF_2024"
}
```

### Secret Key
- **Environment Variable**: `PROMOTE_STAFF_SECRET` (recommended)
- **Default Fallback**: `PROMOTE_STAFF_2024` (if env var not set)
- **Location**: `app/api/admin/promote-staff/route.ts` line 5

### Environment Variable Setup

**In `.env.local`** (local development):
```bash
PROMOTE_STAFF_SECRET=your-secure-random-key-here
```

**In Vercel** (production):
1. Go to Vercel Dashboard
2. Project Settings → Environment Variables
3. Add: `PROMOTE_STAFF_SECRET` = `your-secure-random-key-here`
4. Redeploy

**Recommended Secret Generator**:
```bash
# Generate secure random key (Linux/Mac):
openssl rand -base64 32

# Or use online: https://randomkeygen.com/
```

### How to Use

#### Method 1: Using cURL (with default secret)
```bash
curl -X POST https://yourdomain.com/api/admin/promote-staff \
  -H "Content-Type: application/json" \
  -d '{
    "email": "staff@thebenchmarktrader.com",
    "secretKey": "PROMOTE_STAFF_2024"
  }'
```

#### Method 2: Using cURL (with custom secret)
```bash
curl -X POST https://yourdomain.com/api/admin/promote-staff \
  -H "Content-Type: application/json" \
  -d '{
    "email": "staff@thebenchmarktrader.com",
    "secretKey": "your-secure-random-key-here"
  }'
```

#### Method 3: Using Browser Console
```javascript
fetch('https://yourdomain.com/api/admin/promote-staff', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'staff@thebenchmarktrader.com',
    secretKey: 'PROMOTE_STAFF_2024'
  })
})
.then(r => r.json())
.then(console.log);
```

### Success Response
```json
{
  "success": true,
  "message": "User promoted to Staff successfully",
  "user": {
    "email": "staff@thebenchmarktrader.com",
    "role": "staff",
    "name": "Staff User"
  }
}
```

### Error Responses

**Invalid Secret Key**:
```json
{
  "error": "Invalid secret key"
}
// HTTP 403 Forbidden
```

**Email Required**:
```json
{
  "error": "Email is required"
}
// HTTP 400 Bad Request
```

**User Not Found**:
```json
{
  "error": "User not found"
}
// HTTP 404 Not Found
```

**Already Staff/Admin**:
```json
{
  "success": true,
  "message": "User is already staff",
  "user": {
    "email": "staff@thebenchmarktrader.com",
    "role": "staff",
    "name": "Staff User"
  }
}
```

---

## 🔑 Secret Keys Summary

| Endpoint | Secret Key | Source | Location |
|----------|-----------|--------|----------|
| `/api/admin/promote` | `PROMOTE_ADMIN_2024` | Hardcoded | `app/api/admin/promote/route.ts` line 12 |
| `/api/admin/promote-staff` | `PROMOTE_STAFF_2024` (default) | Hardcoded fallback | `app/api/admin/promote-staff/route.ts` line 5 |
| `/api/admin/promote-staff` | Custom value | Environment variable `PROMOTE_STAFF_SECRET` | `.env.local` or Vercel |

---

## 📋 Step-by-Step Workflow

### First-Time Admin Setup

**Step 1: Create User Account**
```
1. Go to https://yourdomain.com/register
2. Sign up with email: admin@thebenchmarktrader.com
3. Verify email (check inbox)
4. Note: User is created with role="user" by default
```

**Step 2: Promote to Admin**
```bash
# Use cURL or Postman:
curl -X POST https://yourdomain.com/api/admin/promote \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@thebenchmarktrader.com",
    "secretKey": "PROMOTE_ADMIN_2024"
  }'
```

**Step 3: Verify Admin Access**
```
1. Login at https://yourdomain.com/login
2. Should redirect to /admin/dashboard
3. Can access all admin pages
```

### Adding Staff Users

**Step 1: User Signs Up**
```
User registers normally at /register
```

**Step 2: Promote to Staff**
```bash
curl -X POST https://yourdomain.com/api/admin/promote-staff \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newstaff@example.com",
    "secretKey": "PROMOTE_STAFF_2024"
  }'
```

**Step 3: Notify User**
```
Send email to user:
"You have been promoted to Staff. You can now manage blog posts."
```

---

## 🔒 Security Best Practices

### For Production

1. **Change Default Secrets**:
   ```bash
   # In Vercel, set custom secret:
   PROMOTE_STAFF_SECRET=<use-openssl-rand-base64-32>
   ```

2. **Use Environment Variables**:
   - ✅ Store secrets in Vercel environment variables
   - ❌ Don't commit secrets to Git
   - ❌ Don't share secrets in Slack/Email

3. **Rotate Secrets Regularly**:
   - Change `PROMOTE_STAFF_SECRET` every 3-6 months
   - Update in Vercel → Redeploy

4. **Remove Promote Endpoints After Setup** (Optional):
   - After promoting first admin, consider:
     - Deleting `app/api/admin/promote/route.ts`
     - Deleting `app/api/admin/promote-staff/route.ts`
   - Or add IP whitelist

5. **Implement Admin UI** (Recommended):
   - Create `/admin/users` page
   - Allow admins to promote users via UI
   - No need to expose API endpoints

---

## 🛠️ Troubleshooting

### Issue: "Invalid secret key"

**Solution**:
- Check secret key spelling (case-sensitive)
- For promote-staff: Verify `PROMOTE_STAFF_SECRET` in Vercel matches your request
- Default is `PROMOTE_STAFF_2024` if env var not set

### Issue: "User not found"

**Solution**:
- Verify user has registered at `/register`
- Check email spelling (case-sensitive)
- Verify email in MongoDB: Check `users` collection

### Issue: Promoted but still can't access admin

**Solution**:
```bash
# 1. Logout and login again
# 2. Clear browser cache
# 3. Check JWT token includes role:
# Open DevTools → Application → Cookies → Check JWT payload

# 4. Verify in MongoDB:
# Connect to MongoDB Atlas
# Database: leopardsmart
# Collection: users
# Find user → Check role field = "admin" or "staff"
```

---

## 📊 Current Environment Variables

### In `.env.local` (Local)
```bash
# Existing:
MONGODB_URI=mongodb+srv://...
JWT_SECRET=<auto-generated>
CRON_SECRET=<for Vercel cron>
ADMIN_SECRET=<not currently used>

# Recommended to Add:
PROMOTE_STAFF_SECRET=<generate-with-openssl>
```

### In Vercel (Production)
```
✅ MONGODB_URI (set)
✅ JWT_SECRET (set)
✅ CRON_SECRET (set)
⚠️ PROMOTE_STAFF_SECRET (not set - using default)
```

**Recommendation**: Set `PROMOTE_STAFF_SECRET` in Vercel with a secure random value.

---

## 🎯 Quick Reference Commands

### Promote to Admin
```bash
# Default secret
curl -X POST https://yourdomain.com/api/admin/promote \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","secretKey":"PROMOTE_ADMIN_2024"}'
```

### Promote to Staff
```bash
# Default secret
curl -X POST https://yourdomain.com/api/admin/promote-staff \
  -H "Content-Type: application/json" \
  -d '{"email":"staff@example.com","secretKey":"PROMOTE_STAFF_2024"}'
```

### Generate Secure Secret
```bash
openssl rand -base64 32
```

### Check User Role in MongoDB
```javascript
// MongoDB Atlas → Data Explorer
db.users.findOne({ email: "admin@example.com" }, { role: 1, email: 1, username: 1 })
```

---

## 📝 Notes

1. **Admin Promote Endpoint**:
   - Secret is hardcoded: `PROMOTE_ADMIN_2024`
   - Intended for one-time use to create first admin
   - Consider removing after first admin is created

2. **Staff Promote Endpoint**:
   - Secret can be customized via env var
   - Use for ongoing staff management
   - Keep this endpoint if you need to add staff regularly

3. **Role Hierarchy**:
   - Admin > Staff > User
   - Admin can do everything Staff can do, plus more
   - Once promoted, cannot be demoted via these endpoints (need direct DB edit)

4. **Alternative**: Create admin UI at `/admin/users` to manage user roles without exposing API endpoints

---

**Created**: Aug 31, 2026, 10:40 AM (UTC+7)  
**Status**: Active and ready to use ✅
