const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpiresIn } = require('../config/auth.js');

// Generates a JWT token
function generateToken(payload) {
    return jwt.sign(payload, jwtSecret, {
        expiresIn: jwtExpiresIn
    });
};

// Verifies and decodes a JWT token
function verifyToken(token) {
    try {
        return jwt.verify(token, jwtSecret);
    } catch (error) {
        // Checks if token is expired otherwise throws invalid token error
        if (error === 'TokenExpiredError') {
            throw new Error('Token has expired');
        }
        throw new Error('Invalid token');
    }
};

module.exports = {
    generateToken,
    verifyToken
};