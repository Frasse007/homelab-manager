const { Sequelize } = require('sequelize');
const config = require('../config/database.js');

const env = process.env.NODE_ENV;
const dbConfig = config[env];

// Initializes Sequelize connection 
const sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    {
        host: dbConfig.host,
        port: dbConfig.port,
        dialect: dbConfig.dialect,
        logging: dbConfig.logging,
        define: dbConfig.define
    }
);

// Imports models
const User = require('./User.js')(sequelize);
const Service = require('./Service.js')(sequelize);
const MaintenanceLog = require('./MaintenanceLog.js')(sequelize);
const Vulnerability = require('./Vulnerability.js')(sequelize);
const SSLCertificate = require('./SSLCertificate.js')(sequelize);

// Defines associations/relationships
User.hasMany(Service, {
    foreignKey: 'user_id',
    as: 'services',
    // Removes every service connected to a user on deletion
    onDelete: 'CASCADE' 
});

Service.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'owner'
});

Service.hasMany(MaintenanceLog, {
    foreignKey: 'service_id',
    as: 'maintenanceLogs',
    // Removes all maintenance logs connected to a service on deletion
    onDelete: 'CASCADE'
});

MaintenanceLog.belongsTo(Service, {
    foreignKey: 'service_id',
    as: 'service'
});

User.hasMany(MaintenanceLog, {
    foreignKey: 'performed_by_user_id',
    as: 'performedMaintenance',
    // Keeps maintenance logs if user is deleted
    onDelete: 'SET NULL'
});

MaintenanceLog.belongsTo(User, {
    foreignKey: 'performed_by_user_id',
    as: 'performer'
});

Service.hasMany(Vulnerability, {
    foreignKey: 'service_id',
    as: 'vulnerabilities',
    // Removes all vulnerabilities connected to a service on deletion
    onDelete: 'CASCADE'
});

Vulnerability.belongsTo(Service, {
    foreignKey: 'service_id',
    as: 'service'
});

Service.hasMany(SSLCertificate, {
    foreignKey: 'service_id',
    as: 'sslCertificates',
    // Removes all ssl certificates connected to a service on deletion
    onDelete: 'CASCADE'
});

SSLCertificate.belongsTo(Service, {
    foreignKey: 'service_id',
    as: 'service'
});

const db = {
    sequelize,
    Sequelize,
    User,
    Service,
    MaintenanceLog,
    Vulnerability,
    SSLCertificate
};

module.exports = db;
