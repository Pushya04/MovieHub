import React, { useEffect, useState } from 'react';
import { reviewsAPI, watchlistAPI } from '../../../api';
import { FiMessageSquare, FiHeart, FiClock, FiFilm } from 'react-icons/fi';
import styles from './ActivityFeed.module.css';

const ActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const [comments, likes, watchlist] = await Promise.all([
          reviewsAPI.getUserComments(),
          reviewsAPI.getLikedComments(),
          watchlistAPI.getWatchlist()
        ]);

        const transformed = [
          ...comments.map(c => ({ type: 'comment', date: c.created_at, data: c })),
          ...likes.map(l => ({ type: 'like', date: l.created_at, data: l })),
          ...watchlist.map(w => ({ type: 'watchlist', date: w.created_at, data: w }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date));

        setActivities(transformed);
        setError(null);
      } catch (err) {
        setError(err.message || 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const getActivityIcon = (type) => {
    switch(type) {
      case 'comment': 
        return <FiMessageSquare className={styles['activity-icon']} />;
      case 'like': 
        return <FiHeart className={styles['activity-icon']} />;
      case 'watchlist': 
        return <FiFilm className={styles['activity-icon']} />;
      default: 
        return <FiClock className={styles['activity-icon']} />;
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (error) {
    return (
      <div className={styles['activity-error']}>
        Error loading activities: {error}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles['activity-loading']}>
        <div className={styles['activity-spinner']} />
      </div>
    );
  }

  return (
    <div className={styles['activity-container']}>
      <h2 className={styles['activity-title']}>Recent Activity</h2>
      
      {activities.length > 0 ? (
        <div className={styles['activity-list']}>
          {activities.map((activity, index) => (
            <div 
              key={`${activity.type}-${index}`} 
              className={styles['activity-item']}
            >
              <div className={styles['activity-icon-container']}>
                {getActivityIcon(activity.type)}
              </div>
              <div className={styles['activity-content']}>
                <div className={styles['activity-header']}>
                  <span className={styles['activity-type']}>{activity.type}</span>
                  <time className={styles['activity-date']}>
                    {formatDate(activity.date)}
                  </time>
                </div>
                {activity.type === 'comment' && (
                  <p className={styles['activity-text']}>
                    You commented on <strong>{activity.data.movie.title}</strong>: 
                    <span className={styles['activity-excerpt']}>
                      {" "}"{ activity.data.content ? 
                        activity.data.content.slice(0, 60) : 
                        'No comment content'
                      }..."
                    </span>
                  </p>
                )}
                {activity.type === 'like' && (
                  <p className={styles['activity-text']}>
                    You liked a comment on <strong>{activity.data.movie.title}</strong>
                  </p>
                )}
                {activity.type === 'watchlist' && (
                  <p className={styles['activity-text']}>
                    You added <strong>{activity.data.movie.title}</strong> to your watchlist
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles['activity-empty']}>
          No recent activity found
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;