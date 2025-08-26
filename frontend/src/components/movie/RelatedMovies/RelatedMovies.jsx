import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useMovies } from '../../../context/MovieContext';
import styles from './RelatedMovies.module.css';

const RelatedMovies = ({ movieId }) => {
  const { getRelatedMovies, isLoading } = useMovies();
  const [relatedMovies, setRelatedMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRelatedMovies = async () => {
      if (!movieId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const movies = await getRelatedMovies(movieId);
        setRelatedMovies(movies || []);
      } catch (err) {
        console.error('Error fetching related movies:', err);
        setError('Failed to load related movies');
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedMovies();
  }, [movieId, getRelatedMovies]);

  const handleMovieClick = (movieId) => {
    // Navigate to the movie page
    window.location.href = `/movies/${movieId}`;
  };

  if (loading) {
    return (
      <div className={styles.relatedMovies}>
        <h3>Related Movies</h3>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading related movies...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.relatedMovies}>
        <h3>Related Movies</h3>
        <div className={styles.error}>
          <p>{error}</p>
          <button 
            className={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!relatedMovies || relatedMovies.length === 0) {
    return (
      <div className={styles.relatedMovies}>
        <h3>Related Movies</h3>
        <div className={styles.noRelated}>
          <p>No related movies found</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.relatedMovies}>
      <h3>Related Movies</h3>
      <div className={styles.movieGrid}>
        {relatedMovies.map((movie) => (
          <div
            key={movie.id}
            className={styles.movieCard}
            onClick={() => handleMovieClick(movie.id)}
          >
            <div className={styles.moviePoster}>
              {movie.poster_path ? (
                <img
                  src={movie.poster_path}
                  alt={movie.title}
                  loading="lazy"
                />
              ) : (
                <div className={styles.noPoster}>
                  <span>🎬</span>
                  <p>No Poster</p>
                </div>
              )}
            </div>
            <div className={styles.movieInfo}>
              <h4 className={styles.movieTitle}>{movie.title}</h4>
              <div className={styles.movieMeta}>
                <span className={styles.movieYear}>
                  {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                </span>
                <span className={styles.movieRating}>
                  {movie.imdb_rating ? `${movie.imdb_rating.toFixed(1)}⭐` : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

RelatedMovies.propTypes = {
  movieId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
};

export default RelatedMovies;
