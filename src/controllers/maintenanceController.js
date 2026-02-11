const { MaintenanceLog, Service, User } = require('../models');
const { successResponse } = require('../utils/responseFormatter.js');
const { NotFoundError, AuthorizationError } = require('../utils/errors.js');

// GET /api/maintenance-logs - Gets all maintenance logs
async function getAllMaintenanceLogs(req, res, next) {
    try {
        // Takes input and initializes an "empty query" to be used later
        const { service_id, maintenance_type, success } = req.query;
        const where = {};

        // Adds the filters to the query
        if (service_id) where.service_id = service_id;
        if (maintenance_type) where.maintenance_type = maintenance_type;
        if (success !== undefined) where.success = success === 'true';

        // Build include clause with ownership check
        const include = [
            { model: Service, as: 'service' },
            { model: User, as: 'performer', attributes: ['id', 'username'] }
        ];

        // Ensures non-admins can only see logs for their own services
        if (req.user.role !== 'admin') {
            include[0].where = { user_id: req.user.id };
        }

        // Queries the database with filters provided
        const logs = await MaintenanceLog.findAll({
            where,
            include,
            order: [['maintenance_date', 'DESC']]
        });

        // Returns success message with logs
        successResponse(res, logs, 'Maintenance logs retrieved successfully');
    } catch (error) {
        next(error);
    }
};

// GET /api/maintenance-logs/:id - Gets single maintenance log by its ID
async function getMaintenanceLogById(req, res, next) {
    try {
        const { id } = req.params;

        // Returns all information available about log with provided ID
        const log = await MaintenanceLog.findByPk(id, {
            include: [
                { model: Service, as: 'service' },
                { model: User, as: 'performer', attributes: ['id', 'username'] }
            ]
        });

        // Throws custom 'NotFoundError' if log doesn't exist
        if (!log) {
            throw new NotFoundError('Maintenance log not found');
        }

        // Throws custom 'AuthorizationError' if user doesn't own related service or is admin
        if (req.user.role !== 'admin' && log.service.user_id !== req.user.id) {
            throw new AuthorizationError('You can only access logs for your own services');
        }

        // Returns success message with log information
        successResponse(res, log, 'Maintenance log retrieved successfully');
    } catch (error) {
        next(error);
    }
};

// POST /api/maintenance-logs - Creates new maintenance log
async function createMaintenanceLog(req, res, next) {
    try {

        // Throws custom errors if service doesn't exist or user doesn't own service with that ID
        const service = await Service.findByPk(req.body.service_id);

        if (!service) {
            throw new NotFoundError('Service not found');
        }
        if (req.user.role !== 'admin' && service.user_id !== req.user.id) {
            throw new AuthorizationError('You cannot create logs for services you do not own');
        }

        // Takes input from user
        const logData = {
            ...req.body,
            performed_by_user_id: req.user.id
        };

        // Creates new maintenance log with input from user
        const log = await MaintenanceLog.create(logData);

        // Fetches full data including associations to return to user
        const fullLog = await MaintenanceLog.findByPk(log.id, {
            include: [{ model: Service, as: 'service' }]
        });

        // Returns success message with log information
        successResponse(res, fullLog, 'Maintenance log created successfully', 201);
    } catch (error) {
        next(error);
    }
};

// NO PUT as maintenance logs shouldn't allow updates

// DELETE /api/v1/maintenance-logs/:id - Deletes a maintenance log by its ID
async function deleteMaintenanceLog(req, res, next) {
    try {
        const { id } = req.params;

        // Finds the maintenance log by its ID
        const log = await MaintenanceLog.findByPk(id, {
            include: [{ model: Service, as: 'service' }]
        });

        // Throws custom 'NotFoundError' if log doesn't exist
        if (!log) {
            throw new NotFoundError('Maintenance log not found');
        }

        // Throws custom 'AuthorizationError' if user doesn't own service or is admin
        if (req.user.role !== 'admin' && log.service.user_id !== req.user.id) {
            throw new AuthorizationError('You can only delete logs for your own services');
        }

        // Deletes log
        await log.destroy();

        // Returns success message
        successResponse(res, null, 'Maintenance log deleted successfully');
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllMaintenanceLogs,
    getMaintenanceLogById,
    createMaintenanceLog,
    deleteMaintenanceLog
};