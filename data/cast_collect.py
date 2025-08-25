import csv
import os
import time
import re
import logging
import requests
from bs4 import BeautifulSoup
from googlesearch import search
import imdb
import json

# Configure logging for debugging and error tracking
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Create IMDb instance
ia = imdb.IMDb()

def extract_imdb_id(url):
    """Extract IMDb ID from a review URL."""
    match = re.search(r'/title/(tt\d+)/', url)
    return match.group(1)[2:] if match else None  # Remove 'tt' prefix

def get_imdb_details(imdb_id=None, title=None, year=None):
    """
    Fetch movie details from IMDb using IMDb ID or title and year.
    
    Args:
        imdb_id (str): IMDb ID (e.g., '0133093' for The Matrix).
        title (str): Movie title (e.g., 'The Matrix').
        year (str): Release year (e.g., '1999').
    
    Returns:
        dict: Dictionary with title, directors, and cast.
    """
    try:
        if imdb_id:
            movie = ia.get_movie(imdb_id)
        else:
            query = f"{title} ({year})" if year else title
            items = ia.search_movie(query)
            if not items:
                logger.warning(f"No IMDb results for '{query}'")
                return {'title': title, 'directors': 'Not found', 'cast': 'Not found'}
            movie = ia.get_movie(items[0].movieID)
        title = movie.get('title', title)
        directors = [person['name'] for person in movie.get('director', [])]
        directors_str = ', '.join(directors) if directors else 'Not found'
        cast = [person['name'] for person in movie.get('cast', [])[:15]]  # Limit to top 15 cast members
        cast_str = ', '.join(cast) if cast else 'Not found'
        return {'title': title, 'directors': directors_str, 'cast': cast_str}
    except Exception as e:
        logger.error(f"Error fetching IMDb details: {str(e)}")
        return {'title': title, 'directors': 'Not found', 'cast': 'Not found'}

def get_image_urls_from_themoviedb(movie_title, year=None, api_key="3d1a2a9a3cb84e36f35bf952a7ab7c68", num_images=5):
    """
    Fetch image URLs for a movie from TheMovieDB API.
    
    Args:
        movie_title (str): Movie title.
        year (str): Release year.
        api_key (str): TheMovieDB API key.
        num_images (int): Number of image URLs to fetch.
        
    Returns:
        list: List of image URLs.
    """
    try:
        # Format query for API
        query = f"{movie_title}"
        if year:
            query += f" {year}"
            
        # Encode query for URL
        encoded_query = requests.utils.quote(query)
        
        # Search for movie in TheMovieDB
        search_url = f"https://api.themoviedb.org/3/search/movie?api_key={api_key}&query={encoded_query}"
        search_response = requests.get(search_url, timeout=10)
        search_data = search_response.json()
        
        if not search_data.get('results'):
            logger.warning(f"No results found in TheMovieDB for '{query}'")
            return ['Not found']
            
        # Get movie ID from first result
        movie_id = search_data['results'][0]['id']
        
        # Get movie images
        images_url = f"https://api.themoviedb.org/3/movie/{movie_id}/images?api_key={api_key}"
        images_response = requests.get(images_url, timeout=10)
        images_data = images_response.json()
        
        image_urls = []
        
        # Process poster images
        posters = images_data.get('posters', [])
        for poster in posters[:num_images]:
            file_path = poster.get('file_path')
            if file_path:
                image_url = f"https://image.tmdb.org/t/p/original{file_path}"
                image_urls.append(image_url)
                
        # If we need more images, add backdrops
        if len(image_urls) < num_images:
            backdrops = images_data.get('backdrops', [])
            for backdrop in backdrops[:num_images - len(image_urls)]:
                file_path = backdrop.get('file_path')
                if file_path:
                    image_url = f"https://image.tmdb.org/t/p/original{file_path}"
                    image_urls.append(image_url)
        
        return image_urls if image_urls else ['Not found']
    except Exception as e:
        logger.warning(f"Failed to fetch images from TheMovieDB for '{movie_title}': {str(e)}")
        return ['Not found']

def get_image_urls_fallback(query, num_images=5):
    """
    Fallback method to get image URLs using direct HTTP requests.
    
    Args:
        query (str): Search query for the movie.
        num_images (int): Number of image URLs to fetch.
        
    Returns:
        list: List of image URLs.
    """
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Referer': 'https://www.google.com/'
        }
        
        # Try to get images from IMDb
        try:
            # First search for the movie on IMDb
            search_term = f"{query} site:imdb.com"
            for url in search(search_term, num=1, stop=1):
                if 'imdb.com/title/' in url:
                    # Get the IMDb page
                    response = requests.get(url, headers=headers, timeout=10)
                    soup = BeautifulSoup(response.content, 'html.parser')
                    
                    # Look for poster images
                    image_urls = []
                    poster_elements = soup.select('img.ipc-image')
                    for img in poster_elements:
                        src = img.get('src')
                        if src and 'https://m.media-amazon.com' in src:
                            # Get the largest version of the image by modifying the URL
                            base_url = src.split('._V1_')[0]
                            high_res_url = f"{base_url}._V1_.jpg"
                            image_urls.append(high_res_url)
                            if len(image_urls) >= num_images:
                                return image_urls
        except Exception as e:
            logger.debug(f"Failed to get images from IMDb: {str(e)}")
        
        # Try to get images from Rotten Tomatoes as fallback
        try:
            search_term = f"{query} site:rottentomatoes.com"
            for url in search(search_term, num=1, stop=1):
                if 'rottentomatoes.com/m/' in url:
                    response = requests.get(url, headers=headers, timeout=10)
                    soup = BeautifulSoup(response.content, 'html.parser')
                    
                    image_urls = []
                    image_elements = soup.select('img.posterImage, img.movie-poster')
                    for img in image_elements:
                        src = img.get('src')
                        if src and src.startswith('http'):
                            image_urls.append(src)
                            if len(image_urls) >= num_images:
                                return image_urls
        except Exception as e:
            logger.debug(f"Failed to get images from Rotten Tomatoes: {str(e)}")
        
        # Final fallback: try a general image search
        search_term = f"{query} official poster filetype:jpg"
        direct_urls = []
        for url in search(search_term, num=num_images, stop=num_images):
            if url.endswith('.jpg') or url.endswith('.jpeg') or url.endswith('.png'):
                direct_urls.append(url)
                
        return direct_urls if direct_urls else ['Not found']
    except Exception as e:
        logger.warning(f"All fallback methods failed for '{query}': {str(e)}")
        return ['Not found']

def get_google_details(title, year=None):
    """
    Fetch trailer URL, where-to-watch URLs, and up to 5 image URLs from Google.
    
    Args:
        title (str): Movie title (e.g., 'Inception').
        year (str): Release year (e.g., '2010').
    
    Returns:
        dict: Dictionary with trailer_url, where_to_watch_urls, and image_urls.
    """
    query_title = f"{title} ({year})" if year else title
    trailer_url = 'Not found'
    where_to_watch_urls = 'Not found'
    image_urls = ['Not found']

    # Fetch Trailer URL from YouTube
    try:
        trailer_query = f"{query_title} official trailer site:youtube.com"
        for url in search(trailer_query, num=1, stop=1):
            if 'youtube.com' in url or 'youtu.be' in url:
                trailer_url = url
                break
    except Exception as e:
        logger.warning(f"Failed to fetch trailer URL for '{query_title}': {str(e)}")

    # Fetch Where-to-Watch URLs from streaming platforms
    try:
        watch_query = f"where to watch {query_title} streaming online"
        where_to_watch_urls_list = []
        for url in search(watch_query, num=3, stop=3):
            if any(platform in url.lower() for platform in ['netflix', 'prime', 'hulu', 'disney', 'apple', 'amazon']):
                where_to_watch_urls_list.append(url)
        where_to_watch_urls = ', '.join(where_to_watch_urls_list) if where_to_watch_urls_list else 'Not found'
    except Exception as e:
        logger.warning(f"Failed to fetch where-to-watch URLs for '{query_title}': {str(e)}")

    # Fetch up to 5 Image URLs using TheMovieDB API
    try:
        # First try TheMovieDB API
        image_urls = get_image_urls_from_themoviedb(title, year, num_images=5)
        
        # If no results, try fallback method
        if image_urls == ['Not found']:
            logger.info(f"No images found on TheMovieDB for '{query_title}', trying fallback method")
            image_urls = get_image_urls_fallback(f"{query_title} movie poster", num_images=5)
    except Exception as e:
        logger.warning(f"Failed to fetch image URLs for '{query_title}': {str(e)}")
        # Try fallback method
        try:
            image_urls = get_image_urls_fallback(f"{query_title} movie poster", num_images=5)
        except Exception as e2:
            logger.warning(f"Fallback method also failed: {str(e2)}")

    return {
        'trailer_url': trailer_url,
        'where_to_watch_urls': where_to_watch_urls,
        'image_urls': '; '.join(image_urls) if image_urls != ['Not found'] else 'Not found'
    }

def create_progress_file(folder_path):
    """
    Create a progress tracking file if it doesn't exist.
    
    Args:
        folder_path (str): Path to the folder containing CSV files.
    
    Returns:
        str: Path to the progress file.
    """
    progress_path = os.path.join(os.path.dirname(folder_path), 'movie_progress.json')
    if not os.path.exists(progress_path):
        with open(progress_path, 'w', encoding='utf-8') as f:
            json.dump({}, f)
    return progress_path

def load_progress(progress_path):
    """
    Load progress from the progress file.
    
    Args:
        progress_path (str): Path to the progress file.
    
    Returns:
        dict: Dictionary with progress information.
    """
    with open(progress_path, 'r', encoding='utf-8') as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return {}

def save_progress(progress_path, filename, row_index):
    """
    Save progress to the progress file.
    
    Args:
        progress_path (str): Path to the progress file.
        filename (str): Name of the CSV file being processed.
        row_index (int): Index of the last processed row.
    """
    progress = load_progress(progress_path)
    progress[filename] = row_index
    with open(progress_path, 'w', encoding='utf-8') as f:
        json.dump(progress, f)

def process_csv_files(folder_path, output_csv):
    """
    Process all CSV files in the folder, print results, save to CSV immediately after each movie,
    and track progress to resume from the last processed movie.
    
    Args:
        folder_path (str): Path to the folder containing CSV files.
        output_csv (str): Path to the output CSV file.
    """
    progress_path = create_progress_file(folder_path)
    progress = load_progress(progress_path)
    
    # Create output CSV file with headers if it doesn't exist
    fieldnames = ['title', 'directors', 'cast', 'image_urls', 'trailer_url', 'where_to_watch_urls']
    if not os.path.exists(output_csv):
        with open(output_csv, 'w', newline='', encoding='utf-8') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
    
    # Get list of CSV files
    csv_files = [f for f in os.listdir(folder_path) if f.endswith('.csv')]
    
    # Process each CSV file
    for filename in csv_files:
        file_path = os.path.join(folder_path, filename)
        try:
            with open(file_path, 'r', encoding='utf-8') as csvfile:
                reader = list(csv.reader(csvfile))
                
                # Get the starting row index from progress
                start_index = progress.get(filename, 0)
                logger.info(f"Processing {filename} starting from row {start_index}")
                
                # Process rows starting from the last processed row
                for i, row in enumerate(reader[start_index:], start=start_index):
                    if not row:
                        continue
                    
                    try:
                        title = row[0].strip('"')  # First column: title
                        year = row[1].strip('"') if len(row) > 1 else None  # Second column: year
                        review_url = row[-1].strip('"') if len(row) > 2 else None  # Last column: review URL

                        # Extract IMDb ID from review URL if available
                        imdb_id = extract_imdb_id(review_url) if review_url else None
                        if imdb_id:
                            imdb_details = get_imdb_details(imdb_id=imdb_id)
                        else:
                            imdb_details = get_imdb_details(title=title, year=year)

                        title = imdb_details['title']
                        google_details = get_google_details(title, year)
                        details = {**imdb_details, **google_details}

                        # Print details for each movie
                        print(f"Title: {details['title']}")
                        print(f"Directors: {details['directors']}")
                        print(f"Cast: {details['cast']}")
                        print(f"Image URLs: {details['image_urls']}")
                        print(f"Trailer URL: {details['trailer_url']}")
                        print(f"Where to Watch URLs: {details['where_to_watch_urls']}")
                        print("-" * 50)

                        # Append details to the output CSV file immediately
                        with open(output_csv, 'a', newline='', encoding='utf-8') as csvfile:
                            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                            writer.writerow(details)
                        
                        # Update progress
                        save_progress(progress_path, filename, i + 1)
                        
                        time.sleep(2)  # Delay to avoid rate limiting
                    except Exception as e:
                        logger.error(f"Error processing row {i} in {filename}: {str(e)}")
                        # Save progress even if an error occurs
                        save_progress(progress_path, filename, i + 1)
                        # Wait a bit longer in case of errors before trying the next movie
                        time.sleep(5)
                
                # Mark file as complete
                save_progress(progress_path, filename, len(reader))
                logger.info(f"Completed processing {filename}")
        except Exception as e:
            logger.error(f"Error processing {file_path}: {str(e)}")

if __name__ == "__main__":
    # Set your folder path and output CSV file path
    folder_path = r"C:\Users\reddy\Twitter Sentiment Analysis\data\movie_data\movies_per_genre"
    output_csv = r"C:\Users\reddy\Twitter Sentiment Analysis\data\all_movie_details.csv"

    if not os.path.exists(folder_path):
        logger.error(f"Folder not found: {folder_path}")
    else:
        # Process all CSV files, saving progress and updating output CSV for each movie
        process_csv_files(folder_path, output_csv)