import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMovies } from '../../context/MovieContext';
import Analytics from '../../components/movie/Analytics/Analytics';
import CastGrid from '../../components/movie/CastGrid/CastGrid';
import CommentsSection from '../../components/movie/CommentsSection/CommentsSection';
import AddToWatchlist from '../../components/movie/AddToWatchlist/AddToWatchlist';
import Toast from '../../components/common/Toast/Toast';
import styles from './MoviePage.module.css';
import RelatedMovies from '../../components/movie/RelatedMovies/RelatedMovies';

const MoviePage = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const {
    currentMovie,
    getMovieDetails,
    isLoading,
    error,
    featuredMovies,
    loadFeaturedMovies
  } = useMovies();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isTrailerPlaying, setIsTrailerPlaying] = useState(false);
  const [player, setPlayer] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchMovieData = async () => {
      // If at root path with no movieId, redirect to a specific movie
      const idToFetch = movieId || "10"; // Default to movie ID 10 if no ID in URL
      
      // If we're at the root path but using default ID, update URL to include the ID
      if (!movieId) {
        navigate(`/movies/${idToFetch}`, { replace: true });
      }
      
      await getMovieDetails(idToFetch);
    };
    
    fetchMovieData();
  }, [movieId, getMovieDetails, navigate]);

  // Load featured movies for navigation
  useEffect(() => {
    if (featuredMovies.length === 0) {
      loadFeaturedMovies();
    }
  }, [featuredMovies.length, loadFeaturedMovies]);

  const onPlayerReady = (event) => {
    setPlayer(event.target);
  };

  const onPlayerStateChange = (event) => {
    if (!window.YT || !window.YT.PlayerState) return;
    
    switch(event.data) {
      case window.YT.PlayerState.PLAYING:
        setIsTrailerPlaying(true);
        break;
      case window.YT.PlayerState.PAUSED:
      case window.YT.PlayerState.ENDED:
        setIsTrailerPlaying(false);
        break;
      default:
        break;
    }
  };

  const handleMovieClick = (movieId) => {
    navigate(`/movies/${movieId}`);
    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading && !currentMovie) {
    return (
      <div className={styles['loading-container']}>
        <div className={styles['loading-spinner']}></div>
        <p>Loading movie details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles['error-container']}>
        <div className={styles['error-message']}>{error}</div>
      </div>
    );
  }

  if (!currentMovie) return null;

  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return minutes;
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const videoIdMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}?enablejsapi=1` : null;
  };

  const trailerUrl = getYouTubeEmbedUrl(currentMovie.trailer_url);

  const handleBackToMovies = () => {
    navigate('/');
  };

  const handlePreviousMovie = () => {
    console.log('Previous movie clicked. Current movie ID:', currentMovie.id);
    
    if (currentMovie && currentMovie.id > 1) {
      // Go to previous movie (decrement ID)
      const prevMovieId = currentMovie.id - 1;
      console.log('Navigating to previous movie ID:', prevMovieId);
      navigate(`/movies/${prevMovieId}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentMovie && currentMovie.id === 1) {
      // If at first movie, wrap around to a high number (assuming movies go up to 1000)
      const lastMovieId = 1000; // You can adjust this based on your actual movie count
      console.log('Wrapping around to last movie ID:', lastMovieId);
      navigate(`/movies/${lastMovieId}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextMovie = () => {
    console.log('Next movie clicked. Current movie ID:', currentMovie.id);
    
    if (currentMovie) {
      // Go to next movie (increment ID)
      const nextMovieId = currentMovie.id + 1;
      console.log('Navigating to next movie ID:', nextMovieId);
      navigate(`/movies/${nextMovieId}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleRandomMovie = () => {
    console.log('Random movie clicked');
    
    // Generate a random movie ID between 1 and 1000 (adjust range as needed)
    const minId = 1;
    const maxId = 1000; // You can adjust this based on your actual movie count
    
    let randomId;
    do {
      randomId = Math.floor(Math.random() * (maxId - minId + 1)) + minId;
    } while (randomId === currentMovie.id);
    
    console.log('Navigating to random movie ID:', randomId);
    navigate(`/movies/${randomId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={styles['movie-page-container']}>
      {/* Back Button */}
      <button 
        className={styles['back-button']}
        onClick={handleBackToMovies}
      >
        ← Back to Movies
      </button>
      
      {/* Trailer Hero Section */}
      <div className={`${styles['movie-hero']} ${isTrailerPlaying ? styles['trailer-fullscreen'] : ''}`}>
        {trailerUrl ? (
          <div className={styles['hero-trailer-container']}>
            <iframe
              src={trailerUrl}
              title="Movie Trailer"
              allowFullScreen
              className={styles['hero-trailer-iframe']}
              allow="autoplay"
              id="ytplayer"
              onLoad={() => {
                if (window.YT && window.YT.ready) {
                  window.YT.ready(() => {
                    new window.YT.Player('ytplayer', {
                      events: {
                        onReady: onPlayerReady,
                        onStateChange: onPlayerStateChange
                      }
                    });
                  });
                }
              }}
            />
          </div>
        ) : (
          <div 
            className={styles['hero-background-image']}
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${currentMovie.images && currentMovie.images[0]?.url || '/placeholder-movie.jpg'})`
            }}
          />
        )}
        
        {!isTrailerPlaying && (
          <div className={styles['hero-overlay']}>
            <h1 className={styles['movie-title']}>{currentMovie.title}</h1>
            <div className={styles['hero-metadata']}>
              <span>{currentMovie.year || 'N/A'}</span>
              <span>{formatRuntime(currentMovie.run_length)}</span>
              <span>⭐ {currentMovie.imdb_rating || 'N/A'}/10</span>
            </div>
          </div>
        )}
      </div>

      {/* Movie Navigation */}
      <div className={styles['movie-navigation']}>
        <button
          className={styles['nav-button']}
          onClick={handlePreviousMovie}
          disabled={currentMovie && currentMovie.id === 1}
        >
          ← Previous Movie
        </button>
        
        <div className={styles['nav-info']}>
          {currentMovie ? (
            <span>Movie {currentMovie.id}</span>
          ) : (
            <span>Loading...</span>
          )}
        </div>
        
        <button
          className={styles['nav-button']}
          onClick={handleNextMovie}
          disabled={currentMovie === null}
        >
          Next Movie →
        </button>
      </div>

      {/* Quick Next Movie Button */}
      <div className={styles['quick-nav-section']}>
        <button
          className={styles['quick-nav-button']}
          onClick={handleRandomMovie}
        >
          🎲 Show Me Another Movie
        </button>
      </div>

      {/* Main Content */}
      <div className={styles['main-content']}>
        <div className={styles['synopsis-section']}>
          <h2>Synopsis</h2>
          {currentMovie.synopsis ? (
            <div className={styles['synopsis-content']}>
              <p>{currentMovie.synopsis}</p>
            </div>
          ) : (
            <p className={styles['no-synopsis']}>No synopsis available for this movie.</p>
          )}
        </div>

        {currentMovie.genres?.length > 0 && (
          <div className={styles['genre-tags']}>
            {currentMovie.genres.map((genre, index) => (
              <span key={index} className={styles['genre-tag']}>
                {genre.name}
              </span>
            ))}
          </div>
        )}

        <CastGrid movie={currentMovie} />

        {/* Add to Watchlist Section */}
        <AddToWatchlist 
          movie={currentMovie}
          onSuccess={(message) => {
            setToast({ message, type: 'success' });
          }}
          onError={(message) => {
            setToast({ message, type: 'error' });
          }}
        />

        <Analytics movie={currentMovie} />

        {/* Comments Section */}
        <CommentsSection movieId={currentMovie.id} />

        {/* Related Movies Section */}
        <div className={styles['related-movies-section']}>
          <h2>Related Movies</h2>
          <RelatedMovies movieId={currentMovie.id} />
        </div>
      </div>

      {/* Image Gallery */}
      {currentMovie.images && currentMovie.images.length > 0 && (
        <div className={styles['image-gallery']}>
          <h2>Movie Gallery</h2>
          <div className={styles['gallery-container']}>
            <div 
              className={styles['main-image']} 
              style={{ backgroundImage: `url(${currentMovie.images[activeImageIndex]?.url})` }}
            />
            <div className={styles['thumbnail-container']}>
              {currentMovie.images.map((image, index) => (
                <div 
                  key={index}
                  className={`${styles['thumbnail']} ${index === activeImageIndex ? styles['active'] : ''}`}
                  style={{ backgroundImage: `url(${image.url})` }}
                  onClick={() => setActiveImageIndex(index)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default MoviePage;