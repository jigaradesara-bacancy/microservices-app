const express = require('express');
const dotenv = require('dotenv');
require('./worker'); // Import the worker to start it

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Notification service running on port ${PORT}`);
}); 