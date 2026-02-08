const { body } = require('express-validator');

// Validation logic for creating services
const createServiceValidator = [
    body('service_name')
        .trim()
        .notEmpty()
        .withMessage('Service name is required')
        .isLength({ max: 100 })
        .withMessage('Service name must not exceed 100 characters'),

    body('service_type')
        .notEmpty()
        .withMessage('Service type is required')
        .isIn(['web', 'database', 'storage', 'monitoring', 'networking', 'other'])
        .withMessage('Invalid service type'),

    body('description')
        .optional()
        .trim(),

    body('url')
        .optional()
        .isURL()
        .withMessage('Please provide a valid URL'),

    body('port')
        .optional()
        .isInt({ min: 1, max: 65535 })
        .withMessage('Port must be between 1 and 65535'),

    body('internal_ip')
        .optional()
        .isIP()
        .withMessage('Please provide a valid IP address'),

    body('docker_container_name')
        .optional()
        .trim(),

    body('docker_image')
        .optional()
        .trim(),

    body('cores_allocated')
        .optional()
        .isFloat({ min: 0, max: 100 })
        .withMessage('CPU cores allocated must be between 0 and 100'),

    body('ram_allocated')
        .optional()
        .isInt({ min: 0 })
        .withMessage('RAM allocation must be a positive integer'),

    body('status')
        .optional()
        .isIn(['running', 'stopped', 'error', 'maintenance'])
        .withMessage('Invalid status'),

    body('uptime_percentage')
        .optional()
        .isFloat({ min: 0, max: 100 })
        .withMessage('Uptime percentage must be between 0 and 100'),

    body('public_facing')
        .optional()
        .isBoolean()
        .withMessage('Public facing must be a boolean'),

    body('authentication_method')
        .optional()
        .trim(),

    body('security_score')
        .optional()
        .isInt({ min: 0, max: 100 })
        .withMessage('Security score must be between 0 and 100')
];

// Validation logic for updating services
const updateServiceValidator = [
    body('service_name')
        .optional()
        .trim()
        .withMessage('Service name is required')
        .isLength({ max: 100 })
        .withMessage('Service name must not exceed 100 characters'),

    body('service_type')
        .optional()
        .withMessage('Service type is required')
        .isIn(['web', 'database', 'storage', 'monitoring', 'networking', 'other'])
        .withMessage('Invalid service type'),

    body('description')
        .optional()
        .trim(),

    body('url')
        .optional()
        .isURL()
        .withMessage('Please provide a valid URL'),

    body('port')
        .optional()
        .isInt({ min: 1, max: 65535 })
        .withMessage('Port must be between 1 and 65535'),

    body('internal_ip')
        .optional()
        .isIP()
        .withMessage('Please provide a valid IP address'),

    body('docker_container_name')
        .optional()
        .trim(),

    body('docker_image')
        .optional()
        .trim(),

    body('cores_allocated')
        .optional()
        .isFloat({ min: 0, max: 100 })
        .withMessage('CPU cores allocated must be between 0 and 100'),

    body('ram_allocated')
        .optional()
        .isInt({ min: 0 })
        .withMessage('RAM allocation must be a positive integer'),

    body('status')
        .optional()
        .isIn(['running', 'stopped', 'error', 'maintenance'])
        .withMessage('Invalid status'),

    body('uptime_percentage')
        .optional()
        .isFloat({ min: 0, max: 100 })
        .withMessage('Uptime percentage must be between 0 and 100'),

    body('public_facing')
        .optional()
        .isBoolean()
        .withMessage('Public facing must be a boolean'),

    body('authentication_method')
        .optional()
        .trim(),

    body('security_score')
        .optional()
        .isInt({ min: 0, max: 100 })
        .withMessage('Security score must be between 0 and 100')
];

module.exports = {
    createServiceValidator,
    updateServiceValidator
};