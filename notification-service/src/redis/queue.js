const { Worker } = require('bullmq');

// Set up Redis Worker to listen for 'order-notify' jobs
const worker = new Worker('order-notify', async job => {
  const { userEmail, product } = job.data;
  
  console.log(`Sending notification for order: ${userEmail} ordered ${product}`);

  // Simulate sending a notification (email, SMS, etc.)
  await sendNotification(userEmail, product);
});

async function sendNotification(userEmail, product) {
  // Simulate a notification being sent
  console.log(`Notification sent to ${userEmail} about ${product}`);
}

module.exports = worker;
