import React, { useState, useRef } from 'react';
import io from 'socket.io-client';
import 'cors'
import '../App.css'



const socket = io('http://localhost:5000', {
  transports: ['websocket']
});

const Translator = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [interimTranscription, setInterimTranscription] = useState('');
  const [translatedText, setTranslatedText] = useState(''); // State for translated text
  const speechRecognitionRef = useRef(null);

  const startRecording = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Your browser does not support speech recognition. Please use Google Chrome.');
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';  // Recognize English speech
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      setInterimTranscription(interimTranscript);
      setTranscription((prev) => prev + finalTranscript);

      // Emit the final transcript to the backend for translation
      if (finalTranscript) {
        socket.emit('audioChunk', finalTranscript);
      }
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

  // Listen for translated text from the backend
  socket.on('translatedText', (translated) => {
    setTranslatedText(translated);
  });

  return (
    <div className='container'>
      <h1>Real-Time Voice Translation (English to Marathi)</h1>
      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      <p>Transcription (English): {transcription}</p>
      <p style={{ color: 'gray' }}>{interimTranscription}</p>
      <p>Translated Text (Marathi): {translatedText}</p>
    </div>
  );
};

export default Translator;
