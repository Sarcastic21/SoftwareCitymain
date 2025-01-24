// routes/reviewRoutes.js
const express = require('express');
const Review = require('../models/Review');
const router = express.Router();

// Submit a review for a product
router.post('/submit', async (req, res) => {
  try {
    const { id, name, comment, rating } = req.body;
    const newReview = new Review({
      id,
      name,
      comment,
      rating
    });
    await newReview.save();
    res.status(201).json({ message: 'Review submitted successfully', review: newReview });
  } catch (err) {
    res.status(500).json({ message: 'Error submitting review', error: err.message });
  }
});

// Get reviews for a specific product
router.get('/forProduct/:id', async (req, res) => {
  try {
    const reviews = await Review.find({ id: req.params.id });
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reviews', error: err.message });
  }
});
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ date: -1 }); // Sort by date, most recent first
    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching reviews' });
  }
});



module.exports = router;
