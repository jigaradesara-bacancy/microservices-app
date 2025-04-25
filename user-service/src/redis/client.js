const { createClient } = require('redis');
// Load environment variables
const dotenv = require('dotenv');

dotenv.config();
// Set up Redis connection
const redisClient = createClient({
   url: 'redis://alice:foobared@awesome.redis.server:6379'
});

redisClient.connect();

module.exports = redisClient; 
