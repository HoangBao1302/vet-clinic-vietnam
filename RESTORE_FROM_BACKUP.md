# Hướng Dẫn Khôi Phục Từ Backup

## Bước 1: Tìm thư mục backup
Thư mục backup của bạn có commit `4cd3bb2` (commit trước khi thêm multi-language)

## Bước 2: Backup dữ liệu hiện tại (nếu cần)
```powershell
# Tạo backup của thư mục hiện tại (tùy chọn)
Copy-Item -Path "D:\CursorP\Thebenchmarktrader" -Destination "D:\CursorP\Thebenchmarktrader_backup_before_restore" -Recurse
```

## Bước 3: Copy toàn bộ từ thư mục backup
```powershell
# Thay thế đường dẫn backup của bạn
$backupPath = "D:\BackupCursorT1025\Last"
$currentPath = "D:\CursorP\Thebenchmarktrader"

# Xóa thư mục hiện tại (CẨN THẬN!)
Remove-Item -Path $currentPath -Recurse -Force

# Copy toàn bộ từ backup
Copy-Item -Path $backupPath -Destination $currentPath -Recurse
```

## Bước 4: Vào thư mục và kiểm tra
```powershell
cd D:\CursorP\Thebenchmarktrader
git status
git log --oneline -5
```

## Bước 5: Push lên GitHub (nếu cần)
```powershell
git push origin main --force
# Lưu ý: --force sẽ ghi đè lịch sử trên GitHub
```

---

## Cách 2: Git Reset về commit 4cd3bb2 (Nếu backup cùng repository)

Nếu thư mục backup là cùng một git repository:

```powershell
cd D:\CursorP\Thebenchmarktrader

# Xóa tất cả thay đổi chưa commit
git reset --hard HEAD

# Reset về commit 4cd3bb2
git reset --hard 4cd3bb2

# Xóa các files không được track
git clean -fd

# Push lên GitHub (force)
git push origin main --force
```

---

## Cách 3: Manual Copy Files Quan Trọng

Nếu chỉ muốn copy một số files quan trọng từ backup:

### Files cần khôi phục:
1. `app/` - Toàn bộ folder app
2. `components/` - Toàn bộ folder components  
3. `middleware.ts`
4. `next.config.ts`
5. `package.json`
6. Các file config khác

```powershell
$backupPath = "ĐƯỜNG_DẪN_TỚI_THƯ_MỤC_BACKUP"

# Copy folders
Copy-Item -Path "$backupPath\app" -Destination "D:\CursorP\Thebenchmarktrader\app" -Recurse -Force
Copy-Item -Path "$backupPath\components" -Destination "D:\CursorP\Thebenchmarktrader\components" -Recurse -Force

# Copy files
Copy-Item -Path "$backupPath\middleware.ts" -Destination "D:\CursorP\Thebenchmarktrader\middleware.ts" -Force
Copy-Item -Path "$backupPath\next.config.ts" -Destination "D:\CursorP\Thebenchmarktrader\next.config.ts" -Force
```

---

## Sau khi khôi phục:

1. **Kiểm tra dependencies:**
```powershell
npm install
```

2. **Test build local:**
```powershell
npm run build
```

3. **Push lên GitHub để deploy:**
```powershell
git add -A
git commit -m "restore: Khôi phục từ backup commit 4cd3bb2"
git push origin main
```

---

## Lưu ý quan trọng:

⚠️ **Trước khi làm:**
- Đảm bảo bạn đã backup code hiện tại (nếu cần)
- Kiểm tra đường dẫn thư mục backup đúng chưa
- Xác nhận commit 4cd3bb2 có đầy đủ tính năng bạn cần

✅ **Sau khi khôi phục:**
- Kiểm tra `app/page.tsx` tồn tại (không phải `app/[locale]/page.tsx`)
- Kiểm tra không có `i18n.ts`, `routing.ts`, `messages/` folder
- Kiểm tra `next.config.ts` không có `next-intl` plugin
- Kiểm tra `middleware.ts` không có `next-intl` middleware

