const API_BASE_URL = 'http://localhost:8000';

const getToken = () => {
  const item = localStorage.getItem('accessToken');
  if (!item) return null;
  try {
    const { value, expires } = JSON.parse(item);
    if (Date.now() > expires) {
      localStorage.removeItem('accessToken');
      return null;
    }
    return value;
  } catch {
    localStorage.removeItem('accessToken');
    return null;
  }
};

const getAuthHeaders = () => {
  const token = getToken();
  console.log('Getting auth headers, token:', token ? 'exists' : 'missing');
  
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    console.log('Added Authorization header:', `Bearer ${token.substring(0, 10)}...`);
  } else {
    console.log('No token found, making unauthenticated request');
  }
  
  return headers;
};

export const get = async (endpoint) => {
  const headers = getAuthHeaders();
  console.log('Making GET request to:', `${API_BASE_URL}${endpoint}`);
  console.log('Headers:', headers);
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: headers,
      credentials: 'include'
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      
      if (response.status === 401) {
        throw new Error('Not authenticated');
      }
      
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Check if response has content before parsing as JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      // For empty responses
      return null;
    }
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

export const post = async (endpoint, data) => {
  const headers = getAuthHeaders();
  console.log('Making POST request to:', `${API_BASE_URL}${endpoint}`);
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: headers,
      credentials: 'include',
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      
      if (response.status === 401) {
        throw new Error('Not authenticated');
      }
      
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Check if response has content before parsing as JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      // For empty responses
      return null;
    }
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

export const put = async (endpoint, data) => {
  const headers = getAuthHeaders();
  console.log('Making PUT request to:', `${API_BASE_URL}${endpoint}`);
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      
      if (response.status === 401) {
        throw new Error('Not authenticated');
      }
      
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Check if response has content before parsing as JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      // For empty responses
      return null;
    }
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

export const del = async (endpoint) => {
  const headers = getAuthHeaders();
  console.log('Making DELETE request to:', `${API_BASE_URL}${endpoint}`);
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: headers,
      credentials: 'include'
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      
      if (response.status === 401) {
        throw new Error('Not authenticated');
      }
      
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Check if response has content before parsing as JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      // For empty responses (like DELETE with 204 No Content)
      return null;
    }
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};
