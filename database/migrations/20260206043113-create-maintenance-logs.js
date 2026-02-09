'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('maintenance_logs', {
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
      performed_by_user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      maintenance_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      maintenance_type: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      downtime_minutes: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      version_before: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      version_after: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      success: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      // Added for consistency even though logs don't get updated
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Adds indexes for most common queries
    await queryInterface.addIndex('maintenance_logs', ['service_id']);
    await queryInterface.addIndex('maintenance_logs', ['performed_by_user_id']);
    await queryInterface.addIndex('maintenance_logs', ['maintenance_date']);
    await queryInterface.addIndex('maintenance_logs', ['maintenance_type']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('maintenance_logs');
  }
};
