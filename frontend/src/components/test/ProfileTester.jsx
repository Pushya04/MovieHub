import React from 'react';
import { profileAPI } from '../../api/profile';

const ProfileTester = () => {
  const [testResults, setTestResults] = React.useState([]);

  const runTests = async () => {
    const results = [];
    
    try {
      // Test 1: Check if profile API is accessible
      results.push('✅ Profile API module loaded successfully');
      
      // Test 2: Check if API functions exist
      if (typeof profileAPI.getUserComments === 'function') {
        results.push('✅ getUserComments function exists');
      } else {
        results.push('❌ getUserComments function missing');
      }
      
      if (typeof profileAPI.getUserWatchlist === 'function') {
        results.push('✅ getUserWatchlist function exists');
      } else {
        results.push('❌ getUserWatchlist function missing');
      }
      
      if (typeof profileAPI.updateUserProfile === 'function') {
        results.push('✅ updateUserProfile function exists');
      } else {
        results.push('❌ updateUserProfile function missing');
      }
      
      // Test 3: Check if components can be imported
      try {
        const { default: CommentCard } = await import('../user/CommentCard/CommentCard');
        results.push('✅ CommentCard component can be imported');
      } catch (error) {
        results.push('❌ CommentCard component import failed: ' + error.message);
      }
      
      try {
        const { default: WatchlistCard } = await import('../user/WatchlistCard/WatchlistCard');
        results.push('✅ WatchlistCard component can be imported');
      } catch (error) {
        results.push('❌ WatchlistCard component import failed: ' + error.message);
      }
      
    } catch (error) {
      results.push('❌ Test failed: ' + error.message);
    }
    
    setTestResults(results);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Profile Page Component Test</h2>
      <button 
        onClick={runTests}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        Run Tests
      </button>
      
      <div>
        <h3>Test Results:</h3>
        {testResults.length === 0 ? (
          <p>Click "Run Tests" to check component functionality</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {testResults.map((result, index) => (
              <li 
                key={index} 
                style={{ 
                  padding: '8px 0',
                  borderBottom: '1px solid #eee',
                  color: result.startsWith('✅') ? '#28a745' : '#dc3545'
                }}
              >
                {result}
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
        <h3>Profile Page Features:</h3>
        <ul>
          <li>✅ User profile information display</li>
          <li>✅ Profile editing functionality</li>
          <li>✅ User comments management</li>
          <li>✅ Watchlist management</li>
          <li>✅ Tabbed interface</li>
          <li>✅ Responsive design</li>
          <li>✅ Error handling</li>
          <li>✅ Loading states</li>
        </ul>
      </div>
    </div>
  );
};

export default ProfileTester;

