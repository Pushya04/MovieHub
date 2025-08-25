# database_setup.py
import datetime
from sqlalchemy import Boolean, DateTime, create_engine, Column, Integer, String, Float, Text, ForeignKey, UniqueConstraint, Table
from sqlalchemy.orm import sessionmaker, relationship, declarative_base
from sqlalchemy.sql import func
from sqlalchemy.schema import CreateSequence, DropSequence

# Configure database URL with proper encoding
DATABASE_URL = "mysql+pymysql://root:Bantu%4012@localhost:3306/movie_data"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Association table for comment likes
comment_likes = Table(
    'comment_likes',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id'), primary_key=True),
    Column('comment_id', Integer, ForeignKey('comments.id'), primary_key=True)
)

class MovieGenre(Base):
    __tablename__ = 'movie_genre'
    movie_id = Column(Integer, ForeignKey('movies.id'), primary_key=True)
    genre_id = Column(Integer, ForeignKey('genres.id'), primary_key=True)

class MoviePerson(Base):
    __tablename__ = 'movie_person'
    id = Column(Integer, primary_key=True)
    movie_id = Column(Integer, ForeignKey('movies.id'))
    person_id = Column(Integer, ForeignKey('people.id'))
    role = Column(String(50))
    
    __table_args__ = (
        UniqueConstraint('movie_id', 'person_id', 'role', name='uq_movie_person_role'),
    )

class Genre(Base):
    __tablename__ = "genres"
    id = Column(Integer, primary_key=True)
    name = Column(String(50), unique=True)
    movies = relationship("Movie", secondary="movie_genre", back_populates="genres")

class Person(Base):
    __tablename__ = "people"
    id = Column(Integer, primary_key=True)
    name = Column(String(100), unique=True)
    movie_roles = relationship("MoviePerson", backref="person")

class Movie(Base):
    __tablename__ = "movies"
    id = Column(Integer, primary_key=True)
    title = Column(String(200), index=True)
    year = Column(Integer)
    run_length = Column(String(50))
    release_date = Column(String(50))
    synopsis = Column(Text)
    trailer_url = Column(String(500))
    imdb_rating = Column(Float)
    predicted_rating = Column(Float)
    num_raters = Column(Integer)
    num_reviews = Column(Integer)
    
    genres = relationship("Genre", secondary="movie_genre", back_populates="movies")
    people = relationship("MoviePerson", backref="movie")
    images = relationship("Image", back_populates="movie")
    providers = relationship("WatchProvider", back_populates="movie")
    reviews = relationship("Review", back_populates="movie")
    comments = relationship("Comment", back_populates="movie")

class Image(Base):
    __tablename__ = "images"
    id = Column(Integer, primary_key=True)
    url = Column(String(500))
    movie_id = Column(Integer, ForeignKey('movies.id'))
    movie = relationship("Movie", back_populates="images")

class WatchProvider(Base):
    __tablename__ = "providers"
    id = Column(Integer, primary_key=True)
    url = Column(String(500))
    movie_id = Column(Integer, ForeignKey('movies.id'))
    movie = relationship("Movie", back_populates="providers")

class Review(Base):
    __tablename__ = "reviews"
    id = Column(Integer, primary_key=True)
    content = Column(Text)
    rating = Column(Float)
    username = Column(String(100))
    movie_id = Column(Integer, ForeignKey('movies.id'))
    movie = relationship("Movie", back_populates="reviews")

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    email = Column(String(255), unique=True, index=True)
    username = Column(String(50), unique=True, index=True)
    hashed_password = Column(String(255))
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    watchlists = relationship("Watchlist", back_populates="user", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="user", cascade="all, delete-orphan")

class Watchlist(Base):
    __tablename__ = "watchlists"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete="CASCADE"))
    movie_id = Column(Integer, ForeignKey('movies.id'))
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    user = relationship("User", back_populates="watchlists")
    movie = relationship("Movie")

class PasswordResetOTP(Base):
    __tablename__ = "password_reset_otps"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), index=True)
    otp = Column(String(6))
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    expires_at = Column(DateTime)
    used = Column(Boolean, default=False)

class Comment(Base):
    __tablename__ = "comments"
    id = Column(Integer, primary_key=True, autoincrement=True)
    text = Column(Text, nullable=False)
    user_id = Column(Integer, ForeignKey('users.id', ondelete="CASCADE"))
    movie_id = Column(Integer, ForeignKey('movies.id'))
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, onupdate=datetime.datetime.utcnow)
    likes = Column(Integer, default=0)

    user = relationship("User", back_populates="comments")
    movie = relationship("Movie", back_populates="comments")
    liked_by = relationship("User", secondary=comment_likes, backref="liked_comments")

def verify_database():
    """Create tables if they don't exist and verify connection"""
    try:
        # Only create tables that don't exist
        Base.metadata.create_all(bind=engine, checkfirst=True)
        
        print("✅ Database schema verified successfully")
        with engine.connect() as conn:
            print(f"🔗 Connected to: {engine.url}")
            print(f"🔐 Using user: {engine.url.username}")
            print(f"🌐 Host: {engine.url.host}")
            print(f"🗃️ Database: {engine.url.database}")
            
            # Use SQLAlchemy text() for raw SQL execution
            from sqlalchemy import text
            result = conn.execute(text(
                f"SELECT table_name FROM information_schema.tables WHERE table_schema='{engine.url.database}'"
            )).fetchall()
            print("📊 Existing tables:", [row[0] for row in result])
    except Exception as e:
        print(f"❌ Database verification failed: {str(e)}")
        print("\nTroubleshooting steps:")
        print("1. Check if tables already exist in the database")
        print("2. Ensure MySQL server is running")
        print("3. Verify database connection credentials")
        print("4. Confirm pymysql is installed")
        raise
    
if __name__ == "__main__":
    print("🚀 Checking database schema...")
    verify_database()
    print("🎉 Database schema is up-to-date!")