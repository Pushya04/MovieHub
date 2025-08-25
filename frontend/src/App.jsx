import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/common/Header/Header';
import Footer from './components/common/Footer/Footer';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default App;