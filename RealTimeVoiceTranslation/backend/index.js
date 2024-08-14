const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, this is the backend!');
});

app.listen(port, () => {
  console.log(`Backend server is running on port ${port}`);
});
