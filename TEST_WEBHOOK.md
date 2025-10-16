# Test Webhook Stripe

## 🧪 Phương pháp 1: Send Test Events

### Bước 1: Trong Stripe Dashboard
1. Click **"Send test events"**
2. Chọn **"checkout.session.completed"**
3. Click **"Send"**

### Bước 2: Check Logs
```bash
# Trong terminal chạy Next.js
npm run dev
```
Bạn sẽ thấy logs như:
```
Payment successful: cs_test_xxx
Order details: {...}
```

## 🛒 Phương pháp 2: Test với Payment thật

### Bước 1: Start Server
```bash
npm run dev
```

### Bước 2: Tạo Test Payment
1. Vào `http://localhost:3000/downloads`
2. Click **"Mua với Stripe"** trên sản phẩm bất kỳ
3. Điền thông tin checkout
4. Sử dụng test card: **4242 4242 4242 4242**
5. CVC: **123**, Expiry: **12/25**

### Bước 3: Verify Webhook
- Check terminal logs
- Check email có được gửi không
- Check success page

## 🔍 Debug Webhook

### Check Webhook Logs trong Stripe
1. Vào **"Event deliveries"** tab
2. Xem status của events
3. Click vào event để xem chi tiết

### Common Issues:
- **404**: Endpoint URL sai
- **500**: Server error, check logs
- **Signature verification failed**: Webhook secret sai

## 📧 Test Email
Sau khi payment thành công:
1. Check email inbox
2. Verify email template
3. Check download link

## 🚨 Troubleshooting

### Webhook không được gọi:
```bash
# Check server logs
npm run dev

# Check webhook URL
curl -X POST http://localhost:3000/api/webhooks/stripe
```

### Signature verification failed:
```bash
# Check webhook secret in .env.local
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

### Test với ngrok (nếu cần):
```bash
# Install ngrok
npm install -g ngrok

# Expose localhost
ngrok http 3000

# Update webhook URL trong Stripe
# https://abc123.ngrok.io/api/webhooks/stripe
```
