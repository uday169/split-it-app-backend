import { AppError } from '../middleware/errorHandler';
import otpRepository from '../repositories/otp.repository';
import userRepository from '../repositories/user.repository';
import emailService from './email.service';
import { generateOtp, getOtpExpiryTime, isOtpExpired } from '../utils/otp';
import { generateToken } from '../utils/jwt';
import logger from '../config/logger';

const MAX_OTP_ATTEMPTS = 3;
const OTP_RATE_LIMIT_MINUTES = 15;
const MAX_VERIFICATION_ATTEMPTS = 5;

export class AuthService {
  async sendOtp(email: string): Promise<void> {
    // Check rate limiting
    const recentAttempts = await otpRepository.countRecentAttempts(
      email,
      OTP_RATE_LIMIT_MINUTES
    );

    if (recentAttempts >= MAX_OTP_ATTEMPTS) {
      throw new AppError(
        429,
        `Too many OTP requests. Please try again in ${OTP_RATE_LIMIT_MINUTES} minutes.`,
        'OTP_RATE_LIMIT'
      );
    }

    // Generate OTP
    const otp = generateOtp();
    const expiresAt = getOtpExpiryTime();

    // Save OTP to database
    await otpRepository.create({
      email,
      otp,
      expiresAt,
      attempts: 0,
      verified: false,
      createdAt: new Date(),
    });

    // Send OTP email
    try {
      await emailService.sendOtpEmail(email, otp);
      logger.info(`OTP sent to ${email}`);
    } catch (error) {
      logger.error('Failed to send OTP email:', error);
      throw new AppError(500, 'Failed to send OTP. Please try again.', 'EMAIL_SEND_FAILED');
    }
  }

  async verifyOtp(email: string, otp: string): Promise<{ token: string; user: any }> {
    // Find latest OTP for this email
    const otpRecord = await otpRepository.findLatestByEmail(email);

    if (!otpRecord) {
      throw new AppError(400, 'No OTP found for this email', 'OTP_NOT_FOUND');
    }

    // Check if already verified
    if (otpRecord.verified) {
      throw new AppError(400, 'OTP already used', 'OTP_ALREADY_USED');
    }

    // Check if expired
    if (isOtpExpired(otpRecord.expiresAt)) {
      throw new AppError(400, 'OTP has expired. Please request a new one.', 'OTP_EXPIRED');
    }

    // Check attempts
    if (otpRecord.attempts >= MAX_VERIFICATION_ATTEMPTS) {
      throw new AppError(
        429,
        'Too many verification attempts. Please request a new OTP.',
        'TOO_MANY_ATTEMPTS'
      );
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      // Increment attempts
      await otpRepository.update(otpRecord.id, {
        attempts: otpRecord.attempts + 1,
      });

      throw new AppError(400, 'Invalid OTP', 'INVALID_OTP');
    }

    // Mark OTP as verified
    await otpRepository.update(otpRecord.id, {
      verified: true,
    });

    // Find or create user
    let user = await userRepository.findByEmail(email);

    if (!user) {
      user = await userRepository.create({
        email,
        name: email.split('@')[0], // Default name from email
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      logger.info(`New user created: ${user.id}`);
    }

    // Generate JWT token
    const token = generateToken(user.id, user.email);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }
}

export default new AuthService();
