import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { reviewsAPI } from '../../../api/reviews';
import styles from './ReviewEditor.module.css';

const ReviewEditor = ({ movieId, existingComment, onSuccess }) => {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const maxLength = 500;

  // Update comment when existingComment changes
  useEffect(() => {
    setComment(existingComment?.content || '');
  }, [existingComment]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Trim and validate comment
    const trimmedComment = comment.trim();
    if (trimmedComment.length === 0) return;

    setIsSubmitting(true);
    setError(null);

    try {
      if (existingComment) {
        // Update existing comment
        await reviewsAPI.updateComment(
          movieId,
          existingComment.id,
          { content: trimmedComment }
        );
      } else {
        // Create new comment
        await reviewsAPI.createComment(movieId, { content: trimmedComment });
      }

      // Call success callback
      onSuccess();

      // Clear comment if it's a new submission
      if (!existingComment) setComment('');
    } catch (err) {
      // Handle and display error
      setError(err.message || 'Failed to save comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTextChange = (e) => {
    // Limit input to max length
    const inputValue = e.target.value;
    setComment(inputValue.slice(0, maxLength));
  };

  return (
    <div className={styles['review-editor-container']}>
      <form onSubmit={handleSubmit} className={styles['review-editor-form']}>
        <textarea
          value={comment}
          onChange={handleTextChange}
          placeholder="Write your review..."
          className={styles['review-editor-textarea']}
          disabled={isSubmitting}
          maxLength={maxLength}
          rows={5}
        />

        <div className={styles['review-editor-controls']}>
          <span className={styles['character-counter']}>
            {comment.length}/{maxLength}
          </span>
          <button
            type="submit"
            className={styles['review-editor-submit']}
            disabled={isSubmitting || comment.trim().length === 0}
          >
            {isSubmitting 
              ? 'Submitting...' 
              : (existingComment ? 'Update Review' : 'Post Review')
            }
          </button>
        </div>

        {error && (
          <div className={styles['review-editor-error']}>
            {error}
          </div>
        )}
      </form>
    </div>
  );
};

ReviewEditor.propTypes = {
  movieId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  existingComment: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    content: PropTypes.string
  }),
  onSuccess: PropTypes.func
};

ReviewEditor.defaultProps = {
  existingComment: null,
  onSuccess: () => {}
};

export default ReviewEditor;