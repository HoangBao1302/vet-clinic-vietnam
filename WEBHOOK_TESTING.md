# Webhook Testing Guide

## 🧪 Test Webhook trên Localhost

### Sử dụng ngrok (Recommended)
1. Cài đặt ngrok: https://ngrok.com/download
2. Chạy ngrok:
```bash
ngrok http 3000
```
3. Copy URL public (ví dụ: `https://abc123.ngrok.io`)
4. Trong Stripe Dashboard, cập nhật webhook URL thành: `https://abc123.ngrok.io/api/webhooks/stripe`

### Sử dụng Stripe CLI
1. Cài đặt Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login:
```bash
stripe login
```
3. Forward events:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```
4. Copy webhook secret từ output

## 🔍 Test Webhook

### Test với Stripe CLI
```bash
stripe trigger checkout.session.completed
```

### Test Manual
1. Tạo một test payment
2. Check logs trong terminal
3. Verify webhook được gọi

## 📋 Webhook Events cần thiết

- `checkout.session.completed` - Khi thanh toán thành công
- `checkout.session.expired` - Khi session hết hạn (optional)
- `payment_intent.payment_failed` - Khi thanh toán thất bại (optional)

## 🚨 Troubleshooting

### Webhook không được gọi
- Check endpoint URL
- Verify HTTPS (không dùng HTTP cho production)
- Check firewall/network

### Signature verification failed
- Verify webhook secret
- Check raw body parsing
- Ensure correct timestamp

### Test với curl
```bash
curl -X POST http://localhost:3000/api/webhooks/stripe \
  -H "Content-Type: application/json" \
  -H "Stripe-Signature: test_signature" \
  -d '{"type": "checkout.session.completed", "data": {"object": {"id": "cs_test"}}}'
```
