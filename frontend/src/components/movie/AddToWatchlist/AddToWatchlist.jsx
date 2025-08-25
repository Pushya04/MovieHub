import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { post, get } from '../../../api/api';
import styles from './AddToWatchlist.module.css';

const AddToWatchlist = ({ movie, onSuccess, onError }) => {
  const { user } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [stats, setStats] = useState({ total_watchlist: 0, watched: 0 });
  const [loadingStats, setLoadingStats] = useState(false);

  const handleAddToWatchlist = async () => {
    if (!user) {
      if (onError) onError('Please log in to add movies to your watchlist');
      return;
    }

    setIsAdding(true);
    
    try {
      const response = await post('/watchlists', {
        movie_id: movie.id
      });
      
             setIsInWatchlist(true);
       if (onSuccess) onSuccess('Movie added to watchlist successfully!');
       fetchStats(); // Refresh stats after adding
      
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      
      if (error.message?.includes('already in watchlist')) {
        setIsInWatchlist(true);
        if (onError) onError('Movie is already in your watchlist');
      } else {
        if (onError) onError('Failed to add movie to watchlist. Please try again.');
      }
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveFromWatchlist = async () => {
    if (!user) return;

    setIsAdding(true);
    
    try {
      await fetch(`/watchlists/${movie.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      setIsInWatchlist(false);
      if (onSuccess) onSuccess('Movie removed from watchlist');
      fetchStats(); // Refresh stats after removal
      
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      if (onError) onError('Failed to remove movie from watchlist');
    } finally {
      setIsAdding(false);
    }
  };

  const fetchStats = async () => {
    if (!user) return;
    
    setLoadingStats(true);
    try {
      const statsData = await get('/watchlists/stats');
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching watchlist stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  if (!user) {
    return (
      <div className={styles.container}>
        <p className={styles.loginMessage}>Please log in to manage your watchlist</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.watchlistSection}>
        <h3 className={styles.sectionTitle}>Watchlist</h3>
        <div className={styles.watchlistInfo}>
          <p className={styles.description}>
            Add this movie to your personal watchlist to track movies you want to watch.
          </p>
          
          <div className={styles.actionContainer}>
            {isInWatchlist ? (
              <button
                className={`${styles.watchlistButton} ${styles.removeButton}`}
                onClick={handleRemoveFromWatchlist}
                disabled={isAdding}
              >
                {isAdding ? (
                  <>
                    <span className={styles.spinner}></span>
                    Removing...
                  </>
                ) : (
                  <>
                    <span className={styles.icon}>✓</span>
                    Remove from Watchlist
                  </>
                )}
              </button>
            ) : (
              <button
                className={`${styles.watchlistButton} ${styles.addButton}`}
                onClick={handleAddToWatchlist}
                disabled={isAdding}
              >
                {isAdding ? (
                  <>
                    <span className={styles.spinner}></span>
                    Adding...
                  </>
                ) : (
                  <>
                    <span className={styles.icon}>+</span>
                    Add to Watchlist
                  </>
                )}
              </button>
            )}
          </div>
          
          <div className={styles.watchlistStats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>
                {loadingStats ? '...' : stats.total_watchlist}
              </span>
              <span className={styles.statLabel}>Movies in Watchlist</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>
                {loadingStats ? '...' : stats.watched}
              </span>
              <span className={styles.statLabel}>Watched</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddToWatchlist;
