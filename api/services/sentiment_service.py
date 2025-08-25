from textblob import TextBlob
import re

def clean_text(text):
    """
    Clean the text by removing URLs, special characters, and extra whitespace
    """
    # Remove URLs
    text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
    # Remove user @ references and '#' from tweet
    text = re.sub(r'\@\w+|\#\w+', '', text)
    # Remove special characters and numbers
    text = re.sub(r'[^\w\s]', '', text)
    # Remove extra whitespace
    text = ' '.join(text.split())
    return text

def analyze_sentiment_for_text(text: str):
    """
    Analyze the sentiment of the given text using TextBlob.
    Returns a tuple of (polarity, subjectivity, sentiment_label)
    Polarity is a float within the range [-1.0, 1.0]
    Subjectivity is a float within the range [0.0, 1.0]
    """
    # Clean the text first
    cleaned_text = clean_text(text)
    
    # Create TextBlob object
    analysis = TextBlob(cleaned_text)
    
    # Get the polarity score
    polarity = analysis.sentiment.polarity
    
    # Get the subjectivity score
    subjectivity = analysis.sentiment.subjectivity
    
    # Determine sentiment label based on polarity
    if polarity > 0:
        sentiment = "positive"
    elif polarity < 0:
        sentiment = "negative"
    else:
        sentiment = "neutral"
        
    return {
        "text": text,
        "cleaned_text": cleaned_text,
        "polarity": polarity,
        "subjectivity": subjectivity,
        "sentiment": sentiment
    }

