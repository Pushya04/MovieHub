import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { reviewsAPI } from '../../../api/reviews';
import styles from './CommentsSection.module.css';
import PropTypes from 'prop-types';

const CommentItem = ({ comment, onLike, onEdit, onDelete, isOwnComment }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  const handleEdit = async () => {
    try {
      await reviewsAPI.updateComment(comment.movie_id, comment.id, editedContent);
      setIsEditing(false);
      onEdit(comment.id, editedContent);
    } catch (error) {
      console.error('Failed to update comment', error);
      // Optionally show an error message to the user
      alert(error.message || 'Failed to update comment');
    }
  };

  return (
    <div className={styles['comment-item']}>
      <div className={styles['comment-header']}>
        <span className={styles['comment-username']}>
          {comment.user?.username || 'Anonymous'}
        </span>
        <span className={styles['comment-date']}>
          {comment.created_at.toLocaleDateString()}
        </span>
      </div>
      
      {isEditing ? (
        <div className={styles['edit-comment']}>
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className={styles['edit-textarea']}
          />
          <div className={styles['edit-actions']}>
            <button 
              onClick={handleEdit}
              className={styles['save-button']}
            >
              Save
            </button>
            <button 
              onClick={() => setIsEditing(false)}
              className={styles['cancel-button']}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className={styles['comment-content']}>{comment.content}</p>
      )}
      
      <div className={styles['comment-actions']}>
        <button 
          onClick={() => onLike(comment.id)}
          className={styles['like-button']}
        >
          👍 {comment.likes || 0}
        </button>
        
        {isOwnComment && !isEditing && (
          <div className={styles['user-actions']}>
            <button 
              onClick={() => setIsEditing(true)}
              className={styles['edit-button']}
            >
              Edit
            </button>
            <button 
              onClick={() => onDelete(comment.id)}
              className={styles['delete-button']}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

CommentItem.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
    movie_id: PropTypes.number.isRequired,
    likes: PropTypes.number,
    created_at: PropTypes.instanceOf(Date).isRequired,
    user: PropTypes.shape({
      id: PropTypes.number,
      username: PropTypes.string
    })
  }).isRequired,
  onLike: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isOwnComment: PropTypes.bool.isRequired
};

const CommentsSection = ({ movieId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    fetchComments();
  }, [movieId]);

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const fetchedComments = await reviewsAPI.getComments(movieId);
      setComments(fetchedComments);
    } catch (error) {
      console.error('Failed to fetch comments', error);
      alert(error.message || 'Failed to fetch comments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
  
    try {
      console.log('Attempting to add comment:', {
        movieId,
        comment: newComment,
        commentLength: newComment.length
      });
  
      const addedComment = await reviewsAPI.createComment(movieId, newComment);
      
      console.log('Comment added successfully:', addedComment);
      
      setComments([addedComment, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment', error);
      console.error('Detailed error:', {
        message: error.message,
        response: error.response
      });
      alert(error.message || 'Failed to add comment');
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      const updatedComment = await reviewsAPI.likeComment(movieId, commentId);
      setComments(comments.map(comment => 
        comment.id === commentId ? updatedComment : comment
      ));
    } catch (error) {
      console.error('Failed to like comment', error);
      alert(error.message || 'Failed to like comment');
    }
  };

  const handleEdit = async () => {
    try {
      console.log('Attempting to edit comment:', {
        movieId: comment.movie_id,
        commentId: comment.id,
        editedContent
      });
  
      await reviewsAPI.updateComment(comment.movie_id, comment.id, editedContent);
      setIsEditing(false);
      onEdit(comment.id, editedContent);
    } catch (error) {
      console.error('Failed to update comment', error);
      console.error('Detailed error:', {
        message: error.message,
        response: error.response
      });
      alert(error.message || 'Failed to update comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await reviewsAPI.deleteComment(movieId, commentId);
      setComments(comments.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error('Failed to delete comment', error);
      alert(error.message || 'Failed to delete comment');
    }
  };

  return (
    <div className={styles['comments-section']}>
      <h2>Comments</h2>
      
      {isAuthenticated ? (
        <form onSubmit={handleAddComment} className={styles['comment-form']}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className={styles['comment-textarea']}
          />
          <button type="submit" className={styles['submit-button']}>
            Post Comment
          </button>
        </form>
      ) : (
        <p className={styles['login-prompt']}>
          Please log in to leave a comment
        </p>
      )}

      {isLoading ? (
        <div className={styles['loading']}>Loading comments...</div>
      ) : comments.length === 0 ? (
        <p className={styles['no-comments']}>No comments yet</p>
      ) : (
        <div className={styles['comments-list']}>
          {comments.map(comment => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onLike={handleLikeComment}
              onEdit={handleEdit}
              onDelete={handleDeleteComment}
              isOwnComment={user?.id === comment.user_id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

CommentsSection.propTypes = {
  movieId: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]).isRequired
};

export default CommentsSection;