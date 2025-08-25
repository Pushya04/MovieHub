import { useContext } from 'react';
import { MovieContext } from '../context/MovieContext';

export const useMovies = () => {
  const context = useContext(MovieContext);
  
  if (!context) {
    throw new Error('useMovies must be used within a MovieProvider');
  }

  return {
    featuredMovies: context.featuredMovies,
    currentMovie: context.currentMovie,
    isLoading: context.isLoading,
    error: context.error,
    getMovieDetails: context.getMovieDetails,
    loadFeaturedMovies: context.loadFeaturedMovies,
    searchMovies: context.searchMovies,
    getMoviesByGenre: context.getMoviesByGenre
  };
};