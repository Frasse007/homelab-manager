const express = require('express');
const router = express.Router();

// Imports route modules
const authRoutes = require('./authRoutes.js');
const serviceRoutes = require('./serviceRoutes.js');
const maintenanceRoutes = require('./maintenanceRoutes.js');
const vulnerabilityRoutes = require('./vulnerabilityRoutes.js');
const sslCertificateRoutes = require('./sslCertificateRoutes.js');

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'Homelab Service Manager API'
    });
});

// API routes
router.use('/auth', authRoutes);
router.use('/services', serviceRoutes);
router.use('/maintenance-logs', maintenanceRoutes);
router.use('/vulnerabilities', vulnerabilityRoutes);
router.use('/ssl-certificates', sslCertificateRoutes);

module.exports = router;