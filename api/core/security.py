from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from jose import jwt, JWTError
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from .config import settings
from api.db.session import get_db
from api.db.database_setup import User  # Import User model
from api.crud.user_crud import get_user_by_email

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def create_access_token(
    data: dict, 
    expires_delta: Optional[timedelta] = None
) -> str:
    """
    Create a JWT access token with optional custom expiration.
    
    :param data: Payload data to encode in the token
    :param expires_delta: Optional custom expiration time
    :return: Encoded JWT token
    """
    to_encode = data.copy()
    
    # Use custom expiration or default from settings
    expire = datetime.utcnow() + (
        expires_delta or 
        timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    # Add expiration to payload
    to_encode.update({"exp": expire})
    
    return jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )

def decode_token(token: str) -> Dict[str, Any]:
    """
    Decode and validate JWT token.
    
    :param token: JWT token to decode
    :return: Decoded token payload
    :raises HTTPException: If token is invalid
    """
    try:
        # Decode token
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"}
        )
    except jwt.JWTClaimsError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token claims",
            headers={"WWW-Authenticate": "Bearer"}
        )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"}
        )

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    """
    Retrieve the current user based on the JWT token.
    
    :param token: JWT access token
    :param db: Database session
    :return: Authenticated user
    :raises HTTPException: If authentication fails
    """
    # Credentials exception for consistent error handling
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"}
    )

    # Validate token exists
    if not token:
        raise credentials_exception

    try:
        # Decode token
        payload = decode_token(token)
        email: str = payload.get("sub")
        
        if email is None:
            raise credentials_exception
            
        # Get user from database
        user = get_user_by_email(db, email=email)
        
        if user is None:
            raise credentials_exception
            
        return user
        
    except Exception:
        # Catch any unexpected errors
        raise credentials_exception