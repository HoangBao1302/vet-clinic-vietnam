# Config Folder

## Payment Methods Configuration

File `paymentMethods.ts` quản lý việc bật/tắt các phương thức thanh toán.

### Cách Sử Dụng Nhanh

Mở `paymentMethods.ts` và thay đổi:

```typescript
stripe: { enabled: false }  // Tắt Stripe
paypal: { enabled: true }   // Bật PayPal
bank: { enabled: false }    // Tắt Chuyển khoản
```

### Chi Tiết

Xem hướng dẫn đầy đủ tại: `docs/PAYMENT_METHODS_GUIDE.md`
