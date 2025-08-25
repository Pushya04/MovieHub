import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { moviesAPI } from '../../../api/movies';
import styles from './HeroSection.module.css';

const HeroSection = () => {
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState('next'); // for animation direction

  // Get image URL from movie data
  const getImageUrl = (movie) => {
    if (!movie || !movie.images || !Array.isArray(movie.images) || movie.images.length === 0) {
      return null; // No image available, will use a fallback gradient
    }
    
    // Try to find a working image URL
    for (const image of movie.images) {
      if (image && image.url) {
        return image.url;
      }
    }
    
    return null; // No valid image URL found
  };

  // Format movie runtime to hours and minutes
  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return minutes;
  };

  useEffect(() => {
    const loadFeaturedMovies = async () => {
      try {
        const response = await moviesAPI.getFilteredMovies({
          sort_by: 'imdb_rating',
          sort_order: 'desc',
          limit: 5
        });
        
        const movies = response.data ? response.data : response;
        
        if (Array.isArray(movies) && movies.length > 0) {
          setFeaturedMovies(movies);
        } else {
          throw new Error('No movies returned from API');
        }
      } catch (err) {
        console.error('Error loading featured movies:', err);
        setError('Failed to load featured movies. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadFeaturedMovies();
    
    // Set up auto-rotation for the carousel
    const interval = setInterval(() => {
      if (featuredMovies.length > 0) {
        goToNext();
      }
    }, 6000);
    
    return () => clearInterval(interval);
  }, [featuredMovies.length]); // Added dependency to prevent issues

  const goToNext = () => {
    if (isTransitioning || featuredMovies.length === 0) return;
    
    setDirection('next');
    setIsTransitioning(true);
    
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 500);
  };

  const goToPrev = () => {
    if (isTransitioning || featuredMovies.length === 0) return;
    
    setDirection('prev');
    setIsTransitioning(true);
    
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 500);
  };
  
  const goToSlide = (index) => {
    if (isTransitioning || featuredMovies.length === 0 || index === currentIndex) return;
    
    setDirection(index > currentIndex ? 'next' : 'prev');
    setIsTransitioning(true);
    
    setTimeout(() => {
      setCurrentIndex(index);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 500);
  };

  if (isLoading) {
    return (
      <div className={styles.heroLoading}>
        <div className={styles.loadingSpinner}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.heroError}>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className={styles.retryButton}>
          Retry
        </button>
      </div>
    );
  }

  if (featuredMovies.length === 0) {
    return (
      <div className={styles.heroError}>
        <p>No movies available</p>
        <button onClick={() => window.location.reload()} className={styles.retryButton}>
          Retry
        </button>
      </div>
    );
  }

  // Make sure current index is valid
  const safeIndex = Math.min(currentIndex, featuredMovies.length - 1);
  const currentMovie = featuredMovies[safeIndex];
  
  // Safety check for currentMovie
  if (!currentMovie) {
    return (
      <div className={styles.heroError}>
        <p>Error loading movie data</p>
        <button onClick={() => window.location.reload()} className={styles.retryButton}>
          Retry
        </button>
      </div>
    );
  }

  const imageUrl = getImageUrl(currentMovie);

  // Determine which animation class to apply
  const slideClass = isTransitioning 
    ? direction === 'next' 
      ? styles.slideOutLeft 
      : styles.slideOutRight 
    : '';

  return (
    <section className={styles.heroSection}>
      {/* Slides Container */}
      <div className={`${styles.slideContainer} ${slideClass}`}>
        <div 
          className={styles.slideBackground}
          style={{
            backgroundImage: imageUrl 
              ? `linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%), url('${imageUrl}')` 
              : 'linear-gradient(to right, #0f2027, #203a43, #2c5364)'
          }}
        >
          <div className={styles.slideContent}>
            <div className={styles.movieInfo}>
              <h1 className={styles.movieTitle}>{currentMovie.title || 'Untitled Movie'}</h1>
              
              <p className={styles.movieSynopsis}>
                {currentMovie.synopsis 
                  ? (currentMovie.synopsis.length > 150 
                      ? currentMovie.synopsis.substring(0, 150) + '...' 
                      : currentMovie.synopsis) 
                  : 'No synopsis available'}
              </p>
              
              <div className={styles.movieMeta}>
                <span className={styles.rating}>⭐ {currentMovie.imdb_rating || 'N/A'}</span>
                <span className={styles.year}>
                  {currentMovie.release_date 
                    ? new Date(currentMovie.release_date).getFullYear() 
                    : (currentMovie.year || 'N/A')}
                </span>
                <span className={styles.runtime}>{formatRuntime(currentMovie.run_length)}</span>
              </div>
              
              <Link 
                to={`/movies/${currentMovie.id || '0'}`}
                className={styles.viewButton}
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation Controls - Only show if we have multiple movies */}
      {featuredMovies.length > 1 && (
        <div className={styles.navigation}>
          <button 
            onClick={goToPrev}
            className={`${styles.navButton} ${styles.prevButton}`}
            aria-label="Previous movie"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
          </button>
          
          <div className={styles.indicators}>
            {featuredMovies.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`${styles.indicator} ${idx === safeIndex ? styles.activeIndicator : ''}`}
                aria-label={`Go to slide ${idx + 1}`}
                aria-current={idx === safeIndex ? 'true' : 'false'}
              />
            ))}
          </div>
          
          <button 
            onClick={goToNext}
            className={`${styles.navButton} ${styles.nextButton}`}
            aria-label="Next movie"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
          </button>
        </div>
      )}
    </section>
  );
};

export default HeroSection;