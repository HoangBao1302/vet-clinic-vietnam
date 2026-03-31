# Products Bulk Import Tool - Quick Start Guide

## 🎯 Overview

Bulk import tool để migrate **9 products** (3 free + 6 paid) từ hardcoded data vào MongoDB.

---

## 📦 What Gets Imported

### Free Products (3 items):
1. **Support & Resistance Indicator** - Free indicator cho MT4
2. **Auto Trend Lines Indicator** - Free indicator cho MT5  
3. **EA ThebenchmarkTrader Demo** - Free demo EA

### Paid Products (6 items):

**MT4 Products**:
- Multi-Indicator Pro Pack (1,990,000đ)
- EA Full Version (7,900,000đ)
- EA Pro + Source Code (14,900,000đ)

**MT5 Products**:
- Multi-Indicator Pro Pack (1,990,000đ)
- EA Full Version (7,900,000đ)
- EA Pro + Source Code (14,900,000đ)

---

## 🚀 How to Use

### Step 1: Access Import Page

```
https://yourdomain.com/admin/products/import
```

Hoặc từ Products Dashboard:
1. Vào `/admin/products`
2. Click button **"Import Products"** (màu xanh lá)

### Step 2: Load Data

1. Click **"Load Data"** button
2. System sẽ load 9 products từ fallback data
3. Confirm: "Found 9 products ready to import"

### Step 3: Choose Import Mode

**Mode 1: Create New Only** (Default)
- Tạo products mới
- Skip nếu ID đã tồn tại
- Safe mode, không ghi đè

**Mode 2: Update Existing**
- ✅ Check "Update existing products"
- Update products có cùng ID
- Create mới nếu chưa tồn tại
- Useful for re-importing after changes

### Step 4: Run Import

1. Click **"Start Import"** button
2. Wait for completion (progress shows in console)
3. View results:
   - ✅ Success count
   - ❌ Failed/skipped count
   - Total processed

### Step 5: Verify

1. Click **"Go to Products Dashboard"**
2. Confirm 9 products appeared
3. Check `/downloads` page → Products hiển thị từ MongoDB

---

## 🔧 Features

### Import Options
- **Create New**: Import chỉ products chưa tồn tại
- **Update Existing**: Overwrite products đã có với data mới

### Clear All (Danger Zone)
- **Warning**: Xóa TẤT CẢ products trong MongoDB
- Use case: Reset database trước khi re-import
- ⚠️ **KHÔNG THỂ UNDO** - Use with caution!

---

## 📊 After Import

### What Changes:

**Before Import**:
```
/downloads page → Shows fallback hardcoded products
/api/products → Returns empty array []
Admin dashboard → Empty products list
```

**After Import**:
```
/downloads page → Shows products from MongoDB ✅
/api/products → Returns 9 active products ✅
Admin dashboard → Shows 9 products ready to manage ✅
```

### Real-time Updates:
1. Edit product in `/admin/products`
2. Changes reflect INSTANTLY on `/downloads`
3. No need to redeploy or restart

---

## 🎛️ Admin Products Dashboard

After import, you can manage products at `/admin/products`:

**Available Actions**:
- ✏️ **Edit**: Update name, price, description, features
- 🗑️ **Delete**: Remove products
- 👁️ **View**: Preview product details
- 🔄 **Change Status**: active/inactive/coming-soon
- ⭐ **Toggle Featured**: Highlight products
- 📊 **View Stats**: Revenue, sales, performance

---

## 🔄 Data Flow Architecture

```
Import Page (/admin/products/import)
    ↓
API: /api/admin/import/prepare-products (reads fallback data)
    ↓
API: /api/admin/products (POST/PATCH - writes to MongoDB)
    ↓
MongoDB Products Collection
    ↓
Public API: /api/products (GET - reads active products)
    ↓
Downloads Page (/downloads) - Real-time display
```

---

## 📝 Product Schema

Each product has:
```typescript
{
  id: string;              // Unique identifier
  name: string;            // Product name
  description: string;     // Product description
  platform: "MT4" | "MT5"; // Trading platform
  category: "indicator" | "ea-full" | "ea-pro-source";
  price: number;           // Price in VND (0 = free)
  version: string;         // e.g., "v2.0"
  size: string;            // e.g., "680 KB"
  status: "active" | "inactive" | "coming-soon";
  downloadUrl: string;     // File path
  features: string[];      // List of features
}
```

---

## ⚠️ Important Notes

1. **First Time Setup**: Run import ONCE sau khi deploy để populate MongoDB
2. **Fallback System**: Nếu MongoDB trống, `/downloads` tự động dùng fallback data
3. **No Downtime**: Website luôn hoạt động, kể cả khi chưa import
4. **Idempotent**: Safe để run import nhiều lần (won't create duplicates)

---

## 🐛 Troubleshooting

**Issue**: Import fails with "duplicate key error"
- **Solution**: Check "Update existing products" hoặc clear all trước

**Issue**: Products không hiển thị trên `/downloads`
- **Solution**: Verify `status: "active"` trong MongoDB
- Check public API: `curl https://yourdomain.com/api/products`

**Issue**: Admin dashboard trống sau import
- **Solution**: Refresh page, check browser console for errors
- Verify authentication (JWT token valid)

---

## ✅ Success Criteria

After successful import:
- [x] 9 products in MongoDB
- [x] `/admin/products` shows all products
- [x] `/downloads` displays products from database
- [x] `/api/products` returns active products
- [x] Edit in admin → Updates live on public page

---

## 🎉 Next Steps

1. Run import via `/admin/products/import`
2. Verify products on dashboard
3. Test public `/downloads` page
4. Customize products as needed
5. Add more products via "Thêm sản phẩm mới" button

---

**Created**: Feb 10, 2026  
**Status**: ✅ Ready to use
