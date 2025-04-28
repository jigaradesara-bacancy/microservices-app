const { RedisOptions } = require('bullmq');

const redisOptions = {
  connection: {
    host: process.env.REDIS_HOST || 'redis',  // Use 'redis' as default host in Docker
    port: process.env.REDIS_PORT || 6379,     // Use default Redis port
    // password: process.env.REDIS_PASSWORD, (if Redis has auth)
  }
};

module.exports = redisOptions;
