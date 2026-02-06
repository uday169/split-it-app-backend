import { generateToken, verifyToken } from '../../../src/utils/jwt';
import jwt from 'jsonwebtoken';
import '../../helpers/setup';

// Get mocked config
const config = require('../../../src/config/config').default;

describe('JWT Utils', () => {
  const testUserId = 'user-123';
  const testEmail = 'test@example.com';

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const token = generateToken(testUserId, testEmail);

      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    it('should include userId and email in payload', () => {
      const token = generateToken(testUserId, testEmail);
      const decoded = jwt.decode(token) as any;

      expect(decoded.userId).toBe(testUserId);
      expect(decoded.email).toBe(testEmail);
    });

    it('should set expiration time', () => {
      const token = generateToken(testUserId, testEmail);
      const decoded = jwt.decode(token) as any;

      expect(decoded.exp).toBeDefined();
      expect(decoded.iat).toBeDefined();
      
      // Should expire in approximately 30 days
      const expiresInSeconds = decoded.exp - decoded.iat;
      const expectedSeconds = 30 * 24 * 60 * 60; // 30 days
      expect(expiresInSeconds).toBe(expectedSeconds);
    });

    it('should generate different tokens for different users', () => {
      const token1 = generateToken('user-1', 'user1@example.com');
      const token2 = generateToken('user-2', 'user2@example.com');

      expect(token1).not.toBe(token2);
    });
  });

  describe('verifyToken', () => {
    it('should verify and decode a valid token', () => {
      const token = generateToken(testUserId, testEmail);
      const payload = verifyToken(token);

      expect(payload.userId).toBe(testUserId);
      expect(payload.email).toBe(testEmail);
    });

    it('should throw error for invalid token', () => {
      const invalidToken = 'invalid.token.here';

      expect(() => verifyToken(invalidToken)).toThrow();
    });

    it('should throw error for tampered token', () => {
      const token = generateToken(testUserId, testEmail);
      const tamperedToken = token.slice(0, -5) + 'xxxxx'; // Tamper with signature

      expect(() => verifyToken(tamperedToken)).toThrow();
    });

    it('should throw error for expired token', () => {
      // Create a token that expires immediately
      const expiredToken = jwt.sign(
        { userId: testUserId, email: testEmail },
        config.jwtSecret,
        { expiresIn: '0s' }
      );

      // Wait a bit to ensure expiration
      setTimeout(() => {
        expect(() => verifyToken(expiredToken)).toThrow();
      }, 100);
    });

    it('should throw error for token with wrong secret', () => {
      const wrongSecretToken = jwt.sign(
        { userId: testUserId, email: testEmail },
        'wrong-secret',
        { expiresIn: '30d' }
      );

      expect(() => verifyToken(wrongSecretToken)).toThrow();
    });
  });

  describe('token lifecycle', () => {
    it('should create and verify token in full cycle', () => {
      // Generate token
      const token = generateToken(testUserId, testEmail);

      // Verify it immediately
      const payload = verifyToken(token);

      // Check payload matches
      expect(payload.userId).toBe(testUserId);
      expect(payload.email).toBe(testEmail);
      expect((payload as any).exp).toBeDefined();
      expect((payload as any).iat).toBeDefined();
    });
  });
});
