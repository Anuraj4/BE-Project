import React, { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const Translator = ({ sourceLang, targetLang }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const recognitionRef = useRef(null);
  const shouldContinueRef = useRef(false);
  const voicesRef = useRef([]);

  useEffect(() => {
    const loadVoices = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  useEffect(() => {
    socket.on('translatedText', (translated) => {
      setTranslatedText(translated);
      stopRecognition();
      const emotion = detectEmotion(transcription);
      speakText(translated, targetLang, emotion);

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

  const detectEmotion = (text) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('angry') || lowerText.includes('rage')) return 'angry';
    if (lowerText.includes('sad') || lowerText.includes('cry')) return 'sad';
    if (lowerText.includes('happy') || lowerText.includes('joy')) return 'happy';
    if (lowerText.includes('surprise') || lowerText.includes('shocked')) return 'surprised';
    return 'neutral';
  };

  const speakText = (text, lang, emotion = 'neutral') => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;

    // Emotion tone mapping
    switch (emotion) {
      case 'angry':
        utterance.pitch = 0.7;
        utterance.rate = 1.2;
        break;
      case 'sad':
        utterance.pitch = 0.6;
        utterance.rate = 0.9;
        break;
      case 'happy':
        utterance.pitch = 1.4;
        utterance.rate = 1.3;
        break;
      case 'surprised':
        utterance.pitch = 1.6;
        utterance.rate = 1.1;
        break;
      default:
        utterance.pitch = 1;
        utterance.rate = 1;
    }

    // Prioritize exact or partial match for desired language
    let voice = voicesRef.current.find(v => v.lang.toLowerCase().startsWith(lang.toLowerCase()));

    if (!voice && lang === 'mr') {
      voice = voicesRef.current.find(v => v.lang.toLowerCase().includes('hi'));
    }

    if (!voice) {
      voice = voicesRef.current.find(v => v.lang.toLowerCase().includes('en'));
    }

    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    }

    utterance.onend = () => {
      if (shouldContinueRef.current) {
        startRecognition();
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
      // no-op
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