import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './FAQPage.module.css';

const FAQPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openItems, setOpenItems] = useState({});

  const categories = [
    { id: 'all', name: 'All Questions', icon: '❓' },
    { id: 'account', name: 'Account & Login', icon: '🔐' },
    { id: 'movies', name: 'Movies & Content', icon: '🎬' },
    { id: 'watchlist', name: 'Watchlist & Favorites', icon: '❤️' },
    { id: 'reviews', name: 'Reviews & Ratings', icon: '⭐' },
    { id: 'technical', name: 'Technical Issues', icon: '🔧' },
    { id: 'billing', name: 'Billing & Subscription', icon: '💳' }
  ];

  const faqs = [
    {
      id: 1,
      question: 'How do I create an account?',
      answer: 'Creating an account is easy! Click the "Sign Up" button in the top right corner, fill in your email and password, and you\'ll be ready to start discovering movies in no time.',
      category: 'account'
    },
    {
      id: 2,
      question: 'I forgot my password. How can I reset it?',
      answer: 'No worries! Click on "Forgot Password" on the login page, enter your email address, and we\'ll send you a link to reset your password securely.',
      category: 'account'
    },
    {
      id: 3,
      question: 'How do I search for movies?',
      answer: 'Use the search bar at the top of any page to find movies by title, actor, director, or genre. You can also browse our curated collections and recommendations.',
      category: 'movies'
    },
    {
      id: 4,
      question: 'How do movie recommendations work?',
      answer: 'Our recommendation system analyzes your viewing history, ratings, and preferences to suggest movies you\'ll love. The more you use the platform, the better your recommendations become.',
      category: 'movies'
    },
    {
      id: 5,
      question: 'How do I add movies to my watchlist?',
      answer: 'Simply click the heart icon on any movie card or movie detail page. The movie will be added to your personal watchlist for easy access later.',
      category: 'watchlist'
    },
    {
      id: 6,
      question: 'Can I share my watchlist with friends?',
      answer: 'Yes! You can share your watchlist by generating a shareable link or connecting with friends on the platform to see each other\'s recommendations.',
      category: 'watchlist'
    },
    {
      id: 7,
      question: 'How do I write a movie review?',
      answer: 'Navigate to any movie\'s detail page and click "Write Review." You can rate the movie from 1-5 stars and write your thoughts about the film.',
      category: 'reviews'
    },
    {
      id: 8,
      question: 'Can I edit or delete my reviews?',
      answer: 'Yes, you can edit or delete your reviews at any time. Go to your profile page and find the "My Reviews" section to manage your content.',
      category: 'reviews'
    },
    {
      id: 9,
      question: 'The website is loading slowly. What should I do?',
      answer: 'Try refreshing the page, clearing your browser cache, or checking your internet connection. If the problem persists, contact our support team.',
      category: 'technical'
    },
    {
      id: 10,
      question: 'Which browsers are supported?',
      answer: 'We support all modern browsers including Chrome, Firefox, Safari, and Edge. For the best experience, we recommend using the latest version of your browser.',
      category: 'technical'
    },
    {
      id: 11,
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay for premium subscriptions.',
      category: 'billing'
    },
    {
      id: 12,
      question: 'How do I cancel my subscription?',
      answer: 'Go to your account settings, click on "Subscription," and select "Cancel Subscription." You\'ll continue to have access until the end of your current billing period.',
      category: 'billing'
    }
  ];

  const toggleItem = (itemId) => {
    setOpenItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Frequently Asked Questions</h1>
          <p className={styles.heroSubtitle}>
            Find quick answers to common questions about our movie platform. 
            Can't find what you're looking for? Contact our support team for personalized help.
          </p>
          
          {/* Search Bar */}
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search for questions or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            <button className={styles.searchButton}>
              🔍 Search
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className={styles.content}>
        {/* Back Button */}
        <Link to="/" className={styles.backButton}>
          ← Back to Home
        </Link>

        {/* Category Buttons */}
        <section className={styles.categories}>
          <h2>Browse by Category</h2>
          <div className={styles.categoryButtons}>
            {categories.map(category => (
              <button
                key={category.id}
                className={`${styles.categoryButton} ${activeCategory === category.id ? styles.active : ''}`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.icon} {category.name}
              </button>
            ))}
          </div>
        </section>

        {/* FAQ Items */}
        <section className={styles.faqSection}>
          <h2>Common Questions</h2>
          {filteredFaqs.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)', padding: '2rem' }}>
              No questions found matching your search. Try adjusting your search terms or browse by category.
            </div>
          ) : (
            filteredFaqs.map(faq => (
              <div key={faq.id} className={styles.faqItem}>
                <div 
                  className={styles.faqQuestion}
                  onClick={() => toggleItem(faq.id)}
                >
                  <h3>{faq.question}</h3>
                  <button className={`${styles.faqToggle} ${openItems[faq.id] ? styles.open : ''}`}>
                    {openItems[faq.id] ? '−' : '+'}
                  </button>
                </div>
                <div className={`${styles.faqAnswer} ${openItems[faq.id] ? styles.open : ''}`}>
                  <div className={styles.faqAnswerContent}>
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))
          )}
        </section>

        {/* CTA Section */}
        <section className={styles.cta}>
          <h2>Still Have Questions?</h2>
          <p>
            Can't find the answer you're looking for? Our support team is here to help! 
            Send us a message and we'll get back to you within 24 hours.
          </p>
          <Link to="/contact" className={styles.ctaButton}>
            Contact Support
          </Link>
        </section>
      </div>
    </div>
  );
};

export default FAQPage;
