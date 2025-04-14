import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import EnglishToMarathiDisability from "./EnglishToMarathiDisability";
import MarathiToEnglish from "./MarathiToEnglish";
import "./Home.css";

const Disability = () => {
  const [showTranslator, setShowTranslator] = useState(false);
  const [showMarathiToEnglish, setShowMarathiToEnglish] = useState(false);
  const synth = window.speechSynthesis;
  const recognitionRef = useRef(null);
  const navigate = useNavigate();

  const initialSpeechDoneRef = useRef(false); // Track if initial speech has been spoken

  // Speak instructions
  const speak = (text, callback) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = callback;
    synth.speak(utterance);
  };

  // Start voice recognition
  const startRecognition = () => {
    if (!recognitionRef.current) {
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.continuous = true;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        const speechResult = event.results[event.results.length - 1][0].transcript.toLowerCase();
        console.log("User said:", speechResult);

        if (speechResult.includes("open english to marathi")) {
          speak("Opening English to Marathi Translator.");
          setShowTranslator(true);
        } else if (speechResult.includes("close english to marathi")) {
          speak("Closing English to Marathi Translator.");
          setShowTranslator(false);
        } else if (speechResult.includes("open marathi to english")) {
          speak("Opening Marathi to English Translator.");
          setShowMarathiToEnglish(true);
        } else if (speechResult.includes("close marathi to english")) {
          speak("Closing Marathi to English Translator.");
          setShowMarathiToEnglish(false);
        } else if (speechResult.includes("stop reading")) {
          synth.cancel();
        } else if (speechResult.includes("read again")) {
          speak("You can say 'Open English to Marathi' or 'Open Marathi to English' to toggle the translators.");
        }
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
      };

      recognition.start();
      recognitionRef.current = recognition;
    }
  };

  useEffect(() => {
    // Ensure that speech is spoken only once
    if (!initialSpeechDoneRef.current) {
      initialSpeechDoneRef.current = true; // Mark the speech as done

      // Speak instructions only once
      speak(
        "Welcome to the Real-Time Language Translation. You can say 'Open English to Marathi' or 'Open Marathi to English' to toggle the translators.",
        () => {
          startRecognition(); // Start listening after the speech is done
        }
      );
    }

    // Cleanup speech recognition on component unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    };
  }, []);

  return (
    <>
      <div className="hero-section">
        <div className="content">
          <h1 className="main-heading-Home animate-heading">Real-Time Language Translation</h1>
          <p className="description animate-fade">
            Experience seamless language translation powered by AI, bridging communication gaps with real-time accuracy.
          </p>
        </div>
      </div>

      <div className="home-container">
        {/* English to Marathi Translator */}
        <div className="button-container">
          <Button
            className={`btn-lg custom-btn ${showTranslator ? "active-btn" : ""}`}
            onClick={() => setShowTranslator((prevState) => !prevState)}
          >
            {showTranslator ? "Close Translator" : "English To Marathi"}
          </Button>
          <div className={`translator-container ${showTranslator ? "fade-in" : "fade-out"}`}>
            {showTranslator && <EnglishToMarathiDisability />}
          </div>
        </div>

        {/* Marathi to English Translator */}
        <div className="button-container">
          <Button
            className={`btn-lg custom-btn ${showMarathiToEnglish ? "active-btn" : ""}`}
            onClick={() => setShowMarathiToEnglish((prevState) => !prevState)}
          >
            {showMarathiToEnglish ? "Close Translator" : "Marathi To English"}
          </Button>
          <div className={`translator-container ${showMarathiToEnglish ? "fade-in" : "fade-out"}`}>
            {showMarathiToEnglish && <MarathiToEnglish />}
          </div>
        </div>
      </div>
    </>
  );
};

export default Disability;
