# import_reviews.py
import csv
import os
import json
from sqlalchemy.orm import Session
from database_setup import SessionLocal, Movie, Review

CHECKPOINT_FILE = "review_import_checkpoint.json"

def load_checkpoint():
    try:
        with open(CHECKPOINT_FILE, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return {"processed_files": [], "current_file": None, "last_row": 0}

def save_checkpoint(state):
    with open(CHECKPOINT_FILE, 'w') as f:
        json.dump(state, f)

def import_reviews():
    print("📚 Starting review data import...")
    db = SessionLocal()
    checkpoint = load_checkpoint()
    
    try:
        base_dir = 'data/clubed_movie_reviews/reviews_per_movie/'
        
        if not os.path.exists(base_dir):
            print(f"❌ Directory not found: {base_dir}")
            return

        processed_files = checkpoint['processed_files'].copy()
        total_reviews = 0
        skipped_reviews = 0
        files = [f for f in os.listdir(base_dir) if f.endswith('_reviews.csv')]

        # Resume from last processed file if available
        start_index = 0
        if checkpoint['current_file']:
            try:
                start_index = files.index(checkpoint['current_file'])
            except ValueError:
                pass

        for filename in files[start_index:]:
            file_path = os.path.join(base_dir, filename)
            if filename in processed_files:
                print(f"⏭️ Skipping already processed file: {filename}")
                continue

            # Extract and clean movie title
            clean_title = filename.replace('_reviews.csv', '').replace('_', ' ').replace('-', ' ').strip()
            movie = db.query(Movie).filter(Movie.title.ilike(f"%{clean_title}%")).first()
            
            if not movie:
                print(f"⚠️  Movie not found: {clean_title} ({filename})")
                continue

            existing_reviews = db.query(Review).filter_by(movie_id=movie.id).count()
            print(f"\n📄 Processing: {filename} (Existing reviews: {existing_reviews})")
            save_checkpoint({
                "processed_files": processed_files,
                "current_file": filename,
                "last_row": 0
            })

            with open(file_path, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                rows = list(reader)
                start_row = checkpoint.get('last_row', 0) if filename == checkpoint.get('current_file') else 0

                for row_idx in range(start_row, len(rows)):
                    row = rows[row_idx]
                    try:
                        # Check for existing review
                        existing = db.query(Review).filter_by(
                            movie_id=movie.id,
                            username=row['username'],
                            content=row['content'][:500]
                        ).first()
                        
                        if existing:
                            skipped_reviews += 1
                            continue

                        # Validate rating
                        rating_str = row.get('rating', '')
                        if not rating_str:
                            raise ValueError("Empty rating field")
                            
                        rating = float(rating_str)
                        if not (0 <= rating <= 10):
                            raise ValueError(f"Invalid rating value: {rating}")

                        # Create new review
                        review = Review(
                            content=row['content'],
                            rating=rating,
                            username=row['username'],
                            movie_id=movie.id
                        )
                        db.add(review)
                        total_reviews += 1

                        # Commit every 5 reviews
                        if total_reviews % 5 == 0:
                            db.commit()
                            save_checkpoint({
                                "processed_files": processed_files,
                                "current_file": filename,
                                "last_row": row_idx + 1
                            })

                    except Exception as e:
                        skipped_reviews += 1
                        print(f"❌ Error in row {row_idx+1}: {str(e)}")
                        db.rollback()
                        continue

                # Final commit for the file
                db.commit()
                processed_files.append(filename)
                save_checkpoint({
                    "processed_files": processed_files,
                    "current_file": None,
                    "last_row": 0
                })
                new_reviews = db.query(Review).filter_by(movie_id=movie.id).count() - existing_reviews
                print(f"✅ Completed {filename} - Added {new_reviews} new reviews")

        # Cleanup checkpoint on success
        if os.path.exists(CHECKPOINT_FILE):
            os.remove(CHECKPOINT_FILE)

        print("\n🎉 Final Summary:")
        print(f"   Processed files: {len(processed_files)}/{len(files)}")
        print(f"   Total reviews added: {total_reviews}")
        print(f"   Skipped entries: {skipped_reviews}")

    except Exception as e:
        db.rollback()
        print(f"🔥 Critical error: {str(e)}")
        print("💾 Progress saved in checkpoint file")
    finally:
        db.close()
        print("\n🔚 Database connection closed")

if __name__ == "__main__":
    import_reviews()