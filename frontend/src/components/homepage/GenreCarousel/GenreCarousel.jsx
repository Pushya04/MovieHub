import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-slick';
import { moviesAPI } from "../../../api/movies";
import GenreCard from '../../common/GenreCard/GenreCard';
import styles from './GenreCarousel.module.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const GenreCarousel = ({ onGenreSelect }) => {
  const [genres, setGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sliderRef, setSliderRef] = useState(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await moviesAPI.getGenres();
        if (Array.isArray(data) && data.length > 0) {
          setGenres(data);
        } else {
          throw new Error('No genres returned from API');
        }
        setError(null);
      } catch (err) {
        console.error('Error loading genres:', err);
        setError(err.message || 'Failed to load genres');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGenres();
  }, []);

  // Custom arrow components
  const NextArrow = ({ onClick }) => {
    return (
      <button 
        className={`${styles.arrow} ${styles.nextArrow}`} 
        onClick={onClick}
        aria-label="Next genres"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
          <path d="M9.4 18L8 16.6L12.6 12L8 7.4L9.4 6L15.4 12L9.4 18Z" />
        </svg>
      </button>
    );
  };

  const PrevArrow = ({ onClick }) => {
    return (
      <button 
        className={`${styles.arrow} ${styles.prevArrow}`} 
        onClick={onClick}
        aria-label="Previous genres"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
          <path d="M15.4 18L9.4 12L15.4 6L16.8 7.4L12.2 12L16.8 16.6L15.4 18Z" />
        </svg>
      </button>
    );
  };

  // Enhanced slider settings with arrow navigation
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    rtl: false,
    autoplay: true,
    autoplaySpeed: 4000, // Slightly slower autoplay for better readability
    pauseOnHover: true,
    arrows: true,
    centerMode: false,
    variableWidth: false,
    swipeToSlide: true,
    touchThreshold: 5,
    responsive: [
      {
        breakpoint: 1280,
        settings: { slidesToShow: 5, slidesToScroll: 1 }
      },
      {
        breakpoint: 1024,
        settings: { slidesToShow: 4, slidesToScroll: 1 }
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 3, slidesToScroll: 1 }
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 2, slidesToScroll: 1 }
      }
    ],
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    draggable: true,
    cssEase: "ease-out",
  };

  // Alternative external navigation methods
  const goToNext = () => {
    if (sliderRef) {
      sliderRef.slickNext();
    }
  };

  const goToPrev = () => {
    if (sliderRef) {
      sliderRef.slickPrev();
    }
  };

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>Error loading genres: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className={styles.retryButton}
        >
          Retry
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
      </div>
    );
  }

  if (genres.length === 0) {
    return (
      <div className={styles.errorContainer}>
        <p>No genres available at the moment.</p>
        <button 
          onClick={() => window.location.reload()} 
          className={styles.retryButton}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <section className={styles.genreCarouselSection}>
      <h2 className={styles.sectionTitle}>Explore by Genre</h2>
      
      <div className={styles.carouselContainer}>
        {/* You can also add external navigation buttons if needed */}
        {/* 
        <button onClick={goToPrev} className={styles.externalNavigationBtn}>Prev</button>
        <button onClick={goToNext} className={styles.externalNavigationBtn}>Next</button>
        */}
        
        <Slider ref={slider => setSliderRef(slider)} {...settings}>
          {genres.map((genre) => (
            <div key={genre.id} className={styles.genreCardWrapper}>
              <GenreCard 
                genre={genre} 
                onClick={() => onGenreSelect(genre.id)} 
              />
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

GenreCarousel.propTypes = {
  onGenreSelect: PropTypes.func.isRequired
};

export default GenreCarousel;