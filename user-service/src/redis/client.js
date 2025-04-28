const { createClient } = require('redis');
// Load environment variables
const dotenv = require('dotenv');

dotenv.config();
// Set up Redis connection
// const redisClient = createClient({
//    url: 'redis://alice:foobared@awesome.redis.server:6379'
// });
const redisClient = createClient({
   url:process.env.REDIS_URL
})
  .on('error', err => console.log('Redis Client Error', err))
  .connect();

module.exports = redisClient; 
