const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler.js');
const { requestLogger, auditLogger } = require('./middleware/auditLogger.js');
const { apiLimiter } = require('./middleware/rateLimiter.js');
const routes = require('./routes');
const config = require('./config/server.js');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors(config.cors));

// Rate limiting middleware
app.use('/api', apiLimiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use(requestLogger);
app.use(auditLogger);

// API routes
app.use('/api', routes);

// Health check root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Homelab Service Manager API',
        version: '1.0.0',
        status: 'running',
        endpoints: {
            health: '/api/health',
            auth: '/api/auth',
            services: '/api/services',
            maintenance: '/api/maintenance-logs',
            vulnerabilities: '/api/vulnerabilities',
            ssl_certificates: '/api/ssl-certificates'
        }
    });
});

// 404 Handler
app.use(notFoundHandler);

// Error Handler
app.use(errorHandler);

module.exports = app;