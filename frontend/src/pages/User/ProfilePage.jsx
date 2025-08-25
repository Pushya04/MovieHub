import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { reviewsAPI, watchlistAPI } from '../../api';
import MovieCard from '../../components/common/MovieCard/MovieCard';
import './ProfilePage.module.css';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [comments, setComments] = useState([]);
  const [likedComments, setLikedComments] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const [userComments, likedComments, watchlistItems] = await Promise.all([
          reviewsAPI.getUserComments(),
          reviewsAPI.getLikedComments(),
          watchlistAPI.getWatchlist()
        ]);
        
        setComments(userComments);
        setLikedComments(likedComments);
        setWatchlist(watchlistItems);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* User Info Section */}
      <div className="profile-header">
        <h1>{user.username}'s Profile</h1>
        <div className="user-info">
          <p>Email: {user.email}</p>
          <p>Member since: {new Date(user.created_at).toLocaleDateString()}</p>
        </div>
        
        <div className="account-actions">
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
          <a href="/reset-password" className="reset-password-button">
            Reset Password
          </a>
        </div>
      </div>

      {/* User Content Sections */}
      <div className="profile-content">
        {/* Watchlist Section */}
        <section className="profile-section">
          <h2>Your Watchlist ({watchlist.length})</h2>
          {watchlist.length > 0 ? (
            <div className="watchlist-grid">
              {watchlist.map(item => (
                <MovieCard key={item.movie.id} movie={item.movie} />
              ))}
            </div>
          ) : (
            <p className="empty-message">No movies in your watchlist</p>
          )}
        </section>

        {/* Comments Section */}
        <section className="profile-section">
          <h2>Your Comments ({comments.length})</h2>
          {comments.length > 0 ? (
            <div className="comments-list">
              {comments.map(comment => (
                <div key={comment.id} className="comment-card">
                  <div className="comment-header">
                    <span className="movie-title">{comment.movie.title}</span>
                    <span className="comment-date">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="comment-content">{comment.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-message">No comments yet</p>
          )}
        </section>

        {/* Liked Comments Section */}
        <section className="profile-section">
          <h2>Liked Comments ({likedComments.length})</h2>
          {likedComments.length > 0 ? (
            <div className="comments-list">
              {likedComments.map(comment => (
                <div key={comment.id} className="comment-card">
                  <div className="comment-header">
                    <span className="movie-title">{comment.movie.title}</span>
                    <span className="comment-likes">♥ {comment.likes}</span>
                  </div>
                  <p className="comment-content">{comment.content}</p>
                  <p className="comment-author">By {comment.user.username}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-message">No liked comments yet</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;