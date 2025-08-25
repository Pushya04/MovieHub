import { get, post, put, del } from './api';

export const profileAPI = {
  // Get user's comments
  getUserComments: async (userId, page = 1, limit = 10) => {
    try {
      const response = await get(`/movies/0/comments/users/me/comments?skip=${(page - 1) * limit}&limit=${limit}`);
      return response;
    } catch (error) {
      console.error('Error fetching user comments:', error);
      throw error;
    }
  },

  // Get user's watchlist
  getUserWatchlist: async () => {
    try {
      const response = await get('/watchlists');
      return response;
    } catch (error) {
      console.error('Error fetching user watchlist:', error);
      throw error;
    }
  },

  // Get user profile information
  getUserProfile: async (userId) => {
    try {
      const response = await get(`/users/me`);
      return response;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  // Update user profile
  updateUserProfile: async (userData) => {
    try {
      const response = await put('/auth/me', userData);
      return response;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  // Delete user comment
  deleteComment: async (movieId, commentId) => {
    try {
      await del(`/movies/${movieId}/comments/${commentId}`);
      return true;
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  },

  // Remove movie from watchlist
  removeFromWatchlist: async (movieId) => {
    try {
      await del(`/watchlists/${movieId}`);
      return true;
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      throw error;
    }
  }
};
