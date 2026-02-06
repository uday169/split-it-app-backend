"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../src/app"));
const jwt_1 = require("../../src/utils/jwt");
const group_repository_1 = __importDefault(require("../../src/repositories/group.repository"));
const groupMember_repository_1 = __importDefault(require("../../src/repositories/groupMember.repository"));
const user_repository_1 = __importDefault(require("../../src/repositories/user.repository"));
const testData_1 = require("../helpers/testData");
require("../helpers/setup");
// Mock repositories
jest.mock('../../src/repositories/group.repository');
jest.mock('../../src/repositories/groupMember.repository');
jest.mock('../../src/repositories/user.repository');
describe('Group API Integration Tests', () => {
    const userId = testData_1.mockUsers.user1.id;
    const userEmail = testData_1.mockUsers.user1.email;
    let authToken;
    beforeEach(() => {
        jest.clearAllMocks();
        authToken = (0, jwt_1.generateToken)(userId, userEmail);
        user_repository_1.default.findById.mockResolvedValue(testData_1.mockUsers.user1);
    });
    describe('POST /api/groups', () => {
        const endpoint = '/api/groups';
        it('should create a new group', async () => {
            const newGroup = {
                name: 'New Group',
                description: 'Test group',
            };
            group_repository_1.default.create.mockResolvedValue({
                ...testData_1.mockGroup,
                ...newGroup,
                id: 'new-group-id',
            });
            groupMember_repository_1.default.create.mockResolvedValue({
                groupId: 'new-group-id',
                userId,
                role: 'admin',
            });
            const res = await (0, supertest_1.default)(app_1.default)
                .post(endpoint)
                .set('Authorization', `Bearer ${authToken}`)
                .send(newGroup)
                .expect('Content-Type', /json/)
                .expect(201);
            expect(res.body).toHaveProperty('success', true);
            expect(res.body.data).toHaveProperty('id');
            expect(res.body.data).toMatchObject({
                name: newGroup.name,
                description: newGroup.description,
            });
            expect(group_repository_1.default.create).toHaveBeenCalled();
        });
        it('should reject request without authentication', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post(endpoint)
                .send({ name: 'Test Group' })
                .expect('Content-Type', /json/)
                .expect(401);
            expect(res.body).toHaveProperty('success', false);
            expect(group_repository_1.default.create).not.toHaveBeenCalled();
        });
        it('should reject invalid group data', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post(endpoint)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ description: 'Missing name' })
                .expect('Content-Type', /json/)
                .expect(400);
            expect(res.body).toHaveProperty('success', false);
            expect(group_repository_1.default.create).not.toHaveBeenCalled();
        });
    });
    describe('GET /api/groups', () => {
        const endpoint = '/api/groups';
        it('should return user groups', async () => {
            const userGroups = [testData_1.mockGroup];
            group_repository_1.default.findByUserId.mockResolvedValue(userGroups);
            const res = await (0, supertest_1.default)(app_1.default)
                .get(endpoint)
                .set('Authorization', `Bearer ${authToken}`)
                .expect('Content-Type', /json/)
                .expect(200);
            expect(res.body).toHaveProperty('success', true);
            expect(res.body.data).toBeInstanceOf(Array);
            expect(res.body.data).toHaveLength(1);
            expect(res.body.data[0]).toMatchObject({
                id: testData_1.mockGroup.id,
                name: testData_1.mockGroup.name,
            });
        });
        it('should return empty array when user has no groups', async () => {
            group_repository_1.default.findByUserId.mockResolvedValue([]);
            const res = await (0, supertest_1.default)(app_1.default)
                .get(endpoint)
                .set('Authorization', `Bearer ${authToken}`)
                .expect('Content-Type', /json/)
                .expect(200);
            expect(res.body).toHaveProperty('success', true);
            expect(res.body.data).toEqual([]);
        });
        it('should reject request without authentication', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .get(endpoint)
                .expect('Content-Type', /json/)
                .expect(401);
            expect(res.body).toHaveProperty('success', false);
        });
    });
    describe('GET /api/groups/:id', () => {
        const groupId = testData_1.mockGroup.id;
        const endpoint = `/api/groups/${groupId}`;
        it('should return group details', async () => {
            group_repository_1.default.findById.mockResolvedValue(testData_1.mockGroup);
            groupMember_repository_1.default.findByGroupAndUser.mockResolvedValue({
                groupId,
                userId,
            });
            const res = await (0, supertest_1.default)(app_1.default)
                .get(endpoint)
                .set('Authorization', `Bearer ${authToken}`)
                .expect('Content-Type', /json/)
                .expect(200);
            expect(res.body).toHaveProperty('success', true);
            expect(res.body.data).toMatchObject({
                id: testData_1.mockGroup.id,
                name: testData_1.mockGroup.name,
            });
        });
        it('should return 404 for non-existent group', async () => {
            group_repository_1.default.findById.mockResolvedValue(null);
            const res = await (0, supertest_1.default)(app_1.default)
                .get(endpoint)
                .set('Authorization', `Bearer ${authToken}`)
                .expect('Content-Type', /json/)
                .expect(404);
            expect(res.body).toHaveProperty('success', false);
        });
        it('should return 403 for non-member', async () => {
            group_repository_1.default.findById.mockResolvedValue(testData_1.mockGroup);
            groupMember_repository_1.default.findByGroupAndUser.mockResolvedValue(null);
            const res = await (0, supertest_1.default)(app_1.default)
                .get(endpoint)
                .set('Authorization', `Bearer ${authToken}`)
                .expect('Content-Type', /json/)
                .expect(403);
            expect(res.body).toHaveProperty('success', false);
        });
    });
    describe('POST /api/groups/:id/members', () => {
        const groupId = testData_1.mockGroup.id;
        const endpoint = `/api/groups/${groupId}/members`;
        it('should add member to group', async () => {
            const newMemberEmail = testData_1.mockUsers.user2.email;
            group_repository_1.default.findById.mockResolvedValue(testData_1.mockGroup);
            groupMember_repository_1.default.findByGroupAndUser
                .mockResolvedValueOnce({ groupId, userId, role: 'admin' }) // Requester is admin
                .mockResolvedValueOnce(null); // New user not yet a member
            user_repository_1.default.findByEmail.mockResolvedValue(testData_1.mockUsers.user2);
            groupMember_repository_1.default.create.mockResolvedValue({
                groupId,
                userId: testData_1.mockUsers.user2.id,
                role: 'member',
            });
            const res = await (0, supertest_1.default)(app_1.default)
                .post(endpoint)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ email: newMemberEmail })
                .expect('Content-Type', /json/)
                .expect(201);
            expect(res.body).toHaveProperty('success', true);
            expect(groupMember_repository_1.default.create).toHaveBeenCalled();
        });
        it('should reject non-admin adding members', async () => {
            group_repository_1.default.findById.mockResolvedValue(testData_1.mockGroup);
            groupMember_repository_1.default.findByGroupAndUser.mockResolvedValue({
                groupId,
                userId,
                role: 'member',
            });
            const res = await (0, supertest_1.default)(app_1.default)
                .post(endpoint)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ email: testData_1.mockUsers.user2.email })
                .expect('Content-Type', /json/)
                .expect(403);
            expect(res.body).toHaveProperty('success', false);
        });
    });
});
