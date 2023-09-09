const jwt = require('jsonwebtoken');
const User = require('../models/User'); // User model

// Middleware to protect routes (check if user is authenticated)
function protect(req, res, next) {
    // Get the token from request headers
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, 'K3vNuFuPtB5QfxNw5XS5BWh/LZe63jx+/AMOQMIXE8rHRCqLb8AaI5xx58ZHNWc0Zezz8WcaGLdHwGv89Uu01w==');
        const token = jwt.sign({ userId: user._id }, 'K3vNuFuPtB5QfxNw5XS5BWh/LZe63jx+/AMOQMIXE8rHRCqLb8AaI5xx58ZHNWc0Zezz8WcaGLdHwGv89Uu01w==', { expiresIn: '1h' });

        // Find the user by ID from the decoded token
        User.findById(decoded.userId, (err, user) => {
            if (err || !user) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }

            // Attach user data to the request object
            req.user = user;

            // Continue to the next middleware or route handler
            next();
        });
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
}

module.exports = { protect };
