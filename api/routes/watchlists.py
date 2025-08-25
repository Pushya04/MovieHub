from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.orm import Session, joinedload

from ..db.session import get_db
from ..db.database_setup import Watchlist, User, Movie, Image
from ..schemas.watchlist import WatchlistResponse, WatchlistCreate
from ..core.security import get_current_user
from typing import List

router = APIRouter(prefix="/watchlists", tags=["watchlists"])

@router.post("", response_model=WatchlistResponse, status_code=status.HTTP_201_CREATED)
def add_to_watchlist(
    watchlist_data: WatchlistCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    movie_id = watchlist_data.movie_id
    
    # Check if movie exists
    movie = db.query(Movie).filter(Movie.id == movie_id).first()
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    
    # Check if already in watchlist
    existing = db.query(Watchlist).filter(
        Watchlist.user_id == current_user.id,
        Watchlist.movie_id == movie_id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Movie already in watchlist")

    # Add to watchlist
    watchlist_item = Watchlist(user_id=current_user.id, movie_id=movie_id)
    db.add(watchlist_item)
    
    try:
        db.commit()
        db.refresh(watchlist_item)
        
        # Get genre from the first genre in the relationship, or use a default
        genre_name = "Unknown"
        if hasattr(movie, 'genres') and movie.genres and len(movie.genres) > 0:
            genre_name = movie.genres[0].name
        
        # Get poster image URL if available
        poster_path = None
        if hasattr(movie, 'images') and movie.images and len(movie.images) > 0:
            poster_path = movie.images[0].url
        
        # Get rating (prefer imdb_rating, fallback to predicted_rating)
        rating = movie.imdb_rating if movie.imdb_rating is not None else movie.predicted_rating
        
        # Return watchlist item with movie details
        return {
            "id": watchlist_item.id,
            "movie_id": watchlist_item.movie_id,
            "user_id": watchlist_item.user_id,
            "created_at": watchlist_item.created_at,
            "movie": {
                "id": movie.id,
                "title": movie.title,
                "genre": genre_name,
                "poster_path": poster_path,
                "release_date": movie.release_date,
                "rating": rating
            }
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to add movie to watchlist")

@router.get("", response_model=List[WatchlistResponse])
def get_watchlist(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get the current user's watchlist with movie details"""
    try:
        # Get watchlist items with movie details using explicit join and eager loading
        watchlist_items = db.query(Watchlist, Movie).join(
            Movie, Watchlist.movie_id == Movie.id
        ).options(
            joinedload(Movie.genres),
            joinedload(Movie.images)
        ).filter(Watchlist.user_id == current_user.id).all()
        
        result = []
        for item, movie in watchlist_items:
            # Get genre from the first genre in the relationship, or use a default
            genre_name = "Unknown"
            if hasattr(movie, 'genres') and movie.genres and len(movie.genres) > 0:
                genre_name = movie.genres[0].name
            
            # Get poster image URL if available
            poster_path = None
            if hasattr(movie, 'images') and movie.images and len(movie.images) > 0:
                poster_path = movie.images[0].url
            
            # Get rating (prefer imdb_rating, fallback to predicted_rating)
            rating = movie.imdb_rating if movie.imdb_rating is not None else movie.predicted_rating
            
            watchlist_item = {
                "id": item.id,
                "movie_id": item.movie_id,
                "user_id": item.user_id,
                "created_at": item.created_at,
                "movie": {
                    "id": movie.id,
                    "title": movie.title,
                    "genre": genre_name,
                    "poster_path": poster_path,
                    "release_date": movie.release_date,
                    "rating": rating
                }
            }
            result.append(watchlist_item)
        
        return result
    except Exception as e:
        print(f"Error in get_watchlist: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch watchlist")

@router.delete("/{movie_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_from_watchlist(
    movie_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    watchlist_item = db.query(Watchlist).filter(
        Watchlist.user_id == current_user.id,
        Watchlist.movie_id == movie_id
    ).first()
    
    if not watchlist_item:
        raise HTTPException(status_code=404, detail="Movie not found in watchlist")
    
    db.delete(watchlist_item)
    db.commit()
    return None

@router.get("/stats", status_code=status.HTTP_200_OK)
def get_watchlist_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get watchlist statistics for the current user"""
    try:
        # Count total movies in watchlist
        total_watchlist = db.query(Watchlist).filter(
            Watchlist.user_id == current_user.id
        ).count()
        
        # You can add more stats here like watched movies, etc.
        # For now, we'll just return basic stats
        
        return {
            "total_watchlist": total_watchlist,
            "watched": 0,  # Placeholder for future implementation
            "user_id": current_user.id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to get watchlist statistics")