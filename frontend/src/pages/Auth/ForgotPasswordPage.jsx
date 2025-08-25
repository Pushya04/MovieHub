import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from '../styles/AuthPages.module.css';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      await forgotPassword(email);
      setMessage('Password reset instructions have been sent to your email.');
      
      // Optional: Automatically redirect after successful send
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to send reset instructions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles['auth-container']}>
      <div className={styles['auth-card']}>
        <h2>Reset Your Password</h2>
        
        {error && <div className={styles['auth-error']}>{error}</div>}
        {message && <div className={styles['auth-success']}>{message}</div>}
        
        <form onSubmit={handleSubmit} noValidate>
          <div className={styles['form-group']}>
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email"
              required
              autoComplete="email"
              aria-describedby="email-help"
            />
            <small id="email-help" className={styles['form-help-text']}>
              Enter the email associated with your account
            </small>
          </div>
          
          <button 
            type="submit" 
            className={styles['auth-button']}
            disabled={isLoading}
          >
            {isLoading ? 'Sending Reset Link...' : 'Send Reset Link'}
          </button>
        </form>
        
        <div className={styles['auth-links']}>
          <Link to="/login" className={styles['auth-link']}>
            Return to Login
          </Link>
          <div className={styles['auth-additional-info']}>
            Remember your password? 
            <Link to="/login" className={styles['auth-inline-link']}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;