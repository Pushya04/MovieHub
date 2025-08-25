import axios from './axios';

export const watchlistAPI = {
  addToWatchlist: async (movieId) => {
    try {
      const response = await axios.post(`/watchlists`, {
        movie_id: movieId
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || 'Failed to add to watchlist';
    }
  },

  getWatchlist: async () => {
    try {
      const response = await axios.get(`/watchlists`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || 'Failed to fetch watchlist';
    }
  },

  removeFromWatchlist: async (watchlistId) => {
    try {
      await axios.delete(`/watchlists/${watchlistId}`);
      return true;
    } catch (error) {
      throw error.response?.data?.detail || 'Failed to remove from watchlist';
    }
  }
};

// Updated interceptor for watchlist data transformation
axios.interceptors.response.use(
  response => {
    // Handle empty responses (like DELETE with 204 No Content)
    if (response.status === 204 || !response.data) {
      return response;
    }
    
    if (response.config.url?.includes('/watchlists')) {
      const transformItem = (item) => ({
        id: item.id,
        movieId: item.movie_id,
        movieTitle: item.movie_title,
        userId: item.user_id,
        createdAt: new Date(item.created_at)
      });

      if (Array.isArray(response.data)) {
        return {
          ...response,
          data: response.data.map(transformItem)
        };
      }
      
      if (response.data && response.data.id) {
        return {
          ...response,
          data: transformItem(response.data)
        };
      }
    }
    return response;
  },
  error => {
    return Promise.reject(error);
  }
);