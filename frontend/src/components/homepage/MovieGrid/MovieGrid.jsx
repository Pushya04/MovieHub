import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { moviesAPI } from '../../../api/movies';
import MovieCard from '../../common/MovieCard/MovieCard';
import styles from './MovieGrid.module.css';

const MovieGrid = ({ 
  filters = {}, 
  movies: propMovies, 
  title, 
  showLoadMore = false, 
  onLoadMore = null,
  isLoading: contextLoading = false 
}) => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const previousFilters = useRef(filters);
  const debounceTimerRef = useRef(null);
  
  // Debug log on component mount
  useEffect(() => {
    console.log('MovieGrid mounted with title:', title);
    console.log('Initial filters:', filters);
    console.log('Movies from props:', propMovies);
    
    return () => {
      console.log('MovieGrid unmounted');
    };
  }, []);

  useEffect(() => {
    // Update movies when propMovies change
    if (propMovies) {
      console.log('Movies from props updated:', propMovies.length);
      setMovies(propMovies);
      setError(null);
      setIsLoading(false);
      return;
    }
  }, [propMovies]);

  useEffect(() => {
    // Only fetch if filters changed (deep comparison) and no propMovies
    if (propMovies) return; // Skip API calls if using propMovies
    
    const filtersChanged = JSON.stringify(previousFilters.current) !== JSON.stringify(filters);
    console.log('Filters changed?', filtersChanged);
    
    if (filtersChanged) {
      // Reset to page 1 when filters change
      setPage(1);
      setHasMore(true);
      previousFilters.current = {...filters};
    }
    
    // Always fetch when page changes or filters change
    if (filtersChanged || !movies.length || page > 1) {
      
      console.log('Starting fetch process with filters:', filters, 'page:', page);
      
      const fetchMovies = async () => {
        try {
          if (page === 1) {
            setIsLoading(true);
          } else {
            setIsLoadingMore(true);
          }
          console.log('Fetching movies for page:', page);
          
          // Fetch from API
          console.log('Fetching from API with filters:', filters, 'page:', page);
          
          let data;
          if (filters.genre) {
            // Use getMoviesByGenre for genre filtering
            data = await moviesAPI.getMoviesByGenre(filters.genre);
          } else {
            // Use getFilteredMovies for other cases with pagination
            data = await moviesAPI.getFilteredMovies({
              limit: 20, // Increased limit for better pagination
              offset: (page - 1) * 20
            });
          }
          
          console.log('API response received, movies count:', data.length);
          
          if (page === 1) {
            // Replace movies on initial load or filter change
            setMovies(data);
          } else {
            // Append movies when loading more
            setMovies(prevMovies => [...prevMovies, ...data]);
          }
          
          // If we got fewer than 20 movies, assume we've reached the end
          setHasMore(data.length >= 20);
          setError(null);
        } catch (err) {
          console.error('Error fetching movies:', err);
          setError('Failed to load movies. Please try again later.');
        } finally {
          setIsLoading(false);
          setIsLoadingMore(false);
          console.log('Loading state ended');
        }
      };

      // Clear any existing timer
      if (debounceTimerRef.current) {
        console.log('Clearing previous debounce timer');
        clearTimeout(debounceTimerRef.current);
      }
      
      // Set new timer - reduced for faster response
      console.log('Setting new debounce timer');
      debounceTimerRef.current = setTimeout(() => {
        fetchMovies();
      }, 50);
    } else {
      console.log('Skipping fetch - filters have not changed');
    }
    
    // Cleanup function
    return () => {
      if (debounceTimerRef.current) {
        console.log('Cleanup: clearing debounce timer');
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [filters, propMovies, page]);

  if (error) {
    return (
      <div className={styles.movieGridError}>
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

  if (isLoading && !movies.length) {
    return (
      <div className={styles.movieGridLoading}>
        <div
          className={styles.movieGridSpinner}
          aria-label="Loading movies"
        />
      </div>
    );
  }

  // Handler for load more button
  const handleLoadMore = () => {
    if (isLoading || !hasMore) return;
    
    if (onLoadMore && showLoadMore) {
      // Use the context load more function
      onLoadMore();
    } else {
      // Use local pagination
      setPage(prevPage => {
        const nextPage = prevPage + 1;
        console.log('Loading more movies, next page:', nextPage);
        return nextPage;
      });
    }
  };

  // Determine if we should show the load more button
  const shouldShowLoadMore = showLoadMore ? 
    (onLoadMore && !contextLoading) : 
    (hasMore && !isLoading && movies.length > 0);

  return (
    <div className={styles.movieGridContainer}>
      {title && <h2 className={styles.movieGridTitle}>{title}</h2>}
      {movies.length > 0 && (
        <>
          <div className={styles.movieGrid}>
            {movies.map(movie => (
              <MovieCard
                key={movie.id}
                movie={movie}
                className={styles.movieGridCard}
              />
            ))}
          </div>
          
          {shouldShowLoadMore && (
            <div className={styles.loadMoreContainer}>
              <button 
                className={styles.loadMoreButton}
                onClick={handleLoadMore}
                disabled={isLoadingMore}
              >
                {isLoadingMore ? 'Loading More Movies...' : 'Load More Movies'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

MovieGrid.propTypes = {
  title: PropTypes.string,
  filters: PropTypes.shape({
    year: PropTypes.number,
    director: PropTypes.string,
    actor: PropTypes.string,
    genre: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    minRating: PropTypes.number,
    search: PropTypes.string,
    sortBy: PropTypes.string,
    sortOrder: PropTypes.string,
    limit: PropTypes.number,
    offset: PropTypes.number
  }),
  movies: PropTypes.array,
  showLoadMore: PropTypes.bool,
  onLoadMore: PropTypes.func,
  isLoading: PropTypes.bool
};

export default MovieGrid;