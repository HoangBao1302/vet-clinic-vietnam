# ✅ Checklist: Bật/Tắt Phương Thức Thanh Toán

## 🎯 Mục Tiêu

Tắt Stripe và Bank Transfer, chỉ giữ PayPal.

## 📋 Các Bước Thực Hiện

### Bước 1: Mở File Cấu Hình
- [ ] Mở file `config/paymentMethods.ts`

### Bước 2: Kiểm Tra Cấu Hình Hiện Tại
- [ ] Xem trạng thái hiện tại của `stripe.enabled`
- [ ] Xem trạng thái hiện tại của `paypal.enabled`
- [ ] Xem trạng thái hiện tại của `bank.enabled`

### Bước 3: Thay Đổi Cấu Hình
- [ ] Đổi `stripe.enabled` thành `false`
- [ ] Đổi `paypal.enabled` thành `true`
- [ ] Đổi `bank.enabled` thành `false`

### Bước 4: Lưu File
- [ ] Lưu file `config/paymentMethods.ts` (Ctrl + S)

### Bước 5: Kiểm Tra Trên Localhost
- [ ] Mở trình duyệt
- [ ] Vào `http://localhost:3000/downloads`
- [ ] Scroll xuống phần "Sản Phẩm MT4" hoặc "Sản Phẩm MT5"
- [ ] Kiểm tra button "Mua qua Stripe (Card)" có màu xám không
- [ ] Kiểm tra button "Chuyển khoản Ngân hàng" có màu xám không
- [ ] Kiểm tra button "Mua qua PayPal" có màu vàng không
- [ ] Hover vào button Stripe, có tooltip "Tạm thời không khả dụng" không
- [ ] Hover vào button Bank, có tooltip "Tạm thời không khả dụng" không
- [ ] Click vào button PayPal, có redirect đến checkout không

### Bước 6: Test Đa Ngôn Ngữ
- [ ] Chuyển sang tiếng Anh (nếu có)
- [ ] Kiểm tra thông báo disabled có đúng tiếng Anh không

### Bước 7: Commit Changes (Nếu OK)
- [ ] `git add config/ app/downloads/page.tsx docs/`
- [ ] `git commit -m "feat: Disable Stripe and Bank Transfer, keep PayPal only"`
- [ ] `git push origin main`

### Bước 8: Deploy to Production
- [ ] Đợi Vercel deploy xong (hoặc deploy thủ công)
- [ ] Kiểm tra trên production URL
- [ ] Xác nhận button đã disabled đúng

## 🔄 Khi Muốn Bật Lại

### Bật Lại Stripe
- [ ] Mở `config/paymentMethods.ts`
- [ ] Đổi `stripe.enabled` thành `true`
- [ ] Lưu file
- [ ] Kiểm tra trên localhost
- [ ] Commit và push

### Bật Lại Bank Transfer
- [ ] Mở `config/paymentMethods.ts`
- [ ] Đổi `bank.enabled` thành `true`
- [ ] Lưu file
- [ ] Kiểm tra trên localhost
- [ ] Commit và push

## 🐛 Troubleshooting

### Button vẫn có thể click dù đã disabled
- [ ] Clear browser cache (Ctrl + Shift + R)
- [ ] Kiểm tra file `paymentMethods.ts` đã lưu chưa
- [ ] Restart dev server (`npm run dev`)

### Import error
- [ ] Kiểm tra `tsconfig.json` có `"@/*": ["./*"]` không
- [ ] Restart VSCode/Cursor
- [ ] Chạy `npm install` lại

### Button không đổi màu
- [ ] Kiểm tra Tailwind CSS đã compile chưa
- [ ] Clear `.next` folder và restart dev server

## 📞 Tài Liệu Tham Khảo

- `docs/PAYMENT_METHODS_GUIDE.md` - Hướng dẫn chi tiết
- `docs/PAYMENT_METHODS_CHANGES.md` - Tóm tắt thay đổi
- `config/README.md` - Hướng dẫn ngắn gọn
- `config/paymentMethods.example.ts` - Các ví dụ cấu hình

## 🎉 Hoàn Tất

Khi tất cả checklist đã hoàn thành, bạn đã thành công:
- ✅ Tắt Stripe
- ✅ Tắt Bank Transfer
- ✅ Giữ PayPal
- ✅ Có thể bật lại bất cứ lúc nào chỉ bằng 1 dòng code

---

**Thời gian ước tính**: 5-10 phút
**Độ khó**: Dễ ⭐
