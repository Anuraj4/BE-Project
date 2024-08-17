const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000', // Make sure this matches your frontend URL
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

// Add a basic route to handle the root URL
app.get('/', (req, res) => {
  res.send('Backend Server is Running');
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('audioChunk', (chunk) => {
    console.log('received audio chunk', chunk);
    // Process the chunk here
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
