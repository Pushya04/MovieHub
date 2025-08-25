import React from 'react';
import PropTypes from 'prop-types';
import styles from './Analytics.module.css';
import { FiStar, FiTrendingUp, FiUsers, FiMessageSquare, FiClock } from 'react-icons/fi';

const Analytics = ({ movie }) => {
  if (!movie) return null;

  const {
    imdb_rating = 0,
    predicted_rating = 0,
    num_raters = 0,
    num_reviews = 0,
    run_length = 0
  } = movie;

  const formatNumber = (num) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num;
  };

  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return minutes;
  };

  return (
    <div className={styles['analytics-container']}>
      {/* <div className={styles['metric-card']}>
        <div className={styles['metric-header']}>
          <FiStar className={styles['metric-icon']} />
          <h3 className={styles['metric-title']}>IMDb Rating</h3>
        </div>
        <div className={styles['metric-value']}>
          {imdb_rating?.toFixed(1) || 'N/A'}/10
        </div>
      </div> */}

      <div className={styles['metric-card']}>
        <div className={styles['metric-header']}>
          <FiTrendingUp className={styles['metric-icon']} />
          <h3 className={styles['metric-title']}>Predicted Rating</h3>
        </div>
        <div className={styles['metric-value']}>
          {imdb_rating?.toFixed(1) || 'N/A'}/10
        </div>
      </div>

      <div className={styles['metric-card']}>
        <div className={styles['metric-header']}>
          <FiUsers className={styles['metric-icon']} />
          <h3 className={styles['metric-title']}>Raters</h3>
        </div>
        <div className={styles['metric-value']}>
          {formatNumber(num_raters) || 0}
        </div>
      </div>

      <div className={styles['metric-card']}>
        <div className={styles['metric-header']}>
          <FiMessageSquare className={styles['metric-icon']} />
          <h3 className={styles['metric-title']}>Reviews</h3>
        </div>
        <div className={styles['metric-value']}>
          {formatNumber(num_reviews) || 0}
        </div>
      </div>

      <div className={styles['metric-card']}>
        <div className={styles['metric-header']}>
          <FiClock className={styles['metric-icon']} />
          <h3 className={styles['metric-title']}>Runtime</h3>
        </div>
        <div className={styles['metric-value']}>
          {formatRuntime(run_length)}
        </div>
      </div>
    </div>
  );
};

Analytics.propTypes = {
  movie: PropTypes.shape({
    imdb_rating: PropTypes.number,
    predicted_rating: PropTypes.number,
    num_raters: PropTypes.number,
    num_reviews: PropTypes.number,
    run_length: PropTypes.string
  })
};

Analytics.defaultProps = {
  movie: null
};

export default Analytics;