import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { profileAPI } from '../../api/profile';
import { authAPI } from '../../api/auth';
import CommentCard from '../../components/user/CommentCard/CommentCard';
import WatchlistCard from '../../components/user/WatchlistCard/WatchlistCard';
import styles from './ProfilePage.module.css';

const ProfilePage = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  
  // State management
  const [activeTab, setActiveTab] = useState('profile');
  const [comments, setComments] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const [commentsPage, setCommentsPage] = useState(1);
  const [hasMoreComments, setHasMoreComments] = useState(true);

  // Profile editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: user?.username || '',
    email: user?.email || ''
  });

  // Account deletion state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    loadInitialData();
  }, [user, navigate]);

  const loadInitialData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await Promise.all([
        loadComments(),
        loadWatchlist()
      ]);
    } catch (err) {
      setError('Failed to load profile data. Please try again.');
      console.error('Error loading profile data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async (page = 1, append = false) => {
    if (commentsLoading) return;
    
    setCommentsLoading(true);
    try {
      const response = await profileAPI.getUserComments(user.id, page, 10);
      
      if (append) {
        setComments(prev => [...prev, ...response]);
      } else {
        setComments(response);
      }
      
      setHasMoreComments(response.length === 10);
      setCommentsPage(page);
    } catch (err) {
      console.error('Error loading comments:', err);
      if (!append) {
        setError('Failed to load comments.');
      }
    } finally {
      setCommentsLoading(false);
    }
  };

  const loadWatchlist = async () => {
    if (watchlistLoading) return;
    
    setWatchlistLoading(true);
    try {
      const response = await profileAPI.getUserWatchlist();
      setWatchlist(response);
    } catch (err) {
      console.error('Error loading watchlist:', err);
      setError('Failed to load watchlist.');
    } finally {
      setWatchlistLoading(false);
    }
  };

  const handleDeleteComment = async (movieId, commentId) => {
    try {
      await profileAPI.deleteComment(movieId, commentId);
      setComments(prev => prev.filter(comment => comment.id !== commentId));
    } catch (err) {
      console.error('Error deleting comment:', err);
      setError('Failed to delete comment. Please try again.');
    }
  };

  const handleEditComment = async (movieId, commentId, newText) => {
    try {
      // Implement comment editing logic here
      console.log('Editing comment:', { movieId, commentId, newText });
    } catch (err) {
      console.error('Error editing comment:', err);
      setError('Failed to edit comment. Please try again.');
    }
  };

  const handleRemoveFromWatchlist = async (movieId) => {
    try {
      await profileAPI.removeFromWatchlist(movieId);
      setWatchlist(prev => prev.filter(movie => movie.id !== movieId));
    } catch (err) {
      console.error('Error removing from watchlist:', err);
      setError('Failed to remove movie from watchlist. Please try again.');
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await profileAPI.updateUserProfile(editForm);
      updateUser(updatedUser);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword.trim()) {
      setDeleteError('Please enter your password to confirm account deletion.');
      return;
    }

    setDeleteLoading(true);
    setDeleteError('');

    try {
      // Call the deleteUser API with password verification
      await authAPI.deleteUser(deletePassword);
      
      // If successful, the API will handle logout and redirect
      // Just navigate to home as a fallback
      navigate('/');
      
    } catch (err) {
      console.error('Error deleting account:', err);
      if (err.message.includes('Invalid password') || err.message.includes('Invalid credentials')) {
        setDeleteError('Incorrect password. Please try again.');
      } else {
        setDeleteError('Failed to delete account. Please try again.');
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  const loadMoreComments = () => {
    loadComments(commentsPage + 1, true);
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading profile...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Back Button */}
      <button 
        className={styles.backButton}
        onClick={() => navigate('/')}
      >
        ← Back to Home
      </button>
      
      <div className={styles.profileWrapper}>
        {/* Profile Header */}
        <div className={styles.profileHeader}>
          <div className={styles.userAvatar}>
            <div className={styles.avatarPlaceholder}>
              {user.username?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
          <div className={styles.userInfo}>
            <h1>{user.username}</h1>
            <p className={styles.userEmail}>{user.email}</p>
            <p className={styles.memberSince}>
              Member since {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className={styles.tabNavigation}>
          <button
            className={`${styles.tabButton} ${activeTab === 'profile' ? styles.active : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'comments' ? styles.active : ''}`}
            onClick={() => setActiveTab('comments')}
          >
            Comments ({comments.length})
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'watchlist' ? styles.active : ''}`}
            onClick={() => setActiveTab('watchlist')}
          >
            Watchlist ({watchlist.length})
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className={styles.errorMessage}>
            <p>{error}</p>
            <button onClick={loadInitialData}>Retry</button>
          </div>
        )}

        {/* Tab Content */}
        <div className={styles.tabContent}>
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className={styles.profileTab}>
              <div className={styles.profileSection}>
                <div className={styles.sectionHeader}>
                  <h3>Account Information</h3>
                  <button
                    className={styles.editButton}
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </button>
                </div>

                {isEditing ? (
                  <form onSubmit={handleProfileUpdate} className={styles.editForm}>
                    <div className={styles.formGroup}>
                      <label htmlFor="username">Username</label>
                      <input
                        type="text"
                        id="username"
                        value={editForm.username}
                        onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        id="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                    <div className={styles.formActions}>
                      <button type="submit" className={styles.saveButton}>
                        Save Changes
                      </button>
                      <button
                        type="button"
                        className={styles.cancelButton}
                        onClick={() => {
                          setIsEditing(false);
                          setEditForm({
                            username: user.username || '',
                            email: user.email || ''
                          });
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <label>Username</label>
                      <p>{user.username}</p>
                    </div>
                    <div className={styles.infoItem}>
                      <label>Email</label>
                      <p>{user.email}</p>
                    </div>
                    <div className={styles.infoItem}>
                      <label>Member Since</label>
                      <p>{new Date(user.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className={styles.infoItem}>
                      <label>Account Status</label>
                      <p className={styles.statusActive}>Active</p>
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.statsSection}>
                <h3>Your Activity</h3>
                <div className={styles.statsGrid}>
                  <div className={styles.statCard}>
                    <div className={styles.statNumber}>{comments.length}</div>
                    <div className={styles.statLabel}>Comments</div>
                  </div>
                  <div className={styles.statCard}>
                    <div className={styles.statNumber}>{watchlist.length}</div>
                    <div className={styles.statLabel}>Watchlist</div>
                  </div>
                </div>
              </div>

              {/* Account Deletion Section */}
              <div className={styles.dangerZone}>
                <h3>Danger Zone</h3>
                <div className={styles.dangerZoneContent}>
                  <div className={styles.dangerZoneInfo}>
                    <p>Once you delete your account, there is no going back. Please be certain.</p>
                  </div>
                  <button
                    className={styles.deleteAccountButton}
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Comments Tab */}
          {activeTab === 'comments' && (
            <div className={styles.commentsTab}>
              <div className={styles.sectionHeader}>
                <h3>Your Comments</h3>
                <button
                  className={styles.refreshButton}
                  onClick={() => loadComments(1)}
                  disabled={commentsLoading}
                >
                  {commentsLoading ? 'Loading...' : 'Refresh'}
                </button>
              </div>

              {comments.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>You haven't made any comments yet.</p>
                  <button
                    className={styles.browseButton}
                    onClick={() => navigate('/')}
                  >
                    Browse Movies
                  </button>
                </div>
              ) : (
                <div className={styles.commentsList}>
                  {comments.map(comment => (
                    <CommentCard
                      key={comment.id}
                      comment={comment}
                      onDelete={handleDeleteComment}
                      onEdit={handleEditComment}
                    />
                  ))}
                  
                  {hasMoreComments && (
                    <div className={styles.loadMoreContainer}>
                      <button
                        className={styles.loadMoreButton}
                        onClick={loadMoreComments}
                        disabled={commentsLoading}
                      >
                        {commentsLoading ? 'Loading...' : 'Load More Comments'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Watchlist Tab */}
          {activeTab === 'watchlist' && (
            <div className={styles.watchlistTab}>
              <div className={styles.sectionHeader}>
                <h3>Your Watchlist</h3>
                <button
                  className={styles.refreshButton}
                  onClick={loadWatchlist}
                  disabled={watchlistLoading}
                >
                  {watchlistLoading ? 'Loading...' : 'Refresh'}
                </button>
              </div>

              {watchlist.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>Your watchlist is empty.</p>
                  <button
                    className={styles.browseButton}
                    onClick={() => navigate('/')}
                  >
                    Browse Movies
                  </button>
                </div>
              ) : (
                <div className={styles.watchlistGrid}>
                  {watchlist.map(movie => (
                    <WatchlistCard
                      key={movie.id || movie.movie_id}
                      movie={movie}
                      onRemove={handleRemoveFromWatchlist}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Account Deletion Confirmation Modal */}
      {showDeleteConfirm && (
        <div className={styles.modalOverlay}>
          <div className={styles.deleteModal}>
            <h3>Delete Account</h3>
            <p>This action cannot be undone. This will permanently delete your account and remove all your data.</p>
            
            <div className={styles.passwordInput}>
              <label htmlFor="deletePassword">Enter your password to confirm:</label>
              <input
                type="password"
                id="deletePassword"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            {deleteError && (
              <div className={styles.deleteError}>
                <p>{deleteError}</p>
              </div>
            )}

            <div className={styles.modalActions}>
              <button
                className={styles.cancelDeleteButton}
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeletePassword('');
                  setDeleteError('');
                }}
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                className={styles.confirmDeleteButton}
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
