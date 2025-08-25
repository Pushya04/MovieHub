import { useEffect } from 'react';
import { authAPI, moviesAPI, reviewsAPI } from '../../api';

export default function APITestComponent() {
  useEffect(() => {
    const testAllAPIs = async () => {
      try {
        // Test Public Auth Endpoints
        console.group('Auth API Tests');
        
        // Test Movies API
        console.group('Movies API Tests');
        const genres = await moviesAPI.getGenres();
        console.log('Genres:', genres);

        const filteredMovies = await moviesAPI.getFilteredMovies({
          genre: 'Action',
          limit: 5
        });
        console.log('Filtered Movies:', filteredMovies);

        const movieDetails = await moviesAPI.getMovieById(1);
        console.log('Movie Details:', movieDetails);

        const searchResults = await moviesAPI.searchMovies('avatar');
        console.log('Search Results:', searchResults);

        const providers = await moviesAPI.getMovieProviders(1);
        console.log('Providers:', providers);

        const images = await moviesAPI.getMovieImages(1);
        console.log('Images:', images);
        console.groupEnd();

        // Test Reviews API
        console.group('Reviews API Tests');
        const comments = await reviewsAPI.getComments(1);
        console.log('Comments:', comments);
        console.groupEnd();

      } catch (error) {
        console.error('API Test Error:', error);
      }
    };

    testAllAPIs();
  }, []);

  return <div className="api-test-banner">API Tests Running - Check Console</div>;
}