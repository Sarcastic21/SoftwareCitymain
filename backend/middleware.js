const jwt = require('jsonwebtoken');
const SECRET_KEY = '9e5e456ec44a4226b43a37bf39dc61e7a1b684edc4535b4015f6a4e8722f9c08'; // Same as in server.js

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from headers

    if (!token) return res.sendStatus(403); // No token provided

    // Verify token
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403); // Invalid token
        req.user = user; // Attach decoded user to the request object
        next(); 
    });
};


module.exports = authenticateToken;
