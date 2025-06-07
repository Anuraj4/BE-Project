import React, { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const Translator = ({ sourceLang, targetLang }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const recognitionRef = useRef(null);
  const shouldContinueRef = useRef(false);

  // Load voices once
  const voicesRef = useRef([]);

  useEffect(() => {
    // Update voices list when voices changed (some browsers load voices asynchronously)
    window.speechSynthesis.onvoiceschanged = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
    };
    // Initial load
    voicesRef.current = window.speechSynthesis.getVoices();
  }, []);

  useEffect(() => {
    socket.on('translatedText', (translated) => {
      setTranslatedText(translated);
      stopRecognition(); // Stop mic before speaking
      speakText(translated, targetLang);

      // Save to localStorage (max 10 entries)
      const entry = {
        transcription,
        translation: translated,
      };
      const existing = JSON.parse(localStorage.getItem('translationHistory')) || [];
      const updated = [entry, ...existing].slice(0, 10);
      localStorage.setItem('translationHistory', JSON.stringify(updated));
    });

    return () => {
      socket.off('translatedText');
    };
  }, [targetLang, transcription]);

  const speakText = (text, lang) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;

    // Select voice matching language prefix (e.g. "hi", "mr", "ta")
    const voice = voicesRef.current.find(v => v.lang.toLowerCase().startsWith(lang.toLowerCase())) || voicesRef.current[0];
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onend = () => {
      if (shouldContinueRef.current) {
        startRecognition(); // Resume mic after speaking
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  const startRecognition = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Your browser does not support speech recognition.');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = sourceLang;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join('');
      setTranscription(transcript);
      socket.emit('audioChunk', { text: transcript, sourceLang, targetLang });
    };

    recognition.onend = () => {
      // Do nothing here. Wait until speech synthesis completes.
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.onend = null;
      recognitionRef.current.stop();
    }
  };

  const startRecording = () => {
    shouldContinueRef.current = true;
    setIsRecording(true);
    startRecognition();
  };

  const stopRecording = () => {
    shouldContinueRef.current = false;
    setIsRecording(false);
    stopRecognition();
    window.speechSynthesis.cancel();
  };

  return (
    <div className="translator-container">
      <button
        className="stop-recording-button"
        onClick={isRecording ? stopRecording : startRecording}
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      <div>
        <h3>Transcription:</h3>
        <p>{transcription}</p>
      </div>
      <div>
        <h3>Translation:</h3>
        <p>{translatedText}</p>
      </div>
    </div>
  );
};

export default Translator;
