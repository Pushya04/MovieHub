from sqlalchemy.orm import Session
from .database_setup import SessionLocal

def get_db():
    """Dependency to get a database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()