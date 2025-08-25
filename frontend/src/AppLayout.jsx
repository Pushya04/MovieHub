import React from 'react';
import PropTypes from 'prop-types';
import { Outlet } from 'react-router-dom';
import Header from "./components/common/Header/Header";
import Footer from "./components/common/Footer/Footer";
import { useAuth } from "./context/AuthContext";
//import './AppLayout.css';

const AppLayout = () => {
  const { isLoading } = useAuth();

  return (
    <div className="app-container">
      <Header />
      
      <main className="main-content">
        {isLoading ? (
          <div className="global-loading">
            <div className="loading-spinner" />
          </div>
        ) : (
          <Outlet />
        )}
      </main>

      <Footer />
    </div>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node
};

export default AppLayout;