@echo off
echo ========================================
echo AI Workflow Builder - Deployment Setup
echo ========================================
echo.

echo Cleaning up old files...
cd client
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
echo.

echo Installing dependencies...
npm install
echo.

echo Building the project...
npm run build
echo.

echo ========================================
echo Setup complete!
echo ========================================
echo.
echo Next steps:
echo 1. Commit and push your changes
echo 2. Deploy to Vercel
echo.
pause 