from pydantic import BaseModel
from datetime import datetime
from .user import UserOut

class ReviewBase(BaseModel):
    content: str
    rating: float

class ReviewCreate(ReviewBase):
    movie_id: int

class ReviewOut(ReviewBase):
    id: int
    created_at: datetime
    user: UserOut

    class Config:
        from_attributes = True