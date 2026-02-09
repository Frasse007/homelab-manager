'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('services', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      service_name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      service_type: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      url: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      port: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      internal_ip: {
        type: Sequelize.STRING(45),
        allowNull: true
      },
      docker_container_name: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      docker_image: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      cpu_allocated: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true
      },
      ram_allocated: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('running', 'stopped', 'error', 'maintenance'),
        defaultValue: 'running',
        allowNull: false
      },
      uptime_percentage: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true
      },
      last_health_check: {
        type: Sequelize.DATE,
        allowNull: true
      },
      public_facing: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      authentication_method: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      security_score: {
        type: Sequelize.INTEGER,
        allowNull: true
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
    await queryInterface.addIndex('services', ['user_id']);
    await queryInterface.addIndex('services', ['service_type']);
    await queryInterface.addIndex('services', ['status']);
    await queryInterface.addIndex('services', ['public_facing']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('services');
    // Removes custom ENUM type from Postgres memory
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_services_status";');
  }
};
