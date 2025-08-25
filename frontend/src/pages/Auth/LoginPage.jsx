import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from '../styles/AuthPages.module.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      await login({ email, password });
      console.log("sending email",email);
      console.log("sending password",password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles['auth-container']}>
      <div className={styles['auth-card']}>
        <h2>Welcome Back</h2>
        {error && <div className={styles['auth-error']}>{error}</div>}
        <form onSubmit={handleSubmit} noValidate>
          <div className={styles['form-group']}>
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              autoComplete="email"
            />
          </div>
          <div className={styles['form-group']}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />
          </div>
          <button 
            type="submit" 
            className={styles['auth-button']}
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <div className={styles['auth-links']}>
          <Link to="/forgot-password">Forgot Password?</Link>
          <span>New here? <Link to="/register">Create account</Link></span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;