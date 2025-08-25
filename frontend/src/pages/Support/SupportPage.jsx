import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './SupportPage.module.css';

const SupportPage = () => {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const supportTopics = [
    {
      id: 1,
      title: 'Account & Login',
      icon: '🔐',
      description: 'Help with account creation, login issues, and password recovery',
      articles: [
        'How to create an account',
        'Forgot password?',
        'Account security settings',
        'Two-factor authentication'
      ]
    },
    {
      id: 2,
      title: 'Movies & Content',
      icon: '🎬',
      description: 'Questions about finding movies, recommendations, and content',
      articles: [
        'How to search for movies',
        'Understanding movie recommendations',
        'Content availability by region',
        'Movie ratings and content warnings'
      ]
    },
    {
      id: 3,
      title: 'Watchlist & Favorites',
      icon: '❤️',
      description: 'Managing your watchlist and favorite movies',
      articles: [
        'Adding movies to watchlist',
        'Organizing your favorites',
        'Sharing watchlists',
        'Watchlist privacy settings'
      ]
    },
    {
      id: 4,
      title: 'Reviews & Ratings',
      icon: '⭐',
      description: 'Writing reviews and rating movies',
      articles: [
        'How to write a movie review',
        'Rating system explained',
        'Review guidelines',
        'Managing your reviews'
      ]
    },
    {
      id: 5,
      title: 'Technical Issues',
      icon: '🔧',
      description: 'Website performance, bugs, and technical problems',
      articles: [
        'Website not loading',
        'Slow performance',
        'Browser compatibility',
        'Mobile app issues'
      ]
    },
    {
      id: 6,
      title: 'Billing & Subscription',
      icon: '💳',
      description: 'Payment, subscription management, and billing questions',
      articles: [
        'Payment methods accepted',
        'Subscription plans',
        'Billing cycle information',
        'Cancellation process'
      ]
    }
  ];

  const quickActions = [
    {
      title: 'Contact Support',
      description: 'Get in touch with our support team',
      action: 'Contact Us',
      link: '/contact'
    },
    {
      title: 'FAQ',
      description: 'Find answers to common questions',
      action: 'View FAQ',
      link: '/faq'
    },
    {
      title: 'Report Bug',
      description: 'Report technical issues or bugs',
      action: 'Report Issue',
      link: '/contact'
    },
    {
      title: 'Feature Request',
      description: 'Suggest new features or improvements',
      action: 'Suggest Feature',
      link: '/contact'
    }
  ];

  const helpResources = [
    {
      title: 'Help Center',
      description: 'Comprehensive guides and tutorials',
      link: '/help'
    },
    {
      title: 'Community Forum',
      description: 'Connect with other movie enthusiasts',
      link: '/community'
    },
    {
      title: 'Video Tutorials',
      description: 'Step-by-step video guides',
      link: '/tutorials'
    },
    {
      title: 'API Documentation',
      description: 'For developers and integrations',
      link: '/api-docs'
    }
  ];

  const filteredTopics = supportTopics.filter(topic =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>How Can We Help?</h1>
          <p className={styles.heroSubtitle}>
            Find answers to your questions, get help with common issues, and discover everything you need to know about our movie platform.
          </p>
          
          {/* Search Bar */}
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search for help articles, topics, or keywords..."
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

        {/* Support Topics */}
        <section className={styles.supportTopics}>
          <h2>Support Topics</h2>
          <div className={styles.topicsGrid}>
            {filteredTopics.map((topic) => (
              <div
                key={topic.id}
                className={`${styles.topicCard} ${selectedTopic === topic.id ? styles.active : ''}`}
                onClick={() => setSelectedTopic(selectedTopic === topic.id ? null : topic.id)}
              >
                <div className={styles.topicHeader}>
                  <span className={styles.topicIcon}>{topic.icon}</span>
                  <h3>{topic.title}</h3>
                  <button className={styles.expandButton}>
                    {selectedTopic === topic.id ? '−' : '+'}
                  </button>
                </div>
                <p className={styles.topicDescription}>{topic.description}</p>
                
                {selectedTopic === topic.id && (
                  <div className={styles.topicArticles}>
                    <h4>Related Articles:</h4>
                    <ul>
                      {topic.articles.map((article, index) => (
                        <li key={index}>
                          <Link to={`/help/${topic.id}/${index + 1}`} className={styles.articleLink}>
                            {article}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className={styles.quickActions}>
          <h2>Quick Actions</h2>
          <div className={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <div key={index} className={styles.actionCard}>
                <h3>{action.title}</h3>
                <p>{action.description}</p>
                <Link to={action.link} className={styles.actionButton}>
                  {action.action}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Help Resources */}
        <section className={styles.helpResources}>
          <h2>Additional Help Resources</h2>
          <div className={styles.resourcesGrid}>
            {helpResources.map((resource, index) => (
              <div key={index} className={styles.resourceCard}>
                <h3>{resource.title}</h3>
                <p>{resource.description}</p>
                <Link to={resource.link} className={styles.resourceLink}>
                  Learn More →
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Support */}
        <section className={styles.contactSupport}>
          <h3>Still Need Help?</h3>
          <p>Our support team is here to help you with any questions or issues.</p>
          <div className={styles.contactMethods}>
            <div className={styles.contactMethod}>
              <h4>Email Support</h4>
              <p><a href="mailto:moviehubflix01@gmail.com">moviehubflix01@gmail.com</a></p>
              <p>Response time: 2-4 hours during business hours</p>
            </div>
            <div className={styles.contactMethod}>
              <h4>Phone Support</h4>
              <p><a href="tel:+919347967884">+91 9347967884</a></p>
              <p>Available: 9 AM - 6 PM IST</p>
            </div>
            <div className={styles.contactMethod}>
              <h4>Social Media</h4>
              <p>Twitter: <a href="https://twitter.com/moviehubflix01" target="_blank" rel="noopener noreferrer">@moviehubflix01</a></p>
              <p>Instagram: <a href="https://instagram.com/moviehubflix01" target="_blank" rel="noopener noreferrer">@moviehubflix01</a></p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SupportPage;
