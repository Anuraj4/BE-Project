const express = require('express');
const http = require('http');
const path = require('path');
const fetch = require('node-fetch'); // For API requests
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('audioChunk', async (text) => {
    try {
      // Send text to the LibreTranslate API for translation
      const response = await fetch('https://libretranslate.de/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: text, // The transcribed text to translate
          source: 'en', // Source language (English)
          target: 'mr' // Target language (Marathi)
        })
      });

      const data = await response.json();
      const translatedText = data.translatedText;
      console.log('Translated Text:', translatedText);

      // Send the translated text back to the frontend for display
      socket.emit('translatedText', translatedText);
    } catch (error) {
      console.error('Error during translation:', error);
    }
  });
});

server.listen(5000, () => {
  console.log('Server running on port 5000');
});
