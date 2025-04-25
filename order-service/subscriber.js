// order-service/subscriber.js
const { createClient } = require('redis');
const subscriber = createClient();

subscriber.connect().then(async () => {
  console.log('Subscriber connected to Redis');

  await subscriber.subscribe('user:created', (message) => {
    const user = JSON.parse(message);
    console.log('Received user:created event in order-service:', user);
    // Do something, e.g., create an order for new user
  });
});
