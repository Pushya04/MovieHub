import os
import csv
import time
import random
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, WebDriverException
from bs4 import BeautifulSoup

# Configuration
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
GENRE_DIR = os.path.join(BASE_DIR, "movie_data", "movies_per_genre")
REVIEWS_DIR = os.path.join(BASE_DIR, "reviews_per_movie")
CHROMEDRIVER_PATH = r"C:\Users\reddy\Downloads\chromedriver-win64\chromedriver-win64\chromedriver.exe"
CHECKPOINT_FILE = os.path.join(BASE_DIR, "scraper_checkpoint.txt")

def get_chrome_options():
    """Configure Chrome options with anti-detection measures"""
    options = webdriver.ChromeOptions()
    options.add_argument("--headless=new")
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1920,1080")
    user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36"
    options.add_argument(f"user-agent={user_agent}")
    return options

def human_like_delay(min=0.5, max=2.0):
    """Randomized human-like delays"""
    time.sleep(random.uniform(min, max))

def safe_scroll(driver):
    """Human-like scrolling behavior"""
    scroll_pixels = random.randint(300, 700)
    driver.execute_script(f"window.scrollBy(0, {scroll_pixels})")
    human_like_delay(0.2, 0.5)

def parse_review_element(container, selector, attribute=None, default=''):
    """Safe element parsing with multiple fallbacks"""
    try:
        # Try data-testid first
        element = container.find(attrs={"data-testid": selector})
        if not element:
            # Try class-based fallback
            class_map = {
                "review-title": ["ipc-title__text"],
                "review-content": ["ipc-html-content-inner-div"],
                "rating-star": ["ipc-rating-star--rating"],
                "review-author": ["display-name-link"]
            }
            for cls in class_map.get(selector, []):
                element = container.find(class_=cls)
                if element: break
        
        if element:
            return element.get_text(strip=True) if not attribute else element.get(attribute, default)
        return default
    except Exception:
        return default

def parse_review_container(container):
    """Robust review parsing with multiple fallbacks"""
    return {
        'title': parse_review_element(container, "review-title"),
        'content': parse_review_element(container, "review-content"),
        'rating': parse_review_element(container, "rating-star") or 'N/A',
        'username': parse_review_element(container, "review-author", "aria-label").split("'")[0] 
                   if parse_review_element(container, "review-author", "aria-label") 
                   else 'Anonymous'
    }

def scrape_imdb_reviews(url):
    service = Service(CHROMEDRIVER_PATH)
    options = get_chrome_options()
    
    try:
        driver = webdriver.Chrome(service=service, options=options)
        
        # Stealth configuration
        driver.execute_cdp_cmd("Network.enable", {})
        driver.execute_cdp_cmd("Network.setUserAgentOverride", {
            "userAgent": options.arguments[-1].split("=")[1]
        })

        print("Initializing browser...")
        driver.get("https://www.imdb.com")
        human_like_delay(1, 2)
        
        print(f"Accessing: {url}")
        driver.get(url)
        
        # Wait for core content
        WebDriverWait(driver, 20).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, 'div[data-testid="review-card-parent"]'))
        )

        max_loads = 20
        loaded_pages = 0
        retries = 0
        previous_count = 0

        while loaded_pages < max_loads and retries < 3:
            try:
                safe_scroll(driver)
                
                # Load more button handling
                load_button = WebDriverWait(driver, 10).until(
                    EC.element_to_be_clickable((By.CSS_SELECTOR, 'button.ipc-see-more__button:not([disabled])'))
                )
                driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", load_button)
                human_like_delay(0.5, 1)
                
                # Click using JavaScript
                driver.execute_script("arguments[0].click();", load_button)
                
                # Wait for new content
                WebDriverWait(driver, 15).until(
                    lambda d: len(d.find_elements(By.CSS_SELECTOR, 'div[data-testid="review-card-parent"]')) > previous_count
                )
                previous_count = len(driver.find_elements(By.CSS_SELECTOR, 'div[data-testid="review-card-parent"]'))
                loaded_pages += 1
                print(f"Loaded page {loaded_pages}/{max_loads}")
                retries = 0
                human_like_delay(1, 2)

            except TimeoutException:
                retries += 1
                print(f"Loading timeout (retry {retries}/3)")
                safe_scroll(driver)
                if retries >= 3:
                    current_reviews = driver.find_elements(By.CSS_SELECTOR, 'div[data-testid="review-card-parent"]')
                    if not current_reviews:
                        print("No reviews detected")
                        return []

        # Parse reviews
        soup = BeautifulSoup(driver.page_source, 'html.parser')
        containers = soup.find_all('div', {'data-testid': 'review-card-parent'})
        
        reviews = []
        for container in containers:
            try:
                review = parse_review_container(container)
                if review['content']:  # Only keep reviews with content
                    reviews.append(review)
            except Exception as e:
                print(f"Skipping review: {str(e)}")
                continue

        print(f"Successfully collected {len(reviews)} reviews")
        return reviews

    except WebDriverException as e:
        print(f"Browser error: {str(e)}")
        return []
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return []
    finally:
        if 'driver' in locals():
            driver.quit()

def save_checkpoint(genre, movie_index):
    """Save progress state"""
    with open(CHECKPOINT_FILE, 'w') as f:
        f.write(f"{genre},{movie_index}")

def load_checkpoint():
    """Load saved progress"""
    try:
        with open(CHECKPOINT_FILE, 'r') as f:
            content = f.read().strip().split(',')
            return content[0], int(content[1])
    except (FileNotFoundError, ValueError, IndexError):
        return None, 0

def process_genre_files():
    """Process all genre files with resume capability"""
    os.makedirs(GENRE_DIR, exist_ok=True)
    os.makedirs(REVIEWS_DIR, exist_ok=True)
    
    genre_files = sorted([f for f in os.listdir(GENRE_DIR) if f.lower().endswith('.csv')])
    if not genre_files:
        print(f"No CSV files found in {GENRE_DIR}")
        return

    last_genre, last_index = load_checkpoint()
    start_idx = 0
    current_genre = None
    
    if last_genre:
        try:
            start_idx = genre_files.index(f"{last_genre}.csv")
            current_genre = last_genre
        except ValueError:
            start_idx = 0

    for genre_idx, genre_file in enumerate(genre_files[start_idx:], start=start_idx):
        genre_name = os.path.splitext(genre_file)[0]
        genre_path = os.path.join(GENRE_DIR, genre_file)
        genre_reviews_dir = os.path.join(REVIEWS_DIR, genre_name)
        os.makedirs(genre_reviews_dir, exist_ok=True)

        print(f"\n{'Resuming' if genre_idx == start_idx else 'Processing'} genre: {genre_name}")

        with open(genre_path, 'r', encoding='utf-8') as f:
            movies = list(csv.DictReader(f))

        start_movie_idx = last_index if genre_idx == start_idx and current_genre == genre_name else 0
        
        for movie_idx, movie in enumerate(movies[start_movie_idx:], start=start_movie_idx):
            safe_name = ''.join(c if c.isalnum() else '_' for c in movie['name'])
            output_file = f"{safe_name}_{movie['year']}_reviews.csv"
            output_path = os.path.join(genre_reviews_dir, output_file)
            
            if os.path.exists(output_path):
                print(f"Skipping {movie['name']} (exists)")
                save_checkpoint(genre_name, movie_idx)
                continue
            
            review_url = movie['review_url'].split('_ajax')[0].rstrip('/') + '/'
            print(f"\nProcessing {movie['name']} ({movie_idx+1}/{len(movies)})")
            
            try:
                reviews = scrape_imdb_reviews(review_url)
            except Exception as e:
                print(f"Scraping failed: {str(e)}")
                save_checkpoint(genre_name, movie_idx)
                continue
            
            if not reviews:
                print("No reviews collected")
                save_checkpoint(genre_name, movie_idx)
                continue
            
            # Save raw reviews
            with open(output_path, 'w', newline='', encoding='utf-8') as f:
                writer = csv.DictWriter(f, fieldnames=['title', 'content', 'rating', 'username'])
                writer.writeheader()
                writer.writerows(reviews)
            
            print(f"Saved {len(reviews)} reviews")
            save_checkpoint(genre_name, movie_idx)
            human_like_delay(2, 4)
        
        save_checkpoint("", 0)
        print(f"\nCompleted genre: {genre_name}")

if __name__ == "__main__":
    try:
        print("Starting IMDb review processing...")
        process_genre_files()
        if os.path.exists(CHECKPOINT_FILE):
            os.remove(CHECKPOINT_FILE)
        print("\nProcessing completed successfully!")
    except KeyboardInterrupt:
        print("\nProcess interrupted. Run again to resume.")
    except Exception as e:
        print(f"\nCritical error: {str(e)}")