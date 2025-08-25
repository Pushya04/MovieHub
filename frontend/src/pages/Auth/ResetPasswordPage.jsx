import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from '../styles/AuthPages.module.css';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Password validation
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const email = searchParams.get('email');
      const otp = searchParams.get('otp');

      if (!email || !otp) {
        setError('Invalid reset link. Please request a new password reset.');
        return;
      }

      await resetPassword({
        email,
        otp,
        newPassword: password
      });

      setMessage('Password reset successfully!');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message || 'Password reset failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <form onSubmit={handleSubmit} className={styles.authForm}>
        <h2>Set New Password</h2>
        
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}
        
        {message && (
          <div className={styles.successMessage}>
            {message}
          </div>
        )}
        
        <div className={styles.formGroup}>
          <label htmlFor="password">New Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            required
            minLength={8}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            required
            minLength={8}
          />
        </div>
        
        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </button>
        
        <div className={styles.loginLink}>
          <Link to="/login">Return to Login</Link>
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordPage;