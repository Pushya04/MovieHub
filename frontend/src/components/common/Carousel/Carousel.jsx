// frontend/src/components/common/Carousel/Carousel.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Carousel.module.css';

export default function Carousel({ movieId }) {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/movies/${movieId}/images`
        );
        setImages(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load images');
        setLoading(false);
      }
    };

    fetchImages();
  }, [movieId]);

  const nextSlide = () => {
    setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  if (loading) return <div className={styles.loading}>Loading images...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (images.length === 0) return <div className={styles.empty}>No images available</div>;

  return (
    <div className={styles.container}>
      <button 
        className={`${styles.navButton} ${styles.prev}`} 
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        &lt;
      </button>

      <div className={styles.slideContainer}>
        <div className={styles.track} style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {images.map((image, index) => (
            <div 
              key={image.id} 
              className={styles.slide}
              aria-hidden={index !== currentIndex}
            >
              <img
                src={image.url}
                alt={`Movie scene ${index + 1}`}
                className={styles.image}
                loading="lazy"
              />
            </div>
          ))}
        </div>
        
        <div className={styles.pagination}>
          {images.map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${index === currentIndex ? styles.activeDot : ''}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <button 
        className={`${styles.navButton} ${styles.next}`} 
        onClick={nextSlide}
        aria-label="Next slide"
      >
        &gt;
      </button>
    </div>
  );
}