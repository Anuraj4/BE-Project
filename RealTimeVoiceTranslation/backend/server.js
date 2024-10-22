import express from 'express';
import { createServer } from 'http';
import path from 'path';
import fetch from 'node-fetch'; // Optional if Node version < 18
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    credentials: true // If you need to send cookies
  }
});

// Static file serving
app.use(express.static(path.join(process.cwd(), 'public')));

io.on('connection', (socket) => {
  console.log('New client connected');

  // Listen for 'audioChunk' event from the frontend
  socket.on('audioChunk', async (text) => {
    try {
      // Fetch translation
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|mr`
      );
      const data = await response.json();
      const translatedText = data.responseData.translatedText;

      console.log('Translated Text:', translatedText);

      // Send the translated text back to the frontend
      socket.emit('translatedText', translatedText);
    } catch (error) {
      console.error('Error during translation:', error);
      socket.emit('translatedText', 'Error translating text');
    }
  });

  // Handle client disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start the server
server.listen(5000, () => {
  console.log('Server running on port 5000');
});
