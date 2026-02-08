const { body } = require('express-validator');

// Validation logic for creating maintenance logs
const createMaintenanceLogValidator = [
  body('service_id')
    .isInt()
    .withMessage('Service ID must be an integer'),
  
  body('maintenance_date')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid date'),
  
  body('maintenance_type')
    .notEmpty()
    .withMessage('Maintenance type is required')
    .isIn(['Update', 'Backup', 'Security Patch', 'Configuration Change', 'Restart', 'Other'])
    .withMessage('Invalid maintenance type'),
  
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title must not exceed 200 characters'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required'),
  
  body('downtime_minutes')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Downtime must be a positive integer'),
  
  body('version_before')
    .optional()
    .trim(),
  
  body('version_after')
    .optional()
    .trim(),
  
  body('success')
    .optional()
    .isBoolean()
    .withMessage('Success must be a boolean'),
  
  body('notes')
    .optional()
    .trim()
];

module.exports = {
  createMaintenanceLogValidator
};