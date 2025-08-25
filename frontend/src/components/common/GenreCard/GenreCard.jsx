// GenreCard.jsx
import React from 'react';
import PropTypes from 'prop-types';
import styles from './GenreCard.module.css';

const GenreCard = ({ genre, onClick }) => {
  const genreColors = {
    'Action': '#FF6B6B',
    'Crime': '#4ECDC4',
    'Drama': '#45B7D1',
    'Adventure': '#FDCB6E',
    'Sci-Fi': '#6C5CE7',
    'Fantasy': '#A29BFE',
    'Comedy': '#FF9FF3',
    'Thriller': '#54A0FF',
    'Animation': '#5F27CD',
    'Mystery': '#10AC84',
    'Horror': '#FF5252',
    'History': '#747D8C',
    'War': '#2F3542',
    'Biography': '#1E90FF',
    'Music': '#FF6F61',
    'Sport': '#6A5ACD',
    'Romance': '#FF69B4',
    'Western': '#8B4513'
  };

  return (
    <div 
      className={styles.card}
      style={{ 
        backgroundColor: genreColors[genre.name] || '#34495E',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <div className={styles.content}>
        <h3 className={styles.title}>{genre.name}</h3>
      </div>
    </div>
  );
};

GenreCard.propTypes = {
  genre: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  onClick: PropTypes.func.isRequired
};

export default GenreCard;