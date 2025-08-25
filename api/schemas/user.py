from pydantic import BaseModel, EmailStr, Field
from datetime import datetime

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserCreate(UserLogin):
    username: str = Field(..., min_length=3, max_length=50)

class UserOut(BaseModel):
    id: int
    email: EmailStr
    username: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    otp: str = Field(..., min_length=6, max_length=6)
    new_password: str = Field(..., min_length=8)

class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: int

class TokenData(BaseModel):
    email: str | None = None