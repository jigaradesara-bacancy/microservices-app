const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const orderRoutes = require('./routes/order');

// Load environment variables
dotenv.config();

// Set up express app
const app = express();
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Set up routes
app.use('/api/orders', orderRoutes);

// Start server
const PORT = 3002;
app.listen(PORT, () => console.log(`Order service running on port ${PORT}`));
