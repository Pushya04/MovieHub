@echo off
echo 🚀 Building frontend for production...

echo 📦 Installing dependencies...
call npm install

echo 🔨 Building project...
call npm run build

if %ERRORLEVEL% EQU 0 (
    echo ✅ Build successful! Files are in the 'dist' directory.
    echo 📁 Build output:
    dir dist
) else (
    echo ❌ Build failed!
    pause
    exit /b 1
)

pause
