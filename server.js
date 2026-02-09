require('dotenv').config();
const app = require('./src/app');
const { sequelize } = require('./src/models');
const config = require('./src/config/server.js');

const PORT = config.port;

// Tests database connection
async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('Database connection established successfully');

        // Syncs database in dev environment
        if (config.nodeEnv === 'development') {
            await sequelize.sync({ alter: true });
            console.log('Database models synchronized');
        }
        
        // Starts server
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Environment: ${config.nodeEnv}`);
            console.log(`API available at http://localhost:${PORT}/`);
        });
    } catch (error) {
        console.error('Unable to start server:', error);
        process.exit(1);
    }
};

startServer();