const { body } = require('express-validator');

// Validation logic for creating SSL Certificates
const createSSLCertificateValidator = [
  body('service_id')
    .isInt()
    .withMessage('Service ID must be an integer'),
  
  body('domain')
    .trim()
    .notEmpty()
    .withMessage('Domain is required')
    .isLength({ max: 255 })
    .withMessage('Domain must not exceed 255 characters'),
  
  body('issuer')
    .trim()
    .notEmpty()
    .withMessage('Issuer is required')
    .isLength({ max: 255 })
    .withMessage('Issuer must not exceed 255 characters'),
  
  body('certificate_type')
    .notEmpty()
    .withMessage('Certificate type is required')
    .isIn(['Self-Signed', "Let's Encrypt", 'Commercial CA'])
    .withMessage('Invalid certificate type'),
  
  body('issue_date')
    .isISO8601()
    .withMessage('Please provide a valid issue date'),
  
  body('expiration_date')
    .isISO8601()
    .withMessage('Please provide a valid expiration date')
    // Check to ensure expiration date is later than issuance date
    .custom((value, { req }) => {
      const issueDate = new Date(req.body.issue_date);
      const expirationDate = new Date(value);
      if (expirationDate <= issueDate) {
        throw new Error('Expiration date must be after issue date');
      }
      return true;
    }),
  
  body('status')
    .optional()
    .isIn(['valid', 'expiring_soon', 'expired', 'revoked'])
    .withMessage('Invalid status'),
  
  body('auto_renewal_enabled')
    .optional()
    .isBoolean()
    .withMessage('Auto renewal enabled must be a boolean')
];

// Validation logic for updating SSL Certificates
const updateSSLCertificateValidator = [
  body('domain')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Domain cannot be empty')
    .isLength({ max: 255 })
    .withMessage('Domain must not exceed 255 characters'),
  
  body('issuer')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Issuer cannot be empty')
    .isLength({ max: 255 })
    .withMessage('Issuer must not exceed 255 characters'),
  
  body('certificate_type')
    .optional()
    .isIn(['Self-Signed', "Let's Encrypt", 'Commercial CA'])
    .withMessage('Invalid certificate type'),
  
  body('issue_date')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid issue date'),
  
  body('expiration_date')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid expiration date')
    .custom((value, { req }) => {
        // Only perform check if expiration date is after issuance date if request body includes both
        if (req.body.issue_date && value) {
            const issueDate = new Date(req.body.issue_date);
            const expirationDate = new Date(value);
            if (expirationDate <= issueDate) {
            throw new Error('Expiration date must be after issue date');
            }
        }
        return true;
    }),
  
  body('status')
    .optional()
    .isIn(['valid', 'expiring_soon', 'expired', 'revoked'])
    .withMessage('Invalid status'),
  
  body('auto_renewal_enabled')
    .optional()
    .isBoolean()
    .withMessage('Auto renewal enabled must be a boolean')
];

module.exports = {
  createSSLCertificateValidator,
  updateSSLCertificateValidator
};