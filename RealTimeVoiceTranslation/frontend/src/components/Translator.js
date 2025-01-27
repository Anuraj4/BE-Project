import React, { useState, useRef } from 'react';
import io from 'socket.io-client';
import 'cors'
import './Translator.css';
import Button from 'react-bootstrap/Button';


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
    <div className='container text-center'>
      <h1 className='custom-bold'>Real-Time Voice Translation</h1>
      <p className='lead mb-4 text-secondary'>English to Marathi</p>
      <Button
        className='btn-lg mt-1'
        variant={isRecording ? 'danger' : 'success'}
        onClick={isRecording ? stopRecording : startRecording}
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </Button>

      <div className='mt-4'>
        <h5 className='text-muted'>Transcription (English):</h5>
        <p className='transcription-text'>{transcription || 'No transcription yet...'}</p>
        <p className='text-muted interim-text'>{interimTranscription}</p>
      </div>

      <div className='mt-4'>
        <h5 className='text-muted'>Translated Text (Marathi):</h5>
        <p className='translated-text'>{translatedText || 'No translation yet...'}</p>
      </div>
    </div>
  );
};

export default Translator;
