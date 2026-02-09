const request = require('supertest');
const app = require('../../src/app.js');
const { sequelize } = require('../../src/models/index.js');
const { getAuthToken } = require('../utils/test.js');

// Dynamic dates to avoid tests failing in the future
const now = new Date();
const nextYear = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()).toISOString();
const nextWeek = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000)).toISOString();

describe('SSL Certificate Endpoints', () => {
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
        service_name: 'HTTPS Service',
        url: 'https://example.com',
        service_type: 'web',
        status: 'running'
      });
    
    testService = serviceRes.body.data;
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /api/ssl-certificates', () => {
    it('should create a new SSL certificate', async () => {
      const response = await request(app)
        .post('/api/ssl-certificates')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          service_id: testService.id,
          domain: 'example.com',
          issuer: 'Let\'s Encrypt',
          certificate_type: "Let's Encrypt",
          issue_date: now,
          expiration_date: nextYear,
          status: 'valid'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .post('/api/ssl-certificates')
        .send({
          service_id: testService.id,
          domain: 'example.com',
          certificate_type: "Let's Encrypt",
          issue_date: now,
          expiration_date: nextYear,
          status: 'valid'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should fail with missing required fields', async () => {
      const response = await request(app)
        .post('/api/ssl-certificates')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          service_id: testService.id,
          domain: 'example.com'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

  describe('GET /api/ssl-certificates', () => {
    beforeEach(async () => {
      // Create multiple SSL certificates
      await request(app)
        .post('/api/ssl-certificates')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          service_id: testService.id,
          domain: 'example.com',
          issuer: 'DigiCert',
          certificate_type: "Let's Encrypt",
          issue_date: now,
          expiration_date: nextYear,
          status: 'valid'
        });

      await request(app)
        .post('/api/ssl-certificates')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          service_id: testService.id,
          domain: 'api.example.com',
          issuer: 'DigiCert',
          certificate_type: "Let's Encrypt",
          issue_date: now,
          expiration_date: nextWeek,
          status: 'expiring_soon'
        });

      await request(app)
        .post('/api/ssl-certificates')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          service_id: testService.id,
          domain: 'old.example.com',
          issuer: 'Comodo',
          certificate_type: "Let's Encrypt",
          issue_date: now,
          expiration_date: nextWeek,
          status: 'expired'
        });
    });

    it('should get all SSL certificates for authenticated user', async () => {
      const response = await request(app)
        .get('/api/ssl-certificates')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThanOrEqual(3);
    });

    it('should filter certificates by status', async () => {
      const response = await request(app)
        .get('/api/ssl-certificates?status=valid')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      response.body.data.forEach(cert => {
        expect(cert.status).toBe('valid');
      });
    });

    it('should filter certificates by service_id', async () => {
      const response = await request(app)
        .get(`/api/ssl-certificates?service_id=${testService.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      response.body.data.forEach(cert => {
        expect(cert.service_id).toBe(testService.id);
      });
    });

    it('should get expiring certificates', async () => {
      const response = await request(app)
        .get('/api/ssl-certificates/expiring')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      // Should include certificates expiring soon or expired
      response.body.data.forEach(cert => {
        expect(['expiring_soon', 'expired']).toContain(cert.status);
      });
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .get('/api/ssl-certificates');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/ssl-certificates/:id', () => {
    let certId;

    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/api/ssl-certificates')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          service_id: testService.id,
          domain: 'test.example.com',
          issuer: 'Let\'s Encrypt',
          certificate_type: "Let's Encrypt",
          issue_date: now,
          expiration_date: nextYear,
          status: 'valid'
        });
      certId = createResponse.body.data.id;
    });

    it('should get SSL certificate by id', async () => {
      const response = await request(app)
        .get(`/api/ssl-certificates/${certId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id', certId);
      expect(response.body.data).toHaveProperty('domain', 'test.example.com');
    });

    it('should return 404 for non-existent certificate', async () => {
      const response = await request(app)
        .get('/api/ssl-certificates/99999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .get(`/api/ssl-certificates/${certId}`);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/ssl-certificates/:id', () => {
    let certId;

    // Creates a certificate to be used in tests
    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/api/ssl-certificates')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          service_id: testService.id,
          domain: 'update.example.com',
          issuer: 'DigiCert',
          certificate_type: "Let's Encrypt",
          issue_date: now,
          expiration_date: nextYear,
          status: 'valid'
        });
      certId = createResponse.body.data.id;
    });

    it('should update SSL certificate', async () => {
      const response = await request(app)
        .put(`/api/ssl-certificates/${certId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          expiration_date: nextWeek,
          status: 'expiring_soon',
          auto_renewal_enabled: true,
          issuer: 'Let\'s Encrypt'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('status', 'expiring_soon');
      expect(response.body.data).toHaveProperty('auto_renewal_enabled', true);
      expect(response.body.data).toHaveProperty('issuer', 'Let\'s Encrypt');
    });

    it('should renew certificate (update expiry date)', async () => {
      const newExpiryDate = nextYear;
      const response = await request(app)
        .put(`/api/ssl-certificates/${certId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          expiration_date: newExpiryDate,
          issue_date: now,
          status: 'valid'
        });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('status', 'valid');
      expect(new Date(response.body.data.expiration_date).getTime())
        .toBe(new Date(newExpiryDate).getTime());
    });

    it('should fail with invalid status', async () => {
      const response = await request(app)
        .put(`/api/ssl-certificates/${certId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          status: 'invalid'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should return 404 for non-existent certificate', async () => {
      const response = await request(app)
        .put('/api/ssl-certificates/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          status: 'valid'
        });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/ssl-certificates/:id', () => {
    let certId;

    // Creates a certificate to be used in tests
    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/api/ssl-certificates')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          service_id: testService.id,
          domain: 'delete.example.com',
          issuer: 'DigiCert',
          certificate_type: "Let's Encrypt",
          issue_date: now,
          expiration_date: nextYear,
          status: 'valid'
        });
      certId = createResponse.body.data.id;
    });

    it('should delete SSL certificate', async () => {
      const response = await request(app)
        .delete(`/api/ssl-certificates/${certId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // Verify certificate is deleted
      const getResponse = await request(app)
        .get(`/api/ssl-certificates/${certId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(getResponse.status).toBe(404);
    });

    it('should return 404 for non-existent certificate', async () => {
      const response = await request(app)
        .delete('/api/ssl-certificates/99999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    it('should not allow a user to delete another users SSL certificate', async () => {
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
        .delete(`/api/ssl-certificates/${certId}`)
        .set('Authorization', `Bearer ${hackerToken}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });
  });
});
});