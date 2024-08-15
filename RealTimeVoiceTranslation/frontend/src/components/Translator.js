import React from 'react';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ru', name: 'Russian' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  // Add more languages as needed
];

const Translator = () => {
  return (
    <main>
      <h2>Translate Your Voice in Real-Time</h2>
      <div>
        <label htmlFor="language">Choose Language:</label>
        <select id="language">
          {languages.map((language) => (
            <option key={language.code} value={language.code}>
              {language.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <button>Start Translation</button>
      </div>
    </main>
  );
};

export default Translator;
