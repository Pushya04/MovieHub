import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from '../styles/AuthPages.module.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/;

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Username validation
    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (!usernameRegex.test(formData.username)) {
      newErrors.username = '3-16 characters, letters, numbers, and underscore only';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])/.test(formData.password)) {
      newErrors.password = 'Password must include uppercase, lowercase, number, and symbol';
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await register({
        email: formData.email,
        username: formData.username,
        password: formData.password
      });
      navigate('/', { replace: true });
    } catch (err) {
      setErrors(prev => ({
        ...prev,
        submit: err.message || 'Registration failed'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles['auth-container']}>
      <div className={styles['auth-card']}>
        <h2>Create Your Account</h2>
        
        {errors.submit && (
          <div className={styles['auth-error']}>{errors.submit}</div>
        )}
        
        <form onSubmit={handleSubmit} noValidate>
          <div className={styles['form-group']}>
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              autoComplete="email"
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby="email-error"
            />
            {errors.email && (
              <span 
                id="email-error" 
                className={styles['form-error-text']}
              >
                {errors.email}
              </span>
            )}
          </div>

          <div className={styles['form-group']}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              required
              autoComplete="username"
              aria-invalid={errors.username ? "true" : "false"}
              aria-describedby="username-error"
            />
            {errors.username && (
              <span 
                id="username-error" 
                className={styles['form-error-text']}
              >
                {errors.username}
              </span>
            )}
          </div>

          <div className={styles['form-group']}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              required
              autoComplete="new-password"
              aria-invalid={errors.password ? "true" : "false"}
              aria-describedby="password-error"
            />
            {errors.password && (
              <span 
                id="password-error" 
                className={styles['form-error-text']}
              >
                {errors.password}
              </span>
            )}
          </div>

          <div className={styles['form-group']}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat your password"
              required
              autoComplete="new-password"
              aria-invalid={errors.confirmPassword ? "true" : "false"}
              aria-describedby="confirm-password-error"
            />
            {errors.confirmPassword && (
              <span 
                id="confirm-password-error" 
                className={styles['form-error-text']}
              >
                {errors.confirmPassword}
              </span>
            )}
          </div>

          <button 
            type="submit" 
            className={styles['auth-button']}
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className={styles['auth-links']}>
          <div className={styles['auth-additional-info']}>
            Already have an account? 
            <Link to="/login" className={styles['auth-inline-link']}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;