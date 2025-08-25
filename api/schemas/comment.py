from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from typing import Optional
from .user import UserOut

class CommentBase(BaseModel):
    # Keep the alias to match the database column
    content: str = Field(..., min_length=1, max_length=500, alias="text")

class CommentCreate(CommentBase):
    pass

class CommentUpdate(CommentBase):
    pass

class CommentOut(BaseModel):
    id: int
    user_id: int
    movie_id: int
    # Use alias to map between 'text' in database and 'content' in API
    content: str = Field(alias="text")
    created_at: datetime
    updated_at: Optional[datetime] = None
    likes: int = 0
    user: UserOut

    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True
    )