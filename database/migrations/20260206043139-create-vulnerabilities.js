'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('vulnerabilities', {
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
      cve_id: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      severity: {
        type: Sequelize.ENUM('Critical', 'High', 'Medium', 'Low', 'Informational'),
        allowNull: false
      },
      cvss_score: {
        type: Sequelize.DECIMAL(3, 1),
        allowNull: true
      },
      discovered_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      status: {
        type: Sequelize.ENUM('open', 'in_progress', 'patched', 'mitigated', 'accepted'),
        defaultValue: 'open',
        allowNull: false
      },
      patched_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      remediation_notes: {
        type: Sequelize.TEXT,
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
    await queryInterface.addIndex('vulnerabilities', ['service_id']);
    await queryInterface.addIndex('vulnerabilities', ['cve_id']);
    await queryInterface.addIndex('vulnerabilities', ['severity']);
    await queryInterface.addIndex('vulnerabilities', ['status']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('vulnerabilities');
    // Removes custom ENUM type from Postgres memory
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_vulnerabilities_severity";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_vulnerabilities_status";');
  }
};
