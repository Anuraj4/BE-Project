import React, { useState, useRef, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const VoiceControlledTranslator = ({ sourceLang, targetLang }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const recognitionRef = useRef(null);
  const shouldContinueRef = useRef(false);
  const confirmationRef = useRef(null);

  const speak = (text, callback) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.onend = callback;
    window.speechSynthesis.cancel(); // cancel ongoing speech
    window.speechSynthesis.speak(utterance);
  };

  // Ask to start
  useEffect(() => {
    speak("Can we start recording?", () => {
      startConfirmationRecognition(); // Listen for 'yes'
    });

    socket.on("translatedText", (translated) => {
      setTranslatedText(translated);
      stopRecognition();
      speak(translated, targetLang);

      // ✅ Store transcription and translation in localStorage
      const entry = { transcription, translation: translated };
      const existing =
        JSON.parse(localStorage.getItem("translationHistory")) || [];
      existing.unshift(entry); // Add latest on top
      localStorage.setItem(
        "translationHistory",
        JSON.stringify(existing.slice(0, 10))
      ); // Keep last 10 entries
    });

    return () => {
      socket.off("translatedText");
    };
  }, [targetLang, transcription]); // ✅ Make sure `transcription` is a dependency

  const startConfirmationRecognition = () => {
    const confirmRecog = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    confirmRecog.lang = "en-US";
    confirmRecog.interimResults = false;
    confirmRecog.maxAlternatives = 1;

    confirmRecog.onresult = (event) => {
      const result = event.results[0][0].transcript.toLowerCase().trim();
      if (result.includes("yes")) {
        speak("Starting recording now.", () => {
          startRecording();
        });
      } else {
        speak("Recording cancelled. Reload the page to start again.");
      }
    };

    confirmRecog.onerror = (e) => {
      console.error("Confirmation recognition error:", e);
    };

    confirmRecog.start();
    confirmationRef.current = confirmRecog;
  };

  const startRecognition = () => {
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognition.lang = sourceLang;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");
      setTranscription(transcript);
      socket.emit("audioChunk", { text: transcript, sourceLang, targetLang });
    };

    recognition.onend = () => {
      if (shouldContinueRef.current) {
        // wait until speech ends before resuming
      }
    };

    recognition.onerror = (e) => {
      console.error("Recognition error:", e);
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
      <h2 style={{ color: "white" }}>Voice Translator</h2>
      <button
        className="stop-recording-button"
        onClick={isRecording ? stopRecording : startRecording}
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>

      <div>
        <h3 style={{ color: "white" }}>Transcription:</h3>
        <p style={{ color: "white" }}>{transcription}</p>
      </div>
      <div>
        <h3 style={{ color: "white" }}>Translation:</h3>
        <p style={{ color: "white" }}>{translatedText}</p>
      </div>
    </div>
  );
};

export default VoiceControlledTranslator;
