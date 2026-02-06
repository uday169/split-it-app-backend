import { AuthService } from '../../../src/services/auth.service';
import otpRepository from '../../../src/repositories/otp.repository';
import userRepository from '../../../src/repositories/user.repository';
import emailService from '../../../src/services/email.service';
import { generateOtp, getOtpExpiryTime } from '../../../src/utils/otp';
import { mockUsers, createMockOtpRecord, createMockUser } from '../../helpers/testData';
import '../../helpers/setup';

// Mock repositories
jest.mock('../../../src/repositories/otp.repository');
jest.mock('../../../src/repositories/user.repository');

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
    jest.clearAllMocks();
  });

  describe('sendOtp', () => {
    const testEmail = mockUsers.user1.email;

    it('should successfully send OTP for new request', async () => {
      // Mock rate limit check
      (otpRepository.countRecentAttempts as jest.Mock).mockResolvedValue(0);
      (otpRepository.create as jest.Mock).mockResolvedValue({ id: 'otp-1' });
      (emailService.sendOtpEmail as jest.Mock).mockResolvedValue(undefined);

      await authService.sendOtp(testEmail);

      expect(otpRepository.countRecentAttempts).toHaveBeenCalledWith(testEmail, 15);
      expect(otpRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: testEmail,
          otp: expect.stringMatching(/^\d{6}$/),
          attempts: 0,
          verified: false,
        })
      );
      expect(emailService.sendOtpEmail).toHaveBeenCalledWith(
        testEmail,
        expect.stringMatching(/^\d{6}$/)
      );
    });

    it('should throw error when rate limited', async () => {
      (otpRepository.countRecentAttempts as jest.Mock).mockResolvedValue(3);

      await expect(authService.sendOtp(testEmail)).rejects.toMatchObject({
        statusCode: 429,
        code: 'OTP_RATE_LIMIT',
      });

      expect(otpRepository.create).not.toHaveBeenCalled();
      expect(emailService.sendOtpEmail).not.toHaveBeenCalled();
    });

    it('should throw error when email sending fails', async () => {
      (otpRepository.countRecentAttempts as jest.Mock).mockResolvedValue(0);
      (otpRepository.create as jest.Mock).mockResolvedValue({ id: 'otp-1' });
      (emailService.sendOtpEmail as jest.Mock).mockRejectedValue(
        new Error('Email service error')
      );

      await expect(authService.sendOtp(testEmail)).rejects.toMatchObject({
        statusCode: 500,
        code: 'EMAIL_SEND_FAILED',
      });
    });
  });

  describe('verifyOtp', () => {
    const testEmail = mockUsers.user1.email;
    const testOtp = '123456';

    it('should successfully verify valid OTP and create new user', async () => {
      const otpRecord = createMockOtpRecord({
        email: testEmail,
        otp: testOtp,
        verified: false,
        attempts: 0,
      });

      (otpRepository.findLatestByEmail as jest.Mock).mockResolvedValue(otpRecord);
      (otpRepository.update as jest.Mock).mockResolvedValue(undefined);
      (userRepository.findByEmail as jest.Mock).mockResolvedValue(null);
      (userRepository.create as jest.Mock).mockResolvedValue(mockUsers.user1);

      const result = await authService.verifyOtp(testEmail, testOtp);

      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('user');
      expect(result.user).toMatchObject({
        id: mockUsers.user1.id,
        email: mockUsers.user1.email,
      });
      expect(otpRepository.update).toHaveBeenCalledWith(otpRecord.id, {
        verified: true,
      });
      expect(userRepository.create).toHaveBeenCalled();
    });

    it('should successfully verify valid OTP for existing user', async () => {
      const otpRecord = createMockOtpRecord({
        email: testEmail,
        otp: testOtp,
        verified: false,
        attempts: 0,
      });

      (otpRepository.findLatestByEmail as jest.Mock).mockResolvedValue(otpRecord);
      (otpRepository.update as jest.Mock).mockResolvedValue(undefined);
      (userRepository.findByEmail as jest.Mock).mockResolvedValue(mockUsers.user1);

      const result = await authService.verifyOtp(testEmail, testOtp);

      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('user');
      expect(userRepository.create).not.toHaveBeenCalled();
    });

    it('should throw error when OTP not found', async () => {
      (otpRepository.findLatestByEmail as jest.Mock).mockResolvedValue(null);

      await expect(authService.verifyOtp(testEmail, testOtp)).rejects.toMatchObject({
        statusCode: 400,
        code: 'OTP_NOT_FOUND',
      });
    });

    it('should throw error when OTP already used', async () => {
      const otpRecord = createMockOtpRecord({
        verified: true,
      });

      (otpRepository.findLatestByEmail as jest.Mock).mockResolvedValue(otpRecord);

      await expect(authService.verifyOtp(testEmail, testOtp)).rejects.toMatchObject({
        statusCode: 400,
        code: 'OTP_ALREADY_USED',
      });
    });

    it('should throw error when OTP expired', async () => {
      const otpRecord = createMockOtpRecord({
        expiresAt: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
      });

      (otpRepository.findLatestByEmail as jest.Mock).mockResolvedValue(otpRecord);

      await expect(authService.verifyOtp(testEmail, testOtp)).rejects.toMatchObject({
        statusCode: 400,
        code: 'OTP_EXPIRED',
      });
    });

    it('should throw error when invalid OTP', async () => {
      const otpRecord = createMockOtpRecord({
        otp: '999999',
        attempts: 0,
      });

      (otpRepository.findLatestByEmail as jest.Mock).mockResolvedValue(otpRecord);
      (otpRepository.update as jest.Mock).mockResolvedValue(undefined);

      await expect(authService.verifyOtp(testEmail, testOtp)).rejects.toMatchObject({
        statusCode: 400,
        code: 'INVALID_OTP',
      });

      expect(otpRepository.update).toHaveBeenCalledWith(otpRecord.id, {
        attempts: 1,
      });
    });

    it('should throw error when too many verification attempts', async () => {
      const otpRecord = createMockOtpRecord({
        attempts: 5,
      });

      (otpRepository.findLatestByEmail as jest.Mock).mockResolvedValue(otpRecord);

      await expect(authService.verifyOtp(testEmail, testOtp)).rejects.toMatchObject({
        statusCode: 429,
        code: 'TOO_MANY_ATTEMPTS',
      });
    });
  });
});
