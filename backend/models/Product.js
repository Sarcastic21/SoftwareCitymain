import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  description2: { type: String, required: true },

  MRP: { type: Number, required: true },
  MRP2: { type: Number, required: true },

  prices: {
    oneMonth: { type: Number, required: true },
    threeMonths: { type: Number, required: true },
    sixMonths: { type: Number, required: true },
    twelveMonths: { type: Number, required: true },
    game: { type: Number, required: true },
  },
  category: { type: String, required: true }, // Ensure category is included here
  outOfStock: { type: Boolean, default: false },
  showSelectOptions: { type: Boolean, required: true }, // Add this field
});

const Product = mongoose.model('Product', productSchema);

export default Product;
