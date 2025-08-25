import React, { useState, useEffect } from 'react';
import styles from './SearchInput.module.css';

const SearchInput = ({ initialValue = '', onSubmit, className }) => {
  const [searchValue, setSearchValue] = useState(initialValue);
  
  // Update local state when prop changes
  useEffect(() => {
    setSearchValue(initialValue);
  }, [initialValue]);
  
  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit && searchValue.trim()) {
      onSubmit(searchValue);
    }
  };
  
  return (
    <form 
      className={`${styles['search-form']} ${className || ''}`} 
      onSubmit={handleSubmit}
    >
      <button 
        type="submit" 
        className={styles['search-button']}
        aria-label="Submit search"
      >
        <svg 
          viewBox="0 0 24 24" 
          className={styles['search-icon']}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
        </svg>
      </button>
      <input
        type="text"
        value={searchValue}
        onChange={handleInputChange}
        placeholder="Search movies..."
        className={styles['search-input']}
        aria-label="Search"
      />
    </form>
  );
};

export default SearchInput;