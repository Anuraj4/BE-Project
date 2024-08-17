import React, { useState, useRef } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const Translator = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const mediaRecorderRef = useRef(null);
  const speechRecognitionRef = useRef(null);

  const startRecording = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Your browser does not support speech recognition. Please use Google Chrome.');
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          setTranscription((prev) => prev + event.results[i][0].transcript);
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setTranscription((prev) => prev + interimTranscript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
    speechRecognitionRef.current = recognition;
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  return (
    <div>
      <h1>Real-Time Voice Translation</h1>
      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      <p>Transcription: {transcription}</p>
    </div>
  );
};

export default Translator;
