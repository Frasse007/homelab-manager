const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const SSLCertificate = sequelize.define('SSLCertificate', {
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
        // Basic information about SSL Certificate
        domain: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        issuer: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        certificate_type: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                isIn: [['Self-Signed', "Let's Encrypt", 'Commerical CA']]
            }
        },
        issue_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        expiration_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        days_until_expiry: {
            type: DataTypes.VIRTUAL,
            // Calculates difference from current time to expiration date
            get() {
                const now = new Date();
                const expiry = new Date(this.expiration_date);
                const diffTime = expiry - now;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return diffDays;
            }
        },
        status: {
            type: DataTypes.ENUM('valid', 'expiring_soon', 'expired', 'revoked'),
            defaultValue: 'valid',
            allowNull: false
        },
        auto_renewal_enabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        // Table settings/rules
        tableName: 'ssl_certificates',
        timestamps: true,
        underscored: true,
        // Auto-update status based on days until expiry
        hooks: {
            beforeSave: (certificate) => {
                const daysUntilExpiry = certificate.days_until_expiry;
                if (daysUntilExpiry < 0) {
                certificate.status = 'expired';
                } else if (daysUntilExpiry <= 30) {
                certificate.status = 'expiring_soon';
                } else if (certificate.status !== 'revoked') {
                certificate.status = 'valid';
                }
            }
        }
    });

    return SSLCertificate;
};