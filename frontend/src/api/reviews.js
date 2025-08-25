import axios from './axios';

const transformComment = (comment) => ({
    id: comment.id,
    content: comment.text,  // Backend sends text, transform to content
    movie_id: comment.movie_id,
    user_id: comment.user_id,
    likes: comment.likes || 0,
    created_at: new Date(comment.created_at),
    updated_at: comment.updated_at ? new Date(comment.updated_at) : null,
    user: comment.user ? {
      id: comment.user.id,
      email: comment.user.email,
      username: comment.user.username,
      is_active: comment.user.is_active,
      created_at: new Date(comment.user.created_at)
    } : null
});



export const reviewsAPI = {
  getComments: async (movieId) => {
    try {
      const response = await axios.get(`/movies/${movieId}/comments/`);
      return response.data.map(transformComment);
    } catch (error) {
      console.error('Get comments error:', error.response ? error.response.data : error);
      throw new Error(error.response?.data?.detail || 'Failed to fetch comments');
    }
  },

  createComment: async (movieId, content) => {
    try {
      console.log('Creating comment:', {
        movieId,
        content,
        contentLength: content.length,
        contentType: typeof content
      });

      // Send with text instead of content to match backend documentation
      const response = await axios.post(
        `/movies/${movieId}/comments/`,
        { text: content },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Comment creation response:', {
        status: response.status,
        data: response.data
      });

      return transformComment(response.data);
    } catch (error) {
      console.error('Create comment error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        config: error.config
      });
      throw new Error(error.response?.data?.detail || 'Failed to create comment');
    }
  },

  updateComment: async (movieId, commentId, content) => {
    try {
      console.log('Updating comment:', {
        movieId,
        commentId,
        content,
        contentLength: content.length
      });
  
      const response = await axios.put(
        `/movies/${movieId}/comments/${commentId}`,
        { text: content },  // Use 'text' to match backend
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
  
      console.log('Comment update response:', {
        status: response.status,
        data: response.data
      });
  
      return transformComment(response.data);
    } catch (error) {
      console.error('Update comment error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        config: error.config
      });
      throw new Error(error.response?.data?.detail || 'Failed to update comment');
    }
  },

  deleteComment: async (movieId, commentId) => {
    try {
      await axios.delete(`/movies/${movieId}/comments/${commentId}`);
      return true;
    } catch (error) {
      console.error('Delete comment error:', error.response ? error.response.data : error);
      throw new Error(error.response?.data?.detail || 'Failed to delete comment');
    }
  },

  likeComment: async (movieId, commentId) => {
    try {
      const response = await axios.post(
        `/movies/${movieId}/comments/${commentId}/like`
      );
      return transformComment(response.data);
    } catch (error) {
      console.error('Like comment error:', error.response ? error.response.data : error);
      throw new Error(error.response?.data?.detail || 'Failed to like comment');
    }
  },

  getUserComments: async () => {
    try {
      const response = await axios.get(`/movies/comments/users/me/comments`);
      return response.data.map(transformComment);
    } catch (error) {
      console.error('Get user comments error:', error.response ? error.response.data : error);
      throw new Error(error.response?.data?.detail || 'Failed to fetch user comments');
    }
  },

  getLikedComments: async () => {
    try {
      const response = await axios.get(`/movies/comments/users/me/likes`);
      return response.data.map(transformComment);
    } catch (error) {
      console.error('Get liked comments error:', error.response ? error.response.data : error);
      throw new Error(error.response?.data?.detail || 'Failed to fetch liked comments');
    }
  }
};