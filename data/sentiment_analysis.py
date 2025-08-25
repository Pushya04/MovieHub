# sentiment_analysis.py
import numpy as np
from transformers import pipeline

# Improved configuration
SENTIMENT_MODEL = "siebert/sentiment-roberta-large-english"  # Movie-specific sentiment model
BATCH_SIZE = 32  # Increased batch size for efficiency
RATING_SCALE = (0, 10)  # Direct 0-10 scale mapping

def analyze_reviews(reviews):
    """Analyze sentiment of reviews and compute predicted rating with enhanced accuracy."""
    try:
        # Initialize sentiment analysis pipeline with better model
        sentiment_analyzer = pipeline(
            "text-classification",
            model=SENTIMENT_MODEL,
            return_all_scores=True,
            truncation=True,
            max_length=512
        )
    except Exception as e:
        print(f"Model initialization error: {str(e)}")
        return [], 0.0

    # Clean and validate input
    valid_reviews = [str(r).strip() for r in reviews if 10 <= len(str(r).strip()) <= 2000]
    if not valid_reviews:
        return [], 0.0

    # Analyze in batches with error handling
    try:
        results = sentiment_analyzer(valid_reviews, batch_size=BATCH_SIZE)
    except Exception as e:
        print(f"Analysis error: {str(e)}")
        return [], 0.0

    # Process results with enhanced weighting
    weighted_scores = []
    for result in results:
        scores = {item['label'].lower(): item['score'] for item in result}
        positive = scores.get('positive', 0)
        negative = scores.get('negative', 0)
        
        # Enhanced weighting formula
        weighted_score = (positive * 1.1) - (negative * 0.9)
        weighted_scores.append(weighted_score)

    # Calculate predicted rating with IMDb-like scaling
    if weighted_scores:
        avg_score = np.mean(weighted_scores)
        predicted_rating = min(max(round(avg_score * 10, 1), 10.0))
    else:
        predicted_rating = 0.0

    return valid_reviews, predicted_rating