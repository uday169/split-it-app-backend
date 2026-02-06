import request from 'supertest';
import app from '../../src/app';
import config from '../../src/config/config';

describe('CORS Configuration Tests', () => {
  describe('Health check endpoint', () => {
    it('should allow requests with no origin header (mobile apps)', async () => {
      const res = await request(app)
        .get('/health')
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('status', 'ok');
    });

    it('should allow requests from configured frontend URL', async () => {
      const res = await request(app)
        .get('/health')
        .set('Origin', config.frontendUrl)
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      // CORS header should be set for valid origin
      expect(res.headers['access-control-allow-origin']).toBe(config.frontendUrl);
    });

    it('should reject requests from unknown origins in non-development mode', async () => {
      const res = await request(app)
        .get('/health')
        .set('Origin', 'http://evil-website.com')
        .expect(200); // The request itself succeeds, but CORS header won't be set

      expect(res.body).toHaveProperty('success', true);
      // CORS header should NOT be set for invalid origin
      expect(res.headers['access-control-allow-origin']).toBeUndefined();
    });
  });
});
