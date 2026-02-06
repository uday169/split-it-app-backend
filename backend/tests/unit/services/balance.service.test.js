"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const balance_service_1 = require("../../../src/services/balance.service");
const expense_repository_1 = __importDefault(require("../../../src/repositories/expense.repository"));
const expenseSplit_repository_1 = __importDefault(require("../../../src/repositories/expenseSplit.repository"));
const groupMember_repository_1 = __importDefault(require("../../../src/repositories/groupMember.repository"));
const testData_1 = require("../../helpers/testData");
require("../../helpers/setup");
// Mock repositories
jest.mock('../../../src/repositories/expense.repository');
jest.mock('../../../src/repositories/expenseSplit.repository');
jest.mock('../../../src/repositories/groupMember.repository');
describe('BalanceService', () => {
    let balanceService;
    beforeEach(() => {
        balanceService = new balance_service_1.BalanceService();
        jest.clearAllMocks();
    });
    describe('calculateGroupBalances', () => {
        const groupId = testData_1.mockGroup.id;
        const userId = testData_1.mockUsers.user1.id;
        it('should return empty balances when no expenses', async () => {
            groupMember_repository_1.default.findByGroupAndUser.mockResolvedValue({
                groupId,
                userId,
            });
            expense_repository_1.default.findByGroupId.mockResolvedValue([]);
            const result = await balanceService.calculateGroupBalances(groupId, userId);
            expect(result.balances).toEqual([]);
            expect(result.simplifiedBalances).toEqual([]);
        });
        it('should calculate balances for simple equal split expense', async () => {
            // Setup: User1 paid 300, split equally among User1, User2, User3 (100 each)
            // Expected: User2 owes 100, User3 owes 100, User1 is owed 200
            const expense = {
                ...testData_1.mockExpense,
                amount: 300,
                paidBy: testData_1.mockUsers.user1.id,
            };
            const splits = [
                { id: 'split-1', expenseId: expense.id, userId: testData_1.mockUsers.user1.id, amount: 100 },
                { id: 'split-2', expenseId: expense.id, userId: testData_1.mockUsers.user2.id, amount: 100 },
                { id: 'split-3', expenseId: expense.id, userId: testData_1.mockUsers.user3.id, amount: 100 },
            ];
            const members = [
                { userId: testData_1.mockUsers.user1.id, user: testData_1.mockUsers.user1 },
                { userId: testData_1.mockUsers.user2.id, user: testData_1.mockUsers.user2 },
                { userId: testData_1.mockUsers.user3.id, user: testData_1.mockUsers.user3 },
            ];
            groupMember_repository_1.default.findByGroupAndUser.mockResolvedValue({
                groupId,
                userId,
            });
            expense_repository_1.default.findByGroupId.mockResolvedValue([expense]);
            expenseSplit_repository_1.default.findByGroupId.mockResolvedValue(splits);
            groupMember_repository_1.default.getMembersWithUserDetails.mockResolvedValue(members);
            const result = await balanceService.calculateGroupBalances(groupId, userId);
            // Check balances
            const user1Balance = result.balances.find((b) => b.userId === testData_1.mockUsers.user1.id);
            const user2Balance = result.balances.find((b) => b.userId === testData_1.mockUsers.user2.id);
            const user3Balance = result.balances.find((b) => b.userId === testData_1.mockUsers.user3.id);
            expect(user1Balance).toMatchObject({
                totalPaid: 300,
                totalOwed: 100,
                balance: 200,
            });
            expect(user2Balance).toMatchObject({
                totalPaid: 0,
                totalOwed: 100,
                balance: -100,
            });
            expect(user3Balance).toMatchObject({
                totalPaid: 0,
                totalOwed: 100,
                balance: -100,
            });
            // Check simplified balances
            expect(result.simplifiedBalances).toHaveLength(2);
            expect(result.simplifiedBalances).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    fromUserId: testData_1.mockUsers.user2.id,
                    toUserId: testData_1.mockUsers.user1.id,
                    amount: 100,
                }),
                expect.objectContaining({
                    fromUserId: testData_1.mockUsers.user3.id,
                    toUserId: testData_1.mockUsers.user1.id,
                    amount: 100,
                }),
            ]));
        });
        it('should calculate balances for multiple expenses', async () => {
            // Expense 1: User1 paid 300, split equally (100 each)
            // Expense 2: User2 paid 150, split equally (50 each)
            // Net: User1 balance = 300-100-50 = 150
            //      User2 balance = 150-100-50 = 0
            //      User3 balance = 0-100-50 = -150
            const expense1 = {
                id: 'expense-1',
                groupId,
                amount: 300,
                paidBy: testData_1.mockUsers.user1.id,
            };
            const expense2 = {
                id: 'expense-2',
                groupId,
                amount: 150,
                paidBy: testData_1.mockUsers.user2.id,
            };
            const splits = [
                { id: 'split-1', expenseId: expense1.id, userId: testData_1.mockUsers.user1.id, amount: 100 },
                { id: 'split-2', expenseId: expense1.id, userId: testData_1.mockUsers.user2.id, amount: 100 },
                { id: 'split-3', expenseId: expense1.id, userId: testData_1.mockUsers.user3.id, amount: 100 },
                { id: 'split-4', expenseId: expense2.id, userId: testData_1.mockUsers.user1.id, amount: 50 },
                { id: 'split-5', expenseId: expense2.id, userId: testData_1.mockUsers.user2.id, amount: 50 },
                { id: 'split-6', expenseId: expense2.id, userId: testData_1.mockUsers.user3.id, amount: 50 },
            ];
            const members = [
                { userId: testData_1.mockUsers.user1.id, user: testData_1.mockUsers.user1 },
                { userId: testData_1.mockUsers.user2.id, user: testData_1.mockUsers.user2 },
                { userId: testData_1.mockUsers.user3.id, user: testData_1.mockUsers.user3 },
            ];
            groupMember_repository_1.default.findByGroupAndUser.mockResolvedValue({
                groupId,
                userId,
            });
            expense_repository_1.default.findByGroupId.mockResolvedValue([expense1, expense2]);
            expenseSplit_repository_1.default.findByGroupId.mockResolvedValue(splits);
            groupMember_repository_1.default.getMembersWithUserDetails.mockResolvedValue(members);
            const result = await balanceService.calculateGroupBalances(groupId, userId);
            const user1Balance = result.balances.find((b) => b.userId === testData_1.mockUsers.user1.id);
            const user2Balance = result.balances.find((b) => b.userId === testData_1.mockUsers.user2.id);
            const user3Balance = result.balances.find((b) => b.userId === testData_1.mockUsers.user3.id);
            expect(user1Balance?.balance).toBe(150);
            expect(user2Balance?.balance).toBe(0);
            expect(user3Balance?.balance).toBe(-150);
            // Should have 1 simplified transaction: User3 pays User1
            expect(result.simplifiedBalances).toHaveLength(1);
            expect(result.simplifiedBalances[0]).toMatchObject({
                fromUserId: testData_1.mockUsers.user3.id,
                toUserId: testData_1.mockUsers.user1.id,
                amount: 150,
            });
        });
        it('should throw error when user is not a member', async () => {
            groupMember_repository_1.default.findByGroupAndUser.mockResolvedValue(null);
            await expect(balanceService.calculateGroupBalances(groupId, 'non-member-id')).rejects.toMatchObject({
                statusCode: 403,
                code: 'NOT_A_MEMBER',
            });
        });
        it('should handle complex balance simplification', async () => {
            // Setup a circular debt scenario
            // User1 paid 100, User2 paid 100, User3 paid 100 (total 300)
            // All split equally (100 each)
            // Result: All balanced, no simplified transactions needed
            const expenses = [
                { id: 'e1', groupId, amount: 100, paidBy: testData_1.mockUsers.user1.id },
                { id: 'e2', groupId, amount: 100, paidBy: testData_1.mockUsers.user2.id },
                { id: 'e3', groupId, amount: 100, paidBy: testData_1.mockUsers.user3.id },
            ];
            const splits = [
                { id: 's1', expenseId: 'e1', userId: testData_1.mockUsers.user1.id, amount: 100 },
                { id: 's2', expenseId: 'e2', userId: testData_1.mockUsers.user2.id, amount: 100 },
                { id: 's3', expenseId: 'e3', userId: testData_1.mockUsers.user3.id, amount: 100 },
            ];
            const members = [
                { userId: testData_1.mockUsers.user1.id, user: testData_1.mockUsers.user1 },
                { userId: testData_1.mockUsers.user2.id, user: testData_1.mockUsers.user2 },
                { userId: testData_1.mockUsers.user3.id, user: testData_1.mockUsers.user3 },
            ];
            groupMember_repository_1.default.findByGroupAndUser.mockResolvedValue({
                groupId,
                userId,
            });
            expense_repository_1.default.findByGroupId.mockResolvedValue(expenses);
            expenseSplit_repository_1.default.findByGroupId.mockResolvedValue(splits);
            groupMember_repository_1.default.getMembersWithUserDetails.mockResolvedValue(members);
            const result = await balanceService.calculateGroupBalances(groupId, userId);
            // All users should have balance 0
            result.balances.forEach((balance) => {
                expect(balance.balance).toBe(0);
            });
            // No simplified transactions needed
            expect(result.simplifiedBalances).toHaveLength(0);
        });
    });
});
