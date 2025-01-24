const express = require('express');
const router = express.Router();
const Order = require('../models/Order'); // User model

const User = require('../models/User'); // User model
const Cart = require('../models/Cart'); // Cart model
const Product = require('../models/Product'); // Ensure Product model is imported


// POST: Add an order
router.post('/add-order', async (req, res) => {
  try {
    // Ensure the request body is not empty
    if (!req.body || req.body.length === 0) {
      return res.status(400).json({ message: 'No order data provided' });
    }

    // Loop through each order item and create an order in the database
    const orders = await Order.insertMany(req.body); // Insert multiple orders if needed

    res.status(201).json({ message: 'Order added successfully', orders });
  } catch (error) {
    console.error('Error adding order:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
});  
router.post('/products', async (req, res) => {
  const { name, image, description, description2, MRP, prices, category, showSelectOptions } = req.body;

  try {
    const newProduct = new Product({
      name,
      image,
      description,
      description2,
      MRP,
      prices,
      category,
      showSelectOptions, // Save the value received
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add product', error });
  }
});
router.get('/orders', async (req, res) => {
  try {
    const { email } = req.query; // Get email from query parameters

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Fetch orders that match the email
    const orders = await Order.find({ email });

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// Register User
router.post('/register', async (req, res) => {
  try {
    const { email, mobile, password, favoriteSport } = req.body;

    const existingUser = await User.findOne({ mobile });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({ email, mobile, password, favoriteSport });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login User
router.post('/login', async (req, res) => {
  try {
    const { mobile, password } = req.body;
    const user = await User.findOne({ mobile });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid mobile number or password' });
    }

    res.status(200).json({ message: 'Login successful', userId: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
  const { email, favoriteSport, newPassword } = req.body;
  try {
    const user = await User.findOne({ email, favoriteSport });
    if (user) {
      user.password = newPassword;
      await user.save();
      res.json({ message: 'Password updated successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Password reset failed' });
  }
});

// Add to Cart
router.post('/cart/add', async (req, res) => {
  const { userId, productId, productName, productPrice } = req.body;
  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, products: [] });
    }

    const existingProduct = cart.products.find(item => item.productId === productId);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({ productId, productName, productPrice, quantity: 1 });
    }

    await cart.save();
    res.status(200).json({ message: 'Product added to cart', cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add to cart' });
  }
});

// View Cart
router.get('/cart/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const cart = await Cart.findOne({ userId });
    if (cart) {
      res.status(200).json(cart);
    } else {
      res.status(404).json({ message: 'Cart not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch cart' });
  }
});

// Remove from Cart
router.delete('/cart/remove', async (req, res) => {
  const { userId, productId } = req.body;
  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.products = cart.products.filter(item => item.productId !== productId);
    await cart.save();

    res.status(200).json({ message: 'Product removed from cart', cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to remove from cart' });
  }
});

// Get User by Mobile
router.get('/mobile/:mobile', async (req, res) => {
  const { mobile } = req.params;
  try {
    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(user); // Send back user data
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Delete User by Mobile
router.delete('/mobile/:mobile', async (req, res) => {
  const { mobile } = req.params;
  try {
    const user = await User.findOneAndDelete({ mobile });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get a specific product by ID
router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ message: 'Failed to fetch product', error: error.message });
  }
});


module.exports = router;
