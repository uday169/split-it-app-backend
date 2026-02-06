"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../src/app"));
const jwt_1 = require("../../src/utils/jwt");
const expense_repository_1 = __importDefault(require("../../src/repositories/expense.repository"));
const expenseSplit_repository_1 = __importDefault(require("../../src/repositories/expenseSplit.repository"));
const groupMember_repository_1 = __importDefault(require("../../src/repositories/groupMember.repository"));
const user_repository_1 = __importDefault(require("../../src/repositories/user.repository"));
const testData_1 = require("../helpers/testData");
require("../helpers/setup");
// Mock repositories
jest.mock('../../src/repositories/expense.repository');
jest.mock('../../src/repositories/expenseSplit.repository');
jest.mock('../../src/repositories/groupMember.repository');
jest.mock('../../src/repositories/user.repository');
describe('Expense API Integration Tests', () => {
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
    describe('POST /api/expenses', () => {
        const endpoint = '/api/expenses';
        it('should create expense with equal split', async () => {
            const newExpense = {
                groupId,
                description: 'Dinner',
                amount: 300,
                currency: 'USD',
                paidBy: userId,
                splitType: 'equal',
                splits: [
                    { userId: testData_1.mockUsers.user1.id },
                    { userId: testData_1.mockUsers.user2.id },
                    { userId: testData_1.mockUsers.user3.id },
                ],
            };
            expense_repository_1.default.create.mockResolvedValue({
                ...testData_1.mockExpense,
                ...newExpense,
                id: 'new-expense-id',
            });
            expenseSplit_repository_1.default.createMany.mockResolvedValue([
                { id: 'split-1', expenseId: 'new-expense-id', userId: testData_1.mockUsers.user1.id, amount: 100 },
                { id: 'split-2', expenseId: 'new-expense-id', userId: testData_1.mockUsers.user2.id, amount: 100 },
                { id: 'split-3', expenseId: 'new-expense-id', userId: testData_1.mockUsers.user3.id, amount: 100 },
            ]);
            const res = await (0, supertest_1.default)(app_1.default)
                .post(endpoint)
                .set('Authorization', `Bearer ${authToken}`)
                .send(newExpense)
                .expect('Content-Type', /json/)
                .expect(201);
            expect(res.body).toHaveProperty('success', true);
            expect(res.body.data).toHaveProperty('expense');
            expect(res.body.data).toHaveProperty('splits');
            expect(res.body.data.expense).toMatchObject({
                description: newExpense.description,
                amount: newExpense.amount,
            });
            expect(res.body.data.splits).toHaveLength(3);
        });
        it('should create expense with manual split', async () => {
            const newExpense = {
                groupId,
                description: 'Shopping',
                amount: 300,
                currency: 'USD',
                paidBy: userId,
                splitType: 'manual',
                splits: [
                    { userId: testData_1.mockUsers.user1.id, amount: 100 },
                    { userId: testData_1.mockUsers.user2.id, amount: 150 },
                    { userId: testData_1.mockUsers.user3.id, amount: 50 },
                ],
            };
            expense_repository_1.default.create.mockResolvedValue({
                ...testData_1.mockExpense,
                ...newExpense,
                id: 'new-expense-id',
            });
            expenseSplit_repository_1.default.createMany.mockResolvedValue([
                { id: 'split-1', expenseId: 'new-expense-id', userId: testData_1.mockUsers.user1.id, amount: 100 },
                { id: 'split-2', expenseId: 'new-expense-id', userId: testData_1.mockUsers.user2.id, amount: 150 },
                { id: 'split-3', expenseId: 'new-expense-id', userId: testData_1.mockUsers.user3.id, amount: 50 },
            ]);
            const res = await (0, supertest_1.default)(app_1.default)
                .post(endpoint)
                .set('Authorization', `Bearer ${authToken}`)
                .send(newExpense)
                .expect('Content-Type', /json/)
                .expect(201);
            expect(res.body).toHaveProperty('success', true);
            expect(res.body.data.splits).toHaveLength(3);
            expect(res.body.data.splits[0].amount).toBe(100);
            expect(res.body.data.splits[1].amount).toBe(150);
            expect(res.body.data.splits[2].amount).toBe(50);
        });
        it('should reject request without authentication', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post(endpoint)
                .send({
                groupId,
                description: 'Test',
                amount: 100,
                currency: 'USD',
                paidBy: userId,
                splitType: 'equal',
                splits: [{ userId }],
            })
                .expect('Content-Type', /json/)
                .expect(401);
            expect(res.body).toHaveProperty('success', false);
            expect(expense_repository_1.default.create).not.toHaveBeenCalled();
        });
        it('should reject invalid expense data', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post(endpoint)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                groupId,
                // Missing required fields
                description: 'Test',
            })
                .expect('Content-Type', /json/)
                .expect(400);
            expect(res.body).toHaveProperty('success', false);
            expect(expense_repository_1.default.create).not.toHaveBeenCalled();
        });
    });
    describe('GET /api/expenses/:groupId', () => {
        it('should return group expenses', async () => {
            const endpoint = `/api/expenses/${groupId}`;
            const expenses = [testData_1.mockExpense];
            expense_repository_1.default.findByGroupId.mockResolvedValue(expenses);
            const res = await (0, supertest_1.default)(app_1.default)
                .get(endpoint)
                .set('Authorization', `Bearer ${authToken}`)
                .expect('Content-Type', /json/)
                .expect(200);
            expect(res.body).toHaveProperty('success', true);
            expect(res.body.data).toBeInstanceOf(Array);
            expect(res.body.data).toHaveLength(1);
            expect(res.body.data[0]).toMatchObject({
                id: testData_1.mockExpense.id,
                description: testData_1.mockExpense.description,
            });
        });
        it('should return empty array when no expenses', async () => {
            const endpoint = `/api/expenses/${groupId}`;
            expense_repository_1.default.findByGroupId.mockResolvedValue([]);
            const res = await (0, supertest_1.default)(app_1.default)
                .get(endpoint)
                .set('Authorization', `Bearer ${authToken}`)
                .expect('Content-Type', /json/)
                .expect(200);
            expect(res.body).toHaveProperty('success', true);
            expect(res.body.data).toEqual([]);
        });
        it('should reject non-member access', async () => {
            const endpoint = `/api/expenses/${groupId}`;
            groupMember_repository_1.default.findByGroupAndUser.mockResolvedValue(null);
            const res = await (0, supertest_1.default)(app_1.default)
                .get(endpoint)
                .set('Authorization', `Bearer ${authToken}`)
                .expect('Content-Type', /json/)
                .expect(403);
            expect(res.body).toHaveProperty('success', false);
        });
    });
    describe('GET /api/expenses/detail/:id', () => {
        const expenseId = testData_1.mockExpense.id;
        const endpoint = `/api/expenses/detail/${expenseId}`;
        it('should return expense details with splits', async () => {
            const splits = [
                { id: 'split-1', expenseId, userId: testData_1.mockUsers.user1.id, amount: 100 },
                { id: 'split-2', expenseId, userId: testData_1.mockUsers.user2.id, amount: 100 },
            ];
            expense_repository_1.default.findById.mockResolvedValue(testData_1.mockExpense);
            expenseSplit_repository_1.default.findByExpenseId.mockResolvedValue(splits);
            const res = await (0, supertest_1.default)(app_1.default)
                .get(endpoint)
                .set('Authorization', `Bearer ${authToken}`)
                .expect('Content-Type', /json/)
                .expect(200);
            expect(res.body).toHaveProperty('success', true);
            expect(res.body.data).toHaveProperty('expense');
            expect(res.body.data).toHaveProperty('splits');
            expect(res.body.data.splits).toHaveLength(2);
        });
        it('should return 404 for non-existent expense', async () => {
            expense_repository_1.default.findById.mockResolvedValue(null);
            const res = await (0, supertest_1.default)(app_1.default)
                .get(endpoint)
                .set('Authorization', `Bearer ${authToken}`)
                .expect('Content-Type', /json/)
                .expect(404);
            expect(res.body).toHaveProperty('success', false);
        });
    });
});
