// Modal.jsx
import React, { useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import styles from './Modal.module.css';

const Modal = ({ isOpen, onClose, children, className }) => {
  const modalRef = useRef(null);
  const previousFocus = useRef(null);
  const modalRoot = document.getElementById('modal-root');

  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  const handleOutsideClick = useCallback((event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  }, [onClose]);

  const focusFirstElement = useCallback(() => {
    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements?.length) {
      focusableElements[0].focus();
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      previousFocus.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleOutsideClick);
      focusFirstElement();
    }

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleOutsideClick);
      previousFocus.current?.focus();
    };
  }, [isOpen, handleKeyDown, handleOutsideClick, focusFirstElement]);

  if (!isOpen || !modalRoot) return null;

  return createPortal(
    <div 
      role="dialog"
      aria-modal="true"
      className={styles.overlay}
      data-testid="modal-overlay"
    >
      <div
        ref={modalRef}
        className={`${styles.content} ${className || ''}`}
        role="document"
      >
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close modal"
          data-testid="modal-close"
        >
          &times;
        </button>
        <div className={styles.body}>
          {children}
        </div>
      </div>
    </div>,
    modalRoot
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export default Modal;