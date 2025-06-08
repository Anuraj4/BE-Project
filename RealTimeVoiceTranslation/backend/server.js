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
    console.log(`Translating: "${text}" from ${sourceLang} to ${targetLang}`);

    try {
      const response = await fetch('https://translateai.p.rapidapi.com/google/translate/json', {
        method: 'POST',
        headers: {
          'x-rapidapi-key': '00ca0e505dmsh5682b408ae568e3p13e602jsn96e9d7929295',
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

      if (!response.ok) {
        console.error('API error:', response.status, response.statusText);
        socket.emit('translatedText', `API error: ${response.statusText}`);
        return;
      }

      const result = await response.json();
      console.log('API response:', JSON.stringify(result, null, 2));

      const translatedText = result.translated_json?.content;
      if (!translatedText) {
        console.error('No translated text found');
        socket.emit('translatedText', 'Translation error: No translated text found');
        return;
      }

      socket.emit('translatedText', translatedText);
    } catch (error) {
      console.error('Translation error:', error);
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
