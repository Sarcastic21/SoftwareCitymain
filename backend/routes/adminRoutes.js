import express from 'express';
import Product from '../models/Product.js';
import Review from '../models/Review.js'; // Ensure the Review model is properly imported

const router = express.Router();

// Add product
router.post('/add-product', async (req, res) => {
    try {
        console.log("Request Body:", req.body); // Log the incoming request body
        const { name, image, description, description2, MRP, MRP2, prices, category, showSelectOptions } = req.body;

        if (!name || !image || !description || !MRP || !MRP2 || !prices || !category || !showSelectOptions) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const product = new Product({
            name,
            image,
            description,
            description2,
            MRP,
            MRP2,
            prices,
            category,
            showSelectOptions,
        });

        await product.save();
        res.status(201).json({ message: 'Product added successfully' });
    } catch (error) {
        console.error("Error adding product:", error); // Log error for debugging
        res.status(500).json({ message: 'Failed to add product', error: error.message });
    }
});

// Delete product by name
router.delete('/delete-product/:name', async (req, res) => {
    try {
        const deletedProduct = await Product.findOneAndDelete({ name: req.params.name });
        if (deletedProduct) {
            res.status(200).json({ message: 'Product deleted successfully' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).json({ message: 'Failed to delete product', error: error.message });
    }
});

// Get all products with optional category filter
router.get('/products', async (req, res) => {
    try {
        const { category } = req.query;
        const filter = category ? { category } : {};
        const products = await Product.find(filter);
        res.status(200).json(products);
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).json({ message: 'Failed to fetch products', error: error.message });
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

// Route to fetch products with optional filtering by 5-star reviews
// Assuming we want to fetch top-rated products based on reviews with rating 5
router.get('/top-rated-products', async (req, res) => {
    try {
        // Fetch reviews with rating 5
        const reviews = await Review.find({ rating: 5 }).populate('id'); // Use populate to fetch product details from the productId

        // Extract the product details from reviews
        const topRatedProducts = reviews.map(review => review.id); // Get productId from review

        // Return the products that have received a 5-star rating
        res.status(200).json(topRatedProducts);
    } catch (error) {
        console.error('Error fetching top-rated products:', error); // Log the error for debugging
        res.status(500).json({ message: 'Failed to fetch top-rated products', error: error.message });
    }
});

// Route to mark a product as out of stock
router.put('/update-product', async (req, res) => {
    try {
        const { name, outOfStock } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Product name is required' });
        }

        // Find product by name and update the outOfStock status
        const product = await Product.findOneAndUpdate(
            { name },
            { outOfStock },
            { new: true } // Return the updated product
        );

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product updated successfully', product });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: 'Failed to update product', error: error.message });
    }
});

// adminRoutes.js (or similar)
router.put('/update-outofstock', async (req, res) => {
    const { productName } = req.body;

    if (!productName) {
        return res.status(400).json({ message: 'Product name is required' });
    }

    try {
        // Find product by name and set outOfStock to false
        const product = await Product.findOneAndUpdate(
            { name: productName },
            { outOfStock: false },
            { new: true }  // Return the updated document
        );

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product stock status updated', product });
    } catch (error) {
        console.error("Error updating outOfStock:", error);
        res.status(500).json({ message: 'Error updating stock status', error: error.message });
    }
});

export default router;
