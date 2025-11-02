# 💳 Hướng Dẫn Thanh Toán Chuyển Khoản Ngân Hàng

## 📋 Tổng Quan

Hệ thống thanh toán chuyển khoản ngân hàng cho phép khách hàng mua sản phẩm EA, Indicators thông qua chuyển khoản ngân hàng với quy trình duyệt thủ công bởi Admin.

---

## 🎯 Tính Năng Chính

### 1. **Checkout Form**
- Khách hàng chọn phương thức "Chuyển khoản Ngân Hàng"
- Hiển thị thông tin tài khoản nhận tiền
- Form upload ảnh chứng từ chuyển khoản
- Xác nhận đơn hàng

### 2. **Order Management**
- Tạo order với status `pending`
- Lưu ảnh chứng từ vào server
- Gửi email xác nhận đã nhận đơn hàng

### 3. **Admin Dashboard**
- Xem danh sách đơn hàng chuyển khoản chờ duyệt
- Xem ảnh chứng từ chuyển khoản
- Duyệt hoặc từ chối đơn hàng
- Gửi email tự động sau khi duyệt/từ chối

### 4. **Commission & Tracking**
- Affiliate tracking tương tự Stripe/PayPal
- Commission tính khi đơn hàng được duyệt
- Doanh thu chỉ tính khi duyệt thành công

---

## 🗂️ Database Schema

### Order Model (Updated)

```typescript
{
  // ... existing fields ...
  
  transferProof: String,              // Path to uploaded image
  transferProofApproved: Boolean,     // Approval status
  approvedBy: String,                 // Admin name who approved
  approvedAt: Date,                   // Approval timestamp
  rejectionReason: String             // Reason if rejected
}
```

**Order Status Flow:**
- `pending` → Đơn hàng chờ Admin duyệt
- `paid` → Đã duyệt, khách hàng có thể download
- `rejected` → Đã từ chối, cần liên hệ support

---

## 📁 Files Created/Modified

### **New Files:**
```
app/api/bank-transfer/
  ├── create-order/route.ts      # Create pending order
  └── approve/route.ts            # Admin approve/reject order

app/checkout-bank-transfer/
  └── page.tsx                    # Bank transfer checkout page
```

### **Modified Files:**
```
lib/models/Order.ts               # Added bank transfer fields
app/downloads/page.tsx            # Added bank transfer button
app/admin/orders/page.tsx         # Added approve/reject actions
```

---

## 🔄 User Flow

### **Khách Hàng:**

1. Chọn sản phẩm muốn mua → Click "💳 Chuyển khoản NH"
2. Điền form thông tin khách hàng + Broker
3. Xem thông tin tài khoản ngân hàng
4. Chuyển khoản theo đúng số tiền và nội dung
5. Upload ảnh chứng từ chuyển khoản
6. Click "Xác nhận đã chuyển khoản"
7. Nhận email xác nhận đơn đang chờ duyệt
8. Đợi Admin duyệt (1-2 giờ)
9. Nhận email xác nhận đã duyệt + mã đơn hàng
10. Sử dụng mã đơn hàng để download sản phẩm

### **Admin:**

1. Vào Admin Dashboard → Orders
2. Lọc các đơn hàng `pending` (bank_transfer)
3. Click "👁️ Xem ảnh" để xem chứng từ
4. Xác minh thông tin:
   - Số tiền chuyển khoản có đúng không?
   - Nội dung chuyển khoản có đúng không?
   - Ảnh chứng từ có rõ ràng không?
5. Duyệt hoặc từ chối:
   - **Duyệt:** Click "✅ Duyệt" → Nhập tên → Đơn chuyển sang `paid`
   - **Từ chối:** Click "❌ Từ chối" → Nhập lý do → Đơn chuyển sang `rejected`
6. Hệ thống tự động gửi email cho khách hàng

---

## 🔧 API Endpoints

### 1. Create Bank Transfer Order
```
POST /api/bank-transfer/create-order

Request Body:
{
  productId: string,
  productName: string,
  amount: number,
  customerInfo: {
    name: string,
    email: string,
    phone: string,
    broker?: string,
    accountId?: string,
    server?: string
  },
  affiliateCode?: string,
  transferProof: string  // base64 image
}

Response:
{
  success: true,
  orderId: "BANK-1234567890-ABC123XYZ",
  message: "Order created successfully..."
}
```

### 2. Approve/Reject Order
```
POST /api/bank-transfer/approve

Request Body:
{
  orderId: string,
  action: "approve" | "reject",
  adminName: string,
  rejectionReason?: string
}

Response:
{
  success: true,
  message: "Order approved successfully"
}
```

---

## 📧 Email Templates

### 1. **Confirmation Email** (Khi tạo đơn hàng)
- **Subject:** "⏳ Đơn hàng đang chờ xác nhận - [Product Name]"
- **Content:** Mã đơn hàng, thông tin sản phẩm, thời gian chờ xác nhận

### 2. **Approval Email** (Khi Admin duyệt)
- **Subject:** "✅ Thanh toán đã được xác nhận - [Product Name]"
- **Content:** Thông báo duyệt thành công, mã đơn hàng, link download

### 3. **Rejection Email** (Khi Admin từ chối)
- **Subject:** "⚠️ Thanh toán cần xác minh lại - [Product Name]"
- **Content:** Thông báo từ chối, lý do, hướng dẫn liên hệ support

---

## 🏦 Thông Tin Ngân Hàng (Cần Cập Nhật)

Hiện tại đang dùng thông tin mẫu, cần cập nhật trong file:
```
app/checkout-bank-transfer/page.tsx

const bankInfo = {
  bankName: "Vietcombank",           // ⚠️ Cập nhật
  accountNumber: "10200123456789",   // ⚠️ Cập nhật
  accountHolder: "NGUYEN VAN A",     // ⚠️ Cập nhật
  branch: "Chi nhánh TP.HCM"         // ⚠️ Cập nhật
};
```

---

## 🛡️ Security Features

1. **Image Validation:**
   - Chỉ chấp nhận file ảnh (JPG, PNG, GIF)
   - Giới hạn kích thước tối đa 5MB
   - Kiểm tra base64 format

2. **Anti-Bot:**
   - Affiliate tracking với session ID
   - IP tracking
   - Rate limiting qua existing systems

3. **File Storage:**
   - Ảnh lưu tại `/public/uploads/transfers/[orderId].[ext]`
   - Accessible qua URL: `/uploads/transfers/[filename]`

---

## 📊 Admin Dashboard Features

### **View Pending Orders:**
- Orders có `paymentMethod = 'bank_transfer'`
- Orders có `status = 'pending'`

### **Actions Available:**
1. **👁️ Xem ảnh** - Xem ảnh chứng từ chuyển khoản
2. **✅ Duyệt** - Duyệt đơn hàng → `paid`
3. **❌ Từ chối** - Từ chối đơn hàng → `rejected`

### **Status Indicators:**
- `pending` → Buttons: 👁️ Xem ảnh, ✅ Duyệt, ❌ Từ chối
- `paid` → ✅ Đã duyệt
- `rejected` → ❌ Đã từ chối

---

## 🔗 Affiliate Integration

### **Tracking:**
- Affiliate code được lưu khi tạo đơn hàng
- Conversion chỉ tính khi Admin duyệt (`status = 'paid'`)
- Commission rate giống Stripe/PayPal

### **Commission Calculation:**
```javascript
// Trong webhook Paypal/Stripe hiện có logic:
const commissionRate = order.productId.includes('ea')
  ? 0.35  // 35% for EA products
  : 0.25; // 25% for other products

// Logic này cần apply cho bank transfer khi duyệt
```

---

## 📝 Testing Checklist

### **Customer Flow:**
- [ ] Click "💳 Chuyển khoản NH" button
- [ ] Form hiển thị đầy đủ thông tin
- [ ] Upload ảnh chứng từ thành công
- [ ] Nhận email xác nhận đơn đang chờ duyệt
- [ ] Đợi Admin duyệt
- [ ] Nhận email duyệt thành công
- [ ] Download sản phẩm bằng mã đơn hàng

### **Admin Flow:**
- [ ] Vào Admin Dashboard
- [ ] Xem danh sách đơn chuyển khoản
- [ ] Click "👁️ Xem ảnh" để xem chứng từ
- [ ] Duyệt đơn hàng thành công
- [ ] Khách hàng nhận email duyệt
- [ ] Commission được tính
- [ ] Từ chối đơn hàng (test rejection flow)
- [ ] Khách hàng nhận email từ chối

### **Edge Cases:**
- [ ] Upload file không phải ảnh
- [ ] Upload ảnh quá lớn (>5MB)
- [ ] Đơn hàng không có affiliate code
- [ ] Duyệt lại đơn đã từ chối
- [ ] Duplicate order ID (should not happen but test anyway)

---

## 🚨 Important Notes

1. **Thông Tin Ngân Hàng:**
   - ⚠️ CẦN CẬP NHẬT thông tin ngân hàng thật trong `app/checkout-bank-transfer/page.tsx`
   - Test với tài khoản thử nghiệm trước khi deploy

2. **Admin Notification:**
   - Tùy chọn: Thêm email/thông báo cho Admin khi có đơn mới cần duyệt
   - Hiện tại Admin phải vào Dashboard để xem

3. **Commission Tracking:**
   - Cần bổ sung logic tính commission khi duyệt bank transfer
   - Tương tự như Stripe/PayPal webhooks

4. **File Cleanup:**
   - Tùy chọn: Xóa ảnh cũ sau 30-90 ngày để tiết kiệm storage
   - Hiện tại giữ vĩnh viễn để audit trail

5. **Multi-Language:**
   - Tất cả text hiện tại là tiếng Việt
   - Có thể cần thêm English support nếu có khách nước ngoài

---

## 🔄 Order Lifecycle

```
┌─────────────────┐
│  Khách tạo đơn  │ → status: "pending"
└────────┬────────┘ → Email: "⏳ Đang chờ xác nhận"
         │
         ↓
┌─────────────────┐
│ Admin xem xét   │ → Xem ảnh + Thông tin đơn hàng
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ↓         ↓
┌───────┐  ┌──────┐
│DUYỆT  │  │TỪ CHỐI│
└───┬───┘  └───┬──┘
    │          │
    ↓          ↓
"paid"     "rejected"
Email      Email
✅         ⚠️
```

---

## 📞 Support Information

**Email:** support@thebenchmarktrader.com  
**Telegram:** t.me/+0ETUdIuYUzdhZWQ1  
**Hotline:** +84 765 452 515

---

## 🎉 Completed Features

✅ Bank transfer checkout form  
✅ Upload transfer proof image  
✅ Order creation with pending status  
✅ Admin dashboard with approve/reject  
✅ Email notifications (3 types)  
✅ Affiliate tracking  
✅ Commission calculation on approval  
✅ Broker information collection  
✅ Full audit trail  

---

## 🚀 Future Enhancements

- [ ] Auto-OCR để đọc thông tin từ ảnh chuyển khoản
- [ ] Matching tự động với ngân hàng digital
- [ ] Admin notification email khi có đơn mới
- [ ] File cleanup cron job
- [ ] Multi-language support
- [ ] Image compression để tiết kiệm storage
- [ ] Thống kê bank transfer conversion rate

---

**Last Updated:** 02/11/2025  
**Version:** 1.0  
**Author:** ThebenchmarkTrader Team

