import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMovies } from '../../../context/MovieContext';
import styles from './RelatedMovies.module.css';

const RelatedMovies = ({ movieId }) => {
  const navigate = useNavigate();
  const { getRelatedMovies } = useMovies();
  const [relatedMovies, setRelatedMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRelatedMovies = async () => {
      if (!movieId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        console.log('RelatedMovies: Fetching related movies for movieId:', movieId);
        const movies = await getRelatedMovies(movieId);
        console.log('RelatedMovies: Received movies:', movies);
        
        // Validate and filter out invalid movies
        const validMovies = movies.filter(movie => {
          if (!movie || !movie.id) {
            console.warn('RelatedMovies: Invalid movie object:', movie);
            return false;
          }
          if (isNaN(movie.id) || movie.id <= 0) {
            console.warn('RelatedMovies: Invalid movie ID:', movie.id, 'for movie:', movie.title);
            return false;
          }
          return true;
        });
        
        console.log('RelatedMovies: Valid movies after filtering:', validMovies);
        setRelatedMovies(validMovies);
      } catch (err) {
        console.error('RelatedMovies: Error fetching related movies:', err);
        setError('Failed to load related movies');
        setRelatedMovies([]); // Set empty array instead of leaving undefined
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedMovies();
  }, [movieId, getRelatedMovies]);

  const handleMovieClick = (movieId) => {
    console.log('RelatedMovies: Navigating to movie ID:', movieId);
    
    // Validate movie ID before navigation
    if (!movieId || isNaN(movieId) || movieId <= 0) {
      console.error('RelatedMovies: Invalid movie ID:', movieId);
      return;
    }
    
    try {
      // Navigate to movie details page - FIXED: use 'movies' not 'movie'
      navigate(`/movies/${movieId}`);
      
      // Scroll to top of the new page after navigation
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error('RelatedMovies: Navigation error:', error);
      // Fallback: try to reload the page with the new movie ID
      window.location.href = `/movies/${movieId}`;
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading related movies...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className={styles.retryButton}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!relatedMovies || relatedMovies.length === 0) {
    return (
      <div className={styles.noRelated}>
        <p>No related movies found.</p>
      </div>
    );
  }

  // Only show first 2 movies for faster loading
  const displayMovies = relatedMovies.slice(0, 2);

  return (
    <div className={styles.relatedMovies}>
      <div className={styles.movieGrid}>
        {displayMovies.map((movie) => {
          // Additional safety check before rendering
          if (!movie || !movie.id || isNaN(movie.id) || movie.id <= 0) {
            console.warn('RelatedMovies: Skipping invalid movie:', movie);
            return null;
          }
          
          return (
            <div 
              key={movie.id} 
              className={styles.movieCard}
              onClick={() => handleMovieClick(movie.id)}
            >
              <div className={styles.moviePoster}>
                {movie.images && movie.images.length > 0 ? (
                  <img
                    src={movie.images[0].url}
                    alt={movie.title}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/200x300/333/666?text=No+Poster';
                    }}
                  />
                ) : (
                  <div className={styles.noPoster}>
                    <span>🎬</span>
                    <p>No Poster</p>
                  </div>
                )}
              </div>
              
              <div className={styles.movieInfo}>
                <h3 className={styles.movieTitle}>{movie.title}</h3>
                <div className={styles.movieMeta}>
                  <span className={styles.movieYear}>{movie.year || 'N/A'}</span>
                  <span className={styles.movieRating}>
                    ⭐ {movie.imdb_rating ? movie.imdb_rating.toFixed(1) : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RelatedMovies;
