from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session, joinedload
from datetime import datetime
from typing import List

from ..db.session import get_db
from ..db.database_setup import Comment, Movie, User, comment_likes
from ..schemas.comment import CommentCreate, CommentOut, CommentUpdate
from ..schemas.user import UserOut
from ..core.security import get_current_user
from pydantic import BaseModel

class RawCommentInput(BaseModel):
    text: str = None
    content: str = None

router = APIRouter(prefix="/movies/{movie_id}/comments", tags=["comments"])

@router.post("/", response_model=CommentOut, status_code=status.HTTP_201_CREATED)
def create_comment(
    movie_id: int,
    raw_data: dict,  # Capture raw input
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Log raw input for debugging
    print(f"Raw input data: {raw_data}")
    print(f"Movie ID: {movie_id}")
    print(f"Current User ID: {current_user.id}")

    try:
        # Try to extract text, supporting both 'text' and 'content' keys
        comment_text = (
            raw_data.get('text') or 
            raw_data.get('content') or 
            ''
        )

        # Validate comment length
        if len(comment_text.strip()) == 0:
            raise HTTPException(status_code=400, detail="Comment cannot be empty")

        movie = db.query(Movie).get(movie_id)
        if not movie:
            raise HTTPException(status_code=404, detail="Movie not found")

        comment = Comment(
            text=comment_text.strip(),
            user_id=current_user.id,
            movie_id=movie_id,
            created_at=datetime.utcnow()
        )
        
        db.add(comment)
        db.commit()
        db.refresh(comment)

        print(f"Comment created successfully: {comment.id}")
    

    except Exception as e:
        db.rollback()
        print(f"Error creating comment: {e}")
        raise HTTPException(status_code=500, detail=f"Error creating comment: {str(e)}")
    
    return CommentOut(
        id=comment.id,
        content=comment.text,
        user_id=comment.user_id,
        movie_id=comment.movie_id,
        created_at=comment.created_at,
        likes=comment.likes or 0,
        user=UserOut.from_orm(current_user)
    )

@router.get("/", response_model=List[CommentOut])
def get_comments(
    movie_id: int, 
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 50
):
    comments = (
        db.query(Comment)
        .options(joinedload(Comment.user))
        .filter(Comment.movie_id == movie_id)
        .order_by(Comment.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    
    return [
        CommentOut(
            id=c.id,
            content=c.text,
            user_id=c.user_id,
            movie_id=c.movie_id,
            created_at=c.created_at,
            likes=c.likes or 0,
            user=UserOut.from_orm(c.user)
        ) for c in comments
    ]

@router.put("/{comment_id}", response_model=CommentOut)
def update_comment(
    movie_id: int,
    comment_id: int,
    raw_data: dict,  # Capture raw input
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Log raw input for debugging
    print(f"Raw update input data: {raw_data}")
    print(f"Movie ID: {movie_id}")
    print(f"Comment ID: {comment_id}")
    print(f"Current User ID: {current_user.id}")

    try:
        # Try to extract text, supporting both 'text' and 'content' keys
        comment_text = (
            raw_data.get('text') or 
            raw_data.get('content') or 
            ''
        )

        # Validate comment length
        if len(comment_text.strip()) == 0:
            raise HTTPException(status_code=400, detail="Comment cannot be empty")

        comment = db.query(Comment)\
            .options(joinedload(Comment.user))\
            .filter(Comment.id == comment_id, Comment.movie_id == movie_id)\
            .first()
        
        if not comment:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Comment not found")
        
        if comment.user_id != current_user.id:
            raise HTTPException(status.HTTP_403_FORBIDDEN, detail="Not authorized to edit this comment")
        
        comment.text = comment_text.strip()
        comment.updated_at = datetime.utcnow()
        
        db.commit()
        db.refresh(comment)

        print(f"Comment updated successfully: {comment.id}")
    
    except ValidationError as ve:
        print(f"Validation Error: {ve}")
        raise HTTPException(status_code=422, detail=str(ve))
    except Exception as e:
        db.rollback()
        print(f"Error updating comment: {e}")
        raise HTTPException(status_code=500, detail=f"Error updating comment: {str(e)}")
    
    return CommentOut(
        id=comment.id,
        content=comment.text,
        user_id=comment.user_id,
        movie_id=comment.movie_id,
        created_at=comment.created_at,
        updated_at=comment.updated_at,
        likes=comment.likes or 0,
        user=UserOut.from_orm(comment.user)
    )

@router.delete("/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_comment(
    movie_id: int,
    comment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    comment = db.query(Comment)\
        .filter(Comment.id == comment_id, Comment.movie_id == movie_id)\
        .first()
    
    if not comment:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Comment not found")
    
    if comment.user_id != current_user.id:
        raise HTTPException(status.HTTP_403_FORBIDDEN, detail="Not authorized to delete this comment")
    
    try:
        db.delete(comment)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Error deleting comment")
    
    return Response(status_code=status.HTTP_204_NO_CONTENT)

@router.post("/{comment_id}/like", response_model=CommentOut)
def like_comment(
    movie_id: int,
    comment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    comment = db.query(Comment)\
        .filter(Comment.id == comment_id, Comment.movie_id == movie_id)\
        .first()
    
    if not comment:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Comment not found")
    
    if current_user in comment.liked_by:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Already liked")

    try:
        comment.liked_by.append(current_user)
        comment.likes = (comment.likes or 0) + 1
        db.commit()
        db.refresh(comment)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Error liking comment")

    return CommentOut(
        id=comment.id,
        content=comment.text,
        user_id=comment.user_id,
        movie_id=comment.movie_id,
        created_at=comment.created_at,
        likes=comment.likes or 0,
        user=UserOut.from_orm(comment.user)
    )

@router.get("/users/me/comments", response_model=List[CommentOut])
def get_user_comments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 50
):
    comments = (
        db.query(Comment)
        .options(joinedload(Comment.user))
        .filter(Comment.user_id == current_user.id)
        .order_by(Comment.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    
    return [
        CommentOut(
            id=c.id,
            content=c.text,
            user_id=c.user_id,
            movie_id=c.movie_id,
            created_at=c.created_at,
            likes=c.likes or 0,
            user=UserOut.from_orm(c.user)
        ) for c in comments
    ]

@router.get("/users/me/likes", response_model=List[CommentOut])
def get_liked_comments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 50
):
    comments = (
        db.query(Comment)
        .options(joinedload(Comment.user))
        .join(comment_likes)
        .filter(comment_likes.c.user_id == current_user.id)
        .order_by(Comment.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    
    return [
        CommentOut(
            id=c.id,
            content=c.text,
            user_id=c.user_id,
            movie_id=c.movie_id,
            created_at=c.created_at,
            likes=c.likes or 0,
            user=UserOut.from_orm(c.user)
        ) for c in comments
    ]