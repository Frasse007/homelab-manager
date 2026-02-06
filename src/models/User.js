const { DataTypes } = require('sequelize');
const { roles } = require('../config/auth');

module.exports = (sequelize) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            validate: {
                len: [3, 50],
                is: /^[a-zA-Z0-9._]+$/i
            }
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password_hash: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        role: {
            type: DataTypes.ENUM(Object.values(roles)),
            defaultValue: roles.USER,
            allowNull: false
        },
        first_name: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        last_name: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        notification_preferences: {
            type: DataTypes.JSON,
            defaultValue: {
                email: true,
                ssl_expiry: true,
                vulnerability_alerts: true
            }
        }
    }, {
        // Table settings/rules
        tableName: 'users',
        timestamps: true,
        underscored: true
    });

    // Avoids sending password hash as return
    User.prototype.toJSON = function() {
        const values = { ...this.get() };
        delete values.password_hash;
        return values;
    };

    return User;
};