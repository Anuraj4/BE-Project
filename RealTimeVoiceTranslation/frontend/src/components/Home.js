import React, { useState } from "react";
import Translator from "./Translator";
import "./Home.css";

const languageFlags = {
  en: "🇬🇧",
  mr: "🇮🇳",
  hi: "🇮🇳",
  ta: "🇮🇳",
  te: "🇮🇳",
  bn: "🇮🇳",
  gu: "🇮🇳",
  kn: "🇮🇳",
  ml: "🇮🇳",
  pa: "🇮🇳",
  ur: "🇵🇰",
  ne: "🇳🇵",
  si: "🇱🇰",
  fr: "🇫🇷",
  es: "🇪🇸",
  de: "🇩🇪",
  it: "🇮🇹",
  ja: "🇯🇵",
  ko: "🇰🇷",
  zh: "🇨🇳",
  ru: "🇷🇺",
  ar: "🇸🇦",
};

const languages = [
  { code: "en", name: "English" },
  { code: "mr", name: "Marathi" },
  { code: "hi", name: "Hindi" },
  { code: "ta", name: "Tamil" },
  { code: "te", name: "Telugu" },
  { code: "bn", name: "Bengali" },
  { code: "gu", name: "Gujarati" },
  { code: "kn", name: "Kannada" },
  { code: "ml", name: "Malayalam" },
  { code: "pa", name: "Punjabi" },
  { code: "ur", name: "Urdu" },
  { code: "ne", name: "Nepali" },
  { code: "si", name: "Sinhala" },
  { code: "fr", name: "French" },
  { code: "es", name: "Spanish" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "zh", name: "Chinese" },
  { code: "ru", name: "Russian" },
  { code: "ar", name: "Arabic" },
];

const Home = () => {
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("hi");

  return (
    <div className="home-container">
      <h1>Real-Time Language Translation</h1>
      <div className="language-selection">
        <label>
          Input Language:
          <span className="flag-emoji">{languageFlags[sourceLang]}</span>
          <select
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Target Language:
          <span className="flag-emoji">{languageFlags[targetLang]}</span>
          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <Translator sourceLang={sourceLang} targetLang={targetLang} />
    </div>
  );
};

export default Home;
