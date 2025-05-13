import express from 'express';
import { createServer } from 'http';
import path from 'path';
import { Server } from 'socket.io';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Serve static files
app.use(express.static(path.join(process.cwd(), 'public')));

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('audioChunk', async (text) => {
    try {
      const apiKey = process.env.GOOGLE_API_KEY;
      const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          q: text,
          target: 'mr', // Marathi
          source: 'en',
          format: 'text'
        }),
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      const translatedText = data.data.translations[0].translatedText;

      console.log('Translated Text:', translatedText);
      socket.emit('translatedText', translatedText);
    } catch (error) {
      console.error('Translation error:', error);
      socket.emit('translatedText', 'Translation failed.');
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
