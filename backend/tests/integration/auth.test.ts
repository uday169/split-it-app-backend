import request from 'supertest';
import app from '../../src/app';
import otpRepository from '../../src/repositories/otp.repository';
import userRepository from '../../src/repositories/user.repository';
import emailService from '../../src/services/email.service';
import { mockUsers, createMockOtpRecord } from '../helpers/testData';
import '../helpers/setup';

// Mock repositories
jest.mock('../../src/repositories/otp.repository');
jest.mock('../../src/repositories/user.repository');

describe('Auth API Integration Tests', () => {
  describe('POST /api/v1/auth/send-otp', () => {
    const endpoint = '/api/v1/auth/send-otp';
    const validEmail = mockUsers.user1.email;

    beforeEach(() => {
      jest.clearAllMocks();
      (otpRepository.countRecentAttempts as jest.Mock).mockResolvedValue(0);
      (otpRepository.create as jest.Mock).mockResolvedValue({ id: 'otp-1' });
      (emailService.sendOtpEmail as jest.Mock).mockResolvedValue(undefined);
    });

    it('should send OTP to valid email', async () => {
      const res = await request(app)
        .post(endpoint)
        .send({ email: validEmail })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('message');
      expect(otpRepository.create).toHaveBeenCalled();
      expect(emailService.sendOtpEmail).toHaveBeenCalledWith(
        validEmail,
        expect.stringMatching(/^\d{6}$/)
      );
    });

    it('should reject invalid email format', async () => {
      const res = await request(app)
        .post(endpoint)
        .send({ email: 'invalid-email' })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('error');
      expect(otpRepository.create).not.toHaveBeenCalled();
    });

    it('should reject missing email', async () => {
      const res = await request(app)
        .post(endpoint)
        .send({})
        .expect('Content-Type', /json/)
        .expect(400);

      expect(res.body).toHaveProperty('success', false);
      expect(otpRepository.create).not.toHaveBeenCalled();
    });

    it('should rate limit OTP requests', async () => {
      (otpRepository.countRecentAttempts as jest.Mock).mockResolvedValue(3);

      const res = await request(app)
        .post(endpoint)
        .send({ email: validEmail })
        .expect('Content-Type', /json/)
        .expect(429);

      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('error');
      expect(otpRepository.create).not.toHaveBeenCalled();
      expect(emailService.sendOtpEmail).not.toHaveBeenCalled();
    });

    it('should handle email service failure gracefully', async () => {
      (emailService.sendOtpEmail as jest.Mock).mockRejectedValue(
        new Error('Email service down')
      );

      const res = await request(app)
        .post(endpoint)
        .send({ email: validEmail })
        .expect('Content-Type', /json/)
        .expect(500);

      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /api/v1/auth/verify-otp', () => {
    const endpoint = '/api/v1/auth/verify-otp';
    const validEmail = mockUsers.user1.email;
    const validOtp = '123456';

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should verify valid OTP and return token for existing user', async () => {
      const otpRecord = createMockOtpRecord({
        email: validEmail,
        otp: validOtp,
        verified: false,
        attempts: 0,
      });

      (otpRepository.findLatestByEmail as jest.Mock).mockResolvedValue(otpRecord);
      (otpRepository.update as jest.Mock).mockResolvedValue(undefined);
      (userRepository.findByEmail as jest.Mock).mockResolvedValue(mockUsers.user1);

      const res = await request(app)
        .post(endpoint)
        .send({ email: validEmail, otp: validOtp })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data).toHaveProperty('user');
      expect(res.body.data.user).toMatchObject({
        id: mockUsers.user1.id,
        email: mockUsers.user1.email,
      });
    });

    it('should verify valid OTP and create new user', async () => {
      const otpRecord = createMockOtpRecord({
        email: validEmail,
        otp: validOtp,
        verified: false,
        attempts: 0,
      });

      (otpRepository.findLatestByEmail as jest.Mock).mockResolvedValue(otpRecord);
      (otpRepository.update as jest.Mock).mockResolvedValue(undefined);
      (userRepository.findByEmail as jest.Mock).mockResolvedValue(null);
      (userRepository.create as jest.Mock).mockResolvedValue(mockUsers.user1);

      const res = await request(app)
        .post(endpoint)
        .send({ email: validEmail, otp: validOtp })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data).toHaveProperty('user');
      expect(userRepository.create).toHaveBeenCalled();
    });

    it('should reject invalid OTP', async () => {
      const otpRecord = createMockOtpRecord({
        email: validEmail,
        otp: '999999',
        verified: false,
        attempts: 0,
      });

      (otpRepository.findLatestByEmail as jest.Mock).mockResolvedValue(otpRecord);
      (otpRepository.update as jest.Mock).mockResolvedValue(undefined);

      const res = await request(app)
        .post(endpoint)
        .send({ email: validEmail, otp: validOtp })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('error');
    });

    it('should reject expired OTP', async () => {
      const otpRecord = createMockOtpRecord({
        email: validEmail,
        otp: validOtp,
        expiresAt: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
        verified: false,
        attempts: 0,
      });

      (otpRepository.findLatestByEmail as jest.Mock).mockResolvedValue(otpRecord);

      const res = await request(app)
        .post(endpoint)
        .send({ email: validEmail, otp: validOtp })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(res.body).toHaveProperty('success', false);
      expect(res.body.error).toMatch(/expired/i);
    });

    it('should reject missing fields', async () => {
      const res = await request(app)
        .post(endpoint)
        .send({ email: validEmail })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(res.body).toHaveProperty('success', false);
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const res = await request(app)
        .get('/health')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('status', 'ok');
      expect(res.body.data).toHaveProperty('timestamp');
      expect(res.body.data).toHaveProperty('environment');
    });
  });
});
