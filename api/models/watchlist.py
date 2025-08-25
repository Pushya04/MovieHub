from sqlalchemy import Column, Integer, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship

from .base import Base

class Watchlist(Base):
    __tablename__ = "watchlists"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    movie_id = Column(Integer, ForeignKey("movies.id"))
    added_date = Column(DateTime, default=func.now())

    user = relationship("User", back_populates="watchlist")
    movie = relationship("Movie")

    class Config:
        from_attributes = True
