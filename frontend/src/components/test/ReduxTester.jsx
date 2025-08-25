// src/components/test/ReduxTester.jsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, logout } from '../../redux/authSlice';
import { fetchMovieDetails, openTrailerPlayer } from '../../redux/movieSlice';

export default function ReduxTester() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const movies = useSelector((state) => state.movies);

  const testAuth = () => {
    dispatch(loginSuccess({
      user: { id: 1, email: 'test@example.com' },
      accessToken: 'fake-token-123'
    }));
  };

  const testMovie = () => {
    dispatch(fetchMovieDetails(2)); // Test with The Dark Knight's ID
  };

  const testTrailer = () => {
    dispatch(openTrailerPlayer('https://www.youtube.com/watch?v=EXeTwQWrcwY'));
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Redux Functionality Test</h1>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={testAuth}>Test Auth</button>
        <button onClick={testMovie}>Test Movie</button>
        <button onClick={testTrailer}>Test Trailer</button>
        <button onClick={() => dispatch(logout())}>Logout</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <h2>Auth State</h2>
          <pre>{JSON.stringify(auth, null, 2)}</pre>
        </div>
        <div>
          <h2>Movie State</h2>
          <pre>{JSON.stringify(movies, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}