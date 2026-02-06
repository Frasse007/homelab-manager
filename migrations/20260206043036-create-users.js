'use strict';
const { roles } = require('../src/config/auth');

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: Sequelize.STRING(50),
            allowNull: false,
            unique: true
        },
        email: {
            type: Sequelize.STRING(100),
            allowNull: false,
            unique: true
        },
        password_hash: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        role: {
            type: Sequelize.ENUM(Object.values(roles)),
            defaultValue: roles.USER,
            allowNull: false
        },
        first_name: {
            type: Sequelize.STRING(50),
            allowNull: true
        },
        last_name: {
            type: Sequelize.STRING(50),
            allowNull: true
        },
        notification_preferences: {
            type: Sequelize.JSON,
            defaultValue: {
                email: true,
                ssl_expiry: true,
                vulnerability_alerts: true
            }
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
    await queryInterface.addIndex('users', ['username']);
    await queryInterface.addIndex('users', ['email']);
    await queryInterface.addIndex('users', ['role']);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
    // Removes custom ENUM type from Postgres memory
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_users_role";');
  }
};
