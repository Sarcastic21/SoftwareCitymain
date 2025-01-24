const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // Reference to Product model
      productName: { type: String, required: true },
      productPrice: { type: Number, required: true },
      quantity: { type: Number, default: 1, min: 1 }, // Ensures quantity is at least 1
    },
  ],
});

module.exports = mongoose.model('Cart', cartSchema);
