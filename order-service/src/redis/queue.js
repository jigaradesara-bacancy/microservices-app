const { Queue } = require('bullmq');
// Load environment variables
const dotenv = require('dotenv');

dotenv.config();

const redisConfig = {
  host: process.env.REDIS_HOST || 'redis',  // Use 'redis' as default host in Docker
  port: process.env.REDIS_PORT || 6379,     // Use default Redis port
};

console.log('Initializing order queue with config:', redisConfig);

// Set up Redis Queue for order notifications
const orderQueue = new Queue('order-notify', {
  connection: redisConfig,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000
    },
    removeOnComplete: true,
    removeOnFail: false
  }
});

// Add event listeners for queue operations
orderQueue.on('error', (err) => {
  console.error('Queue error:', err);
});

orderQueue.on('waiting', (job) => {
  console.log(`Job ${job.id} is waiting`, job.data);
});

orderQueue.on('active', (job) => {
  console.log(`Job ${job.id} is active`, job.data);
});

orderQueue.on('completed', (job) => {
  console.log(`Job ${job.id} has completed`, job.data);
});

orderQueue.on('failed', (job, err) => {
  console.error(`Job ${job.id} has failed with error ${err.message}`);
  console.error('Job data:', job.data);
});

// Test queue connection
orderQueue.add('test', { test: true })
  .then(() => {
    console.log('✅ Order queue connection test successful');
    return orderQueue.obliterate({ force: true });
  })
  .catch(err => {
    console.error('❌ Order queue connection test failed:', err);
  });

console.log('Order queue initialized');

module.exports = orderQueue;
