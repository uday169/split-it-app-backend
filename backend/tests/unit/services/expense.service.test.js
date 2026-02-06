"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const expense_service_1 = require("../../../src/services/expense.service");
const expense_repository_1 = __importDefault(require("../../../src/repositories/expense.repository"));
const expenseSplit_repository_1 = __importDefault(require("../../../src/repositories/expenseSplit.repository"));
const groupMember_repository_1 = __importDefault(require("../../../src/repositories/groupMember.repository"));
const testData_1 = require("../../helpers/testData");
require("../../helpers/setup");
// Mock repositories
jest.mock('../../../src/repositories/expense.repository');
jest.mock('../../../src/repositories/expenseSplit.repository');
jest.mock('../../../src/repositories/groupMember.repository');
describe('ExpenseService', () => {
    let expenseService;
    beforeEach(() => {
        expenseService = new expense_service_1.ExpenseService();
        jest.clearAllMocks();
    });
    describe('createExpense', () => {
        const groupId = testData_1.mockGroup.id;
        const userId = testData_1.mockUsers.user1.id;
        beforeEach(() => {
            // Mock all users as group members
            groupMember_repository_1.default.findByGroupAndUser.mockResolvedValue({
                groupId,
                userId,
            });
        });
        it('should create expense with equal split', async () => {
            const amount = 300;
            const splits = [
                { userId: testData_1.mockUsers.user1.id },
                { userId: testData_1.mockUsers.user2.id },
                { userId: testData_1.mockUsers.user3.id },
            ];
            const mockExpense = {
                id: 'expense-1',
                groupId,
                description: 'Dinner',
                amount,
                currency: 'USD',
                paidBy: userId,
                splitType: 'equal',
                date: new Date(),
            };
            expense_repository_1.default.create.mockResolvedValue(mockExpense);
            expenseSplit_repository_1.default.createMany.mockResolvedValue([
                { id: 'split-1', expenseId: mockExpense.id, userId: testData_1.mockUsers.user1.id, amount: 100 },
                { id: 'split-2', expenseId: mockExpense.id, userId: testData_1.mockUsers.user2.id, amount: 100 },
                { id: 'split-3', expenseId: mockExpense.id, userId: testData_1.mockUsers.user3.id, amount: 100 },
            ]);
            const result = await expenseService.createExpense(userId, groupId, 'Dinner', amount, 'USD', userId, 'equal', splits);
            expect(result.expense).toMatchObject({
                id: mockExpense.id,
                amount,
            });
            expect(result.splits).toHaveLength(3);
            expect(result.splits.every((s) => s.amount === 100)).toBe(true);
        });
        it('should create expense with manual split', async () => {
            const amount = 300;
            const splits = [
                { userId: testData_1.mockUsers.user1.id, amount: 100 },
                { userId: testData_1.mockUsers.user2.id, amount: 150 },
                { userId: testData_1.mockUsers.user3.id, amount: 50 },
            ];
            const mockExpense = {
                id: 'expense-1',
                groupId,
                description: 'Shopping',
                amount,
                currency: 'USD',
                paidBy: userId,
                splitType: 'manual',
                date: new Date(),
            };
            expense_repository_1.default.create.mockResolvedValue(mockExpense);
            expenseSplit_repository_1.default.createMany.mockResolvedValue(splits.map((s, i) => ({
                id: `split-${i + 1}`,
                expenseId: mockExpense.id,
                ...s,
            })));
            const result = await expenseService.createExpense(userId, groupId, 'Shopping', amount, 'USD', userId, 'manual', splits);
            expect(result.expense).toMatchObject({
                id: mockExpense.id,
                amount,
            });
            expect(result.splits).toHaveLength(3);
            expect(result.splits[0].amount).toBe(100);
            expect(result.splits[1].amount).toBe(150);
            expect(result.splits[2].amount).toBe(50);
        });
        it('should throw error when user is not a member', async () => {
            groupMember_repository_1.default.findByGroupAndUser.mockResolvedValue(null);
            await expect(expenseService.createExpense('non-member-id', groupId, 'Test', 100, 'USD', userId, 'equal', [{ userId }])).rejects.toMatchObject({
                statusCode: 403,
                code: 'NOT_A_MEMBER',
            });
        });
    });
});
