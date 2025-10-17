# 🎯 Affiliate Tracking System - Complete Documentation

**Date:** January 2025  
**Status:** ✅ Complete Implementation  
**Version:** 1.0

---

## 📋 **Overview**

Hệ thống affiliate tracking hoàn chỉnh cho EA Forex ThebenchmarkTrader, bao gồm:
- Click tracking với cookies
- Conversion tracking tự động
- Commission calculation
- Real-time dashboard
- Tracking links generation

---

## 🏗️ **System Architecture**

### **Database Models**

#### **AffiliateClick Model**
```typescript
interface IAffiliateClick {
  affiliateCode: string;        // Mã affiliate (AFF-USERNAME-ABC123)
  clickedAt: Date;             // Thời gian click
  ipAddress: string;           // IP của người click
  userAgent?: string;          // Browser info
  referrer?: string;           // Nguồn traffic
  convertedAt?: Date;          // Thời gian conversion
  orderId?: string;            // Mã đơn hàng
  commissionAmount?: number;    // Số tiền hoa hồng
  productId?: string;          // ID sản phẩm
  productName?: string;        // Tên sản phẩm
  customerEmail?: string;      // Email khách hàng
  customerName?: string;       // Tên khách hàng
  status: 'clicked' | 'converted' | 'paid';
}
```

#### **User Model (Affiliate Fields)**
```typescript
interface IUser {
  // ... existing fields
  affiliateStatus: 'none' | 'pending' | 'approved' | 'rejected';
  affiliateCode?: string;      // Unique affiliate code
  membershipTier: 'free' | 'paid';
  isPaid: boolean;
}
```

---

## 🔌 **API Endpoints**

### **1. Track Affiliate Click**
**Endpoint:** `POST /api/affiliate/track`

**Request:**
```json
{
  "affiliateCode": "AFF-USERNAME-ABC123",
  "productId": "ea-full",
  "productName": "EA ThebenchmarkTrader Full"
}
```

**Response:**
```json
{
  "success": true,
  "clickId": "64f8a1b2c3d4e5f6a7b8c9d0",
  "message": "Affiliate click tracked successfully"
}
```

**Features:**
- ✅ Verify affiliate code exists and is approved
- ✅ Track IP, User Agent, Referrer
- ✅ Set 30-day cookie for conversion tracking
- ✅ Create database record

### **2. Generate Tracking Links**
**Endpoint:** `GET /api/affiliate/links`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "affiliateCode": "AFF-USERNAME-ABC123",
  "membershipTier": "free",
  "isPaid": false,
  "products": [
    {
      "id": "ea-full",
      "name": "EA ThebenchmarkTrader Full Version",
      "price": 7900000,
      "commissionRate": 30,
      "description": "Phiên bản đầy đủ cho tài khoản thực",
      "trackingLink": "https://thebenchmarktrader.com?affiliate=AFF-USERNAME-ABC123&product=ea-full",
      "estimatedCommission": 2370000
    }
  ]
}
```

### **3. Get Affiliate Stats**
**Endpoint:** `GET /api/affiliate/track?affiliateCode=AFF-USERNAME-ABC123`

**Query Parameters:**
- `affiliateCode`: Required
- `startDate`: Optional (YYYY-MM-DD)
- `endDate`: Optional (YYYY-MM-DD)

**Response:**
```json
{
  "success": true,
  "clicks": [...],
  "stats": {
    "totalClicks": 150,
    "conversions": 12,
    "conversionRate": 8.0,
    "totalCommission": 28400000,
    "breakdown": [
      {
        "_id": "converted",
        "count": 12,
        "totalCommission": 28400000
      }
    ]
  }
}
```

---

## 💰 **Commission Structure**

### **Rates by Product & Membership**

| Product | Free Members | Paid Members |
|---------|-------------|--------------|
| EA Full Version | 30% | 35% |
| EA Pro + Source | 30% | 35% |
| Multi-Indicator Pack | 30% | 35% |
| Forex Course | 25% | 25% |
| Social Copy Trading | 10% | 10% (recurring) |

### **Commission Calculation**
```typescript
const commissionRates = {
  'ea-full': affiliate.isPaid ? 0.35 : 0.30,
  'ea-pro-source': affiliate.isPaid ? 0.35 : 0.30,
  'indicator-pro': affiliate.isPaid ? 0.35 : 0.30,
  'course': 0.25,
  'social-copy': 0.10,
};

const commissionAmount = Math.round(orderAmount * commissionRate);
```

---

## 🔄 **Tracking Flow**

### **1. Click Tracking**
```
User clicks affiliate link
    ↓
URL: https://site.com?affiliate=AFF-USER&product=ea-full
    ↓
AffiliateTracker component detects params
    ↓
POST /api/affiliate/track
    ↓
Verify affiliate code exists & approved
    ↓
Create AffiliateClick record
    ↓
Set 30-day cookie: affiliate=AFF-USER:clickId
```

### **2. Conversion Tracking**
```
User completes purchase
    ↓
Checkout includes affiliateCode in metadata
    ↓
Payment webhook (Stripe/PayPal) fires
    ↓
Extract affiliateCode from metadata
    ↓
Find affiliate user & calculate commission
    ↓
Update AffiliateClick record:
    - status: 'converted'
    - convertedAt: new Date()
    - orderId: session.id
    - commissionAmount: calculated
```

---

## 🎛️ **Frontend Components**

### **1. AffiliateTracker Component**
**File:** `components/AffiliateTracker.tsx`

**Features:**
- ✅ Auto-detect affiliate links in URL params
- ✅ Track clicks automatically
- ✅ Show notification to user
- ✅ Set conversion tracking cookie

**Usage:**
```tsx
// Automatically included in layout.tsx
<AffiliateTracker />
```

### **2. Affiliate Dashboard**
**File:** `app/affiliate/dashboard/page.tsx`

**Features:**
- ✅ Real-time stats display
- ✅ Generate tracking links for all products
- ✅ Copy links with one click
- ✅ Commission information
- ✅ Click/conversion history

**Access:** `/affiliate/dashboard` (requires approved affiliate)

---

## 🔧 **Integration Points**

### **1. Checkout Integration**
**File:** `app/checkout/page.tsx`

```typescript
// Extract affiliate code from URL
const affiliateCode = searchParams.get("affiliate") || "";

// Include in payment request
body: JSON.stringify({
  productId: itemId,
  productName: itemName,
  amount: itemPrice,
  method: paymentMethod,
  customerInfo: formData,
  affiliateCode: affiliateCode // ← Affiliate tracking
}),
```

### **2. Payment APIs**
**Files:** 
- `app/api/create-payment/route.ts`
- `app/api/paypal/create-order/route.ts`

```typescript
// Include affiliate code in metadata
metadata: {
  productId,
  customerName: customerInfo.name,
  customerPhone: customerInfo.phone,
  affiliateCode: affiliateCode || '', // ← For webhook processing
},
```

### **3. Webhook Processing**
**File:** `app/api/webhooks/stripe/route.ts`

```typescript
// Handle affiliate conversion
const affiliateCode = session.metadata?.affiliateCode;
if (affiliateCode) {
  const affiliate = await User.findOne({ 
    affiliateCode, 
    affiliateStatus: 'approved' 
  });
  
  if (affiliate) {
    const commissionAmount = Math.round(session.amount_total * commissionRate);
    
    await AffiliateClick.updateOne(
      { affiliateCode },
      {
        $set: {
          convertedAt: new Date(),
          orderId: session.id,
          commissionAmount,
          status: 'converted',
        },
      },
      { sort: { clickedAt: -1 } }
    );
  }
}
```

---

## 📊 **Dashboard Features**

### **Stats Display**
- **Total Clicks**: Tổng số clicks từ affiliate links
- **Conversions**: Số lần conversion thành công
- **Conversion Rate**: Tỷ lệ chuyển đổi (%)
- **Total Commission**: Tổng hoa hồng đã kiếm được

### **Tracking Links**
- **Auto-generated** cho tất cả sản phẩm
- **One-click copy** functionality
- **Commission preview** cho mỗi sản phẩm
- **Estimated earnings** calculation

### **Commission Info**
- **Rate breakdown** theo sản phẩm
- **Membership tier** benefits
- **Payout schedule** information

---

## 🚀 **Usage Guide**

### **For Affiliates**

#### **1. Registration Process**
```
1. Go to /referral/apply
2. Fill application form
3. Wait for admin approval
4. Get unique affiliate code
5. Access dashboard at /affiliate/dashboard
```

#### **2. Generating Tracking Links**
```
1. Login to affiliate dashboard
2. Copy tracking links for products
3. Share links on social media/website
4. Monitor clicks and conversions
5. Track earnings in real-time
```

#### **3. Tracking Link Format**
```
Base URL: https://thebenchmarktrader.com
Parameters:
- affiliate: Your affiliate code
- product: Product ID (optional)

Example:
https://thebenchmarktrader.com?affiliate=AFF-JOHN-ABC123&product=ea-full
```

### **For Admins**

#### **1. Approve Affiliate Applications**
```javascript
// MongoDB query to find pending applications
db.users.find({ affiliateStatus: "pending" })

// Update to approve
db.users.updateOne(
  { _id: ObjectId("...") },
  { $set: { affiliateStatus: "approved" } }
)
```

#### **2. Monitor Affiliate Performance**
```javascript
// Get all affiliate stats
db.affiliateclicks.aggregate([
  { $group: {
    _id: "$affiliateCode",
    totalClicks: { $sum: 1 },
    conversions: { $sum: { $cond: [{ $eq: ["$status", "converted"] }, 1, 0] } },
    totalCommission: { $sum: "$commissionAmount" }
  }}
])
```

---

## 🔒 **Security Features**

### **1. Authentication**
- ✅ JWT token required for affiliate APIs
- ✅ User must be logged in to access dashboard
- ✅ Affiliate status verification

### **2. Validation**
- ✅ Affiliate code format validation
- ✅ Product ID validation
- ✅ Commission rate verification
- ✅ Webhook signature verification

### **3. Data Protection**
- ✅ IP address tracking for fraud prevention
- ✅ Cookie-based conversion tracking
- ✅ Secure metadata handling

---

## 📈 **Analytics & Reporting**

### **Available Metrics**
- **Click-through Rate**: Clicks per affiliate
- **Conversion Rate**: Conversions per clicks
- **Average Order Value**: Revenue per conversion
- **Commission per Click**: Earnings efficiency
- **Top Performing Affiliates**: Leaderboard

### **Real-time Monitoring**
- ✅ Live click tracking
- ✅ Instant conversion updates
- ✅ Commission calculations
- ✅ Performance dashboards

---

## 🛠️ **Technical Requirements**

### **Dependencies**
```json
{
  "mongodb": "^6.0.0",
  "mongoose": "^8.0.0",
  "next": "^14.0.0",
  "react": "^18.0.0"
}
```

### **Environment Variables**
```env
# MongoDB
MONGODB_URI=mongodb+srv://...

# JWT
JWT_SECRET=your-secret-key

# Base URL
NEXT_PUBLIC_BASE_URL=https://thebenchmarktrader.com
```

### **Database Indexes**
```javascript
// AffiliateClick collection indexes
db.affiliateclicks.createIndex({ affiliateCode: 1, clickedAt: -1 })
db.affiliateclicks.createIndex({ orderId: 1 })
db.affiliateclicks.createIndex({ status: 1 })

// User collection indexes
db.users.createIndex({ affiliateCode: 1 })
db.users.createIndex({ affiliateStatus: 1 })
```

---

## 🚧 **Future Enhancements**

### **Phase 2 Features**
- [ ] **Payout Management**: Automated commission payments
- [ ] **Advanced Analytics**: Detailed reporting dashboard
- [ ] **Multi-level Affiliates**: Sub-affiliate programs
- [ ] **Email Notifications**: Commission alerts
- [ ] **API Rate Limiting**: Prevent abuse
- [ ] **Fraud Detection**: Suspicious activity monitoring

### **Phase 3 Features**
- [ ] **Mobile App**: Affiliate mobile dashboard
- [ ] **Social Integration**: Share buttons
- [ ] **A/B Testing**: Link performance testing
- [ ] **Custom Landing Pages**: Personalized affiliate pages
- [ ] **Recurring Commissions**: Subscription tracking

---

## 📞 **Support & Maintenance**

### **Common Issues**

#### **1. Affiliate Links Not Tracking**
- Check affiliate code format
- Verify affiliate is approved
- Check cookie settings
- Review API logs

#### **2. Conversions Not Recording**
- Verify webhook configuration
- Check metadata in payment
- Review database connections
- Check commission calculations

#### **3. Dashboard Access Issues**
- Verify user authentication
- Check affiliate status
- Review JWT token validity
- Check API permissions

### **Monitoring**
- ✅ API response times
- ✅ Database query performance
- ✅ Webhook processing success
- ✅ Commission calculation accuracy

---

## 📋 **Implementation Checklist**

### **✅ Completed**
- [x] AffiliateClick database model
- [x] Click tracking API
- [x] Tracking links generation API
- [x] Affiliate dashboard
- [x] Checkout integration
- [x] Payment webhook processing
- [x] Frontend tracking component
- [x] Commission calculation
- [x] Cookie-based conversion tracking
- [x] Real-time stats display

### **🔄 In Progress**
- [ ] Admin approval interface
- [ ] Payout management system
- [ ] Advanced analytics
- [ ] Email notifications

### **📅 Planned**
- [ ] Mobile app integration
- [ ] Social media sharing
- [ ] A/B testing framework
- [ ] Fraud detection system

---

**🎉 Hệ thống affiliate tracking đã hoàn thành và sẵn sàng sử dụng!**

*Last updated: January 2025*
