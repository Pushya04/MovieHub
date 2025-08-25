import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import styles from './SentimentAnalysisPage.module.css';
import { useAuth } from '../../context/AuthContext';
import { analyzeSentiment } from '../../api/sentiment'; // Assuming you have an API function for this

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SentimentAnalysisPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to analyze sentiment.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeSentiment(text);
      setResults(data);
    } catch (err) {
      setError('Failed to analyze sentiment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: ['Positive', 'Negative', 'Neutral'],
    datasets: [
      {
        label: 'Sentiment Scores',
        data: results ? [results.positive, results.negative, results.neutral] : [0, 0, 0],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(201, 203, 207, 0.6)'
        ],
      },
    ],
  };

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
        <h1>Sentiment Analysis</h1>
        <p>Analyze the sentiment of any text and see the results in a bar graph.</p>
      </header>

      {!user ? (
        <p className={styles.loginMessage}>Please log in to use this feature.</p>
      ) : (
        <>
          <form onSubmit={handleSubmit} className={styles.form}>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text to analyze..."
              className={styles.textarea}
              rows="5"
            />
            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
          </form>

          {error && <p className={styles.error}>{error}</p>}

          {results && (
            <div className={styles.results}>
              <h2>Analysis Results</h2>
              <div className={styles.chartContainer}>
                <Bar data={chartData} />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SentimentAnalysisPage;
