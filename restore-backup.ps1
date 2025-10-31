# Script khôi phục từ backup
# Backup path: D:\BackupCursorT1025\Last
# Current path: D:\CursorP\Thebenchmarktrader

$backupPath = "D:\BackupCursorT1025\Last"
$currentPath = "D:\CursorP\Thebenchmarktrader"

Write-Host "=== KHÔI PHỤC TỪ BACKUP ===" -ForegroundColor Cyan
Write-Host ""

# Kiểm tra backup path
if (-not (Test-Path $backupPath)) {
    Write-Host "❌ ERROR: Backup path không tồn tại: $backupPath" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Backup path tồn tại: $backupPath" -ForegroundColor Green
Write-Host ""

# Kiểm tra current path
if (-not (Test-Path $currentPath)) {
    Write-Host "❌ ERROR: Current path không tồn tại: $currentPath" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Current path tồn tại: $currentPath" -ForegroundColor Green
Write-Host ""

# Xác nhận
Write-Host "⚠️  CẢNH BÁO:" -ForegroundColor Yellow
Write-Host "   - Thư mục hiện tại sẽ được XÓA và thay thế bằng backup"
Write-Host "   - Tất cả thay đổi chưa commit sẽ MẤT"
Write-Host ""
$confirm = Read-Host "Bạn có chắc chắn muốn tiếp tục? (yes/no)"

if ($confirm -ne "yes") {
    Write-Host "❌ Đã hủy khôi phục" -ForegroundColor Red
    exit 0
}

Write-Host ""
Write-Host "🔄 Đang xóa thư mục hiện tại..." -ForegroundColor Yellow
Remove-Item -Path $currentPath -Recurse -Force

Write-Host "📦 Đang copy từ backup..." -ForegroundColor Yellow
Copy-Item -Path $backupPath -Destination $currentPath -Recurse

Write-Host ""
Write-Host "✅ Khôi phục hoàn tất!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Bước tiếp theo:" -ForegroundColor Cyan
Write-Host "   1. cd D:\CursorP\Thebenchmarktrader"
Write-Host "   2. git status"
Write-Host "   3. npm install"
Write-Host "   4. git add -A"
Write-Host "   5. git commit -m 'restore: Khôi phục từ backup'"
Write-Host "   6. git push origin main"

