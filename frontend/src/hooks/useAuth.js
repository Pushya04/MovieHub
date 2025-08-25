import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return {
    user: context.user,
    isAuthenticated: context.isAuthenticated,
    isLoading: context.isLoading,
    login: context.login,
    logout: context.logout,
    register: context.register,
    forgotPassword: context.forgotPassword,
    resetPassword: context.resetPassword
  };
};