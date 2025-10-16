# PayPal & Stripe Payment Setup Guide

## 🚀 Tổng quan

Hệ thống đã được setup để hỗ trợ cả PayPal và Stripe thanh toán với các tính năng:

- ✅ Thanh toán qua Stripe (Card, Apple Pay, Google Pay)
- ✅ Thanh toán qua PayPal (PayPal Balance, Card, Bank)
- ✅ Webhook xử lý tự động
- ✅ Email thông báo sau thanh toán
- ✅ Verify order để tải file
- ✅ Success page hỗ trợ cả 2 phương thức

## 📋 Environment Variables

Cập nhật file `.env.local` với các thông tin sau:

```bash
# Stripe Configuration
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret_here

# PayPal Configuration
PAYPAL_CLIENT_ID=your_paypal_client_id_here
PAYPAL_CLIENT_SECRET=your_paypal_client_secret_here
PAYPAL_MODE=sandbox  # or 'live' for production

# Site URL (Production: https://thebenchmarktrader.com)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 🔧 Stripe Setup

### 1. Tạo Stripe Account
1. Đăng ký tại [stripe.com](https://stripe.com)
2. Vào Dashboard > Developers > API keys
3. Copy **Publishable key** và **Secret key**
4. Vào Webhooks để tạo webhook endpoint

### 2. Setup Webhook
1. Vào Dashboard > Developers > Webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
4. Events to send: `checkout.session.completed`
5. Copy **Webhook secret** (bắt đầu với `whsec_`)

### 3. Test Mode
- Sử dụng test keys (bắt đầu với `pk_test_` và `sk_test_`)
- Test card: `4242 4242 4242 4242`
- CVC: bất kỳ 3 số
- Expiry: bất kỳ ngày trong tương lai

## 💳 PayPal Setup

### 1. Tạo PayPal Developer Account
1. Đăng ký tại [developer.paypal.com](https://developer.paypal.com)
2. Vào Dashboard > My Apps & Credentials
3. Click "Create App"
4. Chọn "Default Application"
5. Copy **Client ID** và **Client Secret**

### 2. Sandbox Mode
- Sử dụng sandbox credentials
- Test account: PayPal sẽ cung cấp test buyer account
- Hoặc tạo test account trong Sandbox > Accounts

### 3. Production Mode
- Thay đổi `PAYPAL_MODE=live`
- Sử dụng live credentials
- Đảm bảo app đã được approved

## 🛠 API Endpoints

### Payment Creation
```
POST /api/create-payment
```
Body:
```json
{
  "productId": "ea-full",
  "productName": "EA ThebenchmarkTrader Full",
  "amount": 7900000,
  "method": "stripe", // or "paypal"
  "customerInfo": {
    "name": "Nguyen Van A",
    "email": "test@example.com",
    "phone": "0765452515"
  }
}
```

### PayPal Order Creation
```
POST /api/paypal/create-order
```

### PayPal Order Capture
```
POST /api/paypal/capture-order
```

### Order Verification
```
GET /api/verify-order?session_id=cs_xxx
POST /api/verify-order
```

### Get Order Info
```
GET /api/get-order?session_id=cs_xxx
```

## 📱 Frontend Integration

### Checkout Page
- URL: `/checkout?item=ea-full&name=EA Full&price=7900000&method=stripe`
- Hỗ trợ cả Stripe và PayPal
- Form validation và error handling

### Downloads Page
- Hiển thị nút mua cho cả Stripe và PayPal
- Verify order với mã đơn hàng
- Download file sau khi verify

### Success Page
- URL: `/downloads/success?session_id=cs_xxx&payment_method=stripe`
- Tự động verify payment
- Hiển thị thông tin order

## 🔄 Payment Flow

### Stripe Flow
1. User click "Mua với Stripe"
2. Redirect to `/checkout` với method=stripe
3. Fill form và submit
4. Redirect to Stripe Checkout
5. User thanh toán
6. Stripe webhook gửi email
7. Redirect to success page
8. Verify và download

### PayPal Flow
1. User click "Mua với PayPal"
2. Redirect to `/checkout` với method=paypal
3. Fill form và submit
4. Redirect to PayPal
5. User thanh toán và approve
6. PayPal redirect về success page
7. Capture order và gửi email
8. Verify và download

## 🧪 Testing

### Stripe Test
```bash
# Test card numbers
4242 4242 4242 4242  # Success
4000 0000 0000 0002  # Declined
4000 0000 0000 9995  # Insufficient funds
```

### PayPal Test
- Sử dụng sandbox buyer account
- Test với các amount khác nhau
- Test cancel flow

## 🚨 Troubleshooting

### Stripe Issues
- Check webhook endpoint URL
- Verify webhook secret
- Check API version compatibility
- Monitor Stripe Dashboard logs

### PayPal Issues
- Verify client credentials
- Check sandbox/live mode
- Monitor PayPal Developer logs
- Test với different amounts

### Common Errors
- `Stripe not configured`: Missing environment variables
- `PayPal not configured`: Missing PayPal credentials
- `Webhook signature verification failed`: Wrong webhook secret
- `Payment not completed`: User cancelled hoặc payment failed

## 📧 Email Templates

Email được gửi tự động sau khi thanh toán thành công với:
- Thông tin đơn hàng
- Link download
- Hướng dẫn cài đặt
- Thông tin support

## 🔒 Security

- Webhook signature verification
- Environment variables cho sensitive data
- HTTPS required cho production
- Input validation và sanitization
- Error handling không expose sensitive info

## 📊 Monitoring

- Stripe Dashboard cho transactions
- PayPal Developer Dashboard cho orders
- Server logs cho webhook events
- Email delivery monitoring

## 🚀 Deployment

### Production Checklist
- [ ] Thay đổi environment variables sang live mode
- [ ] Update webhook URLs
- [ ] Test với real payments
- [ ] Setup monitoring
- [ ] Backup procedures

### Environment Variables cho Production
```bash
PAYPAL_MODE=live
STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_SITE_URL=https://thebenchmarktrader.com
```

## 📞 Support

Nếu gặp vấn đề:
1. Check server logs
2. Verify environment variables
3. Test với sandbox mode trước
4. Contact support team

---

**Lưu ý**: Luôn test kỹ với sandbox mode trước khi deploy production!
