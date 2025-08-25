import axios from './axios';

const handleApiError = (error, defaultMessage) => {
  const serverMessage = error.response?.data?.detail || error.message;
  return Promise.reject(new Error(serverMessage || defaultMessage));
};

export const authAPI = {
  register: async (userData) => {
    try {
      const response = await axios.post(`/auth/register`, {
        email: userData.email,
        username: userData.username,
        password: userData.password
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Registration failed');
    }
  },

  login: async (credentials) => {
    try {
      const formData = new FormData();
      formData.append('username', credentials.email);
      formData.append('password', credentials.password);
      
      const response = await axios.post(`/auth/login`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      const { access_token, token_type, user_id } = response.data;
      
      // Store token with expiration
      localStorage.setItem('accessToken', JSON.stringify({
        value: access_token,
        expires: Date.now() + (30 * 60 * 1000) // 30 minutes
      }));
  
      // Fetch user details
      const userResponse = await axios.get(`/auth/me`);
  
      // Store user details
      localStorage.setItem('user', JSON.stringify({
        id: userResponse.data.id,
        email: userResponse.data.email,
        username: userResponse.data.username
      }));
  
      return {
        accessToken: access_token,
        tokenType: token_type,
        user: userResponse.data
      };
    } catch (error) {
      return handleApiError(error, 'Login failed');
    }
  },
  
  getCurrentUser: async () => {
    try {
      const response = await axios.get(`/auth/me`);
      const userData = {
        id: response.data.id,
        email: response.data.email,
        username: response.data.username,
        avatar: response.data.avatar || '/default-avatar.png',
        is_active: response.data.is_active,
        created_at: new Date(response.data.created_at)
      };
      
      // Always update user in localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      
      return userData;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
      }
      return handleApiError(error, 'Failed to fetch user');
    }
  },
  
  forgotPassword: async (email) => {
    try {
      return await axios.post(`/auth/forgot-password`, { email });
    } catch (error) {
      return handleApiError(error, 'Password reset failed');
    }
  },

  resetPassword: async (resetData) => {
    try {
      return await axios.post(`/auth/reset-password`, {
        email: resetData.email,
        otp: resetData.otp,
        new_password: resetData.newPassword
      });
    } catch (error) {
      return handleApiError(error, 'Password update failed');
    }
  },

  deleteUser: async (password) => {
    try {
      const token = JSON.parse(localStorage.getItem('accessToken'));
      if (!token || !token.value) {
        throw new Error('No access token found');
      }

      // Get current user ID from localStorage
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.id) {
        throw new Error('User information not found');
      }

      const response = await axios.delete(`/auth/users/${user.id}`, {
        data: { password },
        headers: {
          'Authorization': `Bearer ${token.value}`,
          'Content-Type': 'application/json'
        }
      });
      
      // If successful, logout and clear local storage
      authAPI.logout();
      return true;
    } catch (error) {
      return handleApiError(error, 'Account deletion failed');
    }
  },

  logout: () => {
    ['accessToken', 'userId', 'user'].forEach(item => 
      localStorage.removeItem(item)
    );
  }
};

// Axios interceptors
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      authAPI.logout();
      // Redirect to login page or trigger re-authentication
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);