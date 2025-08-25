import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8000',
});

instance.interceptors.request.use((config) => {
  // Carefully parse the token
  const tokenItem = localStorage.getItem('accessToken');
  
  if (tokenItem) {
    try {
      const { value: token } = JSON.parse(tokenItem);
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error parsing token:', error);
      localStorage.removeItem('accessToken');
    }
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

instance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Clear authentication state
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      
      // Redirect to login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance;