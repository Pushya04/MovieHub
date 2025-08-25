# import_movie_details.py
import csv
from sqlalchemy.orm import Session
from api.db.database_setup import SessionLocal, Movie, Person, Image, WatchProvider, MoviePerson

def import_main_details():
    db = SessionLocal()
    try:
        with open('data/all_movie_details.csv', 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row_idx, row in enumerate(reader, 1):
                try:
                    # Get or create movie
                    movie = db.query(Movie).filter_by(title=row['title']).first()
                    if not movie:
                        movie = Movie(
                            title=row['title'],
                            trailer_url=row['trailer_url']
                        )
                        db.add(movie)
                        db.commit()
                        print(f"✅ Created new movie: {movie.title}")

                    # Process directors with deduplication
                    directors = {d.strip() for d in row['directors'].split(',') if d.strip()}
                    for director in directors:
                        person = db.query(Person).filter_by(name=director).first()
                        if not person:
                            person = Person(name=director)
                            db.add(person)
                            db.commit()
                            print(f"➕ Created new person: {director}")

                        # Check and add director relationship
                        if not db.query(MoviePerson).filter_by(
                            movie_id=movie.id,
                            person_id=person.id,
                            role='director'
                        ).first():
                            db.add(MoviePerson(
                                movie_id=movie.id,
                                person_id=person.id,
                                role='director'
                            ))
                            db.commit()

                    # Process cast with deduplication
                    actors = {a.strip() for a in row['cast'].split(',') if a.strip()}
                    for actor in actors:
                        person = db.query(Person).filter_by(name=actor).first()
                        if not person:
                            person = Person(name=actor)
                            db.add(person)
                            db.commit()
                            print(f"➕ Created new person: {actor}")

                        # Check and add actor relationship
                        if not db.query(MoviePerson).filter_by(
                            movie_id=movie.id,
                            person_id=person.id,
                            role='actor'
                        ).first():
                            db.add(MoviePerson(
                                movie_id=movie.id,
                                person_id=person.id,
                                role='actor'
                            ))
                            db.commit()

                    # Process images with deduplication
                    image_urls = {url.strip() for url in row['image_urls'].split(';') if url.strip()}
                    for url in image_urls:
                        if not db.query(Image).filter_by(url=url, movie_id=movie.id).first():
                            db.add(Image(url=url, movie_id=movie.id))
                            db.commit()

                    # Process providers with deduplication
                    if row['where_to_watch_urls'] != 'Not found':
                        provider_urls = {url.strip() for url in row['where_to_watch_urls'].split(',') if url.strip()}
                        for url in provider_urls:
                            if not db.query(WatchProvider).filter_by(url=url, movie_id=movie.id).first():
                                db.add(WatchProvider(url=url, movie_id=movie.id))
                                db.commit()

                    print(f"✅ Successfully processed: {movie.title} (Row {row_idx})")

                except Exception as e:
                    db.rollback()
                    print(f"❌ Error processing row {row_idx}: {str(e)}")
                    continue

    except Exception as e:
        db.rollback()
        print(f"🔥 Critical error: {str(e)}")
    finally:
        db.close()
        print("\n🏁 Import process completed")

if __name__ == "__main__":
    print("🚀 Starting movie data import...")
    import_main_details()