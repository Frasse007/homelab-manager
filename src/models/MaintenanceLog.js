const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const MaintenanceLog = sequelize.define('MaintenanceLog', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        service_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            // Links to id column in services table
            references: {
                model: 'services',
                key: 'id'
            }
        },
        performed_by_user_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            // Links to id column in users table
            references: {
                model: 'users',
                key: 'id'
            }
        },
        // Basic information about maintenance
        maintenance_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        maintenance_type: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                isIn: [['Update', 'Backup', 'Security Patch', 'Configuration Change', 'Restart', 'Other']]
            }
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        downtime_minutes: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            validate: {
                min: 0
            }
        },
        version_before: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        version_after: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        success: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        // Table settings/rules
        tableName: 'maintenance_logs',
        timestamps: true,
        underscored: true,
        // Maintenance logs don't get updated
        updatedAt: false
    });

    return MaintenanceLog;
};