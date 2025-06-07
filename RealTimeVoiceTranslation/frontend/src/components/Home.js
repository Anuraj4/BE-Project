import React, { useState } from 'react';
import Translator from './Translator';
import './Home.css';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'mr', name: 'Marathi' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
];

const Home = () => {
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('mr');

  return (
    <div className="home-container">
      <h1>Real-Time Language Translation</h1>
      <div className="language-selection">
        <label>
          Input Language:
          <select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)}>
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Target Language:
          <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)}>
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <Translator sourceLang={sourceLang} targetLang={targetLang} />
    </div>
  );
};

export default Home;
