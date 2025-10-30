# PowerShell script to fix order 08C44041RJ769621X
# Run: .\run-fix-windows.ps1

$env:MONGODB_URI = "mongodb+srv://leopardsmart_user:bABKHjBhMuXOfk3t@cluster0.gghymaa.mongodb.net/leopardsmart?retryWrites=true&w=majority&appName=Cluster0"

Write-Host ""
Write-Host "========================================"
Write-Host "Fixing Order 08C44041RJ769621X"
Write-Host "========================================"
Write-Host ""

node fix-order-08C44041RJ769621X.js

Write-Host ""
Write-Host "========================================"
Write-Host "Script completed!"
Write-Host "========================================"
Write-Host ""

Read-Host "Press Enter to exit"

