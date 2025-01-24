import mongoose from 'mongoose';

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

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
