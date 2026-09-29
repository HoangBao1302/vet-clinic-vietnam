# 🔐 Authentication System - Hướng Dẫn Setup

## ✅ Đã Hoàn Thành

### 1. **Backend/API**
- ✅ MongoDB database connection (`lib/mongodb.ts`)
- ✅ User model với bcrypt password hashing (`lib/models/User.ts`)
- ✅ JWT authentication utilities (`lib/auth.ts`)
- ✅ Email service với templates (`lib/email.ts`)
- ✅ Auth Context cho React (`lib/authContext.tsx`)

### 2. **API Routes**
- ✅ `/api/auth/register` - Đăng ký user mới
- ✅ `/api/auth/login` - Đăng nhập
- ✅ `/api/auth/forgot-password` - Quên mật khẩu
- ✅ `/api/auth/reset-password` - Reset mật khẩu
- ✅ `/api/admin/users` - GET/POST users (Admin only)
- ✅ `/api/admin/users/[id]` - GET/PUT/DELETE user (Admin only)

### 3. **UI Pages**
- ✅ `/login` - Trang đăng nhập

## 📋 Cần Setup Thêm

### 1. **Tạo file .env.local**

```bash
cp .env.local.example .env.local
```

Sau đó cập nhật các giá trị:

```env
# MongoDB - Đăng ký tại https://www.mongodb.com/cloud/atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/thebenchmarktrader

# JWT Secret - Tạo random string
JWT_SECRET=generate-random-string-here

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# SMTP Email - Cấu hình Gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=support@thebenchmarktrader.com
SMTP_PASS=your-gmail-app-password
```

### 2. **Setup MongoDB Atlas** (FREE)

1. Đăng ký tại: https://www.mongodb.com/cloud/atlas
2. Tạo cluster mới (FREE tier M0)
3. Tạo database user
4. Whitelist IP: `0.0.0.0/0` (allow all) hoặc IP cụ thể
5. Copy connection string vào `MONGODB_URI`

### 3. **Setup Gmail SMTP** (Cho forgot password email)

1. Bật 2-Factor Authentication cho Gmail
2. Tạo App Password:
   - Vào: https://myaccount.google.com/apppasswords
   - Chọn "Mail" và "Other device"
   - Copy password vào `SMTP_PASS`

### 4. **Tạo Admin User Đầu Tiên**

Sau khi setup xong, chạy script tạo admin:

```bash
# Tạo file scripts/create-admin.ts
```

Hoặc đăng ký user thường rồi vào MongoDB Atlas manually update `role: "admin"`

## 🎨 Trang UI Cần Tạo Tiếp

Tôi đã tạo `/login` page. Còn cần tạo:

1. ✅ `/login` - **ĐÃ TẠO**
2. ⏳ `/register` - Đăng ký tài khoản
3. ⏳ `/forgot-password` - Form nhập email
4. ⏳ `/reset-password` - Form nhập mật khẩu mới (với token param)
5. ⏳ `/admin` - Admin dashboard quản lý users
6. ⏳ `/profile` - Trang profile user

Bạn có muốn tôi tiếp tục tạo các trang còn lại không?

## 🔧 Test API

Sau khi setup .env.local, test API:

```bash
npm run dev
```

**Test Register:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"123456"}'
```

**Test Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'
```

## 📊 Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  username: String (unique, 3-30 chars),
  email: String (unique, valid email),
  password: String (hashed with bcrypt),
  role: "user" | "admin",
  isActive: Boolean,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔒 Security Features

- ✅ Password hashing với bcrypt (salt rounds 10)
- ✅ JWT tokens với expiry (7 days)
- ✅ Password reset tokens expire sau 1 hour
- ✅ Admin-only endpoints với role check
- ✅ Input validation
- ✅ SQL injection protection (MongoDB)
- ✅ Email verification trước khi reset password

## 🚀 Next Steps

1. **Setup .env.local** với MongoDB và SMTP
2. **Test APIs** với curl hoặc Postman
3. **Tạo admin user** đầu tiên
4. **Tạo các trang UI còn lại** (register, forgot-password, admin dashboard)
5. **Deploy lên Vercel** và update environment variables

## ❓ Cần Giúp Đỡ?

Bạn muốn tôi:
- [ ] Tạo các trang UI còn lại?
- [ ] Tạo script create-admin.ts?
- [ ] Tạo component ProtectedRoute?
- [ ] Hướng dẫn chi tiết setup MongoDB?
- [ ] Hướng dẫn deploy với environment variables?

Hãy cho tôi biết phần nào bạn muốn tôi làm tiếp!

