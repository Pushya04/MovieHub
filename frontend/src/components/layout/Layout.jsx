import React from 'react';
import PropTypes from 'prop-types';
import Header from '../common/Header/Header';
import Footer from '../common/Footer/Footer';
import styles from './Layout.module.css';
import useResponsive from '../../hooks/useResponsive';
import { useAuth } from '../../context/AuthContext';

const Layout = ({ children, fullWidth = false }) => {
  const { isMobile } = useResponsive();
  const { isAuthenticated } = useAuth();

  return (
    <div className={styles['layout-container']}>
      <Header isMobile={isMobile} isAuthenticated={isAuthenticated} />
      
      <main 
        className={`${styles['main-content']} ${
          fullWidth ? styles['full-width'] : ''
        }`}
      >
        {children}
      </main>

      <Footer isMobile={isMobile} />
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  fullWidth: PropTypes.bool
};

Layout.defaultProps = {
  fullWidth: false
};

export default Layout;