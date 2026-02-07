const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '../../logs/audit.log');

// Checks that /logs folder exists and creates it if it doesn't
const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

// Audit logging middleware that logs all API requests to audit.log
function auditLogger(req, res, next) {
    const timestamp = new Date().toISOString();
    const user = req.user ? req.user.username : 'anonymous';
    const method = req.method;
    const url = req.originalUrl;
    const ip = req.ip || req.connection.remoteAddress;

    // Log after response is sent to improve performance for users
    res.on('finish', () => {
        const statusCode = res.statusCode;
        const logEntry = `[${timestamp}] ${user} | ${method} ${url} | Status: ${statusCode} | IP: ${ip}\n`;

        fs.appendFile(logFilePath, logEntry, (err) => {
            if (err) console.error('Failed to write audit log:', err);
        });
    });

    next();
};

// Request logging middleware for development
function requestLogger(req, res, next) {
    // Checks if environment is development
    if (process.env.NODE_ENV === 'development') {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
    }

    next();
};

module.exports = {
    auditLogger,
    requestLogger
}