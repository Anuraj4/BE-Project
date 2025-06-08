import React, { useEffect, useRef, useState } from "react";
import Translator from "./Translator";
import "./Home.css";
import VoiceControlledTranslator from "./VoiceControlledTranslator";

const languages = [
  { code: "en", name: "english" },
  { code: "mr", name: "marathi" },
  { code: "hi", name: "hindi" },
  { code: "ta", name: "tamil" },
  { code: "te", name: "telugu" },
  { code: "bn", name: "bengali" },
  { code: "gu", name: "gujarati" },
  { code: "kn", name: "kannada" },
  { code: "ml", name: "malayalam" },
  { code: "pa", name: "punjabi" },
  { code: "ur", name: "urdu" },
  { code: "ne", name: "nepali" },
  { code: "si", name: "sinhala" },
  { code: "fr", name: "french" },
  { code: "es", name: "spanish" },
  { code: "de", name: "german" },
  { code: "it", name: "italian" },
  { code: "ja", name: "japanese" },
  { code: "ko", name: "korean" },
  { code: "zh", name: "chinese" },
  { code: "ru", name: "russian" },
  { code: "ar", name: "arabic" },
];

const Disability = () => {
  const [sourceLang, setSourceLang] = useState("");
  const [targetLang, setTargetLang] = useState("");
  const [step, setStep] = useState(0); // 0 = ask input, 1 = ask target, 2 = done
  const synth = window.speechSynthesis;
  const recognitionRef = useRef(null);

  const speak = (text, callback) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.onend = callback;
    synth.cancel(); // stop previous speech
    synth.speak(utterance);
  };

  const startRecognition = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase().trim();
      console.log("User said:", transcript);

      const matchedInputLang = languages.find((lang) => transcript.includes(lang.name));
      if (step === 0 && matchedInputLang) {
        setSourceLang(matchedInputLang.code);
        speak(`Input language set to ${matchedInputLang.name}. Now choose your target language.`, () => {
          setStep(1);
        });
      } else if (step === 1 && matchedInputLang) {
        setTargetLang(matchedInputLang.code);
        speak(`Target language set to ${matchedInputLang.name}. Starting translation.`, () => {
          setStep(2);
        });
      } else {
        speak("I didn't catch that. Please say a valid language name.", () => {
          startRecognition();
        });
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      speak("There was an error in speech recognition. Please try again.");
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  useEffect(() => {
    if (step === 0) {
      speak("Welcome to the voice translator. Please choose your input language.", () => {
        startRecognition();
      });
    } else if (step === 1) {
      startRecognition();
    }
  }, [step]);

  return (
    <div className="home-container">
      <h1>Real-Time Language Translation (Voice Mode)</h1>
      {step < 2 ? (
        <p className="description">Waiting for your voice input...</p>
      ) : (
        <VoiceControlledTranslator sourceLang={sourceLang} targetLang={targetLang} />
      )}
    </div>
  );
};

export default Disability;
