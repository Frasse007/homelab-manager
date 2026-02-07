const { SSLCertificate, Service } = require('../models');
const { successResponse } = require('../utils/responseFormatter.js');
const { NotFoundError, AuthorizationError } = require('../utils/errors.js');
const { Op } = require('sequelize');

// GET /api/ssl-certificates - Gets all SSL certificates
async function getAllCertificates(req, res, next) {
    try {
        // Takes input and initializes an "empty query" to be used later
        const { service_id, status } = req.query;
        const where = {};

        // Adds the filters to the query
        if (service_id) where.service_id = service_id;
        if (status) where.status = status;

        const include = [{ model: Service, as: 'service' }];

        // Ensures non-admins can only see certificates for their own services
        if (req.user.role !== 'admin') {
            include[0].where = { user_id: req.user.id };
        }

        // Queries the database with filters provided
        const certificates = await SSLCertificate.findAll({
            where,
            include,
            order: [['expiration_date', 'ASC']]
        });

        // Returns success message with certificates
        successResponse(res, certificates, 'SSL certificates retrieved successfully');
    } catch (error) {
        next(error);
    }
};

// GET /api/ssl-certificates/:id - Gets single SSL certificate by its ID
async function getCertificateById(req, res, next) {
    try {
        const { id } = req.params;

        // Returns all information available about certificate with provided ID
        const certificate = await SSLCertificate.findByPk(id, {
            include: [{ model: Service, as: 'service' }]
        });

        // Throws custom 'NotFoundError' if certificate doesn't exist
        if (!certificate) {
            throw new NotFoundError('SSL certificate not found');
        }

        // Throws custom 'AuthorizationError' if user doesn't own the associated service or is admin
        if (req.user.role !== 'admin' && certificate.service.user_id !== req.user.id) {
            throw new AuthorizationError('You can only access certificates for your own services');
        }

        // Returns success message with certificate information
        successResponse(res, certificate, 'SSL certificate retrieved successfully');
    } catch (error) {
        next(error);
    }
};

// POST /api/ssl-certificates - Creates new SSL certificate
async function createCertificate(req, res, next) {
    try {
        const { service_id } = req.body;

        // Checks if associated service exists
        const service = await Service.findByPk(service_id);

        if (!service) {
            throw new NotFoundError('Service not found');
        }

        // Throws custom 'AuthorizationError' if user doesn't own service or is admin
        if (req.user.role !== 'admin' && service.user_id !== req.user.id) {
            throw new AuthorizationError('You can only create certificates for your own services');
        }

        // Creates new certificate with input from user
        const certificate = await SSLCertificate.create(req.body);

        // Fetches full data including associations to return to user
        const fullCertificate = await SSLCertificate.findByPk(certificate.id, {
            include: [{ model: Service, as: 'service' }]
        });

        // Returns success message with certificate information
        successResponse(res, fullCertificate, 'SSL certificate created successfully', 201);
    } catch (error) {
        next(error);
    }
};

// PUT /api/ssl-certificates/:id - Updates information for a certificate by its ID
async function updateCertificate(req, res, next) {
    try {
        const { id } = req.params;

        // Finds the certificate by its ID
        const certificate = await SSLCertificate.findByPk(id, {
            include: [{ model: Service, as: 'service' }]
        });

        // Throws custom 'NotFoundError' if certificate doesn't exist
        if (!certificate) {
            throw new NotFoundError('SSL certificate not found');
        }

        // Throws custom 'AuthorizationError' if user doesn't own the associated service or is admin
        if (req.user.role !== 'admin' && certificate.service.user_id !== req.user.id) {
            throw new AuthorizationError('You can only update certificates for your own services');
        }

        // Updates certificate with input
        await certificate.update(req.body);

        // Fetches updated record
        const updatedCertificate = await SSLCertificate.findByPk(id, {
            include: [{ model: Service, as: 'service' }]
        });

        // Returns success message with certificate information
        successResponse(res, updatedCertificate, 'SSL certificate updated successfully');
    } catch (error) {
        next(error);
    }
};

// DELETE /api/ssl-certificates/:id - Deletes a certificate by its ID
async function deleteCertificate(req, res, next) {
    try {
        const { id } = req.params;

        // Finds the certificate by its ID
        const certificate = await SSLCertificate.findByPk(id, {
            include: [{ model: Service, as: 'service' }]
        });

        // Throws custom 'NotFoundError' if certificate doesn't exist
        if (!certificate) {
            throw new NotFoundError('SSL certificate not found');
        }

        // Throws custom 'AuthorizationError' if user doesn't own the associated service or is admin
        if (req.user.role !== 'admin' && certificate.service.user_id !== req.user.id) {
            throw new AuthorizationError('You can only delete certificates for your own services');
        }

        // Deletes certificate
        await certificate.destroy();

        // Returns success message
        successResponse(res, null, 'SSL certificate deleted successfully');
    } catch (error) {
        next(error);
    }
};

// GET /api/ssl-certificates/expiring - Gets SSL certificates nearing expiration
async function getExpiringCertificates(req, res, next) {
    try {
        // Sets up date threshold based on user input or default to 30 days
        const { days = 30 } = req.query;
        const expirationThreshold = new Date();
        expirationThreshold.setDate(expirationThreshold.getDate() + parseInt(days));

        // Filters for certificates expiring soon that are still valid
        const where = {
            expiration_date: { [Op.lte]: expirationThreshold },
            status: { [Op.in]: ['valid', 'expiring_soon'] }
        };

        const include = [{ model: Service, as: 'service' }];

        // Ensures non-admins can only see their own expiring certificates
        if (req.user.role !== 'admin') {
            include[0].where = { user_id: req.user.id };
        }

        // Queries the database for expiring certificates
        const certificates = await SSLCertificate.findAll({
            where,
            include,
            order: [['expiration_date', 'ASC']]
        });

        // Returns success message with expiring certificates
        successResponse(res, certificates, `Certificates expiring within ${days} days retrieved successfully`);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllCertificates,
    getCertificateById,
    createCertificate,
    updateCertificate,
    deleteCertificate,
    getExpiringCertificates
};