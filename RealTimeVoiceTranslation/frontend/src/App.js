import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import Routes instead of Switch
import Navbar from './components/Navbar';
import Home from './components/Home';
import FrontPage from './components/FrontPage'; // Import FrontPage component
import Instructions from './components/Instructions'; // Import FrontPage component
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Playback from './components/Playback';
import Feedback from './components/Feedback';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        {/* Define Routes */}
        <Routes>
          <Route path="/" element={<FrontPage />} /> {/* FrontPage component when at root */}
          <Route path="/home" element={<Home />} /> {/* Home component when at /home */}
          <Route path="/frontpage" element={<FrontPage />} /> {/* Another route for FrontPage */}
          <Route path="/instructions" element={<Instructions />} /> {/* Another route for FrontPage */}
          <Route path="/playback" element={<Playback />} /> {/* Another route for FrontPage */}
          <Route path="/feedback" element={<Feedback />} /> {/* Another route for FrontPage */}
          {/* Add any additional routes here */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
