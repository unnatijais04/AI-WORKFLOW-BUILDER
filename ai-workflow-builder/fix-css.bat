@echo off
echo ========================================
echo Fixing CSS Issues
echo ========================================
echo.

echo Cleaning and rebuilding...
cd client

echo Removing old build files...
if exist build rmdir /s /q build
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

echo Installing dependencies...
npm install

echo Building project...
npm run build

echo.
echo ========================================
echo CSS Fix Complete!
echo ========================================
echo.
echo Your project should now have proper styling.
echo Run 'npm start' to test locally.
echo.
pause 