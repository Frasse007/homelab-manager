const rateLimit = require('express-rate-limit');
const { errorResponse } = require('../utils/responseFormatter.js');

// General API rate limiter middleware that limits requests per IP address
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        errorResponse(res, 'Too many requests, please try again later', 429);
    }
});

// Authentication endpoints(register/login) rate limiter
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many authentication attempts, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    handler: (req, res) => {
        errorResponse(res, 'Too many authentication attempts, please try again later', 429);
    }
});

module.exports = {
    apiLimiter,
    authLimiter
};