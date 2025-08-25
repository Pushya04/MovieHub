import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './CastGrid.module.css';
import { FiUser } from 'react-icons/fi';

const CastGrid = ({ movie }) => {
  const [failedImages, setFailedImages] = useState(new Set());

  if (!movie?.people?.length) {
    return (
      <div className={styles['cast-grid-container']}>
        <h2 className={styles['cast-grid-title']}>Cast & Crew</h2>
        <p className={styles['no-cast-message']}>No cast information available</p>
      </div>
    );
  }

  const handleImageError = (id) => {
    setFailedImages(prev => new Set([...prev, id]));
  };

  return (
    <div className={styles['cast-grid-container']}>
      <h2 className={styles['cast-grid-title']}>Cast & Crew</h2>
      <div className={styles['cast-grid']}>
        {movie.people.map((person) => {
          // Create a unique key using available data
          const uniqueKey = `${person.id || 'unknown'}-${person.role}-${person.name}`;
          
          return (
            <div key={uniqueKey} className={styles['cast-card']}>
              <div className={styles['cast-image-container']}>
                {person.image_url && !failedImages.has(person.id) ? (
                  <img 
                    src={person.image_url} 
                    alt={person.name} 
                    className={styles['cast-image']} 
                    onError={() => handleImageError(person.id)}
                  />
                ) : (
                  <div className={styles['cast-image-placeholder']}>
                    <FiUser className={styles['placeholder-icon']} />
                  </div>
                )}
              </div>
              <div className={styles['cast-info']}>
                <h3 className={styles['cast-name']} title={person.name}>
                  {person.name}
                </h3>
                <p className={styles['cast-role']} title={person.role}>
                  {person.role}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
CastGrid.propTypes = {
  movie: PropTypes.shape({
    people: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        name: PropTypes.string.isRequired,
        role: PropTypes.string.isRequired,
        image_url: PropTypes.string
      })
    )
  })
};

CastGrid.defaultProps = {
  movie: null
};

export default CastGrid;