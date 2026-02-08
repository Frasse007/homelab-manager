const { body } = require('express-validator');

// Validation logic for register endpoint
const registerValidator = [
    body('username')
        .trim()
        .isLength({ min:3, max:50 })
        .withMessage('Username must be between 3 and 50 characters')
        .matches(/^[a-zA-Z0-9._]+$/)
        .withMessage('Username can only contain letters, numbers, "." and "_"'),

    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),

    body('password')
        .isLength({ min: 8})
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter and one number'),

    body('first_name')
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage('First name must not exceed 50 characters'),

    body('last_name')
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage('Last name must not exceed 50 characters'),

    body('role')
        .optional()
        .isIn(['user', 'admin'])
        .withMessage('Role must be user or admin')
];

// Validation logic for login endpoint
const loginValidator = [
    body('identifier')
        .trim()
        .notEmpty()
        .toLowerCase()
        .withMessage('Username or email is required'),

    body('password')
        .notEmpty()
        .withMessage('Password is required')
];

module.exports = {
    registerValidator,
    loginValidator
}