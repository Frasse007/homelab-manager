module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  // Excludes config files and connection between models
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/models/index.js',
    '!src/config/**'
  ],

  // Path to unit tests
  testMatch: [
    '**/tests/**/*.test.js'
  ],
  // Path to setup file for tests
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testTimeout: 10000
};