"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_1 = require("../../../src/utils/jwt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("../../helpers/setup");
// Get mocked config
const config = require('../../../src/config/config').default;
describe('JWT Utils', () => {
    const testUserId = 'user-123';
    const testEmail = 'test@example.com';
    describe('generateToken', () => {
        it('should generate a valid JWT token', () => {
            const token = (0, jwt_1.generateToken)(testUserId, testEmail);
            expect(typeof token).toBe('string');
            expect(token.length).toBeGreaterThan(0);
            expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
        });
        it('should include userId and email in payload', () => {
            const token = (0, jwt_1.generateToken)(testUserId, testEmail);
            const decoded = jsonwebtoken_1.default.decode(token);
            expect(decoded.userId).toBe(testUserId);
            expect(decoded.email).toBe(testEmail);
        });
        it('should set expiration time', () => {
            const token = (0, jwt_1.generateToken)(testUserId, testEmail);
            const decoded = jsonwebtoken_1.default.decode(token);
            expect(decoded.exp).toBeDefined();
            expect(decoded.iat).toBeDefined();
            // Should expire in approximately 30 days
            const expiresInSeconds = decoded.exp - decoded.iat;
            const expectedSeconds = 30 * 24 * 60 * 60; // 30 days
            expect(expiresInSeconds).toBe(expectedSeconds);
        });
        it('should generate different tokens for different users', () => {
            const token1 = (0, jwt_1.generateToken)('user-1', 'user1@example.com');
            const token2 = (0, jwt_1.generateToken)('user-2', 'user2@example.com');
            expect(token1).not.toBe(token2);
        });
    });
    describe('verifyToken', () => {
        it('should verify and decode a valid token', () => {
            const token = (0, jwt_1.generateToken)(testUserId, testEmail);
            const payload = (0, jwt_1.verifyToken)(token);
            expect(payload.userId).toBe(testUserId);
            expect(payload.email).toBe(testEmail);
        });
        it('should throw error for invalid token', () => {
            const invalidToken = 'invalid.token.here';
            expect(() => (0, jwt_1.verifyToken)(invalidToken)).toThrow();
        });
        it('should throw error for tampered token', () => {
            const token = (0, jwt_1.generateToken)(testUserId, testEmail);
            const tamperedToken = token.slice(0, -5) + 'xxxxx'; // Tamper with signature
            expect(() => (0, jwt_1.verifyToken)(tamperedToken)).toThrow();
        });
        it('should throw error for expired token', () => {
            // Create a token that expires immediately
            const expiredToken = jsonwebtoken_1.default.sign({ userId: testUserId, email: testEmail }, config.jwtSecret, { expiresIn: '0s' });
            // Wait a bit to ensure expiration
            setTimeout(() => {
                expect(() => (0, jwt_1.verifyToken)(expiredToken)).toThrow();
            }, 100);
        });
        it('should throw error for token with wrong secret', () => {
            const wrongSecretToken = jsonwebtoken_1.default.sign({ userId: testUserId, email: testEmail }, 'wrong-secret', { expiresIn: '30d' });
            expect(() => (0, jwt_1.verifyToken)(wrongSecretToken)).toThrow();
        });
    });
    describe('token lifecycle', () => {
        it('should create and verify token in full cycle', () => {
            // Generate token
            const token = (0, jwt_1.generateToken)(testUserId, testEmail);
            // Verify it immediately
            const payload = (0, jwt_1.verifyToken)(token);
            // Check payload matches
            expect(payload.userId).toBe(testUserId);
            expect(payload.email).toBe(testEmail);
            expect(payload.exp).toBeDefined();
            expect(payload.iat).toBeDefined();
        });
    });
});
