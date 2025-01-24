import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  comment: { type: String, required: true },
  rating: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
