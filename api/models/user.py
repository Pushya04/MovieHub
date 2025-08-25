from sqlalchemy import Column, Integer, String, Boolean, DateTime
from datetime import datetime
from .base import Base
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True)
    username = Column(String(50), unique=True, index=True)
    hashed_password = Column(String(255))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    comments = relationship("Comment", back_populates="user")
    password_resets = relationship("PasswordResetOTP", backref="user")
    watchlist = relationship("Watchlist", back_populates="user")

    def __repr__(self):
        return f"<User {self.email}>"