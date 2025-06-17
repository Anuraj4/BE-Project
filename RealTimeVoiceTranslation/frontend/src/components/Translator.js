import React, { useState, useRef, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const Translator = ({ sourceLang, targetLang }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const recognitionRef = useRef(null);
  const shouldContinueRef = useRef(false);
  const emotionRef = useRef("Neutral"); // Used internally for pitch control

  useEffect(() => {
    socket.on("translatedText", (translated) => {
      setTranslatedText(translated);
      const detected = detectEmotion(translated);
      emotionRef.current = detected;

      stopRecognition(); // Stop mic before speaking
      speakText(translated, targetLang);

      // Store to localStorage
      const currentEntry = { transcription, translation: translated };
      const existingHistory =
        JSON.parse(localStorage.getItem("translationHistory")) || [];
      existingHistory.unshift(currentEntry);
      localStorage.setItem(
        "translationHistory",
        JSON.stringify(existingHistory.slice(0, 10))
      );
    });

    return () => {
      socket.off("translatedText");
    };
  }, [targetLang, transcription]);

  const detectEmotion = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes("happy") || lower.includes("great") || lower.includes("love")) return "Happy";
    if (lower.includes("sad") || lower.includes("bad") || lower.includes("sorry")) return "Sad";
    if (lower.includes("angry") || lower.includes("hate") || lower.includes("annoyed")) return "Angry";
    if (lower.includes("wow") || lower.includes("amazing") || lower.includes("unbelievable")) return "Surprised";
    return "Neutral";
  };

  const speakText = (text, lang) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;

    // Apply pitch and rate based on detected emotion
    switch (emotionRef.current) {
      case "Happy":
        utterance.pitch = 1.5;
        utterance.rate = 1.2;
        break;
      case "Sad":
        utterance.pitch = 0.8;
        utterance.rate = 0.9;
        break;
      case "Angry":
        utterance.pitch = 1.0;
        utterance.rate = 1.4;
        break;
      case "Surprised":
        utterance.pitch = 1.8;
        utterance.rate = 1.5;
        break;
      default:
        utterance.pitch = 1.0;
        utterance.rate = 1.0;
    }

    utterance.onend = () => {
      if (shouldContinueRef.current) {
        startRecognition();
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  const startRecognition = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser does not support speech recognition.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
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

export default Translator;
