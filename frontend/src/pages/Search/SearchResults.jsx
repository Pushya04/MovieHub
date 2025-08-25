import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMovies } from '../../context/MovieContext';
import MovieGrid from '../../components/homepage/MovieGrid/MovieGrid';
import SearchInput from '../../components/common/SearchInput/SearchInput';
import styles from './SearchResults.module.css';

const SearchResults = () => {
  console.log('SearchResults component rendering');

  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  
  const searchQuery = queryParams.get('q') || '';
  const searchType = queryParams.get('type') || 'movie';
  
  console.log('URL parameters:', { searchQuery, searchType });

  // Get the movies context
  const moviesContext = useMovies();
  
  console.log('Movies context received:', {
    hasContext: Boolean(moviesContext),
    isLoading: moviesContext?.isLoading,
    searchResults: moviesContext?.searchResults 
      ? `Array with ${moviesContext.searchResults.length} items` 
      : 'undefined/null'
  });
  
  // Safely destructure with defaults
  const {
    searchResults = [],
    searchMovies = () => Promise.resolve([]),
    getMoviesByDirector = () => Promise.resolve([]),
    getMoviesByActor = () => Promise.resolve([]),
    isLoading = false,
    error = null,
    currentPage = 1,
    totalPages = 1
  } = moviesContext || {};
  
  // Local state for the component
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [selectedSearchType, setSelectedSearchType] = useState(searchType);
  const [localResults, setLocalResults] = useState([]);
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  // Sync context results to local state
  useEffect(() => {
    console.log('Syncing search results to local state, length:', 
      Array.isArray(searchResults) ? searchResults.length : 'not an array');
    
    if (Array.isArray(searchResults)) {
      setLocalResults(searchResults);
    }
  }, [searchResults]);
  
  // Sync other context states to local
  useEffect(() => {
    setLocalLoading(isLoading);
    setLocalError(error);
  }, [isLoading, error]);

  // Helper function to handle different response formats
  const extractResults = (response) => {
    // Check if response is an array (old API format)
    if (Array.isArray(response)) {
      console.log('Response is array with length:', response.length);
      return response;
    }
    
    // Check if response has results property (new API format)
    if (response && response.results) {
      console.log('Response has results property with length:', response.results.length);
      return response.results;
    }
    
    // If response is somehow undefined or not in expected format
    console.log('Response is in unexpected format:', response);
    return [];
  };

  // Perform search when URL parameters change
  useEffect(() => {
    console.log('Search effect running with:', { searchQuery, searchType });
    
    let isMounted = true;
    
    const performSearch = async () => {
      if (!searchQuery || !isMounted) return;
      
      setLocalLoading(true);
      try {
        console.log('Starting search for:', searchQuery, 'with type:', searchType);
        
        let response;
        
        // Perform search based on selected type
        switch (searchType) {
          case 'director':
            console.log('Searching by director');
            response = await getMoviesByDirector(searchQuery);
            break;
          case 'actor':
            console.log('Searching by actor');
            response = await getMoviesByActor(searchQuery);
            break;
          case 'movie':
          default:
            console.log('Searching by movie title');
            response = await searchMovies(searchQuery);
            break;
        }
        
        const results = extractResults(response);
        console.log(`Search completed with ${results.length} results:`, results);
        
        if (isMounted) {
          setLocalQuery(searchQuery);
          setSelectedSearchType(searchType);
          setLocalResults(results);
          setLocalError(null);
        }
      } catch (err) {
        console.error("Search error:", err);
        if (isMounted) {
          setLocalError(err.message || 'Search failed. Please try again.');
          setLocalResults([]);
        }
      } finally {
        if (isMounted) {
          setLocalLoading(false);
        }
      }
    };
    
    performSearch();
    
    return () => { 
      console.log('Search effect cleanup');
      isMounted = false; 
    };
  }, [searchQuery, searchType, searchMovies, getMoviesByDirector, getMoviesByActor]);
  
  const handleSearchSubmit = (newQuery, newType = selectedSearchType) => {
    console.log('Search submitted:', newQuery, 'with type:', newType);
    const trimmedQuery = newQuery.trim();
    if (trimmedQuery) {
      navigate(`/search?q=${encodeURIComponent(trimmedQuery)}&type=${newType}`);
    }
  };
  
  const handleSearchTypeChange = (e) => {
    const newType = e.target.value;
    console.log('Search type changed to:', newType);
    setSelectedSearchType(newType);
    if (localQuery) {
      handleSearchSubmit(localQuery, newType);
    }
  };
  
  const handleLoadMore = async () => {
    console.log('Load more clicked, current page:', currentPage, 'total pages:', totalPages);
    if (currentPage < totalPages && !localLoading) {
      setLocalLoading(true);
      try {
        const nextPage = currentPage + 1;
        console.log('Loading page:', nextPage);
        
        let response;
        
        switch (selectedSearchType) {
          case 'director':
            response = await getMoviesByDirector(localQuery, nextPage);
            break;
          case 'actor':
            response = await getMoviesByActor(localQuery, nextPage);
            break;
          case 'movie':
          default:
            response = await searchMovies(localQuery, nextPage);
            break;
        }
        
        const results = extractResults(response);
        console.log(`Load more completed with ${results.length} additional results`);
        
        setLocalResults(prev => [...prev, ...results]);
      } catch (err) {
        console.error("Load more error:", err);
        setLocalError(err.message || 'Failed to load more results.');
      } finally {
        setLocalLoading(false);
      }
    }
  };
  
  // Safe check for results
  const hasResults = localResults && localResults.length > 0;
  console.log('Rendering with results:', hasResults, 'count:', localResults?.length || 0);
  
  const renderContent = () => {
    if (localLoading && !hasResults) {
      console.log('Rendering loading state');
      return (
        <div className={styles['loading-container']}>
          <div className={styles['loading-spinner']}></div>
        </div>
      );
    }
    
    if (localError) {
      console.log('Rendering error state:', localError);
      return (
        <div className={styles['error-container']}>
          <div className={styles['error-message']}>{localError}</div>
        </div>
      );
    }
    
    if (!hasResults && localQuery) {
      console.log('Rendering no results state');
      return (
        <div className={styles['no-results']}>
          <p>No movies found matching "{localQuery}" in {selectedSearchType} search</p>
          <p>Try different keywords, search type, or browse our collection.</p>
        </div>
      );
    }
    
    console.log('Rendering movie grid with', localResults?.length || 0, 'results');
    return (
      <>
        <MovieGrid movies={localResults || []} />
        {currentPage < totalPages && (
          <button
            onClick={handleLoadMore}
            className={styles['load-more-button']}
            disabled={localLoading}
          >
            {localLoading ? 'Loading...' : 'Load More'}
          </button>
        )}
      </>
    );
  };
  
  return (
    <div className={styles['search-results-container']}>
      <div className={styles['search-header']}>
        <div className={styles['search-controls']}>
          <SearchInput
            initialValue={localQuery}
            onSubmit={(query) => handleSearchSubmit(query, selectedSearchType)}
            className={styles['search-input']}
          />
          
          <div className={styles['search-type-selector']}>
            <select 
              value={selectedSearchType} 
              onChange={handleSearchTypeChange}
              className={styles['search-type-dropdown']}
            >
              <option value="movie">Movie Title</option>
              <option value="director">Director</option>
              <option value="actor">Actor</option>
            </select>
          </div>
        </div>
        
        {localQuery && (
          <h1 className={styles['search-title']}>
            {selectedSearchType.charAt(0).toUpperCase() + selectedSearchType.slice(1)} Search Results for "{decodeURIComponent(localQuery)}"
          </h1>
        )}
        
        {hasResults && (
          <p className={styles['results-count']}>
            Found {localResults.length} results
          </p>
        )}
      </div>
      
      {renderContent()}
    </div>
  );
};

export default SearchResults;