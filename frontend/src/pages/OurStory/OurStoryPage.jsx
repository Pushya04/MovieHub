import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './OurStoryPage.module.css';

const OurStoryPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      {/* Back Button */}
      <button 
        className={styles.backButton}
        onClick={() => navigate('/')}
      >
        ← Back to Home
      </button>
      
      <header className={styles.header}>
        <h1>Our Story</h1>
        <p>Revolutionizing movie recommendations through advanced comment analysis and sentiment detection.</p>
      </header>

      <section className={styles.section}>
        <h2>The Innovation</h2>
        <p>
          Traditional movie recommendation systems rely heavily on star ratings and critic reviews, which often don't capture the true sentiment of real viewers. We've revolutionized this approach by developing a sophisticated comment analysis system that reads between the lines of user reviews to understand what people truly think about movies.
        </p>
        <div className={styles.featureGrid}>
          <div className={styles.feature}>
            <h3>🔍 Deep Comment Analysis</h3>
            <p>Our AI doesn't just count stars - it reads every word, understands context, and identifies genuine sentiment patterns in user comments.</p>
          </div>
          <div className={styles.feature}>
            <h3>🎯 Sentiment Detection</h3>
            <p>Advanced natural language processing identifies positive, negative, and neutral sentiments with remarkable accuracy, even in sarcastic or nuanced reviews.</p>
          </div>
          <div className={styles.feature}>
            <h3>📊 Real-time Insights</h3>
            <p>Get instant sentiment analysis that reflects current audience opinions, not just historical ratings.</p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Why Comment Analysis Matters</h2>
        <p>
          Star ratings are limited - a 3-star rating could mean "decent but forgettable" or "good but not great." Comments tell the real story. Our system analyzes thousands of user comments to provide you with:
        </p>
        <div className={styles.benefits}>
          <div className={styles.benefit}>
            <h3>🎭 Genre-Specific Analysis</h3>
            <p>We understand that a "scary" comment about a horror movie is positive, while the same word about a comedy might be negative. Our system adapts to genre expectations.</p>
          </div>
          <div className={styles.benefit}>
            <h3>💬 Context-Aware Understanding</h3>
            <p>Our AI recognizes sarcasm, hyperbole, and cultural references that simple rating systems miss entirely.</p>
          </div>
          <div className={styles.benefit}>
            <h3>📈 Trend Detection</h3>
            <p>See how audience sentiment changes over time, helping you understand if a movie's reputation is improving or declining.</p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2>The Technology Behind It</h2>
        <p>
          Our platform combines cutting-edge machine learning with sophisticated natural language processing to deliver insights that go far beyond simple ratings.
        </p>
        <div className={styles.techStack}>
          <div className={styles.techItem}>
            <h3>🤖 Advanced AI Models</h3>
            <p>State-of-the-art transformer models trained on millions of movie reviews to understand nuanced human expression.</p>
          </div>
          <div className={styles.techItem}>
            <h3>🔧 FastAPI Backend</h3>
            <p>High-performance API that processes comments in real-time, providing instant sentiment analysis results.</p>
          </div>
          <div className={styles.techItem}>
            <h3>⚛️ React Frontend</h3>
            <p>Modern, responsive interface that presents complex sentiment data in an intuitive, visually appealing way.</p>
          </div>
          <div className={styles.techItem}>
            <h3>📊 Real-time Analytics</h3>
            <p>Live sentiment tracking that updates as new comments are added, giving you the most current audience perspective.</p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Our Mission</h2>
        <p>
          We believe that every movie deserves to be understood on its own terms, through the authentic voices of real viewers. By analyzing comments instead of just counting stars, we help you discover movies that truly resonate with audiences like you.
        </p>
        <div className={styles.missionPoints}>
          <div className={styles.missionPoint}>
            <h3>🎯 Accurate Recommendations</h3>
            <p>Find movies that match your taste based on what people actually say, not just how many stars they give.</p>
          </div>
          <div className={styles.missionPoint}>
            <h3>🔍 Deeper Insights</h3>
            <p>Understand not just if people liked a movie, but why they liked it - the specific aspects that resonated with viewers.</p>
          </div>
          <div className={styles.missionPoint}>
            <h3>🌍 Inclusive Analysis</h3>
            <p>Our system considers diverse perspectives and cultural contexts, providing recommendations that work for everyone.</p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Join the Revolution</h2>
        <p>
          Experience the future of movie discovery. Our comment-based analysis system provides insights that traditional rating systems simply cannot match. Start exploring movies through the lens of real audience sentiment today.
        </p>
        <div className={styles.cta}>
          <p>Ready to discover movies the smart way?</p>
          <button className={styles.ctaButton} onClick={() => window.location.href = '/'}>
            Explore Movies
          </button>
        </div>
      </section>
    </div>
  );
};

export default OurStoryPage;
