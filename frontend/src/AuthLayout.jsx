import React from 'react';
import PropTypes from 'prop-types';
import { Outlet } from 'react-router-dom';
import { useAuth } from "./context/AuthContext";
import './AuthLayout.css';

const AuthLayout = () => {
  const { isLoading } = useAuth();

  return (
    <div className="auth-layout">
      <div className="auth-container">
        {isLoading ? (
          <div className="auth-loading">
            <div className="loading-spinner" />
          </div>
        ) : (
          <div className="auth-card">
            <Outlet />
          </div>
        )}
      </div>
    </div>
  );
};

AuthLayout.propTypes = {
  children: PropTypes.node
};

export default AuthLayout;