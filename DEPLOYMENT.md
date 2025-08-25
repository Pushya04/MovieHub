# 🚀 MovieHub Deployment Guide

This guide will walk you through deploying your MovieHub project to GitHub and then hosting it online.

## 📋 Prerequisites

- Git installed on your machine
- GitHub account: [@Pushya04](https://github.com/Pushya04)
- Node.js 16+ installed
- Python 3.8+ installed
- MySQL database server (local or cloud)

## 🔄 Step 1: Push to GitHub

### 1.1 Initialize Git Repository

```bash
# Navigate to your project directory
cd "C:/Users/pushy/OneDrive/Desktop/Major Project/Twitter Sentiment Analysis"

# Initialize git repository
git init

# Add your GitHub account as remote origin
git remote add origin https://github.com/Pushya04/MovieHub.git
```

### 1.2 Create .env files (Don't commit these!)

**Backend (.env) - Create in `api/` directory:**
```env
DATABASE_URL=mysql://username:password@localhost:3306/moviehub
SECRET_KEY=your-super-secret-key-here-make-it-long-and-random
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

**Frontend (.env) - Create in `frontend/` directory:**
```env
VITE_API_BASE_URL=http://localhost:8000
```

### 1.3 Stage and Commit Files

```bash
# Add all files to staging
git add .

# Make initial commit
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
git push -u origin main
```

### 1.4 Verify GitHub Repository

1. Go to [https://github.com/Pushya04](https://github.com/Pushya04)
2. You should see your new "MovieHub" repository
3. Verify all files are uploaded correctly

## 🌐 Step 2: Backend Deployment

### 2.1 Prepare Backend for Production

```bash
# Navigate to backend directory
cd api

# Install production dependencies
pip install gunicorn uvicorn[standard]

# Create production requirements
pip freeze > requirements-prod.txt
```

### 2.2 Backend Hosting Options

#### Option A: Railway (Recommended for beginners)
1. Go to [railway.app](https://railway.app)
2. Connect your GitHub account
3. Deploy from your MovieHub repository
4. Set environment variables in Railway dashboard
5. Railway will automatically deploy your FastAPI app

#### Option B: Render
1. Go to [render.com](https://render.com)
2. Connect GitHub and select MovieHub repository
3. Choose "Web Service"
4. Set build command: `pip install -r requirements.txt`
5. Set start command: `gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker`
6. Add environment variables

#### Option C: Heroku
1. Install Heroku CLI
2. Create new app: `heroku create moviehub-backend`
3. Add MySQL addon: `heroku addons:create cleardb:ignite`
4. Deploy: `git push heroku main`

### 2.3 Update Frontend API URL

After deploying backend, update your frontend `.env` file:
```env
VITE_API_BASE_URL=https://your-backend-url.railway.app
```

## 🎨 Step 3: Frontend Deployment

### 3.1 Build Frontend for Production

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Build for production
npm run build
```

### 3.2 Frontend Hosting Options

#### Option A: Vercel (Recommended)
1. Go to [vercel.com](https://vercel.com)
2. Connect GitHub account
3. Import MovieHub repository
4. Vercel will auto-detect React app
5. Set environment variables
6. Deploy automatically

#### Option B: Netlify
1. Go to [netlify.com](https://netlify.com)
2. Connect GitHub and select MovieHub repository
3. Set build command: `cd frontend && npm install && npm run build`
4. Set publish directory: `frontend/dist`
5. Add environment variables

#### Option C: GitHub Pages
1. In your GitHub repository, go to Settings > Pages
2. Source: Deploy from a branch
3. Branch: main, folder: /frontend/dist
4. Build and push your dist folder

## 🗄️ Step 4: Database Setup

### 4.1 Local MySQL Setup
```sql
-- Create database
CREATE DATABASE moviehub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user (replace with your credentials)
CREATE USER 'moviehub_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON moviehub.* TO 'moviehub_user'@'localhost';
FLUSH PRIVILEGES;
```

### 4.2 Cloud Database Options

#### Option A: PlanetScale (Free tier available)
1. Go to [planetscale.com](https://planetscale.com)
2. Create account and new database
3. Get connection string
4. Update backend environment variables

#### Option B: Railway Database
1. In Railway dashboard, create new MySQL database
2. Get connection string
3. Update backend environment variables

#### Option C: AWS RDS
1. Create MySQL RDS instance
2. Configure security groups
3. Get connection string
4. Update backend environment variables

## 🔧 Step 5: Environment Configuration

### 5.1 Backend Environment Variables
```env
DATABASE_URL=mysql://username:password@host:port/database
SECRET_KEY=your-production-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
CORS_ORIGINS=https://your-frontend-domain.com
```

### 5.2 Frontend Environment Variables
```env
VITE_API_BASE_URL=https://your-backend-domain.com
VITE_APP_NAME=MovieHub
VITE_APP_VERSION=1.0.0
```

## 🚀 Step 6: Final Deployment Steps

### 6.1 Test Your Deployment
1. **Backend**: Test API endpoints at `https://your-backend-url.com/docs`
2. **Frontend**: Verify all features work correctly
3. **Database**: Ensure data persistence
4. **Authentication**: Test login/register flow

### 6.2 Update README.md
Update your GitHub README with:
- Live demo links
- Deployment status
- Updated setup instructions

### 6.3 Monitor and Maintain
- Set up logging and monitoring
- Configure error tracking (Sentry)
- Set up CI/CD pipelines
- Regular security updates

## 📱 Step 7: Mobile Optimization

### 7.1 PWA Setup
```bash
# Install PWA dependencies
npm install workbox-webpack-plugin

# Build PWA
npm run build
```

### 7.2 Mobile Testing
- Test on various devices
- Verify responsive design
- Check touch interactions
- Test offline functionality

## 🔒 Step 8: Security & Performance

### 8.1 Security Checklist
- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] CORS properly configured
- [ ] JWT tokens secure
- [ ] SQL injection prevention
- [ ] XSS protection

### 8.2 Performance Optimization
- [ ] Image optimization
- [ ] Code splitting
- [ ] Lazy loading
- [ ] Caching strategies
- [ ] CDN setup

## 📊 Step 9: Analytics & Monitoring

### 9.1 Analytics Setup
```bash
# Install analytics
npm install @vercel/analytics
# or
npm install gtag
```

### 9.2 Monitoring Tools
- **Uptime**: UptimeRobot, Pingdom
- **Performance**: Lighthouse, WebPageTest
- **Errors**: Sentry, LogRocket
- **Analytics**: Google Analytics, Mixpanel

## 🎯 Success Checklist

- [ ] Repository pushed to GitHub
- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Database connected and working
- [ ] Authentication system functional
- [ ] All features working correctly
- [ ] Mobile responsive design
- [ ] Performance optimized
- [ ] Security measures implemented
- [ ] Documentation updated

## 🆘 Troubleshooting

### Common Issues:
1. **CORS errors**: Check backend CORS configuration
2. **Database connection**: Verify connection string and credentials
3. **Build failures**: Check Node.js and Python versions
4. **Environment variables**: Ensure all required vars are set
5. **Port conflicts**: Check if ports are available

### Get Help:
- Email: moviehubflix01@gmail.com
- GitHub Issues: Create issue in your repository
- Community: Stack Overflow, Reddit r/webdev

---

**🎉 Congratulations! Your MovieHub is now live on the internet!**

Share your project:
- LinkedIn: [@pushya04](https://www.linkedin.com/in/pushya04/)
- Portfolio: Add to your GitHub profile
- Resume: Include in your projects section
