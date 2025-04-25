const express = require('express');
const jwt = require('jsonwebtoken');
const Order = require('../models/Order');
const orderQueue = require('../redis/queue');

const router = express.Router();
// Load environment variables
const dotenv = require('dotenv');

dotenv.config();

// Helper to verify JWT token
function verifyToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Failed to authenticate token' });
    req.userEmail = decoded.email;
    next();
  });
}

// Create a new order (authenticated)
router.post('/create', verifyToken, async (req, res) => {
  const { product, amount } = req.body;

  try {
    const order = new Order({
      userEmail: req.userEmail,
      product,
      amount,
    });

    await order.save();

    // Publish event to Redis and enqueue the order notification
    orderQueue.add('notify', { userEmail: req.userEmail, product });

    res.status(201).json({ message: 'Order created successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Error creating order' });
  }
});

module.exports = router;
