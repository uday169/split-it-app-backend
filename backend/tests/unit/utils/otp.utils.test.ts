import { generateOtp, isOtpExpired, getOtpExpiryTime } from '../../../src/utils/otp';

describe('OTP Utils', () => {
  describe('generateOtp', () => {
    it('should generate a 6-digit OTP', () => {
      const otp = generateOtp();
      expect(otp).toMatch(/^\d{6}$/);
      expect(otp.length).toBe(6);
    });

    it('should generate different OTPs on multiple calls', () => {
      const otp1 = generateOtp();
      const otp2 = generateOtp();
      const otp3 = generateOtp();

      // At least one should be different (probability of all same is negligible)
      const allSame = otp1 === otp2 && otp2 === otp3;
      expect(allSame).toBe(false);
    });

    it('should generate OTPs within valid range', () => {
      for (let i = 0; i < 100; i++) {
        const otp = generateOtp();
        const otpNum = parseInt(otp, 10);
        expect(otpNum).toBeGreaterThanOrEqual(100000);
        expect(otpNum).toBeLessThanOrEqual(999999);
      }
    });
  });

  describe('isOtpExpired', () => {
    it('should return false for future expiry time', () => {
      const futureTime = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
      expect(isOtpExpired(futureTime)).toBe(false);
    });

    it('should return true for past expiry time', () => {
      const pastTime = new Date(Date.now() - 10 * 60 * 1000); // 10 minutes ago
      expect(isOtpExpired(pastTime)).toBe(true);
    });

    it('should return true for current time', () => {
      const now = new Date(Date.now() - 1); // 1ms in the past to ensure it's expired
      const result = isOtpExpired(now);
      expect(result).toBe(true);
    });
  });

  describe('getOtpExpiryTime', () => {
    it('should return a time 10 minutes in the future', () => {
      const before = Date.now();
      const expiryTime = getOtpExpiryTime();
      const after = Date.now();

      const expectedMin = before + 10 * 60 * 1000;
      const expectedMax = after + 10 * 60 * 1000;

      expect(expiryTime.getTime()).toBeGreaterThanOrEqual(expectedMin);
      expect(expiryTime.getTime()).toBeLessThanOrEqual(expectedMax);
    });

    it('should not be expired immediately after creation', () => {
      const expiryTime = getOtpExpiryTime();
      expect(isOtpExpired(expiryTime)).toBe(false);
    });
  });
});
