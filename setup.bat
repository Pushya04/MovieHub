@echo off
chcp 65001 >nul
echo 🎬 MovieHub Setup Script
echo ==========================

REM Check if git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git is not installed. Please install Git first.
    pause
    exit /b 1
)

REM Check if we're in the right directory
if not exist "README.md" (
    echo ❌ Please run this script from the MovieHub project root directory
    pause
    exit /b 1
)

echo ✅ Git is installed
echo ✅ Running from correct directory

REM Initialize git repository
echo 🔧 Initializing Git repository...
git init

REM Add remote origin
echo 🔗 Adding GitHub remote origin...
git remote add origin https://github.com/Pushya04/MovieHub.git

REM Create .env files if they don't exist
echo 📝 Creating environment files...

REM Backend .env
if not exist "api\.env" (
    (
        echo DATABASE_URL=mysql://username:password@localhost:3306/moviehub
        echo SECRET_KEY=your-super-secret-key-here-make-it-long-and-random
        echo ALGORITHM=HS256
        echo ACCESS_TOKEN_EXPIRE_MINUTES=30
    ) > api\.env
    echo ✅ Created api\.env
) else (
    echo ℹ️  api\.env already exists
)

REM Frontend .env
if not exist "frontend\.env" (
    (
        echo VITE_API_BASE_URL=http://localhost:8000
    ) > frontend\.env
    echo ✅ Created frontend\.env
) else (
    echo ℹ️  frontend\.env already exists
)

REM Add all files to git
echo 📦 Adding files to Git...
git add .

REM Make initial commit
echo 💾 Making initial commit...
git commit -m "Initial commit: MovieHub - Movie Discovery & Sentiment Analysis Platform

Features:
- React frontend with modern UI/UX
- FastAPI backend with JWT authentication
- MySQL database integration
- Movie recommendations and watchlist
- Sentiment analysis for reviews
- Genre filtering and search
- Responsive design for all devices

Tech Stack:
- Frontend: React 18, Vite, CSS Modules
- Backend: FastAPI, SQLAlchemy, JWT
- Database: MySQL
- AI/ML: NLTK, scikit-learn, TextBlob"

REM Push to GitHub
echo 🚀 Pushing to GitHub...
git push -u origin main

echo.
echo 🎉 Setup complete!
echo.
echo Next steps:
echo 1. Update your .env files with real credentials
echo 2. Test your application locally
echo 3. Deploy to hosting services (see DEPLOYMENT.md)
echo.
echo Your repository is now available at:
echo https://github.com/Pushya04/MovieHub
echo.
echo Happy coding! 🚀
pause
