import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Translator from './components/Translator';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <Translator />
      <Footer />
    </div>
  );
}

export default App;
