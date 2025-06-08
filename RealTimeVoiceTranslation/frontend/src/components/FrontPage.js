import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FrontPage.css';
import FrontImage from './images/frontPageImage.png';

const FrontPage = () => {
  const navigate = useNavigate();
  const [hasAskedOnce, setHasAskedOnce] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (hasAskedOnce) return;

    const synth = window.speechSynthesis;
    if (synth.speaking || synth.pending) synth.cancel();

    const askUtterance = new SpeechSynthesisUtterance(
      'Do you have a visual disability? Please say yes or no.'
    );
    askUtterance.lang = 'en-US';

    askUtterance.onend = () => {
      setTimeout(() => {
        startListening();
      }, 500); // Delay to ensure mic starts after speech ends
    };

    synth.speak(askUtterance);
    setHasAskedOnce(true);
  }, [hasAskedOnce]);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech Recognition not supported in this browser. Please use Google Chrome.');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const spoken = event.results[0][0].transcript.toLowerCase();
      console.log('User said:', spoken);

      if (spoken.includes('yes')) {
        navigate('/disability'); // voice-only version
      } else if (spoken.includes('no')) {
        alert('Proceeding with normal interface.');
      } else {
        retryPrompt();
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      retryPrompt();
    };

    recognition.start();
  };

  const retryPrompt = () => {
    if (retryCount >= 1) {
      alert("Couldn't understand. Please refresh and try again.");
      return;
    }

    setRetryCount(retryCount + 1);

    const synth = window.speechSynthesis;
    const retryUtterance = new SpeechSynthesisUtterance(
      "Sorry, I didn't get that. Do you have a visual disability? Please say yes or no."
    );
    retryUtterance.lang = 'en-US';

    retryUtterance.onend = () => {
      setTimeout(() => {
        startListening();
      }, 500);
    };

    synth.cancel(); // stop previous speech
    synth.speak(retryUtterance);
  };

  const handleGetStartedClick = () => {
    navigate('/home');
  };

  return (
    <div className="front-page-container">
      <div className="text-section">
        <h1 className="main-heading" style={{ fontWeight: 'bold' }}>
          Real-Time Language Translation Using AI and Emotion Detection
        </h1>
        <p className="description">
          Experience seamless, instant language translation powered by AI. Our system offers real-time translation, enabling smooth communication across different languages.
          With the added capability of emotion detection, it understands and interprets the emotional tone behind the conversation, ensuring that your message is conveyed accurately and empathetically.
          Break down language barriers and enhance global connectivity with this innovative solution.
        </p>
        <button className="get-started-btn" onClick={handleGetStartedClick}>
          Get Started
        </button>
      </div>
      <div className="image-section">
        <img src={FrontImage} alt="Real-Time Translation" className="image" />
      </div>
    </div>
  );
};

export default FrontPage;
