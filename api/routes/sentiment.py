from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from api.db.session import get_db  # Changed to use absolute import
from api.schemas.sentiment import SentimentRequest, SentimentResponse
from api.services.sentiment_service import analyze_sentiment_for_text

router = APIRouter(
    prefix="/sentiment",
    tags=["sentiment"],
    responses={404: {"description": "Not found"}},
)

@router.post("/analyze", response_model=SentimentResponse)
def analyze_text_sentiment(
    request: SentimentRequest,
    db: Session = Depends(get_db)
):
    """
    Analyzes the sentiment of a given text.
    """
    if not request.text:
        raise HTTPException(status_code=400, detail="Text cannot be empty")

    sentiment_scores = analyze_sentiment_for_text(request.text)
    return SentimentResponse(**sentiment_scores)
