// MovieCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from './MovieCard.module.css';

const MovieCard = ({ movie }) => {
  // Validate and destructure movie data with fallbacks
  const {
    id,
    title = 'Untitled Movie',
    release_date,
    imdb_rating,
    runtime,
    images = []
  } = movie || {};

  // Image handling with default fallback
  const imageUrl = images[0]?.url || '/default-movie.jpg';
  
  // Date formatting with validation
  const releaseYear = release_date 
    ? new Date(release_date).getFullYear()
    : 'N/A';

  // Rating formatting with fallback
  const rating = imdb_rating ? imdb_rating.toFixed(1) : 'N/A';

  // Runtime formatting
  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <article className={styles.card} data-testid={`movie-card-${id}`}>
      <Link to={`/movies/${id}`} className={styles.link}>
        <div className={styles.imageContainer}>
          <img
            src={imageUrl}
            alt={`Poster for ${title}`}
            className={styles.image}
            loading="lazy"
            onError={(e) => {
              e.target.src = '/default-movie.jpg';
              e.target.alt = 'Default movie poster';
            }}
          />
          <div className={styles.ratingBadge}>
            <span className={styles.ratingIcon}>⭐</span>
            <span className={styles.ratingValue}>{rating}</span>
          </div>
          {runtime && (
            <div className={styles.runtimeBadge}>
              <span className={styles.runtimeValue}>{formatRuntime(runtime)}</span>
            </div>
          )}
        </div>

        <div className={styles.content}>
          <h3 className={styles.title} title={title}>
            {title}
          </h3>
          <div className={styles.meta}>
            <span className={styles.year}>{releaseYear}</span>
            {runtime && (
              <span className={styles.runtime}>{formatRuntime(runtime)}</span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
};

MovieCard.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string,
    release_date: PropTypes.string,
    imdb_rating: PropTypes.number,
    runtime: PropTypes.number,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string
      })
    )
  }).isRequired
};

export default MovieCard;