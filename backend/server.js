const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // For managing files
const QRCode = require('qrcode'); // For generating QR codes
require('dotenv').config();

require('./db'); // Ensure MongoDB connection is initialized
const crypto = require('crypto');

const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
require('./middleware'); // Adjust the path as necessary

const app = express();

const allowedOrigins = [
  'https://premiumcity-9xrc.vercel.app/',
  'https://softwarecitymain1.onrender.com',

];
app.use(cors({
  origin: (origin, callback) => {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
          callback(null, origin);
      } else {
          callback(new Error('Not allowed by CORS'));
      }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); // To parse incoming JSON requests


app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);



const upload = multer({ dest: 'uploads/' }); 

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER, // Use the variable from .env
    pass: process.env.EMAIL_PASS,// Use an app-specific password
  },
});

// Admin login route with JWT
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD; 

app.post('/api/loginadmin', (req, res) => {
  const { username, password } = req.body;

  // Check if username and password match the stored credentials
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    // If successful, return success message
    res.json({ auth: true, message: 'Login successful' });
  } else {
    res.status(401).json({ auth: false, message: 'Invalid credentials' });
  }
});


// Temporary in-memory storage for active QR codes
const activeQRCodes = {};

app.get('/api/generate-qr', async (req, res) => {
  const { amount } = req.query;

  if (!amount) {
    return res.status(400).send('Amount is required');
  }

  try {
    // Generate a unique transaction reference ID using timestamp and random string
    const timestamp = Date.now();
    const transactionRef = `${timestamp}-${crypto.randomBytes(8).toString('hex')}`;

    // Fixed UPI details
    const upiId =process.env.UPI_ID;
    const payeeName =process.env.PAYEE_NAME;

    // Construct UPI URI
    const qrData = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(
      payeeName
    )}&am=${amount}&cu=INR&tr=${transactionRef}&tn=Payment to Ayush Maurya`;

    // Generate QR Code
    const qrCode = await QRCode.toDataURL(qrData);

    // Store the QR code in memory with a validity of 3 minutes
    activeQRCodes[transactionRef] = { timestamp, amount, valid: true };

    // Clean up expired QR codes periodically
    setTimeout(() => {
      delete activeQRCodes[transactionRef];
    }, 3 * 60 * 1000); // 3 minutes in milliseconds

    res.json({ qrCode, transactionRef });
  } catch (error) {
    console.error('Error generating QR Code:', error);
    res.status(500).send('Failed to generate QR Code');
  }
});


// Email sending route
app.post('/api/send-email', upload.single('screenshot'), async (req, res) => {
  const { email, products, utr, mobile, name,description } = req.body; // Extract additional fields
  const screenshotPath = req.file?.path;

  // Validate required fields
  if (!email || !products || !utr || !mobile || !name || !screenshotPath || !description) {
    if (screenshotPath) fs.unlink(screenshotPath, () => {}); // Clean up file if uploaded
    return res.status(400).send('All fields are required.');
  }

  // Parse and format product details
  const productSummary = JSON.parse(products)
    .map(
      (product) =>
        `<li>${product.name} (Duration: ${product.duration}, Price: Rs ${product.price}, Quantity: ${product.quantity})</li>`
    )
    .join('');

  // Prepare email content
  const mailOptions = {
    from: process.env.EMAIL_FROM, // Use the variable from .env
    to: 'shashimaurya485@gmail.com',
    subject: 'New Checkout Details',
    html: `<p>A new payment was made. Here are the details:</p>
           <p><strong>User Name:</strong> ${name}</p>
           <p><strong>User Email:</strong> ${email}</p>
           <p><strong>Mobile Number:</strong> ${mobile}</p>
           <p><strong>UTR Number:</strong> ${utr}</p>
           <p><strong>Additional note:</strong> ${description}</p>

           <p><strong>Products:</strong></p>
           <ul>${productSummary}</ul>`,
    attachments: [{ path: screenshotPath }],
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Email sent successfully!');
    fs.unlink(screenshotPath, () => {}); // Clean up uploaded file after success
  } catch (error) {
    console.error('Error sending email:', error);
    fs.unlink(screenshotPath, () => {}); // Clean up uploaded file after failure
    res.status(500).send('Failed to send email.');
  }
});



app.post('/api/validate-qr', (req, res) => {
  const { transactionRef } = req.body;

  if (!transactionRef) {
    return res.status(400).send('Transaction reference is required');
  }

  const qrCodeDetails = activeQRCodes[transactionRef];

  // Check if QR code exists and is still valid
  if (!qrCodeDetails || !qrCodeDetails.valid) {
    return res.status(400).send('QR Code is invalid or expired.');
  }

  const currentTime = Date.now();

  // Check if the QR code is within the 3-minute validity window
  if (currentTime - qrCodeDetails.timestamp > 3 * 60 * 1000) {
    delete activeQRCodes[transactionRef]; // Remove expired QR code
    return res.status(400).send('QR Code has expired.');
  }

  // Proceed with payment processing
  res.status(200).send('QR Code is valid.');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
