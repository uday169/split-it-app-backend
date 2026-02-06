"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_service_1 = require("../../../src/services/auth.service");
const otp_repository_1 = __importDefault(require("../../../src/repositories/otp.repository"));
const user_repository_1 = __importDefault(require("../../../src/repositories/user.repository"));
const email_service_1 = __importDefault(require("../../../src/services/email.service"));
const testData_1 = require("../../helpers/testData");
require("../../helpers/setup");
// Mock repositories
jest.mock('../../../src/repositories/otp.repository');
jest.mock('../../../src/repositories/user.repository');
describe('AuthService', () => {
    let authService;
    beforeEach(() => {
        authService = new auth_service_1.AuthService();
        jest.clearAllMocks();
    });
    describe('sendOtp', () => {
        const testEmail = testData_1.mockUsers.user1.email;
        it('should successfully send OTP for new request', async () => {
            // Mock rate limit check
            otp_repository_1.default.countRecentAttempts.mockResolvedValue(0);
            otp_repository_1.default.create.mockResolvedValue({ id: 'otp-1' });
            email_service_1.default.sendOtpEmail.mockResolvedValue(undefined);
            await authService.sendOtp(testEmail);
            expect(otp_repository_1.default.countRecentAttempts).toHaveBeenCalledWith(testEmail, 15);
            expect(otp_repository_1.default.create).toHaveBeenCalledWith(expect.objectContaining({
                email: testEmail,
                otp: expect.stringMatching(/^\d{6}$/),
                attempts: 0,
                verified: false,
            }));
            expect(email_service_1.default.sendOtpEmail).toHaveBeenCalledWith(testEmail, expect.stringMatching(/^\d{6}$/));
        });
        it('should throw error when rate limited', async () => {
            otp_repository_1.default.countRecentAttempts.mockResolvedValue(3);
            await expect(authService.sendOtp(testEmail)).rejects.toMatchObject({
                statusCode: 429,
                code: 'OTP_RATE_LIMIT',
            });
            expect(otp_repository_1.default.create).not.toHaveBeenCalled();
            expect(email_service_1.default.sendOtpEmail).not.toHaveBeenCalled();
        });
        it('should throw error when email sending fails', async () => {
            otp_repository_1.default.countRecentAttempts.mockResolvedValue(0);
            otp_repository_1.default.create.mockResolvedValue({ id: 'otp-1' });
            email_service_1.default.sendOtpEmail.mockRejectedValue(new Error('Email service error'));
            await expect(authService.sendOtp(testEmail)).rejects.toMatchObject({
                statusCode: 500,
                code: 'EMAIL_SEND_FAILED',
            });
        });
    });
    describe('verifyOtp', () => {
        const testEmail = testData_1.mockUsers.user1.email;
        const testOtp = '123456';
        it('should successfully verify valid OTP and create new user', async () => {
            const otpRecord = (0, testData_1.createMockOtpRecord)({
                email: testEmail,
                otp: testOtp,
                verified: false,
                attempts: 0,
            });
            otp_repository_1.default.findLatestByEmail.mockResolvedValue(otpRecord);
            otp_repository_1.default.update.mockResolvedValue(undefined);
            user_repository_1.default.findByEmail.mockResolvedValue(null);
            user_repository_1.default.create.mockResolvedValue(testData_1.mockUsers.user1);
            const result = await authService.verifyOtp(testEmail, testOtp);
            expect(result).toHaveProperty('token');
            expect(result).toHaveProperty('user');
            expect(result.user).toMatchObject({
                id: testData_1.mockUsers.user1.id,
                email: testData_1.mockUsers.user1.email,
            });
            expect(otp_repository_1.default.update).toHaveBeenCalledWith(otpRecord.id, {
                verified: true,
            });
            expect(user_repository_1.default.create).toHaveBeenCalled();
        });
        it('should successfully verify valid OTP for existing user', async () => {
            const otpRecord = (0, testData_1.createMockOtpRecord)({
                email: testEmail,
                otp: testOtp,
                verified: false,
                attempts: 0,
            });
            otp_repository_1.default.findLatestByEmail.mockResolvedValue(otpRecord);
            otp_repository_1.default.update.mockResolvedValue(undefined);
            user_repository_1.default.findByEmail.mockResolvedValue(testData_1.mockUsers.user1);
            const result = await authService.verifyOtp(testEmail, testOtp);
            expect(result).toHaveProperty('token');
            expect(result).toHaveProperty('user');
            expect(user_repository_1.default.create).not.toHaveBeenCalled();
        });
        it('should throw error when OTP not found', async () => {
            otp_repository_1.default.findLatestByEmail.mockResolvedValue(null);
            await expect(authService.verifyOtp(testEmail, testOtp)).rejects.toMatchObject({
                statusCode: 400,
                code: 'OTP_NOT_FOUND',
            });
        });
        it('should throw error when OTP already used', async () => {
            const otpRecord = (0, testData_1.createMockOtpRecord)({
                verified: true,
            });
            otp_repository_1.default.findLatestByEmail.mockResolvedValue(otpRecord);
            await expect(authService.verifyOtp(testEmail, testOtp)).rejects.toMatchObject({
                statusCode: 400,
                code: 'OTP_ALREADY_USED',
            });
        });
        it('should throw error when OTP expired', async () => {
            const otpRecord = (0, testData_1.createMockOtpRecord)({
                expiresAt: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
            });
            otp_repository_1.default.findLatestByEmail.mockResolvedValue(otpRecord);
            await expect(authService.verifyOtp(testEmail, testOtp)).rejects.toMatchObject({
                statusCode: 400,
                code: 'OTP_EXPIRED',
            });
        });
        it('should throw error when invalid OTP', async () => {
            const otpRecord = (0, testData_1.createMockOtpRecord)({
                otp: '999999',
                attempts: 0,
            });
            otp_repository_1.default.findLatestByEmail.mockResolvedValue(otpRecord);
            otp_repository_1.default.update.mockResolvedValue(undefined);
            await expect(authService.verifyOtp(testEmail, testOtp)).rejects.toMatchObject({
                statusCode: 400,
                code: 'INVALID_OTP',
            });
            expect(otp_repository_1.default.update).toHaveBeenCalledWith(otpRecord.id, {
                attempts: 1,
            });
        });
        it('should throw error when too many verification attempts', async () => {
            const otpRecord = (0, testData_1.createMockOtpRecord)({
                attempts: 5,
            });
            otp_repository_1.default.findLatestByEmail.mockResolvedValue(otpRecord);
            await expect(authService.verifyOtp(testEmail, testOtp)).rejects.toMatchObject({
                statusCode: 429,
                code: 'TOO_MANY_ATTEMPTS',
            });
        });
    });
});
