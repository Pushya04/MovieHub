@echo off
echo.
echo ==========================================
echo           MovieHub Setup Script
echo ==========================================
echo.

REM Check if Git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git is not installed. Please download from https://git-scm.com/downloads
    pause
    exit /b 1
)
echo ✅ Git is installed

REM Check if running from correct directory
if not exist "api" (
    echo ❌ Please run this script from the MovieHub project root directory
    pause
    exit /b 1
)
echo ✅ Running from correct directory

echo.
echo 🔧 Initializing Git repository...
if exist ".git" (
    echo ℹ️  Git repository already exists
) else (
    git init
    echo ✅ Git repository initialized
)

echo.
echo 🔗 Setting up GitHub remote...
git remote remove origin 2>nul
git remote add origin https://github.com/Pushya04/MovieHub.git
echo ✅ GitHub remote origin set

echo.
echo 📝 Creating environment files...
if not exist "api\.env" (
    echo DATABASE_URL=mysql://username:password@localhost:3306/moviehub > api\.env
    echo SECRET_KEY=your-super-secret-key-here >> api\.env
    echo ALGORITHM=HS256 >> api\.env
    echo ACCESS_TOKEN_EXPIRE_MINUTES=30 >> api\.env
    echo ✅ Created api\.env
) else (
    echo ℹ️  api\.env already exists
)

if not exist "frontend\.env" (
    echo VITE_API_BASE_URL=http://localhost:8000 > frontend\.env
    echo ✅ Created frontend\.env
) else (
    echo ℹ️  frontend\.env already exists
)

echo.
echo 📦 Adding files to Git...
git add .
echo ✅ Files added to Git

echo.
echo 💾 Making initial commit...
git commit -m "Initial commit: MovieHub project with React frontend and FastAPI backend"
echo ✅ Initial commit created

echo.
echo ==========================================
echo           IMPORTANT: READ THIS!
echo ==========================================
echo.
echo ❌ BEFORE PUSHING: You MUST create the repository on GitHub first!
echo.
echo 📋 Steps to create repository on GitHub:
echo    1. Go to https://github.com and sign in
echo    2. Click the + icon → New repository
echo    3. Repository name: MovieHub
echo    4. Make it Public
echo    5. Click Create repository
echo.
echo 🚀 After creating the repository on GitHub, run:
echo    git push -u origin main
echo.
echo ==========================================
echo.
echo 🎉 Local setup complete!
echo.
echo Next steps:
echo 1. Create repository on GitHub (see above)
echo 2. Run: git push -u origin main
echo 3. Update your .env files with real credentials
echo 4. Test your application locally
echo 5. Deploy to hosting services
echo.
pause
