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

    it('should not set CORS header for unknown origins', async () => {
      const res = await request(app)
        .get('/health')
        .set('Origin', 'http://evil-website.com')
        .expect(200); // The request itself succeeds, but CORS header won't be set

      expect(res.body).toHaveProperty('success', true);
      // CORS header should NOT be set for invalid origin
      expect(res.headers['access-control-allow-origin']).toBeUndefined();
    });

    it('should allow requests from Android emulator (10.0.2.2) in development', async () => {
      const res = await request(app)
        .get('/health')
        .set('Origin', 'http://10.0.2.2:3000')
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      // CORS header should be set for Android emulator origin in development
      expect(res.headers['access-control-allow-origin']).toBe('http://10.0.2.2:3000');
    });

    it('should allow requests from local network IPs (192.168.x.x) in development', async () => {
      const res = await request(app)
        .get('/health')
        .set('Origin', 'http://192.168.1.100:3000')
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      // CORS header should be set for local network IP in development
      expect(res.headers['access-control-allow-origin']).toBe('http://192.168.1.100:3000');
    });

    it('should allow requests from local network IPs (10.x.x.x) in development', async () => {
      const res = await request(app)
        .get('/health')
        .set('Origin', 'http://10.1.2.3:8081')
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      // CORS header should be set for local network IP in development
      expect(res.headers['access-control-allow-origin']).toBe('http://10.1.2.3:8081');
    });
  });
});
