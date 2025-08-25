# import_sentiment.py
import csv
from sqlalchemy.orm import Session
from api.db.database_setup import SessionLocal, Movie, Genre

def import_sentiment_data():
    db = SessionLocal()
    try:
        with open('sentiment_results.csv', 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f, delimiter='\t')
            for row in reader:
                movie = db.query(Movie).filter_by(title=row['title']).first()
                if movie:
                    # Update predicted values
                    movie.predicted_rating = float(row['predicted_rating'])
                    movie.synopsis = row['synopsis']
                    movie.num_reviews = int(row['num_reviews'])
                    movie.run_length = row['movie_length']
                    movie.year = int(row['release_year'])
                    
                    # Process genres
                    for genre_name in row['genre'].split(';'):
                        genre_name = genre_name.strip()
                        if genre_name:
                            genre = db.query(Genre).filter_by(name=genre_name).first()
                            if not genre:
                                genre = Genre(name=genre_name)
                                db.add(genre)
                            if genre not in movie.genres:
                                movie.genres.append(genre)
                    
                    db.commit()
                    print(f"Updated sentiment for {movie.title}")
    except Exception as e:
        db.rollback()
        print(f"Error: {str(e)}")
    finally:
        db.close()

if __name__ == "__main__":
    import_sentiment_data()