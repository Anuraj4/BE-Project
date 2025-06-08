import React from 'react';
import './Instructions.css';

const Instructions = () => {
  return (
    <div className="instructions-container">
      <h2 className="instructions-heading" style={{color:"white"}}>How to Use Our Model</h2>
      {/* 📝 Instructions List */}
      <ul className="instructions-list">
        <li>
          <span className="instruction-step">Step 1:</span> Select the language you want to translate from the options available.
        </li>
        <li>
          <span className="instruction-step">Step 2:</span> Speak your message in the selected language.
        </li>
        <li>
          <span className="instruction-step">Step 3:</span> Our model will instantly translate your message to the target language in real-time.
        </li>
        <li>
          <span className="instruction-step">Step 4:</span> If emotion detection is enabled, the system will analyze the tone of your message and translate it with the proper emotional context.
        </li>
        <li>
          <span className="instruction-step">Step 5:</span> View the translated message and its emotional context on the screen.
        </li>
        <li>
          <span className="instruction-step">Step 6:</span> You can hear the translated text in voice format.
        </li>
      </ul>
    </div>
  );
};

export default Instructions;
