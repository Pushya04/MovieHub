import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../../../context/AuthContext';
import styles from './Header.module.css';
import moviehubLogo from '../../../assets/images/moviehub-logo.png';
import { moviesAPI } from '../../../api/movies';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [genres, setGenres] = useState([]);
  const [isGenresDropdownOpen, setIsGenresDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const genresDropdownRef = useRef(null);
  
  // Fetch genres when component mounts
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setIsLoading(true);
        const genresData = await moviesAPI.getGenres();
        setGenres(genresData);
        console.log('Genres loaded in header:', genresData);
      } catch (error) {
        console.error('Failed to load genres in header:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGenres();
  }, []);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (genresDropdownRef.current && !genresDropdownRef.current.contains(event.target)) {
        setIsGenresDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const navLinks = [
    { path: '/', text: 'Home' },
    { path: '/movies/97', text: 'Movies' },
    { isDropdown: true, text: 'Genres' },
    { path: '/watchlist', text: 'Watchlist' },
    { path: '/our-story', text: 'Our Story' },
    { path: '/sentiment-analysis', text: 'Sentiment Analysis' },
  ];
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const toggleGenresDropdown = () => {
    setIsGenresDropdownOpen(!isGenresDropdownOpen);
  };
  
  const handleGenreSelect = (genreId) => {
    setIsGenresDropdownOpen(false);
    setIsMobileMenuOpen(false);
    
    // Navigate to home page with genre parameter
    navigate(`/?genre=${genreId}`);
    
    // Use setTimeout to ensure navigation completes before scrolling
    setTimeout(() => {
      const moviesSection = document.getElementById('movies-section');
      if (moviesSection) {
        moviesSection.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }, 100);
  };
  
  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };
  
  return (
    <header className={styles.header} data-testid="header">
      <div className={styles.container}>
        {/* Logo */}
        <Link to="/" className={styles.logoLink}>
          <img 
            src={moviehubLogo} 
            alt="MovieHub" 
            className={styles.logo}
            width="140"
            height="45"
          />
        </Link>
        
        {/* Desktop Navigation */}
        <nav className={styles.desktopNav} aria-label="Main navigation">
          <ul className={styles.navList}>
            {navLinks.map((link, index) => (
              <li key={index} className={link.isDropdown ? styles.dropdownContainer : ''}>
                {link.isDropdown ? (
                  <div ref={genresDropdownRef}>
                    <button 
                      className={styles.dropdownButton}
                      onMouseEnter={() => setIsGenresDropdownOpen(true)}
                      onClick={toggleGenresDropdown}
                      aria-expanded={isGenresDropdownOpen}
                    >
                      {link.text}
                      <span className={styles.dropdownArrow}>▾</span>
                    </button>
                    
                    {isGenresDropdownOpen && (
                      <div 
                        className={styles.dropdownMenu}
                        onMouseLeave={() => setIsGenresDropdownOpen(false)}
                      >
                        {isLoading ? (
                          <div className={styles.dropdownLoading}>Loading genres...</div>
                        ) : (
                          <ul className={styles.dropdownList}>
                            {genres.map((genre) => (
                              <li key={genre.id}>
                                <button 
                                  className={styles.dropdownItem}
                                  onClick={() => handleGenreSelect(genre.id)}
                                >
                                  {genre.name}
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <NavLink
                    to={link.path}
                    className={({ isActive }) => 
                      `${styles.navLink} ${isActive ? styles.active : ''}`
                    }
                  >
                    {link.text}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Auth Section */}
        <div className={styles.authSection}>
          {isAuthenticated ? (
            <div className={styles.profileDropdown}>
              <Link to="/profile" className={styles.profileButton}>
                <span className={styles.username}>{user?.username}</span>
                <img
                  src={user?.avatar || '/default-avatar.png'}
                  alt="Profile"
                  className={styles.profileAvatar}
                />
              </Link>
              <button 
                onClick={handleLogout} 
                className={styles.logoutButton}
              >
                Logout
              </button>
            </div>
          ) : (
            <div className={styles.authButtons}>
              <Link to="/login" className={styles.authLink}>Login</Link>
              <Link to="/register" className={`${styles.authLink} ${styles.register}`}>Sign Up</Link>
            </div>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <button
          className={styles.mobileMenuButton}
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileMenuOpen}
        >
          <div className={`${styles.hamburger} ${isMobileMenuOpen ? styles.open : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </div>
      
      {/* Mobile Navigation */}
      <nav className={`${styles.mobileNav} ${isMobileMenuOpen ? styles.open : ''}`}>
        <ul className={styles.mobileNavList}>
          {navLinks.map((link, index) => (
            <li key={index}>
              {link.isDropdown ? (
                <>
                  <button 
                    className={styles.mobileDropdownButton}
                    onClick={toggleGenresDropdown}
                  >
                    {link.text}
                    <span className={styles.dropdownArrow}>▾</span>
                  </button>
                  
                  {isGenresDropdownOpen && (
                    <ul className={styles.mobileDropdownList}>
                      {genres.map((genre) => (
                        <li key={genre.id}>
                          <button 
                            className={styles.mobileDropdownItem}
                            onClick={() => handleGenreSelect(genre.id)}
                          >
                            {genre.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <NavLink
                  to={link.path}
                  className={styles.mobileNavLink}
                  onClick={toggleMobileMenu}
                >
                  {link.text}
                </NavLink>
              )}
            </li>
          ))}
          <li>
            {isAuthenticated ? (
              <>
                <Link 
                  to="/profile" 
                  className={styles.mobileNavLink} 
                  onClick={toggleMobileMenu}
                >
                  Profile
                </Link>
                <button 
                  onClick={handleLogout} 
                  className={styles.mobileNavLink}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={styles.mobileNavLink} onClick={toggleMobileMenu}>Login</Link>
                <Link to="/register" className={styles.mobileNavLink} onClick={toggleMobileMenu}>Sign Up</Link>
              </>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;