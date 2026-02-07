const { validationResult } = require('express-validator');
const { ValidationError } = require('../utils/errors.js');

// Validation middleware that checks for errors and formats them
function validate(req, res, next) {
    const errors = validationResult(req);

    // Formats errors if they exist
    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map(err => ({
            field: err.path || err.param,
            message: err.msg,
            value: err.value
        }));

        return next(new ValidationError('Validation failed', formattedErrors));
    }

    next();
};

module.exports = validate;