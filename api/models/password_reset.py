from sqlalchemy import Column, Integer, String, DateTime, Boolean
from datetime import datetime
from .base import Base

class PasswordResetOTP(Base):
    __tablename__ = "password_reset_otps"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), index=True)
    otp = Column(String(6))
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime)
    used = Column(Boolean, default=False)

    def __repr__(self):
        return f"<PasswordResetOTP {self.email}>"