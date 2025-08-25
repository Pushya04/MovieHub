import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { get, del } from '../../api/api';
import styles from './WatchlistPage.module.css';

const WatchlistPage = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('date');
  const [filterGenre, setFilterGenre] = useState('all');

  useEffect(() => {
    // Only fetch watchlist when user is authenticated and not loading
    if (authLoading) {
      return; // Still loading auth state
    }
    
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }
    
    fetchWatchlist();
  }, [authLoading, isAuthenticated, user, navigate]);

  const fetchWatchlist = async () => {
    try {
      console.log('Fetching watchlist for user:', user.id);
      const data = await get('/watchlists');
      console.log('Watchlist data received:', data);

      if (!data || data.length === 0) {
        setWatchlist([]);
        setLoading(false);
        return;
      }

      const moviesWithDetails = data.map(item => {
        const movie = item.movie || {};
        return {
          id: item.id,
          movie_id: item.movie_id,
          title: movie.title || 'Unknown Movie',
          genre: movie.genre || 'Unknown Genre',
          poster_path: movie.poster_path || null,
          release_date: movie.release_date || null,
          rating: movie.rating || 0,
          created_at: item.created_at,
          year: movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'
        };
      });

      console.log('Processed movies:', moviesWithDetails);
      setWatchlist(moviesWithDetails);
      setError(null);
    } catch (err) {
      console.error('Error fetching watchlist:', err);
      if (err.message.includes('401')) {
        setError('Please log in to view your watchlist.');
        navigate('/login');
      } else {
        setError('Failed to load your watchlist. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getSortedAndFilteredMovies = () => {
    let filtered = watchlist;

    if (filterGenre !== 'all') {
      filtered = filtered.filter(movie =>
        movie.genre?.toLowerCase() === filterGenre.toLowerCase()
      );
    }

    switch (sortBy) {
      case 'title':
        return [...filtered].sort((a, b) => a.title.localeCompare(b.title));
      case 'genre':
        return [...filtered].sort((a, b) => (a.genre || '').localeCompare(b.genre || ''));
      case 'rating':
        return [...filtered].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'date':
      default:
        return [...filtered].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    }
  };

  const handleRemoveFromWatchlist = async (movieId) => {
    try {
      await del(`/watchlists/${movieId}`);
      setWatchlist(prev => prev.filter(movie => movie.movie_id !== movieId));
    } catch (err) {
      console.error('Error removing movie from watchlist:', err);
      setError('Failed to remove movie from watchlist. Please try again.');
    }
  };

  const handleMovieClick = (movieId) => {
    // Navigate to movie details page
    navigate(`/movies/${movieId}`);
    
    // Scroll to top of the new page after navigation
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleAddMoreMovies = () => {
    navigate('/');
  };

  const sortedAndFilteredMovies = getSortedAndFilteredMovies();

  if (authLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className={styles.notLoggedIn}>
        <h2>Please Log In</h2>
        <p>You need to be logged in to view your watchlist.</p>
        <button className={styles.loginButton} onClick={() => navigate('/login')}>
          Log In
        </button>
      </div>
    );
  }

  return (
    <div className={styles.watchlistPage}>
      <div className={styles.header}>
        <button className={styles.backToHomeButton} onClick={handleBackToHome}>
          ← Back to Home
        </button>
        <h1>My Watchlist</h1>
        <button className={styles.addButton} onClick={handleAddMoreMovies}>
          + Add More Movies
        </button>
      </div>

      <div className={styles.controls}>
        <div className={styles.filterGroup}>
          <label htmlFor="genreFilter">Filter by Genre:</label>
          <select
            id="genreFilter"
            value={filterGenre}
            onChange={(e) => setFilterGenre(e.target.value)}
            className={styles.select}
          >
            <option value="all">All Genres</option>
            <option value="Action">Action</option>
            <option value="Adventure">Adventure</option>
            <option value="Animation">Animation</option>
            <option value="Comedy">Comedy</option>
            <option value="Crime">Crime</option>
            <option value="Documentary">Documentary</option>
            <option value="Drama">Drama</option>
            <option value="Family">Family</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Horror">Horror</option>
            <option value="Mystery">Mystery</option>
            <option value="Romance">Romance</option>
            <option value="Sci-Fi">Sci-Fi</option>
            <option value="Thriller">Thriller</option>
            <option value="War">War</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="sortBy">Sort by:</label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={styles.select}
          >
            <option value="date">Date Added</option>
            <option value="title">Title</option>
            <option value="genre">Genre</option>
            <option value="rating">Rating</option>
          </select>
        </div>
      </div>

      <div className={styles.watchlistInfo}>
        <p>You have {watchlist.length} movie{watchlist.length !== 1 ? 's' : ''} in your watchlist</p>
      </div>

      {error && (
        <div className={styles.error}>
          <p>{error}</p>
          <button className={styles.retryButton} onClick={fetchWatchlist}>
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading your watchlist...</p>
        </div>
      ) : watchlist.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>🎬</div>
          <h3>Your watchlist is empty</h3>
          <p>Start building your movie collection by adding some films!</p>
          <div className={styles.emptyStateActions}>
            <button className={styles.browseButton} onClick={handleAddMoreMovies}>
              Browse Movies
            </button>
            <button className={styles.exploreButton} onClick={() => navigate('/')}>
              Explore Genres
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.movieGrid}>
          {sortedAndFilteredMovies.map(movie => (
            <div key={movie.id} className={styles.movieCard}>
              <div 
                className={styles.moviePoster}
                onClick={() => handleMovieClick(movie.movie_id)}
                style={{ cursor: 'pointer' }}
              >
                {movie.poster_path ? (
                  <img
                    src={movie.poster_path}
                    alt={movie.title}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x450/333/666?text=No+Poster';
                    }}
                  />
                ) : (
                  <div className={styles.noPoster}>
                    <span>🎬</span>
                    <p>No Poster</p>
                  </div>
                )}

                <div className={styles.movieOverlay}>
                  <button
                    className={styles.removeButton}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent movie click when removing
                      handleRemoveFromWatchlist(movie.movie_id);
                    }}
                    title="Remove from watchlist"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className={styles.movieInfo}>
                <h3 
                  className={styles.movieTitle}
                  onClick={() => handleMovieClick(movie.movie_id)}
                  style={{ cursor: 'pointer' }}
                >
                  {movie.title}
                </h3>
                <div className={styles.movieMeta}>
                  <span className={styles.movieYear}>{movie.year}</span>
                  <span className={styles.movieGenre}>{movie.genre}</span>
                </div>
                <div className={styles.movieRating}>
                  <span className={styles.star}>⭐</span>
                  <span>{movie.rating ? movie.rating.toFixed(1) : 'N/A'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchlistPage;
