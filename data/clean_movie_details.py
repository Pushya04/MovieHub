import os
import pandas as pd
from collections import defaultdict
import shutil

def process_reviews(input_dir, output_dir):
    # Create output directory structure
    final_reviews_dir = os.path.join(output_dir, 'reviews_per_movie')
    os.makedirs(final_reviews_dir, exist_ok=True)
    
    # Dictionary to track movies and their genres
    movie_genres = defaultdict(set)
    movie_files = defaultdict(list)
    
    # Walk through genre directories
    for root, dirs, files in os.walk(input_dir):
        if os.path.basename(root) == 'reviews_per_movie':
            continue  # Skip the root directory itself
        
        genre = os.path.basename(root)
        for file in files:
            if file.endswith('.csv'):
                # Extract movie title from filename
                movie_id = file.rsplit('_', 2)[0]  # Split off _YYYY_reviews.csv
                src_path = os.path.join(root, file)
                
                # Track movie's genres and files
                movie_genres[movie_id].add(genre)
                movie_files[movie_id].append(src_path)
    
    # Process each movie
    for movie_id, files in movie_files.items():
        # Combine all reviews from different genres
        combined = pd.concat([pd.read_csv(f) for f in files])
        
        # Remove duplicate reviews (same content and username)
        combined = combined.drop_duplicates(subset=['content', 'username'])
        
        # Add genres column
        combined['genres'] = ', '.join(sorted(movie_genres[movie_id]))
        
        # Save to new location
        output_file = os.path.join(final_reviews_dir, f"{movie_id}_reviews.csv")
        combined.to_csv(output_file, index=False)
        print(f"Processed {movie_id} with {len(combined)} reviews")

    # Cleanup: Remove old genre directories
    for root, dirs, files in os.walk(input_dir):
        if os.path.basename(root) != 'reviews_per_movie' and root != input_dir:
            shutil.rmtree(root)

if __name__ == "__main__":
    # Configure paths
    input_directory = 'reviews_per_movie'
    output_directory = 'clubed_movie_reviews'
    
    process_reviews(input_directory, output_directory)
    print("Reorganization complete! New structure created at:", output_directory)