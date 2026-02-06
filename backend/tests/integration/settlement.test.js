"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../src/app"));
const jwt_1 = require("../../src/utils/jwt");
const settlement_repository_1 = __importDefault(require("../../src/repositories/settlement.repository"));
const groupMember_repository_1 = __importDefault(require("../../src/repositories/groupMember.repository"));
const user_repository_1 = __importDefault(require("../../src/repositories/user.repository"));
const testData_1 = require("../helpers/testData");
require("../helpers/setup");
// Mock repositories
jest.mock('../../src/repositories/settlement.repository');
jest.mock('../../src/repositories/groupMember.repository');
jest.mock('../../src/repositories/user.repository');
describe('Settlement API Integration Tests', () => {
    const userId = testData_1.mockUsers.user1.id;
    const userEmail = testData_1.mockUsers.user1.email;
    const groupId = testData_1.mockGroup.id;
    let authToken;
    beforeEach(() => {
        jest.clearAllMocks();
        authToken = (0, jwt_1.generateToken)(userId, userEmail);
        user_repository_1.default.findById.mockResolvedValue(testData_1.mockUsers.user1);
        groupMember_repository_1.default.findByGroupAndUser.mockResolvedValue({
            groupId,
            userId,
        });
    });
    describe('POST /api/settlements', () => {
        const endpoint = '/api/settlements';
        it('should create a settlement', async () => {
            const newSettlement = {
                groupId,
                fromUserId: testData_1.mockUsers.user2.id,
                toUserId: testData_1.mockUsers.user1.id,
                amount: 50,
                currency: 'USD',
            };
            const mockSettlement = {
                id: 'settlement-1',
                ...newSettlement,
                createdAt: new Date(),
            };
            settlement_repository_1.default.create.mockResolvedValue(mockSettlement);
            const res = await (0, supertest_1.default)(app_1.default)
                .post(endpoint)
                .set('Authorization', `Bearer ${authToken}`)
                .send(newSettlement)
                .expect('Content-Type', /json/)
                .expect(201);
            expect(res.body).toHaveProperty('success', true);
            expect(res.body.data).toMatchObject({
                groupId,
                amount: 50,
            });
            expect(settlement_repository_1.default.create).toHaveBeenCalled();
        });
        it('should reject request without authentication', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post(endpoint)
                .send({
                groupId,
                fromUserId: userId,
                toUserId: testData_1.mockUsers.user2.id,
                amount: 50,
                currency: 'USD',
            })
                .expect('Content-Type', /json/)
                .expect(401);
            expect(res.body).toHaveProperty('success', false);
            expect(settlement_repository_1.default.create).not.toHaveBeenCalled();
        });
        it('should reject invalid settlement data', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post(endpoint)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                groupId,
                // Missing required fields
            })
                .expect('Content-Type', /json/)
                .expect(400);
            expect(res.body).toHaveProperty('success', false);
            expect(settlement_repository_1.default.create).not.toHaveBeenCalled();
        });
    });
    describe('GET /api/settlements/:groupId', () => {
        it('should return group settlements', async () => {
            const endpoint = `/api/settlements/${groupId}`;
            const settlements = [
                {
                    id: 'settlement-1',
                    groupId,
                    fromUserId: testData_1.mockUsers.user2.id,
                    toUserId: testData_1.mockUsers.user1.id,
                    amount: 50,
                    currency: 'USD',
                    createdAt: new Date(),
                },
            ];
            settlement_repository_1.default.findByGroupId.mockResolvedValue(settlements);
            const res = await (0, supertest_1.default)(app_1.default)
                .get(endpoint)
                .set('Authorization', `Bearer ${authToken}`)
                .expect('Content-Type', /json/)
                .expect(200);
            expect(res.body).toHaveProperty('success', true);
            expect(res.body.data).toBeInstanceOf(Array);
            expect(res.body.data).toHaveLength(1);
        });
        it('should return empty array when no settlements', async () => {
            const endpoint = `/api/settlements/${groupId}`;
            settlement_repository_1.default.findByGroupId.mockResolvedValue([]);
            const res = await (0, supertest_1.default)(app_1.default)
                .get(endpoint)
                .set('Authorization', `Bearer ${authToken}`)
                .expect('Content-Type', /json/)
                .expect(200);
            expect(res.body).toHaveProperty('success', true);
            expect(res.body.data).toEqual([]);
        });
        it('should reject non-member access', async () => {
            const endpoint = `/api/settlements/${groupId}`;
            groupMember_repository_1.default.findByGroupAndUser.mockResolvedValue(null);
            const res = await (0, supertest_1.default)(app_1.default)
                .get(endpoint)
                .set('Authorization', `Bearer ${authToken}`)
                .expect('Content-Type', /json/)
                .expect(403);
            expect(res.body).toHaveProperty('success', false);
        });
    });
});
