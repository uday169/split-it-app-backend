"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../src/app"));
const otp_repository_1 = __importDefault(require("../../src/repositories/otp.repository"));
const user_repository_1 = __importDefault(require("../../src/repositories/user.repository"));
const email_service_1 = __importDefault(require("../../src/services/email.service"));
const testData_1 = require("../helpers/testData");
require("../helpers/setup");
// Mock repositories
jest.mock('../../src/repositories/otp.repository');
jest.mock('../../src/repositories/user.repository');
describe('Auth API Integration Tests', () => {
    describe('POST /api/auth/send-otp', () => {
        const endpoint = '/api/auth/send-otp';
        const validEmail = testData_1.mockUsers.user1.email;
        beforeEach(() => {
            jest.clearAllMocks();
            otp_repository_1.default.countRecentAttempts.mockResolvedValue(0);
            otp_repository_1.default.create.mockResolvedValue({ id: 'otp-1' });
            email_service_1.default.sendOtpEmail.mockResolvedValue(undefined);
        });
        it('should send OTP to valid email', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post(endpoint)
                .send({ email: validEmail })
                .expect('Content-Type', /json/)
                .expect(200);
            expect(res.body).toHaveProperty('success', true);
            expect(res.body).toHaveProperty('message');
            expect(otp_repository_1.default.create).toHaveBeenCalled();
            expect(email_service_1.default.sendOtpEmail).toHaveBeenCalledWith(validEmail, expect.stringMatching(/^\d{6}$/));
        });
        it('should reject invalid email format', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post(endpoint)
                .send({ email: 'invalid-email' })
                .expect('Content-Type', /json/)
                .expect(400);
            expect(res.body).toHaveProperty('success', false);
            expect(res.body).toHaveProperty('error');
            expect(otp_repository_1.default.create).not.toHaveBeenCalled();
        });
        it('should reject missing email', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post(endpoint)
                .send({})
                .expect('Content-Type', /json/)
                .expect(400);
            expect(res.body).toHaveProperty('success', false);
            expect(otp_repository_1.default.create).not.toHaveBeenCalled();
        });
        it('should rate limit OTP requests', async () => {
            otp_repository_1.default.countRecentAttempts.mockResolvedValue(3);
            const res = await (0, supertest_1.default)(app_1.default)
                .post(endpoint)
                .send({ email: validEmail })
                .expect('Content-Type', /json/)
                .expect(429);
            expect(res.body).toHaveProperty('success', false);
            expect(res.body).toHaveProperty('error');
            expect(otp_repository_1.default.create).not.toHaveBeenCalled();
            expect(email_service_1.default.sendOtpEmail).not.toHaveBeenCalled();
        });
        it('should handle email service failure gracefully', async () => {
            email_service_1.default.sendOtpEmail.mockRejectedValue(new Error('Email service down'));
            const res = await (0, supertest_1.default)(app_1.default)
                .post(endpoint)
                .send({ email: validEmail })
                .expect('Content-Type', /json/)
                .expect(500);
            expect(res.body).toHaveProperty('success', false);
            expect(res.body).toHaveProperty('error');
        });
    });
    describe('POST /api/auth/verify-otp', () => {
        const endpoint = '/api/auth/verify-otp';
        const validEmail = testData_1.mockUsers.user1.email;
        const validOtp = '123456';
        beforeEach(() => {
            jest.clearAllMocks();
        });
        it('should verify valid OTP and return token for existing user', async () => {
            const otpRecord = (0, testData_1.createMockOtpRecord)({
                email: validEmail,
                otp: validOtp,
                verified: false,
                attempts: 0,
            });
            otp_repository_1.default.findLatestByEmail.mockResolvedValue(otpRecord);
            otp_repository_1.default.update.mockResolvedValue(undefined);
            user_repository_1.default.findByEmail.mockResolvedValue(testData_1.mockUsers.user1);
            const res = await (0, supertest_1.default)(app_1.default)
                .post(endpoint)
                .send({ email: validEmail, otp: validOtp })
                .expect('Content-Type', /json/)
                .expect(200);
            expect(res.body).toHaveProperty('success', true);
            expect(res.body.data).toHaveProperty('token');
            expect(res.body.data).toHaveProperty('user');
            expect(res.body.data.user).toMatchObject({
                id: testData_1.mockUsers.user1.id,
                email: testData_1.mockUsers.user1.email,
            });
        });
        it('should verify valid OTP and create new user', async () => {
            const otpRecord = (0, testData_1.createMockOtpRecord)({
                email: validEmail,
                otp: validOtp,
                verified: false,
                attempts: 0,
            });
            otp_repository_1.default.findLatestByEmail.mockResolvedValue(otpRecord);
            otp_repository_1.default.update.mockResolvedValue(undefined);
            user_repository_1.default.findByEmail.mockResolvedValue(null);
            user_repository_1.default.create.mockResolvedValue(testData_1.mockUsers.user1);
            const res = await (0, supertest_1.default)(app_1.default)
                .post(endpoint)
                .send({ email: validEmail, otp: validOtp })
                .expect('Content-Type', /json/)
                .expect(200);
            expect(res.body).toHaveProperty('success', true);
            expect(res.body.data).toHaveProperty('token');
            expect(res.body.data).toHaveProperty('user');
            expect(user_repository_1.default.create).toHaveBeenCalled();
        });
        it('should reject invalid OTP', async () => {
            const otpRecord = (0, testData_1.createMockOtpRecord)({
                email: validEmail,
                otp: '999999',
                verified: false,
                attempts: 0,
            });
            otp_repository_1.default.findLatestByEmail.mockResolvedValue(otpRecord);
            otp_repository_1.default.update.mockResolvedValue(undefined);
            const res = await (0, supertest_1.default)(app_1.default)
                .post(endpoint)
                .send({ email: validEmail, otp: validOtp })
                .expect('Content-Type', /json/)
                .expect(400);
            expect(res.body).toHaveProperty('success', false);
            expect(res.body).toHaveProperty('error');
        });
        it('should reject expired OTP', async () => {
            const otpRecord = (0, testData_1.createMockOtpRecord)({
                email: validEmail,
                otp: validOtp,
                expiresAt: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
                verified: false,
                attempts: 0,
            });
            otp_repository_1.default.findLatestByEmail.mockResolvedValue(otpRecord);
            const res = await (0, supertest_1.default)(app_1.default)
                .post(endpoint)
                .send({ email: validEmail, otp: validOtp })
                .expect('Content-Type', /json/)
                .expect(400);
            expect(res.body).toHaveProperty('success', false);
            expect(res.body.error).toMatch(/expired/i);
        });
        it('should reject missing fields', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post(endpoint)
                .send({ email: validEmail })
                .expect('Content-Type', /json/)
                .expect(400);
            expect(res.body).toHaveProperty('success', false);
        });
    });
    describe('GET /health', () => {
        it('should return health status', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
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
