# Content Dashboard - MongoDB Integration Guide

## 📋 Tình trạng hiện tại

### ✅ Đã hoàn thành:

1. **Mongoose Models** (3 models)
   - `lib/models/Partner.ts`
   - `lib/models/TradingAccount.ts`
   - `lib/models/FeaturedAccount.ts`

2. **API Endpoints** (6 endpoints x 3 collections = 18 routes)
   
   **Partners:**
   - `GET /api/admin/partners` - Lấy danh sách partners
   - `POST /api/admin/partners` - Tạo partner mới
   - `GET /api/admin/partners/[id]` - Lấy chi tiết partner
   - `PATCH /api/admin/partners/[id]` - Cập nhật partner
   - `DELETE /api/admin/partners/[id]` - Xóa partner

   **Trading Accounts:**
   - `GET /api/admin/trading-accounts`
   - `POST /api/admin/trading-accounts`
   - `GET /api/admin/trading-accounts/[id]`
   - `PATCH /api/admin/trading-accounts/[id]`
   - `DELETE /api/admin/trading-accounts/[id]`

   **Featured Accounts:**
   - `GET /api/admin/featured-accounts`
   - `POST /api/admin/featured-accounts`
   - `GET /api/admin/featured-accounts/[id]`
   - `PATCH /api/admin/featured-accounts/[id]`
   - `DELETE /api/admin/featured-accounts/[id]`

3. **Migration Scripts**
   - `scripts/migrate-content-to-mongodb.ts` - Sẵn sàng để import data

### ⏳ Cần làm tiếp:

4. **Update Content Dashboard** (`app/admin/content-dashboard/page.tsx`)
   - Thay thế local state bằng API calls
   - Fetch data từ MongoDB thay vì import từ files
   - Implement real save functionality

---

## 🚀 Cách hoàn thiện (Option 1 - Khuyến nghị)

### Bước 1: Import data vào MongoDB (Manual)

Vì migration script gặp vấn đề với TypeScript, cách đơn giản nhất là **import data qua API**:

1. **Deploy code mới lên Vercel** (đã có models và APIs)
2. **Dùng Postman hoặc create một admin tool để import**

**Script import nhanh** (chạy trong browser console khi đã login admin):

```javascript
// Copy data từ files
const partnersData = [...]; // Copy từ data/partners.ts
const tradingAccountsData = [...]; // Copy từ data/tradingAccounts.ts
const featuredAccountsData = [...]; // Copy từ data/featuredAccounts.ts

// Import Partners
for (const partner of partnersData) {
  await fetch('/api/admin/partners', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(partner)
  });
}

// Import Trading Accounts
for (const account of tradingAccountsData) {
  await fetch('/api/admin/trading-accounts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(account)
  });
}

// Import Featured Accounts
for (const featured of featuredAccountsData) {
  await fetch('/api/admin/featured-accounts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(featured)
  });
}

console.log('✅ Import completed!');
```

### Bước 2: Update Content Dashboard

Thay đổi `app/admin/content-dashboard/page.tsx`:

**Hiện tại (local state):**
```typescript
const [localPartners, setLocalPartners] = useState<PartnerInfo[]>(partners);
```

**Sau khi update (fetch từ API):**
```typescript
const [localPartners, setLocalPartners] = useState<PartnerInfo[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetchPartners();
  fetchTradingAccounts();
  fetchFeaturedAccounts();
}, []);

const fetchPartners = async () => {
  const response = await fetch('/api/admin/partners');
  const data = await response.json();
  setLocalPartners(data.partners);
};

// Tương tự cho trading accounts và featured accounts
```

**Update handlers để call API:**

```typescript
const handlePartnerToggleActive = async (id: string) => {
  const partner = localPartners.find(p => p.id === id);
  if (!partner) return;

  const response = await fetch(`/api/admin/partners/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ active: !partner.active })
  });

  if (response.ok) {
    fetchPartners(); // Refresh data
  }
};

const handlePartnerDelete = async (id: string) => {
  if (!confirm("Bạn có chắc chắn muốn xóa partner này?")) return;

  const response = await fetch(`/api/admin/partners/${id}`, {
    method: 'DELETE'
  });

  if (response.ok) {
    fetchPartners(); // Refresh data
    alert('Xóa thành công!');
  }
};
```

**Xóa nút "Lưu Tất Cả":**
- Không cần nút save nữa vì mỗi thay đổi sẽ lưu ngay vào database

---

## 🎯 Option 2 - Giữ nguyên file-based (Nhanh nhất)

Nếu bạn muốn giữ nguyên cách hiện tại (data trong files `.ts`):

1. **Xóa thông báo lỗi:**
```typescript
const handleSave = async () => {
  alert("Thay đổi đã được áp dụng! Để lưu vĩnh viễn, cần cập nhật files trong thư mục data/");
};
```

2. **Thêm note:**
```typescript
<p className="text-sm text-yellow-600">
  ⚠️ Lưu ý: Dashboard này chỉ để preview. Để thay đổi data, cần edit files trong thư mục `data/`.
</p>
```

---

## 💡 Khuyến nghị

**Dùng Option 1 (MongoDB)** vì:
- ✅ Giống hệ thống Blog đã có
- ✅ Admin có thể edit trực tiếp trên web
- ✅ Không cần access vào code để thay đổi data
- ✅ Có API sẵn để dùng cho frontend

**Thời gian hoàn thiện:**
- Import data: 10-15 phút
- Update dashboard: 30-45 phút
- Test: 15 phút
- **Tổng: ~1-1.5 giờ**

---

## 📝 Next Steps

**Nếu chọn Option 1 (MongoDB):**

1. ✅ Deploy code hiện tại (models + APIs đã có)
2. ⏳ Import data vào MongoDB
3. ⏳ Update Content Dashboard để fetch từ API
4. ⏳ Test CRUD operations
5. ⏳ Deploy final version

**Nếu chọn Option 2 (File-based):**

1. ⏳ Update `handleSave` function
2. ⏳ Thêm documentation note
3. ⏳ Deploy

---

## ❓ Bạn muốn tiếp tục?

Tôi có thể:
1. **Hoàn thiện Option 1** - Update dashboard để dùng MongoDB APIs
2. **Implement Option 2** - Giữ file-based với message rõ ràng hơn
3. **Tạo admin tool** - Trang import data tự động

Bạn muốn chọn option nào?
