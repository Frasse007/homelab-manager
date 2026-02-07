const { AuthorizationError } = require('../utils/errors.js');

// Authorization middleware based on role
function authorize(...roles) {
    return (req, res, next) => {

        // Throws custom 'AuthorizationError' if user is not authenticated
        if (!req.user) {
            return next(new AuthorizationError('Authentication required'));
        }

        // Throws custom 'AuthorizationError' if role is not one of possible roles
        if (!roles.includes(req.user.role)) {
            return next(new AuthorizationError('Insufficient permissions'));
        }

        next();
    }
};

// Checks ownership and allows access if user is owner or admin
function authorizeOwnership(resourceUserIdField = 'user_id') {
    return (req, res, next) => {

        // Throws custom 'AuthorizationError' if user is not authenticated
        if (!req.user) {
            return next(new AuthorizationError('Authentication required'));
        }

        // Makes sure admins can access everything
        if (req.user.role === 'admin') {
            return next();
        }

        // Throws custom 'AuthorizationError' if user is not owner
        const resource = req.resource;
        if (resource && resource[resourceUserIdField] !== req.user.id) {
            return next(new AuthorizationError('You can only access your own resources'));
        }

        next();
    }
};

module.exports = {
    authorize,
    authorizeOwnership
}