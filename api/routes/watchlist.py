from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..dependencies import get_db
from ..models.user import User
from ..models.watchlist import Watchlist
from ..models.movie import Movie
from ..schemas.watchlist import WatchlistCreate, WatchlistResponse, MovieInWatchlist
from ..core.security import get_current_user

router = APIRouter()

@router.get("/api/watchlist", response_model=List[WatchlistResponse])
async def get_watchlist(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get the current user's watchlist"""
    # Get watchlist items
    watchlist_items = db.query(Watchlist).filter(Watchlist.user_id == current_user.id).all()
    
    # For each watchlist item, get the corresponding movie details
    for item in watchlist_items:
        # Get movie details from the database or external API
        # This is a placeholder - adjust based on your movie data source
        movie_data = db.query(Movie).filter(Movie.id == item.movie_id).first()
        if movie_data:
            item.movie = MovieInWatchlist(
                id=movie_data.id,
                title=movie_data.title,
                genre=movie_data.genre,
                poster_path=movie_data.poster_path,
                release_date=movie_data.release_date
            )
    
    return watchlist_items

@router.post("/api/watchlist/{movie_id}")
async def add_to_watchlist(
    movie_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add a movie to the user's watchlist"""
    # Check if movie is already in watchlist
    existing = db.query(Watchlist).filter(
        Watchlist.user_id == current_user.id,
        Watchlist.movie_id == movie_id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Movie already in watchlist")
    
    watchlist_item = Watchlist(
        user_id=current_user.id,
        movie_id=movie_id
    )
    db.add(watchlist_item)
    db.commit()
    db.refresh(watchlist_item)
    return watchlist_item

@router.delete("/api/watchlist/{movie_id}")
async def remove_from_watchlist(
    movie_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove a movie from the user's watchlist"""
    watchlist_item = db.query(Watchlist).filter(
        Watchlist.user_id == current_user.id,
        Watchlist.movie_id == movie_id
    ).first()
    
    if not watchlist_item:
        raise HTTPException(status_code=404, detail="Movie not found in watchlist")
    
    db.delete(watchlist_item)
    db.commit()
    return {"status": "success", "message": "Movie removed from watchlist"}
