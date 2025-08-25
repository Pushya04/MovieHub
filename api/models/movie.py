from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime

from .base import Base

class Movie(Base):
    __tablename__ = "movies"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    overview = Column(Text)
    genre = Column(String(50))
    poster_path = Column(String(255))
    release_date = Column(String(10))  # Format: YYYY-MM-DD
    vote_average = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    class Config:
        orm_mode = True
