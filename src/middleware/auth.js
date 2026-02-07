const { verifyToken } = require('../utils/jwt.js');
const { AuthenticationError } = require('../utils/errors.js');
const { User } = require('../models');

// Verifies JWT tokens and attaches them to user requests
async function authenticate(req, res, next) {
    try {
        // Gets token from Authorization header
        const authHeader = req.headers.authorization;

        // Throws custom 'AuthenticationError' if no token is provided
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AuthenticationError('No token provided');
        }

        // Removes 'Bearer ' prefix
        const token = authHeader.substring(7);

        // Verifies token
        const decoded = verifyToken(token);

        const user = await User.findByPk(decoded.id);

        // Throws custom 'AuthenticationError' if user is not found
        if (!user) {
            throw new AuthenticationError('User not found');
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.message === 'Invalid or expired token') {
            return next(new AuthenticationError(error.message));
        }
        next(error);
    }
};

module.exports = {
    authenticate
};