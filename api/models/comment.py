from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey
from datetime import datetime
from .base import Base
from sqlalchemy.orm import relationship

class Comment(Base):
    __tablename__ = "comments"
    
    id = Column(Integer, primary_key=True)
    text = Column(Text, nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'))
    movie_id = Column(Integer, ForeignKey('movies.id'))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="comments")
    movie = relationship("Movie", back_populates="comments")

    def __repr__(self):
        return f"<Comment {self.id}>"