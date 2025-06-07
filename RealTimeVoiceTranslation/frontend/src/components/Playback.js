import React, { useEffect, useState } from 'react';
import './Playback.css';

const Playback = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('translationHistory')) || [];
    setHistory(saved);
  }, []);

  return (
    <div className="playback-container">
      <h2>Recent Translations</h2>
      {history.length === 0 ? (
        <p>No history yet.</p>
      ) : (
        <ul className="history-list">
          {history.map((item, index) => (
            <li key={index} className="history-item">
              <p><strong>Input:</strong> {item.transcription}</p>
              <p><strong>Translation:</strong> {item.translation}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Playback;
