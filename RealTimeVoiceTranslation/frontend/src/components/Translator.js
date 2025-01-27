import React, { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';
import './Translator.css';
import Button from 'react-bootstrap/Button';

const socket = io('http://localhost:5000', {
  transports: ['websocket']
});

const Translator = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [interimTranscription, setInterimTranscription] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const speechRecognitionRef = useRef(null);

  // Reference flags for managing recognition and synthesis states
  const isSpeakingRef = useRef(false);
  const isRecognitionActiveRef = useRef(false);

  // Function to speak text using SpeechSynthesis API
  const speakTranslatedText = (text) => {
    if (!text) return;

    // Stop recognition while speaking
    if (speechRecognitionRef.current && isRecognitionActiveRef.current) {
      speechRecognitionRef.current.stop();
      isRecognitionActiveRef.current = false;
    }

    isSpeakingRef.current = true;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'mr-IN'; // Set the language for Marathi

    // Resume recognition after speaking is done
    utterance.onend = () => {
      isSpeakingRef.current = false;
      if (isRecording && !isRecognitionActiveRef.current) {
        speechRecognitionRef.current.start();
        isRecognitionActiveRef.current = true;
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  const startRecording = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Your browser does not support speech recognition. Please use Google Chrome.');
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US'; // Recognize English speech
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      isRecognitionActiveRef.current = true;
    };

    recognition.onend = () => {
      isRecognitionActiveRef.current = false;

      // Automatically restart recognition if still recording and not speaking
      if (isRecording && !isSpeakingRef.current) {
        recognition.start();
        isRecognitionActiveRef.current = true;
      }
    };

    recognition.onresult = (event) => {
      if (isSpeakingRef.current) return; // Skip processing input during speech synthesis

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
    if (speechRecognitionRef.current && isRecognitionActiveRef.current) {
      speechRecognitionRef.current.stop();
      isRecognitionActiveRef.current = false;
    }
    setIsRecording(false);

    // Cancel ongoing speech synthesis
    window.speechSynthesis.cancel();
  };

  useEffect(() => {
    // Listen for translated text from the backend
    socket.on('translatedText', (translated) => {
      setTranslatedText(translated);
      if (isRecording) {
        speakTranslatedText(translated); // Speak the translated text only if recording is active
      }
    });

    return () => {
      // Clean up the socket event listener when the component unmounts
      socket.off('translatedText');
    };
  }, [isRecording]);

  return (
    <div className="container text-center">
      <h1 className="custom-bold">Real-Time Voice Translation</h1>
      <p className="lead mb-4 text-secondary">English to Marathi</p>
      <Button
        className="btn-lg mt-1"
        variant={isRecording ? 'danger' : 'success'}
        onClick={isRecording ? stopRecording : startRecording}
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </Button>

      <div className="mt-4">
        <h5 className="text-muted">Transcription (English):</h5>
        <p className="transcription-text">{transcription || 'No transcription yet...'}</p>
        <p className="text-muted interim-text">{interimTranscription}</p>
      </div>

      <div className="mt-4">
        <h5 className="text-muted">Translated Text (Marathi):</h5>
        <p className="translated-text">{translatedText || 'No translation yet...'}</p>
      </div>
    </div>
  );
};

export default Translator;
