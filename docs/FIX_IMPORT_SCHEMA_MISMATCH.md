# 🔧 Fix Import Data Error - Schema Mismatch Issue

## ❌ Vấn đề gốc:

**Import fail** với lỗi **406 (Not Acceptable)** hoặc **500 (Internal Server Error)** cho Trading Accounts và Featured Accounts.

### 🔍 Nguyên nhân:

**MongoDB Models không khớp với actual data structure** trong `data/*.ts` files:

| Data File | MongoDB Model (OLD - SAI) | Kết quả |
|-----------|---------------------------|---------|
| `data/tradingAccounts.ts` có: `platform`, `accountName`, `stats` (object), `links`, `description`, `highlights` | Model có: `broker`, `account`, `gain`, `balance`, `maxDrawdown`, `status` | ❌ Validation failed |
| `data/featuredAccounts.ts` có: `name`, `platform`, `gain`, `drawdown`, `days`, `link`, `copyable` | Model có: `accountNumber`, `startBalance`, `currentBalance`, `totalProfit`, `year` | ❌ Validation failed |

## ✅ Giải pháp:

### 1. Update Models để match với actual data structure

**Đã update:**
- `lib/models/TradingAccount.ts` - Giờ match 100% với `data/tradingAccounts.ts`
- `lib/models/FeaturedAccount.ts` - Giờ match 100% với `data/featuredAccounts.ts`

### 2. Add "Clear All Data" feature

Vì data cũ trong MongoDB dùng wrong schema, cần **xóa hết và import lại**.

**New endpoint:** `DELETE /api/admin/clear-all`
- Xóa tất cả Partners, Trading Accounts, Featured Accounts
- Chỉ admin mới được phép

### 3. Add credentials và error logging

- Thêm `credentials: 'include'` vào tất cả fetch calls
- Add detailed console logging để debug

## 📝 Cách sử dụng (sau khi deploy):

### Bước 1: Clear old data (data với wrong schema)

1. Vào: `https://thebenchmarktrader.com/admin/content-dashboard/import`
2. Click nút **"Clear All Data First"** (nút đỏ)
3. Confirm xóa

### Bước 2: Import fresh data với correct schema

1. **KHÔNG** cần check "Update existing records" (vì đã clear rồi)
2. Click **"Start Import (Skip Existing)"**
3. Đợi import hoàn tất

### Kết quả mong đợi:

```
✅ Import Completed!
Successfully imported 11 / 11 records

✅ Partners
Success: 3 / Total: 3

✅ Trading Accounts  
Success: 5 / Total: 5

✅ Featured Accounts
Success: 3 / Total: 3
```

## 🎯 Files đã thay đổi:

1. ✅ `lib/models/TradingAccount.ts` - Updated schema
2. ✅ `lib/models/FeaturedAccount.ts` - Updated schema
3. ✅ `app/api/admin/clear-all/route.ts` - New endpoint
4. ✅ `app/admin/content-dashboard/import/page.tsx` - Add Clear button
5. ✅ `app/admin/content-dashboard/page.tsx` - Update display logic

## 🔄 Schema Changes:

### TradingAccount (NEW):

```typescript
{
  id: string;
  platform: string;              // "MQL4", "MQL5", "Myfxbook", etc
  accountName: string;           // "ThebenchmarkTrader Live #1"
  accountNumber: string;         // "9029831"
  broker: string;                // "Tickmill"
  verified: boolean;
  stats: {
    gain: string;
    drawdown: string;
    winRate: string;
    profitFactor: string;
    tradingDays: string;
  };
  links: {
    profile?: string;
    copyTrade?: string;
    youtube?: string;
  };
  description: string;
  description_en: string;
  highlights: string[];
  highlights_en: string[];
  badge?: string;
  badge_en?: string;
  active: boolean;
  order: number;
}
```

### FeaturedAccount (NEW):

```typescript
{
  id: string;
  name: string;                  // "ThebenchmarkTrader Live #1"
  platform: string;              // "MQL5", "Myfxbook", etc
  broker: string;                // "Tickmill"
  gain: string;                  // "+4359%"
  drawdown: string;              // "28.5%"
  days: string;                  // "1638"
  link: string;                  // Profile URL
  copyable: boolean;
  active: boolean;
  order: number;
}
```

## ⚠️ Important Notes:

1. **BREAKING CHANGE**: Old data không tương thích với new schema
2. **Must clear data** trước khi import lại
3. Edit forms sẽ cần update sau (hiện tại dùng old schema)
4. Dashboard display đã được update để handle both schemas gracefully

## 🚀 Next Steps:

1. Deploy code lên Vercel
2. Clear all old data
3. Import fresh data
4. (Optional) Update edit/create forms để match new schema

---

**Commit:** `fix: Update models to match actual data structure and add Clear All Data feature`
**Date:** 2026-02-10
