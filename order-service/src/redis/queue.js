const { Queue } = require('bullmq');
// Load environment variables
const dotenv = require('dotenv');

dotenv.config();
// Set up Redis Queue for order notifications
const orderQueue = new Queue('order-notify', {
  connection: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

module.exports = orderQueue;
