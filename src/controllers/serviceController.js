const { Service, User, Vulnerability, SSLCertificate, MaintenanceLog } = require('../models');
const { successResponse } = require('../utils/responseFormatter.js');
const { NotFoundError, AuthorizationError } = require('../utils/errors.js');

// GET /api/services - Gets all services
async function getAllServices(req, res, next) {
    try {
        // Takes input and initializes an "empty query" to be used later
        const { service_type, status, public_facing } = req.query;
        const where = {};

        // Adds the filters to the query
        if (service_type) where.service_type = service_type;
        if (status) where.status = status;
        if (public_facing !== undefined) where.public_facing = public_facing === 'true';

        // Ensures non-admins can only see their own services
        if (req.user.role !== 'admin') {
            where.user_id = req.user.id;
        }

        // Queries the database with filters provided
        const services = await Service.findAll({
            where,
            include: [
                { model: User, as: 'owner', attributes: ['id', 'username', 'email'] }
            ],
            order: [['created_at', 'DESC']]
        });

        // Returns success message with services
        successResponse(res, services, 'Services retrieved successfully');
    } catch (error) {
        next(error);
    }
};

// GET /api/services/:id - Gets single service by its ID
async function getServiceById(req, res, next) {
    try {
        const { id } = req.params;

        // Returns all information available about service with provided ID
        const service = await Service.findByPk(id, {
            include: [
                { model: User, as: 'owner', attributes: ['id', 'username', 'email'] },
                { model: Vulnerability, as: 'vulnerabilities' },
                { model: SSLCertificate, as: 'sslCertificates' },
                { model: MaintenanceLog, as: 'maintenanceLogs', limit: 5, order: [['maintenance_date', 'DESC']] }
            ]
        });

        // Throws custom 'NotFoundError' if service doesn't exist
        if (!service) {
            throw new NotFoundError('Service not found');
        }

        // Throws custom 'AuthorizationError' if user doesn't own service or is admin
        if (req.user.role !== 'admin' && service.user_id !== req.user.id) {
            throw new AuthorizationError('You can only access your own services');
        }

        // Returns success message with service information
        successResponse(res, service, 'Service retrieved successfully');
    } catch (error) {
        next(error);
    }
};

// POST /api/services - Creates new service
async function createService(req, res, next) {
    try {
        // Takes input from user
        const serviceData = {
            ...req.body,
            user_id: req.user.id
        };

        // Creates new service with input from user
        const service = await Service.create(serviceData);

        // Returns success message with service information
        successResponse(res, service, 'Service created successfully', 201);
    } catch (error) {
        next(error);
    }
};

// PUT /api/services/:id - Updates information for a service by its ID
async function updateService(req, res, next) {
    try {
        const { id } = req.params;

        // Finds the service by its ID
        const service = await Service.findByPk(id);

        // Throws custom 'NotFoundError' if service doesn't exist
        if (!service) {
            throw new NotFoundError('Service not found');
        }

        // Throws custom 'AuthorizationError' if user doesn't own service or is admin
        if (req.user.role !== 'admin' && service.user_id !== req.user.id) {
            throw new AuthorizationError('You can only update your own services');
        }

        // Updates service with input
        await service.update(req.body);

        // Returns success message with service information
        successResponse(res, service, 'Service updated successfully');
    } catch (error) {
        next(error);
    }
};

// DELETE /api/services/:id - Deletes a service by its ID
async function deleteService(req, res, next) {
    try {
        const { id } = req.params;

        // Finds the service by its ID
        const service = await Service.findByPk(id);

        // Throws custom 'NotFoundError' if service doesn't exist
        if (!service) {
            throw new NotFoundError('Service not found');
        }

        // Throws custom 'AuthorizationError' if user doesn't own service or is admin
        if (req.user.role !== 'admin' && service.user_id !== req.user.id) {
            throw new AuthorizationError('You can only update your own services');
        }

        // Deletes service
        await service.destroy();

        // Returns success message
        successResponse(res, null, 'Service deleted successfully');
    } catch (error) {
        next(error);
    }
};

// GET /api/services/stats - Gets service statistics
async function getServiceStats(req, res, next) {
    try {
        // Logic to give admins complete overview but users only their own services
        const where = req.user.role === 'admin' ? {} : { user_id: req.user.id };

        // Calculate total services and with each status
        const [total, running, stopped, error, maintenance, publicFacing] = await Promise.all([
            Service.count({ where }),
            Service.count({ where: { ...where, status: 'running' } }),
            Service.count({ where: { ...where, status: 'stopped' } }),
            Service.count({ where: { ...where, status: 'error' } }),
            Service.count({ where: { ...where, status: 'maintenance' } }),
            Service.count({ where: { ...where, public_facing: true } })
        ]);

        // Organizes information about services obtained above
        const stats = {
            total,
            by_status: {
                running,
                stopped,
                error,
                maintenance
            },
            public_facing: publicFacing,
            private: total - publicFacing
        };

        // Returns success message with service stats
        successResponse(res, stats, 'Service statistics retrieved successfully');
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllServices,
    getServiceById,
    createService,
    updateService,
    deleteService,
    getServiceStats
};
