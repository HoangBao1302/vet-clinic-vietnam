# Products API Integration - Pricing & Downloads Pages

## Overview

This document outlines the MongoDB integration for the **Pricing** and **Downloads** pages, implementing Option A to enable real-time content management.

---

## Summary

### Pricing Page (`/pricing`)
- **Status**: ✅ **No Changes Needed**
- **Reason**: The Pricing page uses the **i18n translation system** for pricing tiers (Demo, Full, Pro)
- **Design Decision**: This is the correct approach because:
  - Pricing tiers are structural UI elements tied to translations
  - They rarely change and benefit from static rendering
  - Keeps pricing content versioned with translations
- **Admin Control**: Update translations in `lib/i18n/translations/*.ts` (not via MongoDB)

### Downloads Page (`/downloads`)
- **Status**: ✅ **Fully Integrated with MongoDB**
- **Changes Made**:
  1. Now fetches **Products** from MongoDB via `/api/products`
  2. PDF Guides remain static (they're not products, just free documentation)
  3. Free and Paid products are dynamically loaded from database
  4. Real-time updates from Admin Products Dashboard

---

## Implementation Details

### 1. Public Products API

**File**: `app/api/products/route.ts` (NEW)

```typescript
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  await dbConnect();
  const products = await Product.find({ status: "active" })
    .sort({ category: 1, platform: 1, price: 1 })
    .lean();
  return NextResponse.json({ success: true, products });
}
```

**Key Features**:
- Public endpoint (no authentication required)
- Only returns `active` products
- Sorted by category, platform, and price
- Force-dynamic to ensure fresh data

---

### 2. Downloads Page Updates

**File**: `app/downloads/page.tsx`

**Changes**:

1. **Added State Management**:
```typescript
const [products, setProducts] = useState<IProduct[]>([]);
const [loadingProducts, setLoadingProducts] = useState(true);
```

2. **Fetch Products from API**:
```typescript
useEffect(() => {
  fetchProducts();
}, []);

const fetchProducts = async () => {
  try {
    const response = await fetch('/api/products');
    if (response.ok) {
      const data = await response.json();
      setProducts(data.products || []);
    }
  } catch (error) {
    console.error('Error fetching products:', error);
  } finally {
    setLoadingProducts(false);
  }
};
```

3. **Product Mapping Function**:
```typescript
const mapProductToDownloadItem = (product: IProduct): DownloadItem => {
  const isFree = product.price === 0 || product.id.includes('demo');
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    version: product.version || "v1.0",
    size: product.size || "N/A",
    type: typeMap[product.category] || 'ea',
    free: isFree,
    downloadUrl: product.downloadUrl,
    requiresPayment: !isFree,
    price: product.price,
    platform: product.platform
  };
};
```

4. **Combined Data Source**:
```typescript
const allDownloads: DownloadItem[] = [
  ...pdfGuides,  // Static PDF guides
  ...products.map(mapProductToDownloadItem)  // Dynamic products from MongoDB
];

const pdfGuides = allDownloads.filter(d => d.type === "pdf");
const freeItems = allDownloads.filter(d => d.type !== "pdf" && d.free);
const paidItems = allDownloads.filter(d => !d.free && d.requiresPayment);
```

5. **Loading State UI**:
```typescript
{loadingProducts ? (
  <div className="text-center py-12">
    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
    <p className="mt-4 text-gray-600">Đang tải sản phẩm từ MongoDB...</p>
  </div>
) : (
  {/* Render products */}
)}
```

---

## Data Flow

### Before (Static)
```
Downloads Page → Hardcoded Array
                 (No admin control)
```

### After (MongoDB Integration)
```
Admin Products Dashboard → MongoDB Products Collection
                              ↓
                        Public API (/api/products)
                              ↓
                        Downloads Page (Dynamic)
                              ↓
                        Real-time Updates
```

---

## Testing Checklist

### Admin Side
- [ ] Go to `/admin/products`
- [ ] Create a new product (e.g., "Test EA MT4")
- [ ] Set status to "active"
- [ ] Set platform, price, category
- [ ] Save

### Public Side (Downloads)
- [ ] Go to `/downloads`
- [ ] Verify PDF guides section still shows (static)
- [ ] Verify Free section shows free products from MongoDB
- [ ] Verify Paid section shows paid products from MongoDB
- [ ] Check that new "Test EA MT4" appears
- [ ] Edit the product in admin → Should reflect immediately on `/downloads`

### Pricing Page
- [ ] Go to `/pricing`
- [ ] Verify Demo, Full, Pro plans display correctly
- [ ] Verify translations work (VN/EN toggle)
- [ ] Confirm this page does NOT need MongoDB (it's translation-based)

---

## Key Benefits

1. **Real-time Updates**: Admin edits to products instantly reflect on `/downloads`
2. **Single Source of Truth**: Products managed in MongoDB, not hardcoded
3. **Hybrid Approach**: PDF guides remain static (performance), products are dynamic (flexibility)
4. **Scalability**: Easy to add/remove products without code changes
5. **Translation Support**: Products from DB can still be translated via i18n fallbacks

---

## Notes

- **Pricing Page**: Intentionally NOT connected to MongoDB because pricing tiers are structural UI elements best managed via i18n translations
- **PDF Guides**: Remain static in code as they're free documentation, not purchasable products
- **Product Categories**: Mapped from MongoDB `category` field to DownloadItem `type` field
- **Free Products**: Determined by `price === 0` or `id.includes('demo')`
- **Active Products Only**: Public API filters for `status: "active"`

---

## Architecture Alignment

This implementation follows the established patterns from:
- ✅ Partners → `/api/partners` (public API)
- ✅ Trading Accounts → `/api/trading-accounts` (public API)
- ✅ Featured Accounts → `/api/featured-accounts` (public API)
- ✅ **Products → `/api/products` (public API)** ← NEW

All content now has a consistent architecture:
```
Admin Dashboard (CRUD) → MongoDB → Public API → Public Pages
```

---

## Future Enhancements

If needed:
1. **Pricing Tiers from MongoDB**: Could create a `PricingPlan` model if plans need frequent changes
2. **PDF Guides in MongoDB**: Could make guides manageable via admin dashboard
3. **Product Translations**: Store multiple language versions in MongoDB
4. **Product Images**: Add image URLs to Product schema for richer display
5. **Product Categories**: Expand to more categories beyond indicator/ea

---

## Commit Summary

**Changes**:
- ✅ Created `/api/products` public endpoint
- ✅ Updated Downloads page to fetch from MongoDB
- ✅ Added loading states for better UX
- ✅ Kept PDF guides static
- ✅ Verified Pricing page uses i18n (no changes needed)

**Result**:
- Admin Products Dashboard now controls Downloads page content in real-time
- Pricing page continues to work correctly with translation system
- Consistent architecture across all content types
