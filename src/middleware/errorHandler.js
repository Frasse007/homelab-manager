const { AppError } = require('../utils/errors.js');
const { errorResponse } = require('../utils/responseFormatter.js');

// Global error handling middleware that catches and formats all application errors
function errorHandler(err, req, res, next) {
    // Logs error for internal debugging
    console.error('Error:', err);

    // Handles custom operational errors (expected errors)
    if (err instanceof AppError) {
        return errorResponse(
            res,
            err.message,
            err.statusCode,
            err.errors
        );
    }

    // Handles Sequelize validation errors
    if (err.name === 'SequelizeValidationError') {
        const errors = err.errors.map(e => ({
            field: e.path,
            message: e.message,
            value: e.value
        }));
        return errorResponse(res, 'Validation error', 400, errors);
    }

    // Handles Sequelize unique constraint errors
    if (err.name === 'SequelizeUniqueConstraintError') {
        const field = err.errors[0]?.path || 'field';
        return errorResponse(res, `${field} already exists`, 409);
    }

    // Handles Sequelize foreign key constraint errors
    if (err.name === 'SequelizeForeignKeyConstraintError') {
        return errorResponse(res, 'Referenced resource does not exist', 400);
    }

    // Handles JWT invalid token errors
    if (err.name === 'JsonWebTokenError') {
        return errorResponse(res, 'Invalid token', 401);
    }

    // Handles JWT expired token errors
    if (err.name === 'TokenExpiredError') {
        return errorResponse(res, 'Token expired', 401);
    }

    // Defaults to 500 server error for unexpected errors
    const statusCode = err.statusCode || 500;
    
    // Masks/hides technical details in production environment
    const message = process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : err.message;

    errorResponse(res, message, statusCode);
};

// Fallback middleware for routes that do not exist
function notFoundHandler(req, res, next) {
    // Returns 404 error with the requested URL
    errorResponse(res, `Route ${req.originalUrl} not found`, 404);
};

module.exports = {
    errorHandler,
    notFoundHandler
};