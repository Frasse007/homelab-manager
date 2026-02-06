const { Op } = require('sequelize');
const { User } = require('../models');
const { hashPassword, comparePassword } = require('../utils/password.js');
const { generateToken } = require('../utils/jwt.js');
const { successResponse } = require('../utils/responseFormatter.js');
const { AuthenticationError, ConflictError } = require('../utils/errors.js');

// POST /api/auth/register - Registers a new user
async function register(req, res, next) {
    try {
        const { username, email, password, first_name, last_name, role } = req.body;

        // Checks if user already exists
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [{ username }, { email }]
            }
        });

        // Throws custom ConflictError if user is found
        if (existingUser) {
            throw new ConflictError('Username or email already exists');
        }

        // Hashes password before creating user
        const password_hash = await hashPassword(password);

        // Creates user
        const user = await User.create({
            username,
            email,
            password_hash,
            first_name,
            last_name,
            role: role || 'user'
        });

        // Generates token for user
        const token = generateToken({
            id: user.id,
            username: user.username,
            role: user.role
        });

        // Returns success message
        successResponse(res, {
            user: user.toJSON(),
            token
        }, 'User registered successfully', 201);    
    } catch (error) {
        next(error);
    }
};

// POST /api/auth/login - Login user
async function login(req, res, next) {
    try {
        const { identifier, password } = req.body;

        // Finds user by username or email
        const user = await User.findOne({ 
            where: {
                [Op.or]: [{ username: identifier }, { email: identifier }]
            }
        });
        
        // Throws custom Authentication error if user not found
        if (!user) {
            throw new AuthenticationError('Invalid credentials');
        }

        // Checks password
        const isValid = await comparePassword(password, user.password_hash);

        // Throws custom Authentication error if passwords don't match
        if (!isValid) {
            throw new AuthenticationError('Invalid credentials');
        }

        // Generates token for user
        const token = generateToken({
            id: user.id,
            username: user.username,
            role: user.role
        });

        // Returns success message
        successResponse(res, {
            user: user.toJSON(),
            token
        }, 'Login successful');    
    } catch (error) {
        next(error);
    }
};

// GET /api/auth/me - Gets current users profile
async function getProfile(req, res, next) {
    try {
        successResponse(res, req.user.toJSON(), 'Profile retrieved successfully');
    } catch (error) {
        next(error);
    }
};

// POST /api/auth/logout - Logs user out
async function logout(req, res, next) {
    try {
        successResponse(res, null, 'Logout successful');
    } catch (error) {
        next (error);
    }
};

module.exports = {
    register,
    login,
    getProfile,
    logout
};