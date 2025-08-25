import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../../components/common/Header/Header';
import Footer from '../../components/common/Footer/Footer';
import HeroSection from '../../components/homepage/HeroSection/HeroSection';
import GenreCarousel from '../../components/homepage/GenreCarousel/GenreCarousel';
import MovieGrid from '../../components/homepage/MovieGrid/MovieGrid';
import { useMovies } from '../../context/MovieContext';
import { moviesAPI } from '../../api/movies';
import styles from './HomePage.module.css';

const HomePage = () => {
  console.log('HomePage component mounted');
  
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [genres, setGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { featuredMovies, loadFeaturedMovies, loadMoreFeaturedMovies, isLoading: moviesLoading } = useMovies();
  
  // Log when featuredMovies changes
  useEffect(() => {
    console.log('HomePage: featuredMovies updated:', featuredMovies.length, 'movies');
  }, [featuredMovies]);
  
  // Fetch genres when component mounts
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setIsLoading(true);
        const genresData = await moviesAPI.getGenres();
        setGenres(genresData);
        console.log('Genres loaded:', genresData);
      } catch (error) {
        console.error('Failed to load genres:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGenres();
  }, []);

  // Read genre parameter from URL on component mount and handle scrolling
  useEffect(() => {
    const genreParam = searchParams.get('genre');
    if (genreParam) {
      const genreId = parseInt(genreParam);
      if (!isNaN(genreId)) {
        setSelectedGenre(genreId);
        console.log('Genre selected from URL:', genreId);
        
        // Scroll to movies section after a short delay to ensure component renders
        setTimeout(() => {
          const moviesSection = document.getElementById('movies-section');
          if (moviesSection) {
            moviesSection.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start' 
            });
          }
        }, 200);
      }
    }
  }, [searchParams]);

  // Load featured movies when component mounts (if no genre is selected)
  useEffect(() => {
    if (!selectedGenre && featuredMovies.length === 0) {
      console.log('Loading featured movies on mount');
      // Actually call the function to load featured movies
      loadFeaturedMovies(1);
    }
  }, [selectedGenre, featuredMovies.length, loadFeaturedMovies]);

  // Ensure featured movies are loaded on initial mount
  useEffect(() => {
    if (!selectedGenre) {
      console.log('Initial mount - loading featured movies');
      loadFeaturedMovies(1);
    }
    
    return () => {
      console.log('HomePage component unmounting');
    };
  }, []); // Empty dependency array - only run once on mount
  
  // Handle genre selection from either GenreFilter or GenreCarousel
  const handleGenreSelect = (genreId) => {
    console.log('Genre selected:', genreId);
    const newGenreId = genreId === selectedGenre ? null : genreId; // Toggle genre if clicked again
    setSelectedGenre(newGenreId);
    
    // Update URL parameter
    if (newGenreId) {
      setSearchParams({ genre: newGenreId.toString() });
      
      // Scroll to movies section after a short delay to ensure component renders
      setTimeout(() => {
        const moviesSection = document.getElementById('movies-section');
        if (moviesSection) {
          moviesSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      }, 200);
    } else {
      setSearchParams({});
      
      // Scroll to top when clearing genre filter
      window.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
      });
    }
  };

  // Create filters object based on your existing API
  const movieFilters = selectedGenre 
    ? { genre: selectedGenre }
    : {};

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.mainContent}>
        <HeroSection />
        
        <section className={styles.genreSection}>
          <h2 className={styles.sectionTitle}>Browse by Genre</h2>
          {!isLoading && <GenreCarousel onGenreSelect={handleGenreSelect} genres={genres} />}
        </section>
        
        {/* Movie Recommendations Section - Shows when no genre is selected */}
        {!selectedGenre && (
          <section id="movies-section" className={styles.recommendationsSection}>
            <h2 className={styles.sectionTitle}>Movie Recommendations</h2>
            {featuredMovies.length > 0 ? (
              <MovieGrid 
                title="" 
                movies={featuredMovies}
                showLoadMore={true}
                onLoadMore={loadMoreFeaturedMovies}
                isLoading={moviesLoading}
              />
            ) : (
              <MovieGrid 
                title="" 
                movies={[]}
                isLoading={false}
              />
            )}
          </section>
        )}
        
        {/* Genre-specific Movies Section */}
        {selectedGenre && (
          <section id="movies-section" className={styles.moviesSection}>
            <div className={styles.genreSectionHeader}>
              <h2 className={styles.sectionTitle}>
                Movies in {genres.find(g => g.id === selectedGenre)?.name || 'Selected Genre'}
              </h2>
              <button 
                className={styles.clearGenreButton}
                onClick={() => handleGenreSelect(selectedGenre)}
              >
                Clear Filter
              </button>
            </div>
            <MovieGrid 
              title="" 
              filters={movieFilters} 
              key={`genre-${selectedGenre}`} // Force re-render for better performance
            />
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;