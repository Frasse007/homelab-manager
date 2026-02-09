const request = require('supertest');
const app = require('../../src/app.js');
const { sequelize } = require('../../src/models/index.js');
const { getAuthToken } = require('../utils/test.js');

describe('Maintenance Log Endpoints', () => {
  let authToken;
  let testService;

  beforeEach(async () => {
    // Create and login a test user
    const auth = await getAuthToken();
    authToken = auth.token;

    // Create a test service
    const serviceRes = await request(app)
      .post('/api/services')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        service_name: 'Service Under Maintenance',
        url: 'http://192.168.1.200:3000',
        service_type: 'other',
        status: 'running'
      });
    
    testService = serviceRes.body.data;
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /api/maintenance-logs', () => {
    it('should create a new maintenance log with all required fields', async () => {
      const response = await request(app)
        .post('/api/maintenance-logs')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          service_id: testService.id,
          maintenance_type: 'Update',
          title: 'System update to version 2.0',
          description: 'Upgrading system from version 1.5 to 2.0'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('maintenance_type', 'Update');
      expect(response.body.data).toHaveProperty('title', 'System update to version 2.0');
      expect(response.body.data).toHaveProperty('service_id', testService.id);
      expect(response.body.data).toHaveProperty('success', true);
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .post('/api/maintenance-logs')
        .send({
          service_id: testService.id,
          maintenance_type: 'Update',
          title: 'Test maintenance',
          description: 'Test'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should fail with invalid maintenance type', async () => {
      const response = await request(app)
        .post('/api/maintenance-logs')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          service_id: testService.id,
          maintenance_type: 'invalid_type',
          title: 'Test',
          description: 'Test description'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should fail with missing title', async () => {
      const response = await request(app)
        .post('/api/maintenance-logs')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          service_id: testService.id,
          maintenance_type: 'Backup',
          description: 'Test description'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should fail with non-existent service_id', async () => {
      const response = await request(app)
        .post('/api/maintenance-logs')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          service_id: 99999,
          maintenance_type: 'Update',
          title: 'Test',
          description: 'Test'
        });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    it('should create maintenance log with all optional fields', async () => {
      const response = await request(app)
        .post('/api/maintenance-logs')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          service_id: testService.id,
          maintenance_type: 'Security Patch',
          title: 'Apply critical security patch',
          description: 'Patching CVE-2024-1234',
          maintenance_date: '2024-03-16T02:00:00Z',
          downtime_minutes: 30,
          version_before: '1.5.2',
          version_after: '1.5.3',
          success: true,
          notes: 'Patch applied successfully with no issues'
        });

      expect(response.status).toBe(201);
      expect(response.body.data).toHaveProperty('downtime_minutes', 30);
      expect(response.body.data).toHaveProperty('version_before', '1.5.2');
      expect(response.body.data).toHaveProperty('version_after', '1.5.3');
      expect(response.body.data).toHaveProperty('notes', 'Patch applied successfully with no issues');
    });

    it('should fail with negative downtime_minutes', async () => {
      const response = await request(app)
        .post('/api/maintenance-logs')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          service_id: testService.id,
          maintenance_type: 'Restart',
          title: 'Server restart',
          description: 'Scheduled restart',
          downtime_minutes: -5
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should accept all valid maintenance types', async () => {
      const types = ['Update', 'Backup', 'Security Patch', 'Configuration Change', 'Restart', 'Other'];
      
      for (const type of types) {
        const response = await request(app)
          .post('/api/maintenance-logs')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            service_id: testService.id,
            maintenance_type: type,
            title: `${type} maintenance`,
            description: `Testing ${type} maintenance type`
          });

        expect(response.status).toBe(201);
        expect(response.body.data).toHaveProperty('maintenance_type', type);
      }
    });
  });

  describe('GET /api/maintenance-logs', () => {
    // Creates multiple maintenance logs for use in tests
    beforeEach(async () => {
      await request(app)
        .post('/api/maintenance-logs')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          service_id: testService.id,
          maintenance_type: 'Security Patch',
          title: 'Security patch applied',
          description: 'Applied latest security patches'
        });

      await request(app)
        .post('/api/maintenance-logs')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          service_id: testService.id,
          maintenance_type: 'Backup',
          title: 'Daily backup',
          description: 'Automated daily backup'
        });

      await request(app)
        .post('/api/maintenance-logs')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          service_id: testService.id,
          maintenance_type: 'Restart',
          title: 'Scheduled restart',
          description: 'Monthly scheduled restart'
        });
    });

    it('should get all maintenance logs for authenticated user', async () => {
      const response = await request(app)
        .get('/api/maintenance-logs')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThanOrEqual(3);
    });

    it('should filter maintenance logs by type', async () => {
      const response = await request(app)
        .get('/api/maintenance-logs?maintenance_type=Security Patch')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      response.body.data.forEach(log => {
        expect(log.maintenance_type).toBe('Security Patch');
      });
    });

    it('should filter maintenance logs by service_id', async () => {
      const response = await request(app)
        .get(`/api/maintenance-logs?service_id=${testService.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      response.body.data.forEach(log => {
        expect(log.service_id).toBe(testService.id);
      });
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .get('/api/maintenance-logs');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/maintenance-logs/:id', () => {
    let logId;
    // Creates maintenance log for use in tests
    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/api/maintenance-logs')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          service_id: testService.id,
          maintenance_type: 'Configuration Change',
          title: 'Update configuration',
          description: 'Updated system configuration'
        });
      logId = createResponse.body.data.id;
    });

    it('should get maintenance log by id', async () => {
      const response = await request(app)
        .get(`/api/maintenance-logs/${logId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id', logId);
      expect(response.body.data).toHaveProperty('title', 'Update configuration');
    });

    it('should return 404 for non-existent log', async () => {
      const response = await request(app)
        .get('/api/maintenance-logs/99999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .get(`/api/maintenance-logs/${logId}`);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/maintenance-logs/:id', () => {
    let logId;
    // Creates maintenance log for use in tests
    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/api/maintenance-logs')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          service_id: testService.id,
          maintenance_type: 'Other',
          title: 'Log for delete test',
          description: 'This log will be deleted'
        });
      logId = createResponse.body.data.id;
    });

    it('should delete maintenance log', async () => {
      const response = await request(app)
        .delete(`/api/maintenance-logs/${logId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // Verifies log is deleted
      const getResponse = await request(app)
        .get(`/api/maintenance-logs/${logId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(getResponse.status).toBe(404);
    });

    it('should return 404 for non-existent log', async () => {
      const response = await request(app)
        .delete('/api/maintenance-logs/99999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    it('should not allow a user to delete another users maintenance log', async () => {
      // Creates and logs in the hacker user
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
      // Tests if hacker can delete other users maintenance logs
      const response = await request(app)
        .delete(`/api/maintenance-logs/${logId}`)
        .set('Authorization', `Bearer ${hackerToken}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });
  });
});