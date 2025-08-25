import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { watchlistAPI } from '../../../api/watchlist';
import MovieCard from '../../common/MovieCard/MovieCard';
import styles from './Watchlist.module.css';

const Watchlist = () => {
  const [watchlistItems, setWatchlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const data = await watchlistAPI.getWatchlist();
        setWatchlistItems(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch watchlist');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWatchlist();
  }, []);

  const handleRemove = async (movieId) => {
    try {
      await watchlistAPI.deleteWatchlistItem(movieId);
      setWatchlistItems(prev => prev.filter(item => item.movie.id !== movieId));
    } catch (err) {
      setError(err.message || 'Failed to remove movie from watchlist');
    }
  };

  if (isLoading) {
    return (
      <div className={styles['watchlist-loading']}>
        <div className={styles['watchlist-spinner']}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles['watchlist-error']}>
        Error loading watchlist: {error}
      </div>
    );
  }

  return (
    <div className={styles['watchlist-container']}>
      <h2 className={styles['watchlist-title']}>My Watchlist</h2>
      {watchlistItems.length > 0 ? (
        <div className={styles['watchlist-grid']}>
          {watchlistItems.map((item) => (
            <div key={item.movie.id} className={styles['watchlist-item']}>
              <MovieCard 
                movie={item.movie} 
                // Pass any additional props needed for MovieCard
              />
              <button 
                onClick={() => handleRemove(item.movie.id)}
                className={styles['remove-button']}
                aria-label={`Remove ${item.movie.title} from watchlist`}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles['watchlist-empty']}>
          Your watchlist is currently empty
        </div>
      )}
    </div>
  );
};

export default Watchlist;