import React, { useState, useRef, useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import Sentiment from 'sentiment';
import './Translator.css';
import Button from 'react-bootstrap/Button';
import Playback from './Playback';

const socket = io('http://localhost:5000', {
  transports: ['websocket']
});

const Translator = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [interimTranscription, setInterimTranscription] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const speechRecognitionRef = useRef(null);

  const isSpeakingRef = useRef(false);
  const isRecognitionActiveRef = useRef(false);

  // DEBUG: Log available voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      console.log("Available voices:", voices);
    };
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
  }, []);

  const speakTranslatedText = useCallback((text) => {
    if (!text) return;

    if (speechRecognitionRef.current && isRecognitionActiveRef.current) {
      speechRecognitionRef.current.stop();
      isRecognitionActiveRef.current = false;
    }

    isSpeakingRef.current = true;

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const marathiVoice = voices.find(v => v.lang === 'mr-IN');

    if (marathiVoice) {
      utterance.voice = marathiVoice;
    } else {
      console.warn("No Marathi voice found. Using default voice.");
    }

    utterance.lang = 'mr-IN';
    utterance.pitch = 1;
    utterance.rate = 1;
    utterance.volume = 1;

    utterance.onend = () => {
      isSpeakingRef.current = false;
      if (isRecording && !isRecognitionActiveRef.current) {
        speechRecognitionRef.current.start();
        isRecognitionActiveRef.current = true;
      }
    };

    window.speechSynthesis.speak(utterance);
  }, [isRecording]);

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

    recognition.onstart = () => {
      isRecognitionActiveRef.current = true;
    };

    recognition.onend = () => {
      isRecognitionActiveRef.current = false;
      if (isRecording && !isSpeakingRef.current) {
        recognition.start();
        isRecognitionActiveRef.current = true;
      }
    };

    recognition.onresult = (event) => {
      if (isSpeakingRef.current) return;

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
    window.speechSynthesis.cancel();
  };

  useEffect(() => {
    socket.on('translatedText', (translated) => {
      setTranslatedText(translated);
      if (isRecording) {
        speakTranslatedText(translated);
      }
    });

    return () => {
      socket.off('translatedText');
    };
  }, [isRecording, speakTranslatedText]);

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

      {/* Optional test button */}
      <Button className="mt-3" variant="info" onClick={() => speakTranslatedText("नमस्कार, तुमचं भाषांतर पूर्ण झालं आहे")}>
        Test Speak Marathi
      </Button>

      <Playback translatedText={translatedText} />
    </div>
  );
};

export default Translator;