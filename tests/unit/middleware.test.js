const { authorize, authorizeOwnership } = require('../../src/middleware/authorize.js');
const { AuthorizationError } = require('../../src/utils/errors.js');

describe('Authorization Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        // Mocking Express objects
        req = {
            user: null,
            resource: null
        };
        res = {};
        next = jest.fn();
    });

    describe('authorize()', () => {
        it('should call next with AuthorizationError if user is not authenticated', () => {
            const middleware = authorize('admin');
            middleware(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(AuthorizationError));
            expect(next.mock.calls[0][0].message).toBe('Authentication required');
        });

        it('should call next with AuthorizationError if user role is not permitted', () => {
            req.user = { role: 'user' };
            const middleware = authorize('admin', 'editor');
            middleware(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(AuthorizationError));
            expect(next.mock.calls[0][0].message).toBe('Insufficient permissions');
        });

        it('should call next() without arguments if user role is permitted', () => {
            req.user = { role: 'admin' };
            const middleware = authorize('admin', 'editor');
            middleware(req, res, next);

            expect(next).toHaveBeenCalledWith();
        });
    });

    describe('authorizeOwnership()', () => {
        it('should allow access if user is an admin', () => {
            req.user = { id: 1, role: 'admin' };
            req.resource = { user_id: 99 };
            
            const middleware = authorizeOwnership();
            middleware(req, res, next);

            expect(next).toHaveBeenCalledWith();
        });

        it('should allow access if user is the owner of the resource', () => {
            req.user = { id: 5, role: 'user' };
            req.resource = { user_id: 5 };
            
            const middleware = authorizeOwnership('user_id');
            middleware(req, res, next);

            expect(next).toHaveBeenCalledWith();
        });

        it('should fail if user is not the owner and not an admin', () => {
            req.user = { id: 5, role: 'user' };
            req.resource = { user_id: 10 };
            
            const middleware = authorizeOwnership('user_id');
            middleware(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(AuthorizationError));
            expect(next.mock.calls[0][0].message).toBe('You can only access your own resources');
        });

        it('should work with custom resource fields', () => {
            req.user = { id: 5, role: 'user' };
            req.resource = { owner_id: 5 };
            
            const middleware = authorizeOwnership('owner_id');
            middleware(req, res, next);

            expect(next).toHaveBeenCalledWith();
        });
    });
});