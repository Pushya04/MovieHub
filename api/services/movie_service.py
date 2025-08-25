from sqlalchemy.orm import Session, joinedload
from sqlalchemy import and_, desc, asc
from ..db.database_setup import Movie, Genre, Person, MoviePerson, Comment, Review, Image
from datetime import datetime, date
import re
from dateutil import parser  # Corrected import

def format_movie(movie: Movie) -> dict:
    """Format movie data with robust release date parsing."""
    release_date = None
    if movie.release_date:
        if isinstance(movie.release_date, str):
            # Remove noise like "(USA)" and extra whitespace
            cleaned = re.sub(r'\s*\(.*\)', '', movie.release_date).strip()
            try:
                # Parse using dateutil.parser
                parsed_date = parser.parse(cleaned)
                release_date = parsed_date.date()
            except (ValueError, OverflowError, TypeError):
                release_date = None
        elif isinstance(movie.release_date, date):
            release_date = movie.release_date
            
    # Handle None values for numeric fields
    imdb_rating = float(movie.imdb_rating) if movie.imdb_rating is not None else None
    predicted_rating = float(movie.predicted_rating) if movie.predicted_rating is not None else None

    return {
        "id": movie.id,
        "title": movie.title,
        "year": movie.year,
        "run_length": movie.run_length,
        "release_date": release_date.isoformat() if release_date else None,
        "synopsis": movie.synopsis,
        "trailer_url": movie.trailer_url,
        "imdb_rating": imdb_rating,
        "predicted_rating": predicted_rating,
        "num_raters": movie.num_raters,
        "num_reviews": movie.num_reviews,
        "genres": [{"id": g.id, "name": g.name} for g in movie.genres],
        "people": [
            {
                "id": mp.person.id,
                "name": mp.person.name,
                "role": mp.role
            } for mp in movie.people
        ],
        "comments": [
            {
                "id": c.id,
                "text": c.text,
                "likes": c.likes,
                "user_id": c.user_id,
                "movie_id": c.movie_id,
                "created_at": c.created_at.isoformat(),
                "updated_at": c.updated_at.isoformat() if c.updated_at else None,
                "user": {
                    "id": c.user.id,
                    "email": c.user.email,
                    "username": c.user.username,
                    "is_active": c.user.is_active,
                    "created_at": c.user.created_at.isoformat()
                }
            } for c in movie.comments
        ],
        "images": [
            {"id": img.id, "url": img.url} for img in movie.images
        ]
    }

def _base_query(db: Session):
    """Base query with all necessary joined loads"""
    return db.query(Movie).options(
        joinedload(Movie.genres),
        joinedload(Movie.people).joinedload(MoviePerson.person),
        joinedload(Movie.comments).joinedload(Comment.user),
        joinedload(Movie.images)
    )

def get_movie_by_id(db: Session, movie_id: int) -> dict | None:
    """Get single movie by ID with all relationships"""
    movie = _base_query(db).filter(Movie.id == movie_id).first()
    return format_movie(movie) if movie else None

def get_movies_by_genre(db: Session, genre_id: int) -> list[dict]:
    """Get movies by genre ID"""
    movies = _base_query(db)\
        .join(Movie.genres)\
        .filter(Genre.id == genre_id)\
        .all()
    return [format_movie(m) for m in movies]

def get_movies_by_director(db: Session, director_name: str) -> list[dict]:
    """Get movies by director name"""
    movies = _base_query(db)\
        .join(Movie.people)\
        .join(Person)\
        .filter(and_(
            Person.name.ilike(f"%{director_name}%"),
            MoviePerson.role == "director"
        ))\
        .all()
    return [format_movie(m) for m in movies]

def get_movies_by_actor(db: Session, actor_name: str) -> list[dict]:
    """Get movies by actor name"""
    movies = _base_query(db)\
        .join(Movie.people)\
        .join(Person)\
        .filter(and_(
            Person.name.ilike(f"%{actor_name}%"),
            MoviePerson.role == "actor"
        ))\
        .all()
    return [format_movie(m) for m in movies]

def get_movies_by_year(db: Session, year: int) -> list[dict]:
    """Get movies by release year"""
    movies = _base_query(db)\
        .filter(Movie.year == year)\
        .all()
    return [format_movie(m) for m in movies]

def search_movies(db: Session, query: str) -> list[dict]:
    """Search movies by title"""
    movies = _base_query(db)\
        .filter(Movie.title.ilike(f"%{query}%"))\
        .all()
    return [format_movie(m) for m in movies]

def get_movies_with_filters(db: Session, filters: dict) -> list[dict]:
    """Get movies with advanced filters"""
    query = _base_query(db)

    # Apply filters
    if filters.get('year'):
        query = query.filter(Movie.year == filters['year'])
    if filters.get('min_rating'):
        query = query.filter(Movie.imdb_rating >= filters['min_rating'])
    if filters.get('genre'):
        query = query.join(Movie.genres).filter(Genre.name.ilike(f"%{filters['genre']}%"))
    if filters.get('director'):
        query = query.join(Movie.people).join(Person).filter(and_(
            Person.name.ilike(f"%{filters['director']}%"),
            MoviePerson.role == "director"
        ))
    if filters.get('actor'):
        query = query.join(Movie.people).join(Person).filter(and_(
            Person.name.ilike(f"%{filters['actor']}%"),
            MoviePerson.role == "actor"
        ))
    if filters.get('search'):
        query = query.filter(Movie.title.ilike(f"%{filters['search']}%"))

    # Apply sorting
    sort_field = filters.get('sort_by', 'imdb_rating')
    sort_order = desc if filters.get('sort_order', 'desc') == 'desc' else asc
    sort_mapping = {
        'imdb_rating': Movie.imdb_rating,
        'year': Movie.year,
        'title': Movie.title,
        'release_date': Movie.release_date
    }
    
    if sort_field in sort_mapping:
        query = query.order_by(sort_order(sort_mapping[sort_field]))

    # Apply pagination
    if filters.get('limit'):
        query = query.limit(filters['limit'])
    if filters.get('offset'):
        query = query.offset(filters['offset'])

    return [format_movie(m) for m in query.all()]