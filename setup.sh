#!/bin/bash

# MovieHub Setup Script
# This script will help you set up your project for GitHub

echo "🎬 MovieHub Setup Script"
echo "=========================="

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "README.md" ]; then
    echo "❌ Please run this script from the MovieHub project root directory"
    exit 1
fi

echo "✅ Git is installed"
echo "✅ Running from correct directory"

# Initialize git repository
echo "🔧 Initializing Git repository..."
git init

# Add remote origin
echo "🔗 Adding GitHub remote origin..."
git remote add origin https://github.com/Pushya04/MovieHub.git

# Create .env files if they don't exist
echo "📝 Creating environment files..."

# Backend .env
if [ ! -f "api/.env" ]; then
    cat > api/.env << EOF
DATABASE_URL=mysql://username:password@localhost:3306/moviehub
SECRET_KEY=your-super-secret-key-here-make-it-long-and-random
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
EOF
    echo "✅ Created api/.env"
else
    echo "ℹ️  api/.env already exists"
fi

# Frontend .env
if [ ! -f "frontend/.env" ]; then
    cat > frontend/.env << EOF
VITE_API_BASE_URL=http://localhost:8000
EOF
    echo "✅ Created frontend/.env"
else
    echo "ℹ️  frontend/.env already exists"
fi

# Add all files to git
echo "📦 Adding files to Git..."
git add .

# Make initial commit
echo "💾 Making initial commit..."
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

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push -u origin main

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update your .env files with real credentials"
echo "2. Test your application locally"
echo "3. Deploy to hosting services (see DEPLOYMENT.md)"
echo ""
echo "Your repository is now available at:"
echo "https://github.com/Pushya04/MovieHub"
echo ""
echo "Happy coding! 🚀"
