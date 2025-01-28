import React, { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';
import Sentiment from 'sentiment'; // Sentiment analysis
import './Translator.css';
import Button from 'react-bootstrap/Button';
import Playback from './Playback'; // Import Playback component

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

  // Advanced Sentiment Analysis Function
  const analyzeSentiment = (text) => {
    const sentimentAnalyzer = new Sentiment();
    const result = sentimentAnalyzer.analyze(text);
    return result.score;
  };

  // Emotional Tone Function based on Sentiment Score
  const determineTone = (sentimentScore, sentence) => {
    const exclamationMark = sentence.includes('!');
    const questionMark = sentence.includes('?');
    const emotionalKeywords = ['angry', 'happy', 'excited', 'sad', 'frustrated'];

    let pitch = 1.0;
    let rate = 1.0;
    let volume = 1.0;
    let emphasis = 1.0;

    if (emotionalKeywords.some(keyword => sentence.toLowerCase().includes(keyword))) {
      // Emotionally charged sentence
      if (sentence.toLowerCase().includes('angry')) {
        pitch = 0.5; rate = 0.8; volume = 1.2;
      } else if (sentence.toLowerCase().includes('happy')) {
        pitch = 2.0; rate = 1.4; volume = 1.1;
      } else if (sentence.toLowerCase().includes('excited')) {
        pitch = 2.5; rate = 1.6; volume = 1.3;
      } else if (sentence.toLowerCase().includes('sad')) {
        pitch = 0.6; rate = 0.9; volume = 0.8;
      } else if (sentence.toLowerCase().includes('frustrated')) {
        pitch = 0.7; rate = 0.8; volume = 1.0;
      }
    } else {
      // Neutral sentiment-based tone
      if (sentimentScore >= 7) {
        pitch = 2.2; rate = 1.5; volume = 1.2; emphasis = exclamationMark ? 1.4 : 1.0;
      } else if (sentimentScore >= 3) {
        pitch = 1.8; rate = 1.3; volume = 1.1; emphasis = exclamationMark ? 1.2 : 1.0;
      } else if (sentimentScore >= 0) {
        pitch = 1.2; rate = 1.1; volume = 1.0; emphasis = exclamationMark ? 1.1 : 1.0;
      } else if (sentimentScore <= -7) {
        pitch = 0.6; rate = 0.8; volume = 0.7; emphasis = questionMark ? 1.2 : 1.0;
      } else if (sentimentScore <= -3) {
        pitch = 0.8; rate = 0.9; volume = 0.8; emphasis = questionMark ? 1.1 : 1.0;
      }
    }

    return { pitch, rate, volume, emphasis };
  };

  const speakTranslatedText = (text) => {
    if (!text) return;

    if (speechRecognitionRef.current && isRecognitionActiveRef.current) {
      speechRecognitionRef.current.stop();
      isRecognitionActiveRef.current = false;
    }

    isSpeakingRef.current = true;

    const sentimentScore = analyzeSentiment(text);
    const tone = determineTone(sentimentScore, text);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US'; // Set language to English
    utterance.pitch = tone.pitch;
    utterance.rate = tone.rate;
    utterance.volume = tone.volume;
    utterance.pitch *= tone.emphasis;
    utterance.rate *= tone.emphasis;

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
    recognition.lang = 'mr-IN'; // Set language to Marathi
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
      setTranscription(finalTranscript);  // Set final Marathi transcription here

      if (finalTranscript) {
        socket.emit('audioChunk', finalTranscript); // Send Marathi transcript for translation
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
      setTranslatedText(translated); // Set translated English text here
      if (isRecording) {
        speakTranslatedText(translated); // Speak the translated English text if recording is active
      }
    });

    return () => {
      socket.off('translatedText');
    };
  }, [isRecording]);

  return (
    <div className="container text-center">
      <h1 className="custom-bold">Real-Time Voice Translation</h1>
      <p className="lead mb-4 text-secondary">Marathi to English</p>
      <Button
        className="btn-lg mt-1"
        variant={isRecording ? 'danger' : 'success'}
        onClick={isRecording ? stopRecording : startRecording}
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </Button>

      <div className="mt-4">
        <h5 className="text-muted">Transcription (Marathi):</h5>
        <p className="transcription-text">{transcription || 'No transcription yet...'}</p>
        <p className="text-muted interim-text">{interimTranscription}</p>
      </div>

      <div className="mt-4">
        <h5 className="text-muted">Translated Text (English):</h5>
        <p className="translated-text">{translatedText || 'No translation yet...'}</p>
      </div>

      {/* Add Playback component and pass translatedText as prop */}
      <Playback translatedText={translatedText} />
    </div>
  );
};

export default Translator;
