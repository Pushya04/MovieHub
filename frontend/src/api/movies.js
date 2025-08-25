import axios from './axios';

const transformMovie = (movie) => {
    if (!movie) {
      console.warn('Attempting to transform null or undefined movie');
      return null;
    }
  
    try {
      return {
        title: movie.title || '',
        year: movie.year || null,
        run_length: movie.run_length || null,
        release_date: movie.release_date ? new Date(movie.release_date) : null,
        synopsis: movie.synopsis || '',
        trailer_url: movie.trailer_url || '',
        imdb_rating: movie.imdb_rating || null,
        predicted_rating: movie.predicted_rating || null,
        num_raters: movie.num_raters || 0,
        num_reviews: movie.num_reviews || 0,
        id: movie.id || null,
        genres: Array.isArray(movie.genres) 
          ? movie.genres.map(g => ({ 
              id: g?.id || null,
              name: g?.name || (typeof g === 'string' ? g : '') 
            })) 
          : [],
        
        people: Array.isArray(movie.people) 
          ? movie.people.map(p => ({
              name: p?.person?.name || p?.name || '',
              role: p?.role || ''
            })) 
          : [],
        
        comments: Array.isArray(movie.comments) 
          ? movie.comments.map(c => ({
              content: c.text || c.content || '',
              movie_id: c.movie_id || null,
              user_id: c.user_id || null,
              likes: c.likes || 0,
              created_at: c.created_at ? new Date(c.created_at) : null,
              user: c.user ? {
                id: c.user.id || null,
                email: c.user.email || '',
                username: c.user.username || '',
                is_active: c.user.is_active ?? false,
                created_at: c.user.created_at ? new Date(c.user.created_at) : null
              } : null
            })) 
          : [],
        
        providers: Array.isArray(movie.providers) 
          ? movie.providers.map(p => ({
              url: p.url || ''
            })) 
          : [],
        
        images: Array.isArray(movie.images) 
          ? movie.images.map(img => ({
              url: img.url || ''
            })) 
          : []
      };
    } catch (error) {
      console.error('Error transforming movie:', error);
      return null;
    }
  };
  
  export default transformMovie;
export const moviesAPI = {
  getGenres: async () => {
    try {
      const response = await axios.get(`/movies/genres/`);
      return response.data.map(g => ({ id: g.id, name: g.name }));
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch genres');
    }
  },

  getMovieById: async (movieId) => {
    if (!movieId) {
      throw new Error('Movie ID is required');
    }
     
    try {
      const response = await axios.get(`/movies/${movieId}`);
      const transformedMovie = transformMovie(response.data);
      return transformedMovie;
    } catch (error) {
      console.error("Error fetching movie:", error);
      throw new Error(error.response?.data?.detail || 'Movie not found');
    }
  },

  getFilteredMovies: async (filters = {}) => {
    try {
      const response = await axios.get(`/movies/`, {
        params: {
          year: filters.year,
          director: filters.director,
          actor: filters.actor,
          genre: filters.genre,
          min_rating: filters.minRating,
          search: filters.search,
          sort_by: filters.sortBy,
          sort_order: filters.sortOrder,
          limit: filters.limit,
          offset: filters.offset
        }
      });
      return response.data.map(transformMovie);
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch movies');
    }
  },

  getMoviesByGenre: async (genreId) => {
    try {
      const response = await axios.get(`/movies/by-genre/${genreId}`);
      console.log(response);
      return response.data.map(transformMovie);
    } catch (error) {
        console.log(error);
      throw new Error(error.response?.data?.detail || 'Failed to fetch genre movies');
    }
  },

  getMoviesByDirector: async (directorName) => {
    try {
      const response = await axios.get(
        `/movies/by-director/${encodeURIComponent(directorName)}`
      );
      console.log(response);
      return response.data.map(transformMovie);
    } catch (error) {
        
console.log(error);
      throw new Error(error.response?.data?.detail || 'Failed to fetch director movies');
    }
  },

  getMoviesByActor: async (actorName) => {
    try {
      const response = await axios.get(
        `/movies/by-actor/${encodeURIComponent(actorName)}`
      );
      console.log(response);
      return response.data.map(transformMovie);
    } catch (error) {
        console.log(error);
      throw new Error(error.response?.data?.detail || 'Failed to fetch actor movies');
    }
  },

  getMoviesByYear: async (year) => {
    try {
      const response = await axios.get(`/movies/by-year/${year}`);
      console.log(response);
      return response.data.map(transformMovie);
    } catch (error) {
        console.log(error);
      throw new Error(error.response?.data?.detail || 'Failed to fetch yearly movies');
    }
  },

  searchMovies: async (query) => {
    try {
      const response = await axios.get(
        `/movies/search/${encodeURIComponent(query)}`
      );
      console.log(response);
      return response.data.map(transformMovie);
    } catch (error) {
        console.log(error);
      throw new Error(error.response?.data?.detail || 'Search failed');
    }
  },

  getMovieProviders: async (movieId) => {
    try {
      const response = await axios.get(`/movies/${movieId}/providers`);
      console.log(response);
      return response.data.map(p => ({ id: p.id, url: p.url }));
    } catch (error) {
        console.log(error);
      throw new Error(error.response?.data?.detail || 'Failed to fetch providers');
    }
  },

  getMovieImages: async (movieId) => {
    try {
      const response = await axios.get(`/movies/${movieId}/images`);
      console.log(response);
      return response.data.map(img => ({ id: img.id, url: img.url }));
    } catch (error) {
        
        console.log(error);
      throw new Error(error.response?.data?.detail || 'Failed to fetch images');
    }
  }
};