from pydantic import BaseModel, Field

class SentimentRequest(BaseModel):
    text: str = Field(..., description="The text to analyze for sentiment")

class SentimentResponse(BaseModel):
    text: str = Field(..., description="The original text")
    cleaned_text: str = Field(..., description="The cleaned text used for analysis")
    polarity: float = Field(..., description="Sentiment polarity score (-1 to 1)")
    subjectivity: float = Field(..., description="Subjectivity score (0 to 1)")
    sentiment: str = Field(..., description="Sentiment label (positive, negative, or neutral)")

    class Config:
        schema_extra = {
            "example": {
                "text": "I love this movie! The acting was fantastic.",
                "cleaned_text": "I love this movie The acting was fantastic",
                "polarity": 0.8,
                "subjectivity": 0.9,
                "sentiment": "positive"
            }
        }