import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { moviesAPI } from '../api/movies';
import PropTypes from 'prop-types';

const MovieContext = createContext();

export function MovieProvider({ children }) {
  console.log('MovieProvider initializing');
  
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [currentMovie, setCurrentMovie] = useState(null);
  const [moviesByGenre, setMoviesByGenre] = useState({});
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('movie'); // Default search type
  const movieCache = useRef({});

  const handleError = (error, defaultMessage) => {
    console.error('Error handled:', error, 'Default message:', defaultMessage);
    const message = error.response?.data?.detail || error.message || defaultMessage;
    setError(message);
    return message;
  };

  const getMovieDetails = useCallback(async (movieId) => {
    if (movieCache.current[movieId]) {
      setCurrentMovie(movieCache.current[movieId]);
      return movieCache.current[movieId];
    }

    setIsLoading(true);
    try {
      const movie = await moviesAPI.getMovieById(movieId);
      
      if (movie) {
        movieCache.current[movieId] = movie;
        setCurrentMovie(movie);
        setError(null);
      }
      
      return movie;
    } catch (err) {
      console.error('Error in getMovieDetails:', err);
      handleError(err, 'Failed to load movie details');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadFeaturedMovies = useCallback(async (page = 1) => {
    console.log('loadFeaturedMovies called with page:', page);
    // Check cache for better performance
    const cacheKey = `featured_${page}`;
    if (movieCache.current[cacheKey]) {
      console.log('Using cached featured movies for page:', page);
      const cachedMovies = movieCache.current[cacheKey];
      setFeaturedMovies(prev => page === 1 ? cachedMovies : [...prev, ...cachedMovies]);
      return cachedMovies;
    }
    
    console.log('Fetching featured movies from API for page:', page);
    setIsLoading(true);
    try {
      const movies = await moviesAPI.getFilteredMovies({
        sort_by: 'imdb_rating',
        sort_order: 'desc',
        page,
        limit: 20,  // Increased back to 20 for better pagination
        offset: (page - 1) * 20  // Add proper offset for pagination
      });
      
      console.log('API response received:', movies);
      
      // Safety check for array
      const movieArray = Array.isArray(movies) ? movies : [];
      console.log('Processed movie array:', movieArray.length, 'movies');
      
      // Cache the results
      movieCache.current[cacheKey] = movieArray;
      
      if (page === 1) {
        // Replace movies on first page
        console.log('Setting featured movies (first page):', movieArray.length, 'movies');
        setFeaturedMovies(movieArray);
      } else {
        // Append movies on subsequent pages
        console.log('Appending featured movies (page', page, '):', movieArray.length, 'movies');
        setFeaturedMovies(prev => [...prev, ...movieArray]);
      }
      
      // Update pagination state
      setTotalPages(Math.ceil(movieArray.length / 20));
      setCurrentPage(page);
      setError(null);
      return movies;
    } catch (err) {
      console.error('Error in loadFeaturedMovies:', err);
      handleError(err, 'Failed to load featured movies');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadMoreFeaturedMovies = useCallback(async () => {
    const nextPage = currentPage + 1;
    console.log('Loading more featured movies, page:', nextPage);
    return await loadFeaturedMovies(nextPage);
  }, [currentPage, loadFeaturedMovies]);

  // Helper to handle API responses that may be in different formats
  const processSearchResults = (response) => {
    console.log('Processing search results:', response);
    
    // Handle array response
    if (Array.isArray(response)) {
      return {
        results: response,
        total_pages: Math.ceil(response.length / 20) || 1,
        current_page: 1
      };
    }
    
    // Handle object with results property
    if (response && response.results) {
      return response;
    }
    
    // Handle empty or unexpected response
    return {
      results: [],
      total_pages: 0,
      current_page: 1
    };
  };

  const searchMovies = useCallback(async (query, page = 1) => {
    console.log('searchMovies called with query:', query, 'page:', page);
    if (!query) {
      console.log('No query provided, returning empty results');
      return [];
    }
    
    setIsLoading(true);
    try {
      console.log('Searching movies by title');
      const response = await moviesAPI.searchMovies(query);
      console.log('Search response:', response);
      
      // Set search state
      setSearchQuery(query);
      setSearchType('movie');
      
      // Process search results
      if (Array.isArray(response) && response.length > 0) {
        console.log('Setting search results with length:', response.length);
        setSearchResults(response);
        setTotalPages(Math.ceil(response.length / 20) || 1);
        setCurrentPage(1);
        setError(null);
      } else {
        console.log('Search returned no results');
        setSearchResults([]);
        setTotalPages(0);
        setCurrentPage(1);
      }
      
      return response;
    } catch (err) {
      console.error('Error in searchMovies:', err);
      handleError(err, 'Search failed');
      setSearchResults([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getMoviesByGenre = useCallback(async (genreId, page = 1) => {
    console.log('getMoviesByGenre called with genreId:', genreId, 'page:', page);
    setIsLoading(true);
    try {
      console.log('Fetching movies by genre');
      const movies = await moviesAPI.getMoviesByGenre(genreId);
      console.log('Genre movies response:', movies);
      
      // Safety check for array
      const movieArray = Array.isArray(movies) ? movies : [];
      
      setSelectedGenre(genreId);
      setMoviesByGenre(prev => ({
        ...prev,
        [genreId]: page === 1 ? movieArray : [...(prev[genreId] || []), ...movieArray]
      }));
      setTotalPages(Math.ceil(movieArray.length / 20) || 1);
      setCurrentPage(page);
      setError(null);
      return movies;
    } catch (err) {
      console.error('Error in getMoviesByGenre:', err);
      handleError(err, 'Failed to load genre movies');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getRelatedMovies = useCallback(async (movieId) => {
    console.log('getRelatedMovies called with movieId:', movieId);
    
    // Check cache first for better performance
    const cacheKey = `related_${movieId}`;
    if (movieCache.current[cacheKey]) {
      console.log('Related movies found in cache');
      return movieCache.current[cacheKey];
    }
    
    setIsLoading(true);
    try {
      console.log('Fetching movie for related movies');
      const movie = await moviesAPI.getMovieById(movieId);
      console.log('Movie details for related:', movie?.title || 'unknown');
      
      if (!movie || !movie.genres || !movie.genres.length) {
        console.log('No genre found for related movies');
        return [];
      }

      const firstGenre = movie.genres[0];
      console.log('First genre:', firstGenre);
      
      // Try to get related movies by genre ID first, fallback to genre name
      let relatedMovies = [];
      if (firstGenre?.id) {
        console.log('Fetching related movies by genre ID:', firstGenre.id);
        try {
          relatedMovies = await moviesAPI.getMoviesByGenre(firstGenre.id);
        } catch (err) {
          console.log('Failed to fetch by genre ID, trying by name:', err);
        }
      }
      
      // If no results by ID, try by genre name
      if (!relatedMovies || relatedMovies.length === 0) {
        if (firstGenre?.name) {
          console.log('Fetching related movies by genre name:', firstGenre.name);
          try {
            // Use search functionality to find movies with similar genre
            const searchResults = await moviesAPI.getFilteredMovies({
              search: firstGenre.name,
              limit: 20
            });
            relatedMovies = searchResults || [];
          } catch (err) {
            console.log('Failed to fetch by genre name:', err);
          }
        }
      }
      
      // Final fallback: if still no results, get some featured movies
      if (!relatedMovies || relatedMovies.length === 0) {
        console.log('No genre-based results, falling back to featured movies');
        try {
          const featuredResults = await moviesAPI.getFilteredMovies({
            sort_by: 'imdb_rating',
            sort_order: 'desc',
            limit: 20
          });
          relatedMovies = featuredResults || [];
        } catch (err) {
          console.log('Failed to fetch featured movies as fallback:', err);
        }
      }
      
      console.log('Related movies response:', relatedMovies);
      
      // Safety check for array and filter out current movie
      const movieArray = Array.isArray(relatedMovies) ? relatedMovies : [];
      console.log('RelatedMovies: Raw movie array before filtering:', movieArray.map(m => ({ id: m?.id, title: m?.title })));
      
      const filteredMovies = movieArray.filter(m => {
        if (!m || !m.id) {
          console.warn('RelatedMovies: Movie missing ID:', m);
          return false;
        }
        if (m.id === movieId) {
          console.log('RelatedMovies: Filtering out current movie:', m.title);
          return false;
        }
        return true;
      }).slice(0, 2); // Reduced from 3 to 2 for faster loading
      
      console.log('RelatedMovies: Final filtered movies:', filteredMovies.map(m => ({ id: m?.id, title: m?.title })));
      
      // Cache the results for better performance
      movieCache.current[cacheKey] = filteredMovies;
      
      return filteredMovies;
    } catch (err) {
      console.error('Error in getRelatedMovies:', err);
      handleError(err, 'Failed to load related movies');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Function to search movies by director
  const getMoviesByDirector = useCallback(async (directorName, page = 1) => {
    console.log('getMoviesByDirector called with name:', directorName, 'page:', page);
    if (!directorName) {
      console.log('No director name provided, returning empty results');
      return [];
    }
    
    setIsLoading(true);
    try {
      console.log('Fetching movies by director');
      const movies = await moviesAPI.getMoviesByDirector(directorName);
      console.log('Director movies response:', movies);
      
      // Safety check for array
      const movieArray = Array.isArray(movies) ? movies : [];
      
      // Update search state
      setSearchQuery(directorName);
      setSearchType('director');
      setSearchResults(movieArray);
      setTotalPages(Math.ceil(movieArray.length / 20) || 1);
      setCurrentPage(page);
      setError(null);
      
      return movieArray;
    } catch (err) {
      console.error('Error in getMoviesByDirector:', err);
      handleError(err, 'Failed to find movies by this director');
      setSearchResults([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Function to search movies by actor
  const getMoviesByActor = useCallback(async (actorName, page = 1) => {
    console.log('getMoviesByActor called with name:', actorName, 'page:', page);
    if (!actorName) {
      console.log('No actor name provided, returning empty results');
      return [];
    }
    
    setIsLoading(true);
    try {
      console.log('Fetching movies by actor');
      const movies = await moviesAPI.getMoviesByActor(actorName);
      console.log('Actor movies response:', movies);
      
      // Safety check for array
      const movieArray = Array.isArray(movies) ? movies : [];
      
      // Update search state
      setSearchQuery(actorName);
      setSearchType('actor');
      setSearchResults(movieArray);
      setTotalPages(Math.ceil(movieArray.length / 20) || 1);
      setCurrentPage(page);
      setError(null);
      
      return movieArray;
    } catch (err) {
      console.error('Error in getMoviesByActor:', err);
      handleError(err, 'Failed to find movies with this actor');
      setSearchResults([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Enhanced refreshData to include the new search types
  const refreshData = useCallback(async () => {
    console.log('refreshData called with query:', searchQuery, 'type:', searchType);
    if (searchQuery) {
      switch (searchType) {
        case 'director':
          console.log('Refreshing director search');
          return getMoviesByDirector(searchQuery);
        case 'actor':
          console.log('Refreshing actor search');
          return getMoviesByActor(searchQuery);
        case 'movie':
        default:
          console.log('Refreshing movie search');
          return searchMovies(searchQuery);
      }
    }
    
    if (selectedGenre) {
      console.log('Refreshing genre movies');
      return getMoviesByGenre(selectedGenre);
    }
    
    console.log('Refreshing featured movies');
    return loadFeaturedMovies();
  }, [searchQuery, searchType, selectedGenre, searchMovies, getMoviesByDirector, getMoviesByActor, getMoviesByGenre, loadFeaturedMovies]);

  // Create resetter for search results
  const clearSearchResults = useCallback(() => {
    console.log('Clearing search results');
    setSearchResults([]);
    setSearchQuery('');
    setSearchType('movie');
  }, []);

  const value = {
    featuredMovies,
    currentMovie,
    moviesByGenre,
    searchResults,
    isLoading,
    error,
    currentPage,
    totalPages,
    selectedGenre,
    searchQuery,
    searchType,
    getMovieDetails,
    loadFeaturedMovies,
    searchMovies,
    getMoviesByGenre,
    getMoviesByDirector,
    getMoviesByActor,
    getRelatedMovies,
    refreshData,
    clearError: () => setError(null),
    setSearchResults,
    clearSearchResults,
    loadMoreFeaturedMovies
  };



  console.log('MovieProvider context value:', value);
  
  return (
    <MovieContext.Provider value={value}>
      {children}
    </MovieContext.Provider>
  );
}

MovieProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useMovies = () => {
  const context = useContext(MovieContext);
  if (!context) {
    console.error('useMovies must be used within MovieProvider - context is null or undefined');
    throw new Error('useMovies must be used within MovieProvider');
  }
  return context;
};