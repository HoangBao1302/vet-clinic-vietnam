# License Management System Setup

## Tổng quan

Hệ thống License Management cho ThebenchmarkTrader.com cho phép quản lý license cho EA Bot với các tính năng:

- **Single/Multiple Account Support**: Hỗ trợ cả 1 account hoặc nhiều accounts trên 1 license
- **API Integration**: API endpoints để verify, activate, revoke, extend license
- **Admin Panel**: Giao diện admin để quản lý license
- **Usage Tracking**: Theo dõi usage của license (IP, version, heartbeats)

## Cài đặt

### 1. Environment Variables

Thêm các biến môi trường sau vào `.env.local`:

```env
# License System Configuration
LICENSE_API_KEY=your-super-secret-license-api-key-change-this-in-production

# Admin Basic Auth (for license admin panel)
BASIC_AUTH_USER=admin
BASIC_AUTH_PASS=your-admin-password-change-this-in-production
```

### 2. Database Schema

License model đã được tạo với các trường:
- `productId`: ID sản phẩm (EA Bot)
- `accountNumber`: Single account (tương thích ngược)
- `accountNumbers`: Array of accounts (mới)
- `mode`: REAL/DEMO/BOTH
- `plan`: PAID/DEMO/TRIAL
- `startAt`, `expireAt`: Thời gian bắt đầu và hết hạn
- `isActive`: Trạng thái active
- `maxAccounts`: Giới hạn số account tối đa
- `usage`: Thông tin usage tracking

## API Endpoints

### 1. Verify License
```
POST /api/license/verify
Headers: x-api-key: YOUR_API_KEY
Body: {
  "productId": "EA_BOT_V1",
  "accountNumber": 1234567,
  "mode": "REAL",
  "version": "1.0.0"
}
```

Response:
- `OK|accountNumber|mode|expiryEpoch|plan|note`
- `DENY|NOT_FOUND_OR_EXPIRED`
- `DENY|MODE_MISMATCH`

### 2. Activate License
```
POST /api/license/activate
Headers: x-api-key: YOUR_API_KEY
Body: {
  "productId": "EA_BOT_V1",
  "accountNumber": 1234567,
  "mode": "BOTH",
  "plan": "DEMO",
  "days": 60,
  "note": "Demo license"
}
```

### 3. Revoke License
```
POST /api/license/revoke
Headers: x-api-key: YOUR_API_KEY
Body: {
  "productId": "EA_BOT_V1",
  "accountNumber": 1234567,
  "note": "Revoked by admin"
}
```

### 4. Extend License
```
POST /api/license/extend
Headers: x-api-key: YOUR_API_KEY
Body: {
  "productId": "EA_BOT_V1",
  "accountNumber": 1234567,
  "days": 30,
  "note": "Extended by admin"
}
```

## Admin Panel

### Truy cập Admin Panel

1. Truy cập: `https://thebenchmarktrader.com/admin/licenses`
2. Sử dụng Basic Auth với credentials từ env variables

### Chức năng Admin Panel

1. **Search License**: Tìm kiếm theo productId và accountNumber
2. **Create DEMO**: Tạo license demo 60 ngày cho 1 account
3. **Create Multi**: Tạo license cho nhiều accounts
4. **Revoke**: Thu hồi license
5. **Extend**: Gia hạn license
6. **View Table**: Xem danh sách license với thông tin chi tiết

## Sử dụng trong EA Bot

### 1. Verify License trong EA Bot

```mql4
// Trong EA Bot, gọi API verify license
string response = httpRequest("POST", "https://thebenchmarktrader.com/api/license/verify", 
  "{\"productId\":\"EA_BOT_V1\",\"accountNumber\":" + IntegerToString(AccountNumber()) + ",\"mode\":\"REAL\"}",
  "x-api-key: YOUR_API_KEY");

if(StringFind(response, "OK|") == 0) {
  // License hợp lệ
  string parts[];
  StringSplit(response, "|", parts);
  int expiryEpoch = (int)StringToInteger(parts[3]);
  // Kiểm tra expiry và sử dụng EA Bot
} else {
  // License không hợp lệ
  Print("License denied: " + response);
}
```

### 2. Heartbeat Tracking

EA Bot nên gọi verify API định kỳ để update usage tracking.

## Workflow

### 1. Khách hàng mua EA Bot
1. Khách hàng thanh toán qua Stripe/PayPal
2. Webhook tạo license tự động
3. Gửi email với thông tin license

### 2. Admin tạo license thủ công
1. Truy cập admin panel
2. Sử dụng form "Create DEMO" hoặc "Create Multi"
3. License được tạo và active ngay lập tức

### 3. Quản lý license
1. Search để tìm license
2. Revoke để khóa license
3. Extend để gia hạn license
4. Xem usage tracking trong table

## Bảo mật

1. **API Key**: Sử dụng API key mạnh cho license API
2. **Basic Auth**: Bảo vệ admin panel với Basic Auth
3. **HTTPS**: Tất cả API calls phải qua HTTPS
4. **IP Tracking**: Theo dõi IP để phát hiện abuse

## Troubleshooting

### License không hoạt động
1. Kiểm tra API key
2. Kiểm tra productId và accountNumber
3. Kiểm tra thời gian hết hạn
4. Kiểm tra mode (REAL/DEMO/BOTH)

### Admin panel không truy cập được
1. Kiểm tra Basic Auth credentials
2. Kiểm tra env variables
3. Kiểm tra middleware configuration

## Monitoring

- Theo dõi usage tracking trong admin panel
- Kiểm tra logs của API endpoints
- Monitor license expiry và extend requests
