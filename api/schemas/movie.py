from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from .genre import GenreOut
from .person import PersonOut
from .comment import CommentOut
from .provider import ProviderOut

class MovieBase(BaseModel):
    title: str
    year: Optional[int] = None
    run_length: Optional[str] = None
    release_date: Optional[datetime] = None
    synopsis: Optional[str] = None
    trailer_url: Optional[str] = None
    imdb_rating: Optional[float] = Field(None, ge=0, le=10)
    predicted_rating: Optional[float] = Field(None, ge=0, le=10)
    num_raters: Optional[int] = 0
    num_reviews: Optional[int] = 0

class ImageOut(BaseModel):
    id: int
    url: str
    class Config:
        from_attributes = True

class MovieCreate(MovieBase):
    pass

class MovieUpdate(MovieBase):
    pass

class MovieOut(MovieBase):
    id: int
    genres: List[GenreOut] = []
    people: List[PersonOut] = []
    comments: List[CommentOut] = []
    images: List[ImageOut] = []
    providers: List[ProviderOut] = []

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": 1,
                "title": "The Dark Knight",
                "year": 2008,
                "run_length": "152 min",
                "release_date": "2008-07-18",
                "synopsis": "When the menace known as the Joker wreaks havoc...",
                "trailer_url": "https://youtube.com/watch?v=EXeTwQWrcwY",
                "imdb_rating": 9.0,
                "genres": [{"id": 1, "name": "Action"}],
                "people": [{"id": 1, "name": "Christopher Nolan", "role": "Director"}],
                "comments": [],
                "images": [{"id": 1, "url": "/images/poster.jpg", "type": "poster"}]
            }
        }

class MovieFilterParams(BaseModel):
    year: Optional[int] = None
    director: Optional[str] = None
    actor: Optional[str] = None
    genre: Optional[str] = None
    min_rating: Optional[float] = Field(None, ge=0, le=10)
    search: Optional[str] = None
    sort_by: str = "imdb_rating"
    sort_order: str = "desc"
    limit: int = 100
    offset: int = 0