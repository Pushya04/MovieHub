import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './BlogPage.module.css';

const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Posts', count: 12 },
    { id: 'reviews', name: 'Movie Reviews', count: 5 },
    { id: 'lists', name: 'Top Lists', count: 3 },
    { id: 'news', name: 'Industry News', count: 2 },
    { id: 'guides', name: 'How-To Guides', count: 2 }
  ];

  const featuredPosts = [
    {
      id: 1,
      title: 'The Evolution of Cinema: From Silent Films to Streaming',
      excerpt: 'Explore how the movie industry has transformed over the decades, from the golden age of Hollywood to the digital revolution that\'s changing how we consume content.',
      category: 'news',
      readTime: '8 min read',
      date: 'March 15, 2024'
    },
    {
      id: 2,
      title: 'Top 10 Must-Watch Movies of 2024 (So Far)',
      excerpt: 'Discover the most compelling films released this year, from blockbuster hits to indie gems that deserve your attention.',
      category: 'lists',
      readTime: '6 min read',
      date: 'March 10, 2024'
    }
  ];

  const regularPosts = [
    {
      id: 3,
      title: 'How to Build the Perfect Movie Night',
      excerpt: 'Tips and tricks for creating an unforgettable movie-watching experience at home.',
      category: 'guides',
      readTime: '4 min read',
      date: 'March 8, 2024'
    },
    {
      id: 4,
      title: 'Hidden Gems: Underrated Movies You Need to See',
      excerpt: 'Discover amazing films that flew under the radar but deserve a spot on your watchlist.',
      category: 'reviews',
      readTime: '7 min read',
      date: 'March 5, 2024'
    },
    {
      id: 5,
      title: 'The Art of Movie Reviewing: A Beginner\'s Guide',
      excerpt: 'Learn how to write thoughtful, engaging movie reviews that help others discover great films.',
      category: 'guides',
      readTime: '5 min read',
      date: 'March 3, 2024'
    },
    {
      id: 6,
      title: 'Classic Movies That Still Hold Up Today',
      excerpt: 'Timeless films from decades past that continue to entertain and inspire modern audiences.',
      category: 'reviews',
      readTime: '6 min read',
      date: 'March 1, 2024'
    },
    {
      id: 7,
      title: 'Understanding Movie Genres: A Complete Guide',
      excerpt: 'Dive deep into the different movie genres and learn what makes each one unique.',
      category: 'guides',
      readTime: '9 min read',
      date: 'February 28, 2024'
    },
    {
      id: 8,
      title: 'The Rise of International Cinema',
      excerpt: 'How foreign films are gaining popularity and changing the global movie landscape.',
      category: 'news',
      readTime: '7 min read',
      date: 'February 25, 2024'
    },
    {
      id: 9,
      title: 'Movie Soundtracks That Changed Everything',
      excerpt: 'Iconic film scores and soundtracks that revolutionized how we experience movies.',
      category: 'reviews',
      readTime: '8 min read',
      date: 'February 22, 2024'
    },
    {
      id: 10,
      title: 'The Future of Movie Theaters',
      excerpt: 'How streaming and technology are reshaping the traditional movie-going experience.',
      category: 'news',
      readTime: '6 min read',
      date: 'February 20, 2024'
    }
  ];

  const filteredPosts = activeCategory === 'all' 
    ? regularPosts 
    : regularPosts.filter(post => post.category === activeCategory);

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>MovieHub Blog</h1>
          <p className={styles.heroSubtitle}>
            Discover the latest movie news, reviews, and insights from our team of film enthusiasts. 
            Stay updated with industry trends and find your next favorite film.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className={styles.content}>
        {/* Back Button */}
        <Link to="/" className={styles.backButton}>
          ← Back to Home
        </Link>

        {/* Category Filter */}
        <section className={styles.categoryFilter}>
          <h2>Browse by Category</h2>
          <div className={styles.categoryButtons}>
            {categories.map(category => (
              <button
                key={category.id}
                className={`${styles.categoryButton} ${activeCategory === category.id ? styles.active : ''}`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </section>

        {/* Featured Posts */}
        <section className={styles.featuredPosts}>
          <h2>Featured Articles</h2>
          <div className={styles.featuredGrid}>
            {featuredPosts.map(post => (
              <article key={post.id} className={styles.featuredPost}>
                <div className={styles.featuredImage}>
                  🎬
                </div>
                <div className={styles.featuredContent}>
                  <div className={styles.featuredMeta}>
                    <span className={styles.featuredCategory}>{post.category}</span>
                    <span>{post.readTime}</span>
                    <span>{post.date}</span>
                  </div>
                  <h3>{post.title}</h3>
                  <p className={styles.featuredExcerpt}>{post.excerpt}</p>
                  <Link to={`/blog/${post.id}`} className={styles.readMoreButton}>
                    Read Full Article
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Regular Posts */}
        <section className={styles.regularPosts}>
          <h2>Latest Articles</h2>
          <div className={styles.postsGrid}>
            {filteredPosts.map(post => (
              <article key={post.id} className={styles.postCard}>
                <div className={styles.postImage}>
                  🎬
                </div>
                <div className={styles.postContent}>
                  <div className={styles.postMeta}>
                    <span className={styles.postCategory}>{post.category}</span>
                    <span>{post.readTime}</span>
                    <span>{post.date}</span>
                  </div>
                  <h3>{post.title}</h3>
                  <p className={styles.postExcerpt}>{post.excerpt}</p>
                  <Link to={`/blog/${post.id}`} className={styles.postLink}>
                    Read More →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className={styles.newsletter}>
          <h3>Stay Updated</h3>
          <p>Subscribe to our newsletter for the latest movie reviews, industry insights, and exclusive content.</p>
          <div className={styles.newsletterForm}>
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className={styles.newsletterInput}
            />
            <button className={styles.newsletterButton}>Subscribe</button>
          </div>
          <p className={styles.newsletterNote}>
            By subscribing, you agree to receive updates from MovieHub. 
            Contact us at <a href="mailto:moviehubflix01@gmail.com">moviehubflix01@gmail.com</a> for any questions.
          </p>
        </section>
      </div>
    </div>
  );
};

export default BlogPage;
