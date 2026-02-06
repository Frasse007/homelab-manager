const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Service = sequelize.define('Service', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            // Links to id column in users table
            references: {
                model: 'users',
                key: 'id'
            }
        },
        // Basic information about service
        service_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        service_type: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                isIn: [['web', 'database', 'storage', 'monitoring', 'networking', 'other']]
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        // Networking information about service
        url: {
            type: DataTypes.STRING(255),
            allowNull: true,
            validate: {
                isUrl: true
            }
        },
        port: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                min: 1,
                max: 65535
            }
        },
        internal_ip: {
            type: DataTypes.STRING(45),
            allowNull: true,
            validate: {
                isIP: true
            }
        },
        // Docker information about service (If any)
        docker_container_name: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        docker_image: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        // Resources information about service
        cores_allocated: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        ram_allocated: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'RAM in MB'
        },
        // Status information about service
        status: {
            type: DataTypes.ENUM('running', 'stopped', 'error', 'maintenance'),
            defaultValue: 'running',
            allowNull: false
        },
        uptime_percentage: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
            validate: {
                min: 0,
                max: 100
            }
        },
        last_health_check: {
            type: DataTypes.DATE,
            allowNull: true
        },
        // Security information about service
        public_facing: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        authentication_method: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        security_score: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                min: 0,
                max: 100
            }
        }
    }, {
        // Table settings/rules
        tableName: 'services',
        timestamps: true,
        underscored: true
    });

    return Service;
};