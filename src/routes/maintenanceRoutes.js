const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController.js');
const { authenticate } = require('../middleware/auth.js');
const validate = require('../middleware/validate.js');
const { createMaintenanceLogValidator, updateMaintenanceLogValidator } = require('../validators/maintenanceValidator.js');

// All maintenance routes require authentication
router.use(authenticate);

// CRUD routes
// GET /api/maintenance-logs - Gets all maintenance logs
router.get('/', maintenanceController.getAllMaintenanceLogs);

// GET /api/maintenance-logs/:id - Gets single maintenance log by its ID
router.get('/:id', maintenanceController.getMaintenanceLogById);

// POST /api/maintenance-logs - Creates new maintenance log
router.post('/', createMaintenanceLogValidator, validate, maintenanceController.createMaintenanceLog);

// DELETE /api/v1/maintenance-logs/:id - Deletes a maintenance log by its ID
router.delete('/:id', maintenanceController.deleteMaintenanceLog);

module.exports = router;