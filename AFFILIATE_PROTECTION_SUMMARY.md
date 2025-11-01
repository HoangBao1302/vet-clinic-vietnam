# 🛡️ Bảo Vệ Hệ Thống Affiliate

## ✅ Đã Triển Khai

### **1. Ẩn Trang Affiliate Khỏi User Chưa Đăng Nhập**

#### **Các Trang Được Bảo Vệ:**
- ✅ `/referral` - Trang chính affiliate program
- ✅ `/referral/ban-ea` - Chi tiết chương trình bán EA (30% hoa hồng)
- ✅ `/referral/copy-social` - Chi tiết Copy Social Trading (10% hoa hồng)
- ✅ `/referral/ban-khoa-hoc` - Chi tiết bán khóa học (25% hoa hồng)
- ✅ `/referral/apply` - Form đăng ký affiliate (đã có từ trước)

#### **Component Mới:**
- ✅ `components/AuthProtected.tsx` - Wrapper component để bảo vệ trang

**Logic:**
- User chưa login → Redirect đến `/login?redirect=/referral`
- User đã login → Cho phép xem trang
- Loading state trong khi check auth

### **2. Ngăn Chặn Self-Referral (Tự Mua Qua Link Của Mình)**

#### **Stripe Webhook:**
- ✅ Check `customerEmail === affiliateEmail`
- ✅ Nếu trùng → Block commission ($0)
- ✅ Vẫn track conversion nhưng đánh dấu `selfReferral: true`
- ✅ Log warning để monitoring

#### **PayPal Webhook:**
- ✅ Tương tự như Stripe
- ✅ Check email khi có `payerEmail`
- ✅ Block commission nếu self-referral
- ✅ Track conversion với flag `selfReferral: true`

**Kết Quả:**
- ❌ User không thể tự mua qua link của mình để nhận commission
- ✅ Vẫn được mua hàng bình thường (chỉ không có commission)
- ✅ Tracking đầy đủ để admin monitor

### **3. Chỉ Approved Affiliate Mới Được Commission**

#### **Kiểm Tra:**
- ✅ Stripe webhook: `affiliateStatus === 'approved'`
- ✅ PayPal webhook: `affiliateStatus === 'approved'`
- ✅ Tất cả API affiliate đều check status

**Flow:**
1. User đăng ký → `affiliateStatus: 'pending'`
2. Admin duyệt → `affiliateStatus: 'approved'`
3. Chỉ khi `approved` → Mới được commission

---

## 📁 Files Đã Thay Đổi

### **New Files:**
- `components/AuthProtected.tsx` - Auth protection wrapper

### **Updated Files:**
- `app/referral/page.tsx` - Trang chính (thêm AuthProtected)
- `app/referral/ban-ea/page.tsx` - Trang bán EA (thêm AuthProtected)
- `app/referral/copy-social/page.tsx` - Trang Copy Social (thêm AuthProtected)
- `app/referral/ban-khoa-hoc/page.tsx` - Trang bán khóa học (thêm AuthProtected)
- `app/api/webhooks/stripe/route.ts` - Thêm self-referral check
- `app/api/webhooks/paypal/route.ts` - Thêm self-referral check

---

## 🔒 Bảo Vệ Hiện Tại

### **Layer 1: Trang Web**
- ✅ Ẩn tất cả trang affiliate/referral khỏi user chưa login
- ✅ Redirect đến login page nếu chưa đăng nhập
- ✅ User phải đăng nhập → Xem được chính sách → Đăng ký affiliate

### **Layer 2: Đăng Ký Affiliate**
- ✅ Phải đăng nhập mới đăng ký được (đã có từ trước)
- ✅ Status mặc định: `pending`
- ✅ Admin phải duyệt → `approved`

### **Layer 3: Commission Tracking**
- ✅ Chỉ `affiliateStatus === 'approved'` mới được commission
- ✅ Block self-referral (email match)
- ✅ Track nhưng không credit commission cho self-referral

---

## 📊 Kết Quả

### **Trước:**
- ❌ User chưa login có thể xem chính sách affiliate
- ❌ User có thể tự đăng ký → Tự mua qua link → Nhận commission
- ⚠️ Rủi ro fraud cao

### **Sau:**
- ✅ Chỉ user đã login mới xem được trang affiliate
- ✅ Phải được admin duyệt mới trở thành affiliate
- ✅ Không thể tự mua qua link của mình để nhận commission
- ✅ Bảo vệ chống fraud hiệu quả

---

## 🎯 Self-Referral Detection

### **Logic:**
```typescript
if (customerEmail === affiliateEmail) {
  // Block commission
  commissionAmount = 0;
  selfReferral = true;
  // Still track for monitoring
}
```

### **Monitoring:**
Server logs sẽ hiển thị:
- `🚫 SELF-REFERRAL BLOCKED: Affiliate tried to buy through their own link`
- Có thể query database: `AffiliateClick.find({ selfReferral: true })`

---

## 📝 Notes

1. **Admin Approval:** Admin phải duyệt affiliate trong dashboard trước khi họ có thể kiếm commission
2. **Self-Referral:** Vẫn cho phép mua hàng (chỉ block commission)
3. **Tracking:** Tất cả self-referral đều được track để monitor fraud patterns

---

**Status:** ✅ Hoàn thành  
**Protection Level:** High - Multi-layer defense against affiliate fraud

