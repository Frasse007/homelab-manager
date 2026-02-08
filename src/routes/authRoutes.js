const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.js');
const { authenticate, resolveUser } = require('../middleware/auth.js');
const validate = require('../middleware/validate.js');
const { registerValidator, loginValidator } = require('../validators/authValidator.js');
const { authLimiter } = require('../middleware/rateLimiter.js');

// Public routes
// POST /api/auth/register - Registers a new user
router.post('/register', authLimiter, resolveUser, registerValidator, validate, authController.register);

// POST /api/auth/login - Login user
router.post('/login', authLimiter, loginValidator, validate, authController.login);

// Protected routes
// GET /api/auth/me - Gets current users profile
router.get('/me', authenticate, authController.getProfile);

// POST /api/auth/logout - Logs user out
router.post('/logout', authenticate, authController.logout);

module.exports = router;

