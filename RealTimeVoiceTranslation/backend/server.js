import express from 'express';
import { createServer } from 'http';
import path from 'path';
import fetch from 'node-fetch'; // Use import instead of require
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'] // Allowed HTTP methods
}));
app.use(express.static(path.join(process.cwd(), 'public')));

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('audioChunk', async (text) => {
    try {
      const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|mr`);
      const data = await response.json();
      const translatedText = data.responseData.translatedText;

      console.log('Translated Text:', translatedText);

      // Send the translated text back to the frontend for display
      socket.emit('translatedText', translatedText);
    } catch (error) {
      console.error('Error during translation:', error);
      socket.emit('translatedText', 'Error translating text');
    }
  });
});

server.listen(5000, () => {
  console.log('Server running on port 5000');
});
