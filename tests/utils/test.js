const request = require('supertest');
const app = require('../../src/app');

// Creates a user and returns their auth token and data
const getAuthToken = async (customUser = {}) => {
  const user = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'Password123!',
    first_name: 'Test',
    last_name: 'User',
    ...customUser
  };

  await request(app).post('/api/auth/register').send(user);

  const loginRes = await request(app).post('/api/auth/login').send({
    identifier: user.username,
    password: user.password
  });

  return {
    token: loginRes.body.data.token,
    user: loginRes.body.data.user
  };
};

module.exports = { getAuthToken };