# 📊 Admin Orders Dashboard - Hướng dẫn sử dụng

## 🎯 Tính năng

Dashboard giúp bạn:
- ✅ Monitor tất cả orders real-time
- ✅ Phát hiện orders có vấn đề (productId/amount sai)
- ✅ Tự động fix orders lỗi với 1 click
- ✅ Xem thống kê doanh thu, sản phẩm, payment methods
- ✅ Search và filter orders
- ✅ Không cần vào MongoDB Atlas nữa!

## 🚀 Truy cập Dashboard

### URL
```
https://thebenchmarktrader.com/admin/orders
```

### Đăng nhập
- **Mật khẩu mặc định**: `admin123`
- ⚠️ **Lưu ý**: Đổi mật khẩu này trong production!

## 📊 Giao diện Dashboard

### 1. Stats Cards (Thống kê tổng quan)
```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│ Tổng đơn    │ Đã thanh    │ Đơn lỗi     │ Doanh thu   │
│ 150         │ 145         │ 5           │ 1.2 tỷ đ    │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

### 2. Product & Payment Stats
- **Theo sản phẩm**: Số lượng orders cho mỗi product
- **Theo phương thức**: PayPal vs Stripe

### 3. Invalid Orders Alert
Nếu có orders lỗi, sẽ hiện cảnh báo:
```
⚠️ 5 đơn hàng có vấn đề!
Các đơn hàng này có productId hoặc amount không khớp với giá chuẩn.
[Xem chi tiết]
```

### 4. Search & Filter
- **Search**: Tìm theo Order ID, Email, hoặc Tên
- **Filters**:
  - `Tất cả`: Hiện tất cả orders
  - `✅ Hợp lệ`: Chỉ orders đúng
  - `❌ Lỗi`: Chỉ orders có vấn đề

### 5. Orders Table
Bảng hiển thị chi tiết từng order:
- **Status**: ✅ (hợp lệ) hoặc ❌ (lỗi)
- **Order ID**: Mã đơn hàng
- **Customer**: Tên + email
- **Product**: ProductId (và expected price nếu lỗi)
- **Amount**: Số tiền (màu đỏ nếu sai)
- **Payment**: PayPal/Stripe
- **Date**: Ngày tạo
- **Actions**: Nút `🔧 Fix` cho orders lỗi

## 🔧 Cách fix orders lỗi

### Tự động fix (RECOMMENDED)
1. Vào dashboard
2. Click filter `❌ Lỗi` để xem orders có vấn đề
3. Click nút `🔧 Fix` bên cạnh order lỗi
4. Confirm → System tự động:
   - Phát hiện product đúng dựa vào amount
   - Update productId, productName, amount
   - Verify fix thành công
5. Done! ✅

### Logic auto-fix
```typescript
// System sẽ detect product dựa vào amount:
Amount ≈ 14.9M → ea-pro-source-mt4/mt5
Amount ≈ 7.9M  → ea-full-mt4/mt5
Amount ≈ 1.99M → indicator-pro-mt4/mt5

// Sau đó update:
- productId: Correct product ID
- productName: Correct product name
- amount: Correct amount (based on productId)
```

## 📊 Các trường hợp orders lỗi

### Case 1: ProductId sai
```
❌ Order: 7J549064YR6975206
   ProductId: ea-full (sai)
   Amount: 14.900.000đ (đúng)
   
→ Fix: Detect từ amount → ea-pro-source-mt4
```

### Case 2: Amount sai
```
❌ Order: 08C44041RJ769621X
   ProductId: ea-full (sai)
   Amount: 79.000đ (sai)
   
→ Fix: Detect từ email/description → ea-pro-source-mt5 + 14.9M
```

### Case 3: Cả 2 đều sai
```
❌ Order: 4GJ92129R5593362B
   ProductId: ea-full (sai)
   Amount: 7.900.000đ (sai)
   
→ Fix: Detect từ context → ea-pro-source-mt4 + 14.9M
```

## 🎯 Workflow sử dụng hàng ngày

### Morning Check (Mỗi sáng)
1. Vào dashboard
2. Check "Đơn lỗi" card
3. Nếu > 0 → Click filter `❌ Lỗi`
4. Fix từng order với nút `🔧 Fix`
5. Verify tất cả orders đã ✅

### After Each Sale (Sau mỗi đơn mới)
1. Click `🔄 Refresh`
2. Check order mới nhất (top of table)
3. Verify:
   - Status: ✅ (green checkmark)
   - ProductId: Đúng
   - Amount: Đúng
4. Nếu ❌ → Click `🔧 Fix` ngay

### Weekly Review (Mỗi tuần)
1. Check "Doanh thu" card
2. Review "Theo sản phẩm" stats
3. Review "Theo phương thức" stats
4. Export data nếu cần (feature coming soon)

## 🔒 Bảo mật

### Đổi mật khẩu admin
Mở file `app/admin/orders/page.tsx`, tìm dòng:
```typescript
if (password === 'admin123') {
```

Đổi thành:
```typescript
if (password === 'YOUR_SECURE_PASSWORD') {
```

### Production Security (Recommended)
Nên implement proper authentication:
1. NextAuth.js với admin role
2. JWT tokens
3. Rate limiting
4. IP whitelist

## 🚀 API Endpoints

Dashboard sử dụng 2 API endpoints:

### 1. GET `/api/admin/orders/stats`
Lấy thống kê và danh sách orders
```typescript
Response: {
  total: number,
  paid: number,
  pending: number,
  totalRevenue: number,
  byProduct: Record<string, number>,
  byPaymentMethod: Record<string, number>,
  recentOrders: Order[],
  invalidOrders: Order[]
}
```

### 2. POST `/api/admin/orders/fix`
Fix một order cụ thể
```typescript
Request: {
  orderId: string
}

Response: {
  success: boolean,
  message: string,
  changes: {
    productId: { old, new },
    productName: { old, new },
    amount: { old, new }
  }
}
```

## 📱 Mobile Responsive

Dashboard hoàn toàn responsive:
- ✅ Desktop: Full table view
- ✅ Tablet: Scrollable table
- ✅ Mobile: Stacked cards + horizontal scroll

## 🎨 UI Features

### Color Coding
- 🟢 **Green**: Valid orders, paid status
- 🔴 **Red**: Invalid orders, errors
- 🟣 **Purple**: Primary actions, stats
- ⚪ **Gray**: Neutral info

### Icons
- ✅ Valid order
- ❌ Invalid order
- 🔧 Fix action
- 🔄 Refresh
- 🔍 Search
- 📊 Stats
- 💳 Payment
- 📦 Product

## 🐛 Troubleshooting

### Dashboard không load
1. Check Vercel deployment status
2. Check MongoDB connection
3. Check browser console for errors

### Stats không chính xác
1. Click `🔄 Refresh`
2. Check MongoDB có data không
3. Verify API endpoints hoạt động

### Fix button không work
1. Check browser console
2. Verify order ID tồn tại
3. Check MongoDB write permissions

## 📈 Future Enhancements

Có thể thêm:
- [ ] Export orders to CSV/Excel
- [ ] Email notifications cho orders lỗi
- [ ] Bulk fix multiple orders
- [ ] Order history/audit log
- [ ] Revenue charts/graphs
- [ ] Customer analytics
- [ ] Refund management
- [ ] Webhook logs viewer

## 🎯 Benefits

### Trước khi có Dashboard
- ❌ Phải vào MongoDB Atlas
- ❌ Phải viết queries manually
- ❌ Không biết orders nào lỗi
- ❌ Fix manual từng order
- ❌ Không có overview

### Sau khi có Dashboard
- ✅ Web interface đẹp, dễ dùng
- ✅ Real-time stats
- ✅ Tự động phát hiện lỗi
- ✅ Fix 1 click
- ✅ Full overview + analytics

---

## 🚀 Deploy Dashboard

Dashboard đã được tạo, cần:

1. **Commit & Push**:
```bash
git add -A
git commit -m "Add admin orders dashboard with auto-fix"
git push origin main
```

2. **Vercel auto-deploy** (hoặc manual trigger)

3. **Test**:
```
https://thebenchmarktrader.com/admin/orders
Password: admin123
```

4. **Verify**:
- [ ] Stats hiển thị đúng
- [ ] Orders table load
- [ ] Filter hoạt động
- [ ] Search hoạt động
- [ ] Fix button works

---

**Status**: ✅ Dashboard ready to deploy!  
**Priority**: 🚀 HIGH - Giúp monitor và fix orders tự động  
**Time to implement**: 5 phút (just deploy)

