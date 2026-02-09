const { sequelize } = require('../src/models');

// Setup test database before running tests
beforeAll(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true }); // TA BORT OM INTEFUNKAR
    console.log('Test database connected');
  } catch (error) {
    console.error('Unable to connect to test database:', error);
  }
});

// Close database connection after all tests
afterAll(async () => {
  await sequelize.close();
  console.log('Test database connection closed');
});

// Clear database between tests
afterEach(async () => {
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});