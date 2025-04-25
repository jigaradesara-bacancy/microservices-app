// user-service/publisher.js
const { createClient } = require('redis');
const client = createClient();

client.connect().then(async () => {
  console.log('Publisher connected to Redis');

  const user = { id: 1, name: 'John Doe' };
  await client.publish('user:created', JSON.stringify(user));
  console.log('User Created Event Published:', user);
});
