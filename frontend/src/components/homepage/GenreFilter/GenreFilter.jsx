import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { moviesAPI } from '../../../api/movies';
import styles from './GenreFilter.module.css';

const GenreFilter = ({ onFilterChange, initialSelected = [], activeGenreId = null }) => {
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState(initialSelected);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load genres when component mounts
  useEffect(() => {
    const loadGenres = async () => {
      try {
        const data = await moviesAPI.getGenres();
        setGenres(data);
        setError(null);
      } catch (err) {
        console.error('Error loading genres:', err);
        setError(err.message || 'Failed to load genres');
      } finally {
        setIsLoading(false);
      }
    };

    loadGenres();
  }, []);

  // Handle changes when activeGenreId changes (from GenreCarousel selection)
  useEffect(() => {
    if (activeGenreId !== null) {
      // If there's an active genre from carousel, update selected genres
      const newSelection = [activeGenreId];
      setSelectedGenres(newSelection);
      onFilterChange(newSelection);
    }
  }, [activeGenreId, onFilterChange]);

  const handleGenreToggle = (genreId) => {
    const newSelection = selectedGenres.includes(genreId)
      ? selectedGenres.filter(id => id !== genreId)
      : [...selectedGenres, genreId];
    
    setSelectedGenres(newSelection);
    onFilterChange(newSelection);
  };

  const handleClearFilters = () => {
    setSelectedGenres([]);
    onFilterChange([]);
  };

  if (error) {
    return (
      <div className={styles.error}>
        <p>Error loading genres: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className={styles.retryButton}
        >
          Retry
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Filter by Genre</h3>
        {selectedGenres.length > 0 && (
          <button 
            className={styles.clearButton}
            onClick={handleClearFilters}
            type="button"
          >
            Clear All
          </button>
        )}
      </div>
      <div className={styles.buttons}>
        {genres.map(genre => (
          <button
            key={genre.id}
            onClick={() => handleGenreToggle(genre.id)}
            className={`${styles.button} ${
              selectedGenres.includes(genre.id) ? styles.selected : ''
            }`}
            aria-pressed={selectedGenres.includes(genre.id)}
            type="button"
          >
            {genre.name}
          </button>
        ))}
      </div>
    </div>
  );
};

GenreFilter.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  initialSelected: PropTypes.arrayOf(PropTypes.number),
  activeGenreId: PropTypes.number
};

export default GenreFilter;