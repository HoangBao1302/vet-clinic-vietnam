# 💳 Hướng Dẫn Quản Lý Phương Thức Thanh Toán

## 📋 Tổng Quan

Hệ thống cho phép bạn **bật/tắt** các phương thức thanh toán một cách đơn giản thông qua file cấu hình.

Các button thanh toán sẽ được **làm mờ (disabled)** khi tắt, thay vì bị gỡ bỏ hoàn toàn.

## 🎯 Ưu Điểm Của Cách Làm Này

✅ **Dễ dàng bật/tắt**: Chỉ cần thay đổi `true`/`false` trong 1 file
✅ **Giữ nguyên UI**: Người dùng vẫn thấy các tùy chọn (nhưng bị disabled)
✅ **Không phá vỡ code**: Không cần sửa logic, layout
✅ **Khôi phục nhanh**: Chỉ cần đổi `false` → `true`
✅ **Có tooltip**: Hiển thị lý do tại sao không khả dụng

## 📝 Cách Sử Dụng

### Bước 1: Mở File Cấu Hình

```
config/paymentMethods.ts
```

### Bước 2: Thay Đổi Trạng Thái

```typescript
export const PAYMENT_METHODS = {
  stripe: {
    enabled: false, // ← Đổi thành false để TẮT Stripe
    // ...
  },
  paypal: {
    enabled: true,  // ← Đổi thành true để BẬT PayPal
    // ...
  },
  bank: {
    enabled: false, // ← Đổi thành false để TẮT Chuyển khoản
    // ...
  }
}
```

### Bước 3: Lưu File

Hệ thống sẽ tự động cập nhật. Không cần restart server (Next.js hot reload).

## 🔧 Các Trường Hợp Sử Dụng

### 1. Tắt Stripe và Bank Transfer (chỉ giữ PayPal)

```typescript
export const PAYMENT_METHODS = {
  stripe: {
    enabled: false, // ❌ TẮT
    // ...
  },
  paypal: {
    enabled: true,  // ✅ BẬT
    // ...
  },
  bank: {
    enabled: false, // ❌ TẮT
    // ...
  }
}
```

### 2. Chỉ bật Bank Transfer (tắt Stripe và PayPal)

```typescript
export const PAYMENT_METHODS = {
  stripe: {
    enabled: false, // ❌ TẮT
    // ...
  },
  paypal: {
    enabled: false, // ❌ TẮT
    // ...
  },
  bank: {
    enabled: true,  // ✅ BẬT
    // ...
  }
}
```

### 3. Bật tất cả

```typescript
export const PAYMENT_METHODS = {
  stripe: {
    enabled: true,  // ✅ BẬT
    // ...
  },
  paypal: {
    enabled: true,  // ✅ BẬT
    // ...
  },
  bank: {
    enabled: true,  // ✅ BẬT
    // ...
  }
}
```

## 🎨 Giao Diện Khi Button Bị Disabled

Khi một phương thức thanh toán bị tắt:

- ❌ Button chuyển sang màu xám (`bg-gray-300`)
- ❌ Text chuyển sang màu xám nhạt (`text-gray-500`)
- ❌ Cursor chuyển thành `not-allowed`
- ❌ Opacity giảm xuống 60%
- ℹ️ Hiển thị tooltip khi hover: "Tạm thời không khả dụng"
- ℹ️ Hiển thị text nhỏ bên cạnh: "(Tạm thời không khả dụng)"

## 📱 Ví Dụ Trực Quan

### Khi BẬT (enabled: true)
```
┌─────────────────────────────────────┐
│  💳  Mua qua Stripe (Card)          │  ← Màu xanh, có thể click
└─────────────────────────────────────┘
```

### Khi TẮT (enabled: false)
```
┌─────────────────────────────────────┐
│  💳  Mua qua Stripe (Card)          │  ← Màu xám, không click được
│      (Tạm thời không khả dụng)      │  ← Thông báo
└─────────────────────────────────────┘
```

## 🌍 Đa Ngôn Ngữ

Thông báo disabled hỗ trợ cả tiếng Việt và tiếng Anh:

```typescript
disabledMessage: 'Tạm thời không khả dụng',      // Tiếng Việt
disabledMessageEn: 'Temporarily unavailable'      // Tiếng Anh
```

Bạn có thể tùy chỉnh thông báo này trong file `config/paymentMethods.ts`.

## 🔍 Kiểm Tra Trạng Thái

### Trong Code

```typescript
import { isPaymentMethodEnabled } from '@/config/paymentMethods';

if (isPaymentMethodEnabled('stripe')) {
  // Stripe đang được bật
}
```

### Lấy Danh Sách Phương Thức Đang Bật

```typescript
import { getEnabledPaymentMethods } from '@/config/paymentMethods';

const enabledMethods = getEnabledPaymentMethods();
// Ví dụ: ['paypal'] nếu chỉ PayPal được bật
```

## 📍 Các File Liên Quan

| File | Mô Tả |
|------|-------|
| `config/paymentMethods.ts` | **File cấu hình chính** - Bật/tắt ở đây |
| `app/downloads/page.tsx` | Trang Downloads - Sử dụng cấu hình |
| `docs/PAYMENT_METHODS_GUIDE.md` | File hướng dẫn này |

## ⚠️ Lưu Ý Quan Trọng

1. **Không xóa code**: Chỉ thay đổi `enabled: true/false`
2. **Không cần restart**: Next.js sẽ tự động reload
3. **Test trước khi deploy**: Kiểm tra trên localhost trước
4. **Backup**: Nên commit vào Git trước khi thay đổi

## 🚀 Quy Trình Khuyến Nghị

### Khi Muốn Tắt Phương Thức Thanh Toán

1. Mở `config/paymentMethods.ts`
2. Đổi `enabled: true` → `enabled: false`
3. Lưu file
4. Kiểm tra trên localhost: `http://localhost:3000/downloads`
5. Xác nhận button đã bị disabled
6. Commit và push lên Git
7. Deploy lên production

### Khi Muốn Bật Lại

1. Mở `config/paymentMethods.ts`
2. Đổi `enabled: false` → `enabled: true`
3. Lưu file
4. Kiểm tra trên localhost
5. Commit và push
6. Deploy

## 🎯 Trường Hợp Của Bạn

Theo yêu cầu, bạn muốn tắt:
- ❌ Stripe (Card)
- ❌ Chuyển khoản Ngân hàng

Chỉ giữ lại:
- ✅ PayPal

### Cấu Hình Đề Xuất

```typescript
export const PAYMENT_METHODS = {
  stripe: {
    enabled: false, // ❌ TẮT
    label: 'Mua qua Stripe (Card)',
    labelEn: 'Buy with Stripe (Card)',
    color: 'blue',
    disabledMessage: 'Tạm thời không khả dụng',
    disabledMessageEn: 'Temporarily unavailable'
  },
  paypal: {
    enabled: true,  // ✅ BẬT
    label: 'Mua qua PayPal (Sandbox)',
    labelEn: 'Buy with PayPal (Sandbox)',
    color: 'yellow',
    disabledMessage: 'Tạm thời không khả dụng',
    disabledMessageEn: 'Temporarily unavailable'
  },
  bank: {
    enabled: false, // ❌ TẮT
    label: 'Chuyển khoản Ngân hàng',
    labelEn: 'Bank Transfer',
    color: 'green',
    disabledMessage: 'Tạm thời không khả dụng',
    disabledMessageEn: 'Temporarily unavailable'
  }
}
```

## 📞 Hỗ Trợ

Nếu có vấn đề, kiểm tra:

1. File `config/paymentMethods.ts` có đúng cú pháp không
2. Browser console có lỗi không (F12)
3. Clear cache và refresh (Ctrl + Shift + R)

---

**Tóm tắt**: Chỉ cần mở `config/paymentMethods.ts` và đổi `enabled: true/false` là xong! 🎉
