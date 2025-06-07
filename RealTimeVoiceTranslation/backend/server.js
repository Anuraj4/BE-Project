import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.use(cors());
app.use(express.json());

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('audioChunk', async ({ text, sourceLang, targetLang }) => {
    try {
      const response = await fetch('https://translateai.p.rapidapi.com/google/translate/json', {
        method: 'POST',
        headers: {
          'x-rapidapi-key': 'cb08593354msh02368129a061c44p15fb3ejsn5b8905f700d1',
          'x-rapidapi-host': 'translateai.p.rapidapi.com',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          origin_language: sourceLang,
          target_language: targetLang,
          words_not_to_translate: '',
          paths_to_exclude: '',
          common_keys_to_exclude: '',
          json_content: {
            content: text,
          },
        }),
      });

      const result = await response.json();
      const translatedText = result.translated_json?.content || 'Translation error';

      socket.emit('translatedText', translatedText);
    } catch (error) {
      console.error('Error during translation:', error);
      socket.emit('translatedText', 'Error translating text');
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(5000, () => {
  console.log('Server running on port 5000');
});
