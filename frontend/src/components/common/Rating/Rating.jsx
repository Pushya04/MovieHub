// Rating.jsx
import React from 'react';
import PropTypes from 'prop-types';
import styles from './Rating.module.css';

const Rating = ({ rating, synopsis }) => {
  // Validate and format rating
  const formattedRating = typeof rating === 'number' 
    ? rating.toFixed(1)
    : 'N/A';

  // Fallback for empty synopsis
  const displaySynopsis = synopsis?.trim() || 'No synopsis available';

  return (
    <div className={styles.container} data-testid="rating-component">
      <div className={styles.ratingDisplay}>
        <svg 
          className={styles.starIcon}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
            fill="currentColor"
          />
        </svg>
        <span className={styles.ratingValue}>
          {formattedRating}
          <span className={styles.ratingScale}>/10</span>
        </span>
      </div>
      
      <div className={styles.synopsisContainer}>
        <h3 className={styles.synopsisHeading}>Synopsis</h3>
        <p className={styles.synopsisText} aria-live="polite">
          {displaySynopsis}
        </p>
      </div>
    </div>
  );
};

Rating.propTypes = {
  rating: PropTypes.number,
  synopsis: PropTypes.string
};

Rating.defaultProps = {
  rating: null,
  synopsis: ''
};

export default Rating;