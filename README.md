# 🌐 Real-Time Voice Translation App

Welcome to the **Real-Time Voice Translation App**, a project that captures spoken words and translates them into another language instantly. This application leverages **speech recognition**, **real-time socket communication**, and **language translation** to provide a seamless and interactive language conversion experience.

---

## 🚀 Features

- **Real-time Voice Recognition**: Uses your device's microphone to capture audio input.
- **Language Translation**: Translates spoken words to the target language.
- **Dynamic Language Selection**: Select input and output languages for translation.
- **Socket.io for Real-time Communication**: Achieves low latency in delivering transcriptions and translations.

---

## 🛠️ Tech Stack

- **Frontend**: React, Socket.io-client, Bootstrap
- **Backend**: Node.js, Express, Socket.io
- **APIs Used**: Web Speech API (for speech recognition)

---

## 🎨 Screenshots

![Recording](./screenshots/recording.png)
*Example: App while recording.*

![Translation](./screenshots/translation.png)
*Example: Real-time translation display.*

---

## 📂 Project Structure

```plaintext
├── client/                     # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   └── Translator.js   # Core component for translation
│   │   ├── App.js              # Main App component
│   │   └── index.js            # React entry point
├── server/                     # Node.js backend
│   ├── index.js                # Main server file
│   └── translationService.js   # Translation functionality
├── README.md                   # Project documentation
└── package.json
```

## Usage

- **Start Recording**: Click the "Start Recording" button to begin capturing audio.
- **Transcription**: See live transcription of the input language.
- **Translation**: View the translated text in the selected output language.
- **Stop Recording**: Click the "Stop Recording" button to stop the process.

## Future Enhancements
- **Add More Languages**: Expanding available input and output languages.
- **User Authentication**: Allow users to save translations and preferences.
- **Database Integration**: Store historical translations for users.
- **Analytics**: Insights on popular language pairs, usage frequency, etc.


