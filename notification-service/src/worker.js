const { Worker, Queue } = require('bullmq');
const dotenv = require('dotenv');
const orderCreatedProcessor = require('./jobs/orderCreatedProcessor');

// Load env variables
dotenv.config();

const redisConfig = {
  host: process.env.REDIS_HOST || 'redis',
  port: process.env.REDIS_PORT || 6379,
};

console.log('Initializing notification worker...');
console.log('Redis connection configuration:', redisConfig);

// Create a shared queue instance
const queue = new Queue('order-notify', { connection: redisConfig });

// Function to process existing jobs
async function processExistingJobs() {
  try {
    const jobs = await queue.getJobs(['waiting', 'active', 'delayed', 'stuck']);
    console.log(`Found ${jobs.length} existing jobs in queue`);
    
    for (const job of jobs) {
      console.log(`Processing job ${job.id}:`, job.data);
      if (job.data.test) {
        await job.remove();
        continue;
      }
      try {
        const result = await orderCreatedProcessor(job);
        console.log(`Successfully processed job ${job.id}:`, result);
        await job.moveToCompleted(result, true);
      } catch (error) {
        console.error(`Failed to process job ${job.id}:`, error);
        await job.moveToFailed(error, true);
      }
    }
  } catch (error) {
    console.error('Error processing existing jobs:', error);
  }
}

// Initialize worker
const orderCreatedWorker = new Worker(
  'order-notify',
  async (job) => {
    console.log('Worker processing job:', job.id);
    return orderCreatedProcessor(job);
  },
  {
    connection: redisConfig,
    concurrency: 5,
    removeOnComplete: true,
    removeOnFail: false,
    lockDuration: 30000,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000
    }
  }
);

// Events
orderCreatedWorker.on('completed', (job) => {
  console.log(`✅ Completed order job: ${job.id}`, job.data);
});

orderCreatedWorker.on('failed', (job, err) => {
  console.error(`❌ Failed order job: ${job.id}`, err);
  console.error('Job data:', job.data);
});

orderCreatedWorker.on('error', (err) => {
  console.error('Worker error:', err);
  console.error('Error stack:', err.stack);
});

orderCreatedWorker.on('active', (job) => {
  console.log(`🔄 Processing job: ${job.id}`, job.data);
});

orderCreatedWorker.on('ready', async () => {
  console.log('🚀 Notification Worker is ready and listening...');
  await processExistingJobs();
});

orderCreatedWorker.on('stalled', (job) => {
  console.log(`⚠️ Job ${job.id} has stalled`);
});

orderCreatedWorker.on('closing', () => {
  console.log('Worker is closing...');
});

orderCreatedWorker.on('closed', () => {
  console.log('Worker has closed');
});

// Test Redis connection
queue.add('test', { test: true })
  .then(() => {
    console.log('✅ Redis connection test successful');
    return queue.obliterate({ force: true });
  })
  .catch(err => {
    console.error('❌ Redis connection test failed:', err);
  });

// Periodically check for stuck jobs
setInterval(processExistingJobs, 30000);

console.log('Notification Worker initialized');
