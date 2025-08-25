# A mock sentiment analysis function.
# In a real application, you would use a library like NLTK, TextBlob, or a pre-trained model.

def analyze_sentiment_for_text(text: str) -> dict:
    """
    Analyzes the sentiment of a given text and returns scores.
    This is a mock implementation.
    """
    # Simple logic for demonstration
    positive_words = ["good", "great", "awesome", "love", "like"]
    negative_words = ["bad", "terrible", "hate", "dislike"]

    text_lower = text.lower()
    pos_count = sum(text_lower.count(word) for word in positive_words)
    neg_count = sum(text_lower.count(word) for word in negative_words)
    
    total = pos_count + neg_count
    if total == 0:
        return {"positive": 0.0, "negative": 0.0, "neutral": 1.0}

    positive = pos_count / total
    negative = neg_count / total
    neutral = 1 - (positive + negative)

    return {"positive": positive, "negative": negative, "neutral": neutral}
