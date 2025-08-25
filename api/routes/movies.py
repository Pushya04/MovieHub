from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import Optional, List
from ..db.session import get_db
from ..db.database_setup import Movie, Genre, Person, MoviePerson, Comment
from ..schemas.movie import MovieOut, MovieFilterParams, ImageOut
from ..schemas.provider import ProviderOut
from ..services.movie_service import (
    get_movie_by_id,
    get_movies_by_genre,
    get_movies_by_director,
    get_movies_by_actor,
    get_movies_by_year,
    get_movies_with_filters,
    search_movies,
    format_movie
)

router = APIRouter(prefix="/movies", tags=["movies"])

@router.get("/{movie_id}/images", response_model=List[ImageOut])
def get_movie_images(movie_id: int, db: Session = Depends(get_db)):
    movie = db.query(Movie).filter(Movie.id == movie_id).first()
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    # Explicitly map image_type to type
    return [
        {"id": img.id, "url": img.url}
        for img in movie.images
    ]

@router.get("/genres/", response_model=list[dict])
def get_all_genres(db: Session = Depends(get_db)):
    genres = db.query(Genre).all()
    return [{"id": genre.id, "name": genre.name} for genre in genres]

@router.get("/{movie_id}/providers", response_model=list[ProviderOut])
def get_movie_providers(movie_id: int, db: Session = Depends(get_db)):
    movie = (
        db.query(Movie)
        .options(joinedload(Movie.providers))
        .filter(Movie.id == movie_id)
        .first()
    )
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    return movie.providers

@router.get("/{movie_id}", response_model=MovieOut)
def get_movie(movie_id: int, db: Session = Depends(get_db)):
    movie = (
        db.query(Movie)
        .options(
            joinedload(Movie.genres),
            joinedload(Movie.people).joinedload(MoviePerson.person),
            joinedload(Movie.comments).joinedload(Comment.user),
            joinedload(Movie.images)
        )
        .filter(Movie.id == movie_id)
        .first()
    )
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    return format_movie(movie)

@router.get("/by-genre/{genre_id}", response_model=list[MovieOut])
def get_movies_by_genre_route(genre_id: int, db: Session = Depends(get_db)):
    movies = get_movies_by_genre(db, genre_id)
    if not movies:
        raise HTTPException(status_code=404, detail="No movies found for this genre")
    return movies

@router.get("/by-director/{director_name}", response_model=list[MovieOut])
def get_movies_by_director_route(director_name: str, db: Session = Depends(get_db)):
    movies = get_movies_by_director(db, director_name)
    if not movies:
        raise HTTPException(status_code=404, detail="No movies found for this director")
    return movies

@router.get("/by-actor/{actor_name}", response_model=list[MovieOut])
def get_movies_by_actor_route(actor_name: str, db: Session = Depends(get_db)):
    movies = get_movies_by_actor(db, actor_name)
    if not movies:
        raise HTTPException(status_code=404, detail="No movies found for this actor")
    return movies

@router.get("/by-year/{year}", response_model=list[MovieOut])
def get_movies_by_year_route(year: int, db: Session = Depends(get_db)):
    movies = get_movies_by_year(db, year)
    if not movies:
        raise HTTPException(status_code=404, detail="No movies found for this year")
    return movies

@router.get("/search/{query}", response_model=list[MovieOut])
def search_movies_route(query: str, db: Session = Depends(get_db)):
    movies = search_movies(db, query)
    if not movies:
        raise HTTPException(status_code=404, detail="No movies found matching your search")
    return movies

@router.get("/", response_model=list[MovieOut])
def get_filtered_movies(
    year: Optional[int] = None,
    director: Optional[str] = None,
    actor: Optional[str] = None,
    genre: Optional[str] = None,
    min_rating: Optional[float] = None,
    search: Optional[str] = None,
    sort_by: str = "imdb_rating",
    sort_order: str = "desc",
    limit: int = 100,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    filters = {
        "year": year,
        "director": director,
        "actor": actor,
        "genre": genre,
        "min_rating": min_rating,
        "search": search,
        "sort_by": sort_by,
        "sort_order": sort_order,
        "limit": limit,
        "offset": offset
    }
    movies = get_movies_with_filters(db, filters)
    if not movies:
        raise HTTPException(status_code=404, detail="No movies found matching your criteria")
    return movies