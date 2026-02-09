const request = require('supertest');
const app = require('../../src/app.js');
const { sequelize } = require('../../src/models/index.js');
const { getAuthToken } = require('../utils/test.js');

describe('Service Endpoints', () => {
  let authToken;
  let testService;

  beforeEach(async () => {
    // Create and login a test user
    const auth = await getAuthToken();
    authToken = auth.token;

    // Creates a service to be used
    const serviceRes = await request(app)
    .post('/api/services')
    .set('Authorization', `Bearer ${authToken}`)
    .send({
      service_name: 'Test Plex',
      url: 'http://192.168.1.50:32400',
      service_type: 'other',
      status: 'running'
    });
  
    testService = serviceRes.body.data;
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /api/services', () => {
    it('should create a new service', async () => {
      const response = await request(app)
        .post('/api/services')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          service_name: 'Test Service',
          service_type: 'web',
          description: 'A test service',
          port: 8080,
          status: 'running'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('service_name', 'Test Service');
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .post('/api/services')
        .send({
          service_name: 'Test Service 2',
          service_type: 'web'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should fail with invalid service type', async () => {
      const response = await request(app)
        .post('/api/services')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          service_name: 'Test Service 3',
          service_type: 'invalid_type'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/services', () => {
    it('should get all services for authenticated user', async () => {
      await request(app)
        .post('/api/services')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ service_name: 'Plex', service_type: 'media' });
      const response = await request(app)
        .get('/api/services')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should filter services by status', async () => {
      const response = await request(app)
        .get('/api/services?status=running')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      response.body.data.forEach(service => {
        expect(service.status).toBe('running');
      });
    });
  });

  describe('GET /api/services/:id', () => {
    let serviceId;

    // Creates test service before each test
    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/api/services')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          service_name: 'Service for Get Test',
          service_type: 'database'
        });
      serviceId = createResponse.body.data.id;
    });

    it('should get service by id', async () => {
      const response = await request(app)
        .get(`/api/services/${serviceId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id', serviceId);
    });

    it('should return 404 for non-existent service', async () => {
      const response = await request(app)
        .get('/api/services/99999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/services/:id', () => {
    let serviceId;

    // Creates test service before each test
    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/api/services')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          service_name: 'Service for Update Test',
          service_type: 'web'
        });
      serviceId = createResponse.body.data.id;
    });

    it('should update service', async () => {
      const response = await request(app)
        .put(`/api/services/${serviceId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          service_name: 'Updated Service Name',
          status: 'maintenance'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('service_name', 'Updated Service Name');
      expect(response.body.data).toHaveProperty('status', 'maintenance');
    });
  });

  describe('DELETE /api/services/:id', () => {
    let serviceId;

    // Creates test service before each test
    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/api/services')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          service_name: 'Service for Delete Test',
          service_type: 'web'
        });
      serviceId = createResponse.body.data.id;
    });

    it('should delete service', async () => {
      const response = await request(app)
        .delete(`/api/services/${serviceId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // Verify service is deleted
      const getResponse = await request(app)
        .get(`/api/services/${serviceId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(getResponse.status).toBe(404);
    });
  });

    it('should not allow a user to delete another users service', async () => {
      const serviceId = testService.id;
      await request(app)
        .post('/api/auth/register')
        .send({
            username: 'hacker',
            email: 'hacker@ex.com',
            password: 'Password123!',
            first_name: 'Hack', 
            last_name: 'Er'
        });
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
            identifier: 'hacker',
            password: 'Password123!'
        });
      const hackerToken = loginRes.body.data.token;

      const response = await request(app)
        .delete(`/api/services/${serviceId}`)
        .set('Authorization', `Bearer ${hackerToken}`);

        expect(response.status).toBe(403);
    });

  describe('GET /api/services/stats', () => {
    it('should get service statistics', async () => {
      const response = await request(app)
        .get('/api/services/stats')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('total');
      expect(response.body.data).toHaveProperty('by_status');
      expect(response.body.data.by_status).toHaveProperty('running');
    });
  });
});