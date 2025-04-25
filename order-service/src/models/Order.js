const mongoose = require('mongoose');

// Define the Order schema
const orderSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  product: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, default: 'Pending' },
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
