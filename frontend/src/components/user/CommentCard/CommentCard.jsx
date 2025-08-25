import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from './CommentCard.module.css';

const CommentCard = ({ comment, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await onEdit(comment.id, editText);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleCancel = () => {
    setEditText(comment.content);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      setIsDeleting(true);
      try {
        await onDelete(comment.movie_id, comment.id);
      } catch (error) {
        console.error('Error deleting comment:', error);
        setIsDeleting(false);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={styles.commentCard}>
      <div className={styles.commentHeader}>
        <div className={styles.commentMeta}>
          <Link to={`/movies/${comment.movie_id}`} className={styles.movieLink}>
            <span className={styles.movieTitle}>Movie #{comment.movie_id}</span>
          </Link>
          <span className={styles.commentDate}>
            {formatDate(comment.created_at)}
          </span>
        </div>
        <div className={styles.commentActions}>
          <button
            className={`${styles.actionButton} ${styles.editButton}`}
            onClick={handleEdit}
            disabled={isEditing}
          >
            Edit
          </button>
          <button
            className={`${styles.actionButton} ${styles.deleteButton}`}
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      <div className={styles.commentContent}>
        {isEditing ? (
          <div className={styles.editForm}>
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className={styles.editTextarea}
              rows="3"
            />
            <div className={styles.editActions}>
              <button
                className={`${styles.actionButton} ${styles.saveButton}`}
                onClick={handleSave}
              >
                Save
              </button>
              <button
                className={`${styles.actionButton} ${styles.cancelButton}`}
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className={styles.commentText}>{comment.content}</p>
        )}
      </div>

      <div className={styles.commentFooter}>
        <span className={styles.likes}>
          ❤️ {comment.likes || 0} likes
        </span>
      </div>
    </div>
  );
};

CommentCard.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
    movie_id: PropTypes.number.isRequired,
    created_at: PropTypes.string.isRequired,
    likes: PropTypes.number,
    user: PropTypes.object
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired
};

export default CommentCard;

