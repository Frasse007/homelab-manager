const express = require('express');
const router = express.Router();
const SSLCertificateController = require('../controllers/sslCertificateController.js');
const { authenticate } = require('../middleware/auth.js');
const validate = require('../middleware/validate.js');
const { createSSLCertificateValidator, updateSSLCertificateValidator } = require('../validators/sslCertificateValidator.js');

// All SSL certificate routes require authentication
router.use(authenticate);

// SSL certificates expiring soon
router.get('/expiring', SSLCertificateController.getExpiringCertificates);

// CRUD routes
// GET /api/ssl-certificates - Gets all SSL certificates
router.get('/', SSLCertificateController.getAllCertificates);

// GET /api/ssl-certificates/:id - Gets single SSL certificate by its ID
router.get('/:id', SSLCertificateController.getCertificateById);

// POST /api/ssl-certificates - Creates new SSL certificate
router.post('/', createSSLCertificateValidator, validate, SSLCertificateController.createCertificate);

// PUT /api/ssl-certificates/:id - Updates information for a certificate by its ID
router.put('/:id', updateSSLCertificateValidator, validate, SSLCertificateController.updateCertificate);

// DELETE /api/ssl-certificates/:id - Deletes a certificate by its ID
router.delete('/:id', SSLCertificateController.deleteCertificate);

module.exports = router;