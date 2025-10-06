# Cấu hình Email cho EA ThebenchmarkTrader

## 📧 Cần tạo file .env.local

Tạo file `.env.local` trong thư mục gốc của dự án với nội dung:

```env
# Resend API Configuration
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
RESEND_FROM=noreply@thebenchmarktrader.com
RESEND_TO=support@thebenchmarktrader.com

# Base URL for production
NEXT_PUBLIC_BASE_URL=http://localhost:3002
```

## 🔧 Cách lấy RESEND_API_KEY:

1. **Đăng ký tài khoản Resend**: Truy cập https://resend.com
2. **Verify domain**: Thêm domain của bạn (ví dụ: thebenchmarktrader.com)
3. **Tạo API Key**: Vào Dashboard → API Keys → Create API Key
4. **Copy API Key**: Thay thế `re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` trong file .env.local

## 📝 Cập nhật email addresses:

- `RESEND_FROM`: Email gửi đi (phải thuộc domain đã verify)
- `RESEND_TO`: Email nhận tin nhắn từ form liên hệ

## 🚀 Khởi động lại server:

Sau khi tạo .env.local, khởi động lại dev server:
```bash
npm run dev
```

## ✅ Test email:

Form liên hệ sẽ hoạt động sau khi cấu hình đúng RESEND_API_KEY.





