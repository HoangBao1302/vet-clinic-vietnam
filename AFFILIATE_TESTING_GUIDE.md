# 🧪 Affiliate System Testing Guide

**Date:** January 2025  
**Purpose:** Hướng dẫn test toàn bộ quy trình affiliate từ A-Z

---

## 🎯 **Overview**

Hướng dẫn này sẽ giúp bạn test toàn bộ hệ thống affiliate:
1. **Tạo affiliate test user**
2. **Test tracking links**
3. **Test click tracking**
4. **Test conversion tracking**
5. **Test dashboard**

---

## 🚀 **Quick Start**

### **Bước 1: Tạo Test Affiliate User**

```bash
# Chạy script tạo test user
node scripts/create-test-affiliate.js
```

**Output sẽ hiển thị:**
```
✅ Test affiliate user created successfully!

📋 Test Affiliate User Info:
Username: testaffiliate
Email: affiliate@test.com
Password: 123456
Affiliate Code: AFF-TEST-ABC123
Status: approved
Membership: free

🔗 Test Tracking Links:
EA Full: https://thebenchmarktrader.com?affiliate=AFF-TEST-ABC123&product=ea-full
EA Pro: https://thebenchmarktrader.com?affiliate=AFF-TEST-ABC123&product=ea-pro-source
Indicators: https://thebenchmarktrader.com?affiliate=AFF-TEST-ABC123&product=indicator-pro
```

### **Bước 2: Test Affiliate Dashboard**

1. **Login với test user:**
   - Email: `affiliate@test.com`
   - Password: `123456`

2. **Truy cập dashboard:**
   - URL: `/affiliate/dashboard`
   - Kiểm tra stats, tracking links

3. **Test tracking links:**
   - Copy các links từ dashboard
   - Test format: `?affiliate=AFF-TEST-ABC123&product=ea-full`

### **Bước 3: Test Automated Flow**

1. **Truy cập test page:**
   - URL: `/affiliate/test`
   - Click "Test Full Flow"
   - Xem kết quả chi tiết

---

## 🔍 **Detailed Testing Steps**

### **1. Test Affiliate Registration**

#### **Manual Test:**
```
1. Go to: /referral/apply
2. Fill application form
3. Submit application
4. Check status in MongoDB
5. Admin approve manually
```

#### **API Test:**
```bash
curl -X POST http://localhost:3000/api/affiliate/apply \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "fullName": "Test Affiliate",
    "phone": "0123456789",
    "company": "Test Company",
    "website": "https://test.com",
    "experience": "5 years",
    "audience": "1000+ followers",
    "promochannel": "Facebook, Telegram",
    "reason": "Want to earn commission"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Đăng ký affiliate thành công",
  "affiliateCode": "AFF-USERNAME-ABC123"
}
```

### **2. Test Tracking Links Generation**

#### **API Test:**
```bash
curl -X GET http://localhost:3000/api/affiliate/links \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "affiliateCode": "AFF-TEST-ABC123",
  "products": [
    {
      "id": "ea-full",
      "name": "EA ThebenchmarkTrader Full Version",
      "price": 7900000,
      "commissionRate": 30,
      "trackingLink": "https://thebenchmarktrader.com?affiliate=AFF-TEST-ABC123&product=ea-full",
      "estimatedCommission": 2370000
    }
  ]
}
```

### **3. Test Click Tracking**

#### **Manual Test:**
```
1. Click tracking link: https://site.com?affiliate=AFF-TEST-ABC123&product=ea-full
2. Check browser console for "Affiliate click tracked"
3. Check database for new AffiliateClick record
```

#### **API Test:**
```bash
curl -X POST http://localhost:3000/api/affiliate/track \
  -H "Content-Type: application/json" \
  -d '{
    "affiliateCode": "AFF-TEST-ABC123",
    "productId": "ea-full",
    "productName": "EA ThebenchmarkTrader Full Version"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "clickId": "64f8a1b2c3d4e5f6a7b8c9d0",
  "message": "Affiliate click tracked successfully"
}
```

### **4. Test Conversion Tracking**

#### **Manual Test:**
```
1. Use affiliate link to visit site
2. Go to checkout with affiliate params
3. Complete payment (test mode)
4. Check webhook processes conversion
5. Check database for conversion update
```

#### **API Test (Simulate Webhook):**
```bash
curl -X POST http://localhost:3000/api/webhooks/stripe \
  -H "Content-Type: application/json" \
  -d '{
    "type": "checkout.session.completed",
    "data": {
      "object": {
        "id": "test_session_123",
        "amount_total": 7900000,
        "customer_email": "test@example.com",
        "metadata": {
          "productId": "ea-full",
          "customerName": "Test Customer",
          "affiliateCode": "AFF-TEST-ABC123"
        }
      }
    }
  }'
```

### **5. Test Stats Retrieval**

#### **API Test:**
```bash
curl -X GET "http://localhost:3000/api/affiliate/track?affiliateCode=AFF-TEST-ABC123" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "stats": {
    "totalClicks": 5,
    "conversions": 1,
    "conversionRate": 20.0,
    "totalCommission": 2370000,
    "breakdown": [
      {
        "_id": "converted",
        "count": 1,
        "totalCommission": 2370000
      }
    ]
  }
}
```

---

## 🗄️ **Database Verification**

### **Check AffiliateClick Collection:**
```javascript
// MongoDB queries
db.affiliateclicks.find({ affiliateCode: "AFF-TEST-ABC123" })

// Check conversion
db.affiliateclicks.find({ 
  affiliateCode: "AFF-TEST-ABC123", 
  status: "converted" 
})

// Check commission
db.affiliateclicks.aggregate([
  { $match: { affiliateCode: "AFF-TEST-ABC123" } },
  { $group: {
    _id: "$status",
    count: { $sum: 1 },
    totalCommission: { $sum: "$commissionAmount" }
  }}
])
```

### **Check User Collection:**
```javascript
// Check affiliate status
db.users.find({ 
  affiliateCode: "AFF-TEST-ABC123" 
}, { 
  username: 1, 
  email: 1, 
  affiliateStatus: 1, 
  affiliateCode: 1 
})
```

---

## 🔧 **Troubleshooting**

### **Common Issues:**

#### **1. Affiliate Registration Fails**
- ✅ Check JWT token validity
- ✅ Check user authentication
- ✅ Check MongoDB connection
- ✅ Check affiliate status (not already applied)

#### **2. Tracking Links Not Generated**
- ✅ Check affiliate status = 'approved'
- ✅ Check affiliateCode exists
- ✅ Check API authentication

#### **3. Click Tracking Fails**
- ✅ Check affiliateCode format
- ✅ Check affiliate exists and approved
- ✅ Check MongoDB connection
- ✅ Check API response

#### **4. Conversion Not Tracked**
- ✅ Check webhook configuration
- ✅ Check metadata in payment
- ✅ Check affiliateCode in metadata
- ✅ Check commission calculation

#### **5. Dashboard Not Loading**
- ✅ Check user authentication
- ✅ Check affiliate status
- ✅ Check API permissions
- ✅ Check data format

---

## 📊 **Expected Results**

### **After Full Test:**

#### **Database Records:**
```javascript
// AffiliateClick collection should have:
{
  affiliateCode: "AFF-TEST-ABC123",
  clickedAt: "2025-01-XX",
  ipAddress: "127.0.0.1",
  status: "converted",
  convertedAt: "2025-01-XX",
  orderId: "test_session_123",
  commissionAmount: 2370000,
  productId: "ea-full",
  productName: "EA ThebenchmarkTrader Full Version"
}
```

#### **Dashboard Stats:**
- Total Clicks: 1+
- Conversions: 1
- Conversion Rate: 100%
- Total Commission: 2,370,000đ

#### **Tracking Links:**
- EA Full: `?affiliate=AFF-TEST-ABC123&product=ea-full`
- EA Pro: `?affiliate=AFF-TEST-ABC123&product=ea-pro-source`
- Indicators: `?affiliate=AFF-TEST-ABC123&product=indicator-pro`

---

## 🎯 **Test Scenarios**

### **Scenario 1: New Affiliate**
```
1. Register new affiliate
2. Admin approve
3. Generate tracking links
4. Test click tracking
5. Test conversion
6. Check dashboard stats
```

### **Scenario 2: Existing Affiliate**
```
1. Login with existing affiliate
2. Check dashboard
3. Generate new tracking links
4. Test different products
5. Check commission rates
```

### **Scenario 3: Conversion Flow**
```
1. Click affiliate link
2. Browse products
3. Go to checkout
4. Complete payment
5. Check conversion tracking
6. Verify commission calculation
```

### **Scenario 4: Multiple Clicks**
```
1. Click same affiliate link multiple times
2. Check click tracking
3. Complete one conversion
4. Check conversion rate
5. Verify stats accuracy
```

---

## 📱 **Mobile Testing**

### **Test on Mobile:**
```
1. Use mobile device
2. Click affiliate links
3. Test responsive dashboard
4. Check mobile tracking
5. Test mobile checkout
```

---

## 🔒 **Security Testing**

### **Test Security:**
```
1. Test with invalid affiliate codes
2. Test with expired tokens
3. Test with unauthorized access
4. Test SQL injection prevention
5. Test XSS prevention
```

---

## 📈 **Performance Testing**

### **Test Performance:**
```
1. Test with multiple concurrent clicks
2. Test database query performance
3. Test API response times
4. Test dashboard loading speed
5. Test webhook processing time
```

---

## ✅ **Final Checklist**

### **Before Production:**
- [ ] All test scenarios pass
- [ ] Database queries optimized
- [ ] Error handling implemented
- [ ] Security measures in place
- [ ] Performance acceptable
- [ ] Documentation complete
- [ ] Monitoring setup
- [ ] Backup procedures

---

**🎉 Sau khi hoàn thành tất cả tests, hệ thống affiliate sẽ sẵn sàng cho production!**

*Last updated: January 2025*
