'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('Password123!', 10);

    await queryInterface.bulkInsert('users', [
      {
        username: 'admin',
        email: 'admin@homelab.local',
        password_hash: hashedPassword,
        role: 'admin',
        first_name: 'Admin',
        last_name: 'User',
        notification_preferences: JSON.stringify({
          email: true,
          ssl_expiry: true,
          vulnerability_alerts: true
        }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        username: 'johndoe',
        email: 'john@example.com',
        password_hash: hashedPassword,
        role: 'user',
        first_name: 'John',
        last_name: 'Doe',
        notification_preferences: JSON.stringify({
          email: true,
          ssl_expiry: true,
          vulnerability_alerts: false
        }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        username: 'testGuy',
        email: 'testGuy@homelab.local',
        password_hash: hashedPassword,
        role: 'user',
        first_name: 'Test',
        last_name: 'Guy',
        notification_preferences: JSON.stringify({
          email: true,
          ssl_expiry: true,
          vulnerability_alerts: true
        }),
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};