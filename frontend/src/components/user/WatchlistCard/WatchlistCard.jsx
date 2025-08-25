import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from './WatchlistCard.module.css';

const WatchlistCard = ({ movie, onRemove }) => {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async () => {
    if (window.confirm('Remove this movie from your watchlist?')) {
      setIsRemoving(true);
      try {
        await onRemove(movie.movie_id || movie.id);
      } catch (error) {
        console.error('Error removing from watchlist:', error);
        setIsRemoving(false);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getMovieTitle = () => {
    return movie.movie?.title || movie.title || `Movie #${movie.movie_id || movie.id}`;
  };

  const getMovieImage = () => {
    return movie.movie?.poster_path || movie.poster_path || '/default-movie.jpg';
  };

  const getMovieGenre = () => {
    return movie.movie?.genre || movie.genre || 'Unknown';
  };

  const getReleaseDate = () => {
    return movie.movie?.release_date || movie.release_date;
  };

  return (
    <div className={styles.watchlistCard}>
      <div className={styles.movieImage}>
        <img
          src={getMovieImage()}
          alt={getMovieTitle()}
          className={styles.image}
          onError={(e) => {
            e.target.src = '/default-movie.jpg';
          }}
        />
      </div>

      <div className={styles.movieInfo}>
        <Link to={`/movies/${movie.movie_id || movie.id}`} className={styles.movieLink}>
          <h3 className={styles.movieTitle}>{getMovieTitle()}</h3>
        </Link>
        
        <div className={styles.movieMeta}>
          <span className={styles.genre}>{getMovieGenre()}</span>
          <span className={styles.releaseDate}>
            {formatDate(getReleaseDate())}
          </span>
        </div>

        <div className={styles.addedDate}>
          Added: {formatDate(movie.created_at)}
        </div>
      </div>

      <div className={styles.actions}>
        <button
          className={`${styles.removeButton} ${isRemoving ? styles.removing : ''}`}
          onClick={handleRemove}
          disabled={isRemoving}
        >
          {isRemoving ? 'Removing...' : 'Remove'}
        </button>
      </div>
    </div>
  );
};

WatchlistCard.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.number,
    movie_id: PropTypes.number,
    created_at: PropTypes.string,
    movie: PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
      genre: PropTypes.string,
      poster_path: PropTypes.string,
      release_date: PropTypes.string
    }),
    title: PropTypes.string,
    genre: PropTypes.string,
    poster_path: PropTypes.string,
    release_date: PropTypes.string
  }).isRequired,
  onRemove: PropTypes.func.isRequired
};

export default WatchlistCard;

