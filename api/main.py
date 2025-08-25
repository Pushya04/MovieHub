from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .db.database_setup import Base, engine

# Create all database tables before starting the app
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app with metadata for better documentation
app = FastAPI(
    title="Movie API",
    description="Comprehensive Movie Database API with User Authentication and Social Features",
    version="1.0",
    openapi_tags=[
        {
            "name": "auth",
            "description": "User authentication and authorization operations"
        },
        {
            "name": "movies",
            "description": "Main movie operations and filtering"
        },
        {
            "name": "comments",
            "description": "User comments management"
        }
    ]
)

# Configure CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],  # Allowed HTTP methods
    allow_headers=["*"],  # Allowed headers
    expose_headers=["*"],  # Headers to expose to frontend
    max_age=3600  # Cache preflight requests for 1 hour
)

# Import and include all routers for endpoint functionality
from .routes.auth import router as auth_router
from .routes.movies import router as movies_router
from .routes.comments import router as comments_router
from .routes.sentiment import router as sentiment_router
from .routes.watchlists import router as watchlists_router

app.include_router(auth_router)
app.include_router(movies_router)
app.include_router(comments_router)
app.include_router(sentiment_router)
app.include_router(watchlists_router)

# Root endpoint for a welcome message
@app.get("/", include_in_schema=False)
def read_root():
    return {
        "message": "Welcome to Movie API",
        "documentation": "/docs",
        "redoc": "/redoc"
    }