# synopsis_generator.py
import re
from typing import List
from transformers import pipeline, AutoTokenizer

# Configuration
SYNOPSIS_MODEL = "sshleifer/distilbart-cnn-12-6"  # Fast, distilled BART model
TOKENIZER = AutoTokenizer.from_pretrained(SYNOPSIS_MODEL)
MIN_REVIEW_LENGTH = 80  # Minimum review length to filter noise
MAX_INPUT_LENGTH = 1024  # Model's max input token length
BATCH_SIZE = 4  # Number of summaries processed at once
CHUNK_SUMMARY_LENGTH = 100  # Length of intermediate summaries
REVIEWS_PER_BATCH = 10  # Number of reviews per initial batch

def generate_synopsis(reviews: List[str], max_length: int = 200) -> str:
    """Generate a movie synopsis from up to 500 reviews efficiently."""
    try:
        # Clean and filter reviews
        cleaned_reviews = [
            re.sub(r'\s+', ' ', str(text).strip())
            for text in reviews
            if len(str(text).strip()) >= MIN_REVIEW_LENGTH
        ]
        
        if len(cleaned_reviews) < 2:
            return "No synopsis available (insufficient valid reviews)"

        # Initialize summarization pipeline
        summarizer = pipeline(
            "summarization",
            model=SYNOPSIS_MODEL,
            truncation=True
        )

        # Step 1: Summarize batches of reviews incrementally
        batch_summaries = []
        for i in range(0, len(cleaned_reviews), REVIEWS_PER_BATCH):
            batch = cleaned_reviews[i:i + REVIEWS_PER_BATCH]
            combined_batch = " ".join(batch)
            # Truncate to model's max input length
            inputs = TOKENIZER(
                combined_batch,
                max_length=MAX_INPUT_LENGTH,
                truncation=True,
                return_tensors="pt"
            )
            truncated_text = TOKENIZER.decode(
                inputs["input_ids"][0],
                skip_special_tokens=True
            )
            # Summarize the batch
            summary = summarizer(
                truncated_text,
                max_length=CHUNK_SUMMARY_LENGTH,
                min_length=30,
                num_beams=1,  # Greedy decoding for speed
                do_sample=False
            )
            batch_summaries.append(summary[0]['summary_text'])

        # Step 2: Summarize the batch summaries into final synopsis
        combined_summary = " ".join(batch_summaries)
        final_summary = summarizer(
            combined_summary,
            max_length=max_length,
            min_length=80,
            num_beams=1,  # Greedy decoding for speed
            do_sample=False
        )[0]['summary_text']

        # Post-process the output
        final_summary = re.sub(r'\s+', ' ', final_summary).strip()
        if not final_summary.endswith(('.', '!', '?')):
            final_summary += '.'
        return final_summary.capitalize()

    except Exception as e:
        print(f"Synopsis error: {str(e)}")
        return "No synopsis available (system error)"

