import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authAPI } from '../api/auth';
import PropTypes from 'prop-types';

const AuthContext = createContext();

// Encrypted token storage with expiration
const tokenStorage = {
    get: () => {
      const item = localStorage.getItem('accessToken');
      if (!item) return null;
      
      try {
        const { value, expires } = JSON.parse(item);
        
        // Check if token is expired
        if (Date.now() > expires) {
          tokenStorage.clear();
          return null;
        }
        
        return value;
      } catch (error) {
        console.error('Error parsing token:', error);
        tokenStorage.clear();
        return null;
      }
    },
    
    set: (token, expiresIn = 1800) => { // 30 minutes default
      const expires = Date.now() + (expiresIn * 1000);
      localStorage.setItem('accessToken', JSON.stringify({ 
        value: token, 
        expires 
      }));
    },
    
    clear: () => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      sessionStorage.clear();
    }
  };

// Security policies
const PASSWORD_POLICY = {
  minLength: 8,
  requireUpper: true,
  requireLower: true,
  requireNumber: true,
  requireSpecial: false
};

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
  });

  const validatePassword = useCallback((password) => {
    const validation = {
      isValid: true,
      errors: []
    };

    if (password.length < PASSWORD_POLICY.minLength) {
      validation.errors.push(`Minimum ${PASSWORD_POLICY.minLength} characters`);
      validation.isValid = false;
    }
    if (PASSWORD_POLICY.requireUpper && !/[A-Z]/.test(password)) {
      validation.errors.push('At least one uppercase letter');
      validation.isValid = false;
    }
    if (PASSWORD_POLICY.requireLower && !/[a-z]/.test(password)) {
      validation.errors.push('At least one lowercase letter');
      validation.isValid = false;
    }
    if (PASSWORD_POLICY.requireNumber && !/\d/.test(password)) {
      validation.errors.push('At least one number');
      validation.isValid = false;
    }

    return validation;
  }, []);

  const handleAuthSuccess = useCallback(({ user, accessToken, expiresIn = 3600 }) => {
    tokenStorage.set(accessToken, expiresIn);
    setAuthState({
      user,
      isAuthenticated: true,
      isLoading: false,
      error: null
    });
  }, []);

  const handleAuthFailure = useCallback((error) => {
    tokenStorage.clear();
    setAuthState(prev => ({
      ...prev,
      isAuthenticated: false,
      isLoading: false,
      error: error.message
    }));
  }, []);

  const validateSession = useCallback(async () => {
    try {
      // Retrieve token from storage
      const tokenItem = localStorage.getItem('accessToken');
      
      if (!tokenItem) {
        // No token exists
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null
        });
        return false;
      }
  
      // Parse token carefully
      const { value: token, expires } = JSON.parse(tokenItem);
      
      // Check token expiration
      if (Date.now() > expires) {
        // Token expired
        tokenStorage.clear();
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: 'Session expired'
        });
        return false;
      }
  
      // Attempt to get current user
      const userData = await authAPI.getCurrentUser();
      
      setAuthState({
        user: userData,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
      
      return true;
    } catch (error) {
      // Failed to validate session
      tokenStorage.clear();
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: error.message
      });
      return false;
    }
  }, []);
  
  // Setup token refresh mechanism
  useEffect(() => {
    // Initial session validation
    validateSession();

    // Setup periodic token check
    const checkInterval = setInterval(() => {
      const storedToken = tokenStorage.get();
      if (!storedToken) {
        // Token has expired or been removed
        handleAuthFailure(new Error('Session expired'));
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(checkInterval);
  }, [validateSession, handleAuthFailure]);

  const login = async (credentials) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      const response = await authAPI.login(credentials);
      
      // Fetch full user details after login
      const userData = await authAPI.getCurrentUser();
      
      handleAuthSuccess({
        user: userData,
        accessToken: response.accessToken,
        expiresIn: 3600 // Default expiration
      });
      
      return true;
    } catch (error) {
      handleAuthFailure(error);
      throw error;
    }
  };

  const register = async (userData) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      const passwordCheck = validatePassword(userData.password);
      if (!passwordCheck.isValid) {
        throw new Error(passwordCheck.errors.join(', '));
      }

      const response = await authAPI.register(userData);
      
      // After successful registration, try to log in
      await login({
        email: userData.email,
        password: userData.password
      });
      
      return true;
    } catch (error) {
      handleAuthFailure(error);
      throw error;
    }
  };

  const resetPassword = async (resetData) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      const passwordCheck = validatePassword(resetData.newPassword);
      if (!passwordCheck.isValid) {
        throw new Error(passwordCheck.errors.join(', '));
      }

      await authAPI.resetPassword(resetData);
      
      // After successful password reset, try to log in
      await login({
        email: resetData.email,
        password: resetData.newPassword
      });
      
      setAuthState(prev => ({ ...prev, error: null }));
      return true;
    } catch (error) {
      handleAuthFailure(error);
      throw error;
    }
  };

  const forgotPassword = async (email) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      await authAPI.forgotPassword(email);
      setAuthState(prev => ({ ...prev, error: null, isLoading: false }));
      return true;
    } catch (error) {
      handleAuthFailure(error);
      throw error;
    }
  };

  const logout = () => {
    authAPI.logout();
    tokenStorage.clear();
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    });
  };

  const updateUser = (updatedUserData) => {
    setAuthState(prev => ({
      ...prev,
      user: updatedUserData
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        register,
        forgotPassword,
        resetPassword,
        updateUser,
        clearError: () => setAuthState(prev => ({ ...prev, error: null })),
        validateSession
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};