import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Translator from './components/Translator';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/Home';

function App() {
  return (
    <div className="App">
      <Header />
      <Home />
    </div>
  );
}

export default App;
