@echo off
REM Windows batch script to fix order 08C44041RJ769621X
REM Run: run-fix-windows.bat

set MONGODB_URI=mongodb+srv://leopardsmart_user:bABKHjBhMuXOfk3t@cluster0.gghymaa.mongodb.net/leopardsmart?retryWrites=true^&w=majority^&appName=Cluster0

echo.
echo ========================================
echo Fixing Order 08C44041RJ769621X
echo ========================================
echo.

node fix-order-08C44041RJ769621X.js

echo.
echo ========================================
echo Script completed!
echo ========================================
echo.

pause

