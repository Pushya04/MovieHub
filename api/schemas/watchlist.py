from pydantic import BaseModel
from datetime import datetime

class WatchlistBase(BaseModel):
    movie_id: int

class WatchlistCreate(WatchlistBase):
    pass

class MovieInWatchlist(BaseModel):
    id: int
    title: str
    genre: str
    poster_path: str | None = None
    release_date: str | None = None
    rating: float | None = None

class WatchlistResponse(BaseModel):
    id: int
    movie_id: int
    user_id: int
    created_at: datetime
    movie: MovieInWatchlist | None = None
    
    class Config:
        from_attributes = True