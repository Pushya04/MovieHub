# 🎬 MovieHub - Movie Discovery & Sentiment Analysis Platform

A comprehensive movie discovery platform built with modern web technologies, featuring movie recommendations, user reviews, sentiment analysis, and personalized watchlists.

![MovieHub](https://img.shields.io/badge/MovieHub-Platform-blue?style=for-the-badge&logo=movie)
![React](https://img.shields.io/badge/React-18.0+-61DAFB?style=for-the-badge&logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.68+-009688?style=for-the-badge&logo=fastapi)
![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1?style=for-the-badge&logo=mysql)

## 🌟 Features

### Core Functionality
- **Movie Discovery**: Browse movies by genre, search, and get personalized recommendations
- **User Authentication**: Secure login/registration system with JWT tokens
- **Watchlist Management**: Add/remove movies to personal watchlists
- **Review System**: Rate and review movies with sentiment analysis
- **Genre Filtering**: Filter movies by multiple genres with smooth navigation
- **Responsive Design**: Mobile-first design that works on all devices

### Advanced Features
- **Sentiment Analysis**: AI-powered sentiment analysis of movie reviews
- **Movie Analytics**: Detailed movie statistics and insights
- **Social Features**: Share reviews, follow other users, and discover content
- **Real-time Updates**: Live updates for reviews and ratings
- **Search & Filter**: Advanced search with multiple filter options

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **Vite** - Fast build tool and development server
- **CSS Modules** - Scoped CSS styling
- **React Router v6** - Client-side routing
- **Axios** - HTTP client for API calls
- **Context API** - State management

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM for database operations
- **MySQL** - Relational database
- **JWT** - JSON Web Token authentication
- **Pydantic** - Data validation and serialization
- **Uvicorn** - ASGI server

### Database
- **MySQL** - Primary database server
- **SQLAlchemy ORM** - Database abstraction layer
- **Alembic** - Database migrations

### AI/ML
- **NLTK** - Natural language processing
- **scikit-learn** - Machine learning algorithms
- **TextBlob** - Sentiment analysis
- **Pandas** - Data manipulation

### DevOps & Tools
- **Git** - Version control
- **GitHub Actions** - CI/CD pipeline
- **Docker** - Containerization ready
- **Environment Variables** - Configuration management

## 📁 Project Structure

```
MovieHub/
├── api/                          # Backend API
│   ├── core/                    # Core configurations
│   ├── crud/                    # Database operations
│   ├── db/                      # Database setup & models
│   ├── models/                  # SQLAlchemy models
│   ├── routes/                  # API endpoints
│   ├── schemas/                 # Pydantic schemas
│   ├── services/                # Business logic
│   └── main.py                  # FastAPI application
├── frontend/                     # React frontend
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   ├── pages/               # Page components
│   │   ├── context/             # React context
│   │   ├── hooks/               # Custom hooks
│   │   ├── api/                 # API integration
│   │   ├── assets/              # Images and static files
│   │   └── styles/              # Global styles
│   ├── public/                  # Public assets
│   └── package.json             # Dependencies
├── data/                         # Data files and scripts
├── requirements.txt              # Python dependencies
├── setup.py                      # Project setup
└── README.md                     # This file
```

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- MySQL 8.0+
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/Pushya04/MovieHub.git
cd MovieHub
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd api

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo "DATABASE_URL=mysql://username:password@localhost:3306/moviehub
SECRET_KEY=your-super-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30" > .env

# Start backend server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_BASE_URL=http://localhost:8000" > .env

# Start development server
npm run dev
```

### 4. Database Setup
```sql
-- Create database
CREATE DATABASE moviehub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user (replace with your credentials)
CREATE USER 'moviehub_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON moviehub.* TO 'moviehub_user'@'localhost';
FLUSH PRIVILEGES;
```

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```env
DATABASE_URL=mysql://username:password@localhost:3306/moviehub
SECRET_KEY=your-super-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

**Frontend (.env)**
```env
VITE_API_BASE_URL=http://localhost:8000
```

### Database Configuration

Update `api/core/config.py` with your MySQL credentials:
```python
DATABASE_URL = "mysql://username:password@localhost:3306/moviehub"
```

## 📊 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout

### Movies
- `GET /movies/` - Get all movies
- `GET /movies/{id}` - Get movie details
- `GET /movies/by-genre/{genre_id}` - Get movies by genre
- `GET /movies/search` - Search movies

### Watchlist
- `GET /watchlists` - Get user watchlist
- `POST /watchlists` - Add movie to watchlist
- `DELETE /watchlists/{id}` - Remove movie from watchlist

### Reviews
- `GET /movies/{id}/comments` - Get movie reviews
- `POST /movies/{id}/comments` - Add review
- `PUT /movies/{id}/comments/{comment_id}` - Update review
- `DELETE /movies/{id}/comments/{comment_id}` - Delete review

## 🎯 Key Features Implementation

### Genre Selection & Navigation
- Smooth scrolling to movies section
- URL-based state management
- Responsive genre carousel
- Real-time filtering

### Watchlist Management
- Add/remove movies seamlessly
- Persistent user preferences
- Real-time updates
- Mobile-optimized interface

### Sentiment Analysis
- AI-powered review analysis
- Emotion detection
- Sentiment scoring
- Visual sentiment indicators

## 🌐 Deployment Guide

### Backend Deployment (Railway - Recommended)

1. **Go to [railway.app](https://railway.app)**
2. **Sign up with GitHub**
3. **Click "New Project" → "Deploy from GitHub repo"**
4. **Choose your MovieHub repository**
5. **Set environment variables:**
   ```env
   DATABASE_URL=your-mysql-connection-string
   SECRET_KEY=your-production-secret-key
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   CORS_ORIGINS=https://your-frontend-domain.vercel.app
   ```
6. **Build Command:** `pip install -r requirements.txt`
7. **Start Command:** `gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker`

### Frontend Deployment (Vercel - Recommended)

1. **Go to [vercel.com](https://vercel.com)**
2. **Sign up with GitHub**
3. **Click "New Project" → Import MovieHub repository**
4. **Set environment variables:**
   ```env
   VITE_API_BASE_URL=https://your-backend-url.railway.app
   VITE_APP_NAME=MovieHub
   VITE_APP_VERSION=1.0.0
   ```
5. **Build Settings:**
   - Framework Preset: Vite
   - Build Command: `cd frontend && npm install && npm run build`
   - Output Directory: `frontend/dist`
   - Install Command: `cd frontend && npm install`

### Database Setup (Railway MySQL)

1. **In Railway dashboard, click "New"**
2. **Select "Database" → "MySQL"**
3. **Copy connection string**
4. **Update backend environment variables**

### Alternative Hosting Options

**Backend:**
- **Render**: [render.com](https://render.com)
- **Heroku**: [heroku.com](https://heroku.com)
- **AWS**: [aws.amazon.com](https://aws.amazon.com)

**Frontend:**
- **Netlify**: [netlify.com](https://netlify.com)
- **GitHub Pages**: Built into GitHub
- **AWS S3**: For static hosting

**Database:**
- **PlanetScale**: [planetscale.com](https://planetscale.com) (Free tier)
- **AWS RDS**: Managed MySQL
- **Google Cloud SQL**: Managed MySQL

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- CORS protection
- SQL injection prevention
- XSS protection
- Environment variable security

## 📱 Mobile Optimization

- Responsive design
- Touch-friendly interface
- Progressive Web App (PWA) ready
- Mobile-first approach
- Optimized for all screen sizes

## 🎨 UI/UX Features

- Modern, clean design
- Dark theme with red accent colors
- Smooth animations and transitions
- Intuitive navigation
- Consistent component design
- Accessibility features

## 📊 Performance Features

- Code splitting
- Lazy loading
- Image optimization
- Efficient API calls
- Caching strategies
- Debounced search

## 🚀 Production Deployment

### 1. Prepare Backend for Production
```bash
cd api
pip install gunicorn uvicorn[standard]
pip freeze > requirements-prod.txt
```

### 2. Build Frontend for Production
```bash
cd frontend
npm run build
```

### 3. Environment Setup
```bash
# Backend
export DATABASE_URL="your-production-db-url"
export SECRET_KEY="your-production-secret"
export CORS_ORIGINS="https://your-frontend-domain.com"

# Frontend
export VITE_API_BASE_URL="https://your-backend-domain.com"
```

### 4. Run with Gunicorn
```bash
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

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

## 📊 Analytics & Monitoring

### Setup Analytics
```bash
# Install analytics
npm install @vercel/analytics
# or
npm install gtag
```

### Monitoring Tools
- **Uptime**: UptimeRobot, Pingdom
- **Performance**: Lighthouse, WebPageTest
- **Errors**: Sentry, LogRocket
- **Analytics**: Google Analytics, Mixpanel

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Pyaraka Pushyamithra**
- GitHub: [@Pushya04](https://github.com/Pushya04)
- LinkedIn: [Pushyamithra](https://www.linkedin.com/in/pushya04/)
- Email: moviehubflix01@gmail.com

## 📞 Support

If you have any questions or need help:
- Email: moviehubflix01@gmail.com
- Phone: +91 9347967884
- Office: IIIT Guwahati, Bongora 781015, Assam, India

## 🙏 Acknowledgments

- Movie data sources and APIs
- Open-source community contributions
- IIIT Guwahati for academic support

## 🎉 Project Status

- ✅ **Frontend**: Complete with all pages and components
- ✅ **Backend**: Complete with all API endpoints
- ✅ **Database**: Models and schemas ready
- ✅ **Authentication**: JWT system implemented
- ✅ **UI/UX**: Modern, responsive design
- ✅ **Features**: All core functionality working
- 🚧 **Deployment**: Ready for hosting setup

---

## 🎯 **Ready for Production Deployment!**

Your MovieHub project is a complete, production-ready application that showcases modern web development skills and provides a great user experience for movie discovery and sentiment analysis.

**🚀 Deploy now and share your project with the world!**

---

**Made with ❤️ by Pyaraka Pushyamithra**
