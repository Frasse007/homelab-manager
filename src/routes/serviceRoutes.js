const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController.js');
const { authenticate } = require('../middleware/auth.js');
const validate = require('../middleware/validate.js');
const { createServiceValidator, updateServiceValidator } = require('../validators/serviceValidator.js');

// All service routes require authentication
router.use(authenticate)

// Service statistics route
router.get('/stats', serviceController.getServiceStats);

// CRUD routes
// GET /api/services - Gets all services
router.get('/', serviceController.getAllServices);

// GET /api/services/:id - Gets single service by its ID
router.get('/:id', serviceController.getServiceById);

// POST /api/services - Creates new service
router.post('/', createServiceValidator, validate, serviceController.createService);

// PUT /api/services/:id - Updates information for a service by its ID
router.put('/:id', updateServiceValidator, validate, serviceController.updateService);

// DELETE /api/services/:id - Deletes a service by its ID
router.delete('/:id', serviceController.deleteService);

module.exports = router;