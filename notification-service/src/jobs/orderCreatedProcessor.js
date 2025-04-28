// Job processor for order:created queue

const orderCreatedProcessor = async (job) => {
    console.log('=== Starting Job Processing ===');
    console.log('Job ID:', job.id);
    console.log('Job Data:', job.data);
    console.log('Attempt:', job.attemptsMade);
    
    try {
      const { userEmail, product, orderId } = job.data;
  
      if (!userEmail || !product) {
        throw new Error('Missing required data: userEmail or product');
      }
  
      console.log(`📨 Processing notification for order ${orderId || 'N/A'}`);
      console.log(`User: ${userEmail}, Product: ${product}`);
  
      // Simulate some processing time
      await new Promise(resolve => setTimeout(resolve, 1000));
  
      // Here, pretend you're sending an email or push notification
      // You could integrate nodemailer, Twilio, Firebase etc.
      console.log(`✅ Notification processed successfully for order ${orderId || 'N/A'}`);
  
      const result = { 
        success: true, 
        orderId: orderId || 'N/A', 
        userEmail, 
        product,
        processedAt: new Date().toISOString()
      };
      
      console.log('Job Result:', result);
      console.log('=== Job Processing Complete ===');
      
      return result;
    } catch (error) {
      console.error('❌ Failed to process order notification:', error);
      console.error('Error stack:', error.stack);
      console.error('Job data:', job.data);
      console.log('=== Job Processing Failed ===');
      throw error; // Rethrow to trigger retries
    }
  };
  
  module.exports = orderCreatedProcessor;
  