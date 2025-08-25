import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from './ErrorPage.module.css';

const ErrorPage = ({ error }) => {
  const statusCode = error?.status || 404;
  const message = error?.message || 'Page Not Found';

  return (
    <div className={styles['error-container']}>
      <div className={styles['error-content']}>
        <div className={styles['error-code']}>{statusCode}</div>
        <h1 className={styles['error-message']}>{message}</h1>
        <p className={styles['error-description']}>
          Oops! Something went wrong. The page you're looking for might be unavailable or doesn't exist.
        </p>
        <Link to="/" className={styles['home-button']}>
          Return to Home
        </Link>
      </div>
    </div>
  );
};

ErrorPage.propTypes = {
  error: PropTypes.shape({
    status: PropTypes.number,
    message: PropTypes.string
  })
};

ErrorPage.defaultProps = {
  error: {
    status: 404,
    message: 'Page Not Found'
  }
};

export default ErrorPage;