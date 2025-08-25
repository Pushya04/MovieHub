# import_genres.py
import csv
import os
from sqlalchemy.orm import Session
from database_setup import SessionLocal, Movie, Genre

def import_genre_data():
    print("🎬 Starting genre data import...")
    db = SessionLocal()
    try:
        genre_dir = 'data/movie_data/movies_per_genre/'
        
        if not os.path.exists(genre_dir):
            print(f"❌ Directory not found: {genre_dir}")
            return

        csv_files = [f for f in os.listdir(genre_dir) if f.endswith('.csv')]
        print(f"📂 Found {len(csv_files)} genre CSV files")
        
        for filename in csv_files:
            file_path = os.path.join(genre_dir, filename)
            print(f"\n📄 Processing: {filename}")
            
            with open(file_path, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                total_rows = sum(1 for _ in reader)
                f.seek(0)
                reader = csv.DictReader(f)
                
                print(f"🔍 Found {total_rows} entries")
                processed = updated = new_genres = 0

                for row in reader:
                    try:
                        movie_title = row['name']
                        movie = db.query(Movie).filter_by(title=movie_title).first()
                        
                        if not movie:
                            print(f"⚠️  Missing movie: {movie_title}")
                            continue

                        # Update movie metadata (excluding num_raters and num_reviews)
                        updates = []
                        if not movie.year:
                            movie.year = int(row['year'])
                            updates.append("year")
                        if not movie.run_length:
                            movie.run_length = row['run_length']
                            updates.append("runtime")
                        if not movie.release_date:
                            movie.release_date = row['release_date']
                            updates.append("release_date")
                        if not movie.imdb_rating:
                            movie.imdb_rating = float(row['rating'])
                            updates.append("imdb_rating")

                        if updates:
                            print(f"🔄 Updated {movie_title}: {', '.join(updates)}")
                            updated += 1

                        # Process genres
                        current_genres = {g.name for g in movie.genres}
                        for genre_name in row['genres'].split(';'):
                            genre_name = genre_name.strip()
                            if not genre_name:
                                continue
                                
                            genre = db.query(Genre).filter_by(name=genre_name).first()
                            if not genre:
                                genre = Genre(name=genre_name)
                                db.add(genre)
                                print(f"➕ New genre: {genre_name}")
                                new_genres += 1
                            
                            if genre_name not in current_genres:
                                movie.genres.append(genre)
                                current_genres.add(genre_name)

                        db.commit()
                        processed += 1

                    except Exception as e:
                        db.rollback()
                        print(f"❌ Error processing {movie_title}: {str(e)}")
                        continue

                print(f"\n✅ Completed {filename}:")
                print(f"   Processed: {processed}")
                print(f"   Updated: {updated}")
                print(f"   New genres: {new_genres}")

        print("\n🎉 Successfully imported all genre data!")

    except Exception as e:
        db.rollback()
        print(f"\n🔥 Critical failure: {str(e)}")
    finally:
        db.close()
        print("\n🔚 Database connection closed")

if __name__ == "__main__":
    import_genre_data()