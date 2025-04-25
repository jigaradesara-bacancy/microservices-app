const dotenv = require('dotenv');
const { Queue } = require('bullmq');

// Load environment variables
dotenv.config();

// Set up queue
const orderQueue = new Queue('order-notify', {
  connection: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000
    }
  }
});

console.log('Notification service started and listening for events...');
