# process_movies.py
import os
import csv
import time
import random
from typing import Dict, List, Set
from collections import defaultdict
from sentiment_analysis import analyze_reviews
from synopsis import generate_synopsis

# Configuration
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
REVIEWS_DIR = os.path.join(BASE_DIR, 'clubed_movie_reviews', 'reviews_per_movie')
META_FILE = os.path.join(BASE_DIR, 'all_movie_details.csv')
GENRE_DIR = os.path.join(BASE_DIR, 'movie_data', 'movies_per_genre')
OUTPUT_DIR = os.path.join(BASE_DIR, 'data', 'processed_movies')
TEST_DIR = os.path.join(BASE_DIR, 'test_results')

os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(TEST_DIR, exist_ok=True)

def load_movie_data() -> Dict[str, dict]:
    """Load and merge data from all sources"""
    movies = defaultdict(lambda: {
        'genres': set(),
        'run_length': 'N/A',
        'directors': '',
        'cast': '',
        'image_urls': [],
        'trailer_url': '',
        'watch_urls': []
    })

    # Load genre-specific files for run_length and genres
    genre_files = [f for f in os.listdir(GENRE_DIR) if f.endswith('.csv')]
    for genre_file in genre_files:
        genre_name = os.path.splitext(genre_file)[0]
        with open(os.path.join(GENRE_DIR, genre_file), 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                title = row['name'].strip()
                movies[title]['genres'].add(genre_name)
                if row.get('run_length') and movies[title]['run_length'] == 'N/A':
                    movies[title]['run_length'] = row['run_length']

    # Load main metadata file
    with open(META_FILE, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            title = row['title'].strip()
            movies[title].update({
                'directors': row['directors'],
                'cast': row['cast'],
                'image_urls': row['image_urls'].split('; '),
                'trailer_url': row['trailer_url'],
                'watch_urls': row['where_to_watch_urls'].split(', ')
            })

    return movies

def process_reviews(movie_title: str) -> dict:
    """Process reviews for a single movie"""
    result = {
        'predicted_rating': 0.0,
        'synopsis': 'No synopsis available',
        'num_reviews': 0
    }
    
    try:
        safe_name = ''.join([c if c.isalnum() or c in (' ', '_') else '_' 
                          for c in movie_title]).replace(' ', '_').strip('_')
        review_files = [
            f"{safe_name}_reviews.csv",
            f"{safe_name.replace('__', '_')}_reviews.csv",
            f"{safe_name.replace(' ', '')}_reviews.csv",
            f"{safe_name}.csv"
        ]
        
        review_path = None
        for file in review_files:
            path = os.path.join(REVIEWS_DIR, file)
            if os.path.exists(path):
                review_path = path
                break
                
        if not review_path:
            raise FileNotFoundError("No review file found")

        with open(review_path, 'r', encoding='utf-8') as rf:
            review_reader = csv.DictReader(rf)
            reviews = [row['content'] for row in review_reader if row.get('content')]
            
            if reviews:
                # Corrected: Handle single return value from analyze_reviews
                rating = analyze_reviews(reviews)
                result.update({
                    'predicted_rating': rating,
                    'synopsis': generate_synopsis(reviews),
                    'num_reviews': len(reviews)
                })
                
    except Exception as e:
        print(f"Error processing {movie_title}: {str(e)}")
    
    return result

def process_and_export():
    """Main processing pipeline"""
    start_time = time.time()
    movies = load_movie_data()
    output_path = os.path.join(OUTPUT_DIR, 'all_movies_processed.csv')
    
    with open(output_path, 'w', newline='', encoding='utf-8') as outfile:
        writer = csv.DictWriter(outfile, fieldnames=[
            'title', 'predicted_rating', 'genre', 'synopsis', 
            'num_reviews', 'movie_length', 'release_year'
        ])
        writer.writeheader()
        
        for title, meta in movies.items():
            print(f"Processing: {title}")
            review_data = process_reviews(title)
            
            writer.writerow({
                'title': title,
                'predicted_rating': review_data['predicted_rating'],
                'genre': '; '.join(sorted(meta['genres'])),
                'synopsis': review_data['synopsis'],
                'num_reviews': review_data['num_reviews'],
                'movie_length': meta['run_length'],
                'release_year': meta.get('year', 'N/A')
            })
            
            time.sleep(random.uniform(0.2, 0.5))

    print(f"\nProcessed {len(movies)} movies in {time.time()-start_time:.2f}s")
    print(f"Output file: {output_path}")

def test_first_10_movies():
    """Test function for first 10 movies"""
    movies = load_movie_data()
    test_movies = dict(list(movies.items())[:10])
    output_path = os.path.join(TEST_DIR, 'test_output.csv')
    
    with open(output_path, 'w', newline='', encoding='utf-8') as outfile:
        writer = csv.DictWriter(outfile, fieldnames=[
            'title', 'predicted_rating', 'genre', 'synopsis', 
            'num_reviews', 'movie_length', 'release_year'
        ])
        writer.writeheader()
        
        for title, meta in test_movies.items():
            print(f"Testing: {title}")
            review_data = process_reviews(title)
            writer.writerow({
                'title': title,
                'predicted_rating': review_data['predicted_rating'],
                'genre': '; '.join(sorted(meta['genres'])),
                'synopsis': review_data['synopsis'],
                'num_reviews': review_data['num_reviews'],
                'movie_length': meta['run_length'],
                'release_year': meta.get('year', 'N/A')
            })

    print("\nTest completed. Check test_results directory")

if __name__ == "__main__":
    test_first_10_movies()
    process_and_export()