import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom'; // Added missing import
import { AuthProvider } from './context/AuthContext';
import { MovieProvider } from './context/MovieContext';
import router from './router';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <MovieProvider>
        <RouterProvider router={router} />
      </MovieProvider>
    </AuthProvider>
  </React.StrictMode>
);