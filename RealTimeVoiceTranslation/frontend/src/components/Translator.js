import React, { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const Translator = ({ sourceLang, targetLang }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const recognitionRef = useRef(null);
  const shouldContinueRef = useRef(false);

  useEffect(() => {
    socket.on('translatedText', (translated) => {
      setTranslatedText(translated);
      stopRecognition(); // Stop mic before speaking
      speakText(translated, targetLang);
    });

    return () => {
      socket.off('translatedText');
    };
  }, [targetLang]);

  const speakText = (text, lang) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;

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
      // Wait for speech synthesis to finish before resuming
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
      <button className="stop-recording-button" onClick={isRecording ? stopRecording : startRecording}>
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
