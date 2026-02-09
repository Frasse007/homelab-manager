'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ssl_certificates', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      service_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'services',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      domain: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      issuer: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      certificate_type: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      issue_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      expiration_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('valid', 'expiring_soon', 'expired', 'revoked'),
        defaultValue: 'valid',
        allowNull: false
      },
      auto_renewal_enabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Adds indexes for most common queries
    await queryInterface.addIndex('ssl_certificates', ['service_id']);
    await queryInterface.addIndex('ssl_certificates', ['domain']);
    await queryInterface.addIndex('ssl_certificates', ['status']);
    await queryInterface.addIndex('ssl_certificates', ['expiration_date']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ssl_certificates');
    // Removes custom ENUM type from Postgres memory
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_ssl_certificates_status";');
  }
};
