# 🚀 License Management System - New Features

## ✅ Các Chức Năng Mới Đã Thêm

### 1. **Delete License (Xóa License Hoàn Toàn)**
- **API Endpoint**: `DELETE /api/license/delete`
- **Chức năng**: Xóa license hoàn toàn khỏi database (không chỉ set inactive)
- **Admin Panel**: 
  - Form "Delete (xóa hoàn toàn)" với nút đỏ 🗑️
  - Nút xóa trực tiếp trong bảng license với confirmation dialog

### 2. **Test Verify License**
- **API Endpoint**: `GET /api/license/test-verify`
- **Chức năng**: Test verify license giống như EA Bot sẽ gọi
- **Admin Panel**: Form "Test Verify License" với nút xanh ✅
- **Parameters**: productId, accountNumber, mode (REAL/DEMO/BOTH), version

### 3. **Test Activate License**
- **API Endpoint**: `POST /api/license/test-activate`
- **Chức năng**: Test tạo license mới giống như API activate
- **Admin Panel**: Form "Test Activate License" với nút xanh dương 🚀
- **Parameters**: productId, accountNumber(s), mode, plan, days, maxAccounts, note

---

## 🎯 Cách Sử Dụng

### **Truy Cập Admin Panel**
```
https://yourdomain.com/admin/licenses
```

### **1. Xóa License**
#### **Cách 1: Form Delete**
1. Mở section "Delete (xóa hoàn toàn)"
2. Nhập productId và accountNumber
3. Click nút 🗑️ Delete
4. License sẽ bị xóa hoàn toàn khỏi database

#### **Cách 2: Xóa Trực Từ Bảng**
1. Tìm license trong bảng "Recent / Search Results"
2. Click nút 🗑️ ở cột "actions"
3. Confirm dialog sẽ hiện: "Xóa license [productId] - Account [accountNumber]?"
4. Click OK để xóa

### **2. Test Verify License**
1. Mở section "Test Verify License"
2. Nhập thông tin:
   - **productId**: ID sản phẩm (ví dụ: EA_BOT_V1)
   - **accountNumber**: Số tài khoản
   - **mode**: REAL/DEMO/BOTH (default: REAL)
   - **version**: Phiên bản EA (default: 1.0.0)
3. Click nút ✅ Verify
4. Kết quả sẽ hiện trong console log

**Kết quả có thể:**
- `OK|accountNumber|mode|expiryEpoch|plan|note` - License hợp lệ
- `DENY|NOT_FOUND_OR_EXPIRED` - License không tìm thấy hoặc hết hạn
- `DENY|MODE_MISMATCH` - Mode không khớp

### **3. Test Activate License**
1. Mở section "Test Activate License"
2. Nhập thông tin:
   - **productId**: ID sản phẩm
   - **accountNumber**: Tài khoản đơn (hoặc)
   - **accountNumbers**: Danh sách tài khoản CSV (123,456,789)
   - **mode**: BOTH/REAL/DEMO (default: BOTH)
   - **plan**: DEMO/PAID/TRIAL (default: DEMO)
   - **days**: Số ngày (default DEMO=60)
   - **maxAccounts**: Số tài khoản tối đa
   - **note**: Ghi chú
3. Click nút 🚀 Activate
4. License mới sẽ được tạo và kết quả hiện trong console log

---

## 🔧 API Endpoints Chi Tiết

### **DELETE /api/license/delete**
```json
{
  "productId": "EA_BOT_V1",
  "accountNumber": 1234567,
  "note": "Deleted by admin"
}
```

**Response:**
```json
{
  "ok": true,
  "message": "License deleted for productId: EA_BOT_V1, accountNumber: 1234567",
  "deletedLicense": {
    "productId": "EA_BOT_V1",
    "accountNumber": 1234567,
    "accountNumbers": [1234567],
    "mode": "BOTH",
    "plan": "DEMO",
    "note": "Deleted by admin"
  }
}
```

### **GET /api/license/test-verify**
```
GET /api/license/test-verify?productId=EA_BOT_V1&accountNumber=1234567&mode=REAL&version=1.0.0
```

**Response:**
```json
{
  "ok": true,
  "result": "OK|1234567|BOTH|1735689600|DEMO|Test license",
  "license": {
    "productId": "EA_BOT_V1",
    "accountNumber": 1234567,
    "accountNumbers": [1234567],
    "mode": "BOTH",
    "plan": "DEMO",
    "expireAt": "2024-12-31T23:59:59.000Z",
    "isActive": true,
    "note": "Test license",
    "usage": {
      "lastSeenAt": "2024-01-01T00:00:00.000Z",
      "lastIP": "admin_test",
      "lastVersion": "1.0.0",
      "heartbeats": 1
    }
  }
}
```

### **POST /api/license/test-activate**
```json
{
  "productId": "EA_BOT_V1",
  "accountNumber": 1234567,
  "mode": "BOTH",
  "plan": "DEMO",
  "days": 60,
  "note": "Test activation"
}
```

**Response:**
```json
{
  "ok": true,
  "message": "License activated successfully",
  "license": {
    "licenseId": "65f1234567890abcdef12345",
    "productId": "EA_BOT_V1",
    "accounts": [1234567],
    "maxAccounts": 1,
    "mode": "BOTH",
    "plan": "DEMO",
    "startAt": "2024-01-01T00:00:00.000Z",
    "expireAt": "2024-03-01T00:00:00.000Z",
    "isActive": true,
    "note": "Test activation",
    "createdBy": "admin_test"
  }
}
```

---

## ⚠️ Lưu Ý Quan Trọng

### **Delete License**
- **KHÔNG THỂ HOÀN TÁC**: License bị xóa hoàn toàn khỏi database
- **Confirmation Dialog**: Luôn có dialog xác nhận trước khi xóa
- **Backup**: Nên backup database trước khi xóa hàng loạt

### **Test Functions**
- **Console Log**: Kết quả test sẽ hiện trong server console
- **Không ảnh hưởng Production**: Các function test không ảnh hưởng đến license thật
- **API Key Required**: Tất cả API đều cần `x-api-key` header

### **Security**
- **Admin Only**: Chỉ admin mới có thể truy cập `/admin/licenses`
- **API Key**: Tất cả API endpoints đều được bảo vệ bằng API key
- **Validation**: Tất cả input đều được validate

---

## 🎉 Kết Luận

Bây giờ bạn có đầy đủ các chức năng:
- ✅ **Activate**: Tạo license mới
- ✅ **Verify**: Kiểm tra license hợp lệ
- ✅ **Delete**: Xóa license hoàn toàn
- ✅ **Revoke**: Khóa license (set inactive)
- ✅ **Extend**: Gia hạn license

Tất cả đều có giao diện admin thân thiện và API endpoints đầy đủ!
