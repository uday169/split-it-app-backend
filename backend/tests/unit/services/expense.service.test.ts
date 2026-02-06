import { ExpenseService } from '../../../src/services/expense.service';
import expenseRepository from '../../../src/repositories/expense.repository';
import expenseSplitRepository from '../../../src/repositories/expenseSplit.repository';
import groupMemberRepository from '../../../src/repositories/groupMember.repository';
import { mockUsers, mockGroup } from '../../helpers/testData';
import '../../helpers/setup';

// Mock repositories
jest.mock('../../../src/repositories/expense.repository');
jest.mock('../../../src/repositories/expenseSplit.repository');
jest.mock('../../../src/repositories/groupMember.repository');

describe('ExpenseService', () => {
  let expenseService: ExpenseService;

  beforeEach(() => {
    expenseService = new ExpenseService();
    jest.clearAllMocks();
  });

  describe('createExpense', () => {
    const groupId = mockGroup.id;
    const userId = mockUsers.user1.id;

    beforeEach(() => {
      // Mock all users as group members
      (groupMemberRepository.findByGroupAndUser as jest.Mock).mockResolvedValue({
        groupId,
        userId,
      });
    });

    it('should create expense with equal split', async () => {
      const amount = 300;
      const splits = [
        { userId: mockUsers.user1.id },
        { userId: mockUsers.user2.id },
        { userId: mockUsers.user3.id },
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

      (expenseRepository.create as jest.Mock).mockResolvedValue(mockExpense);
      (expenseSplitRepository.createMany as jest.Mock).mockResolvedValue([
        { id: 'split-1', expenseId: mockExpense.id, userId: mockUsers.user1.id, amount: 100 },
        { id: 'split-2', expenseId: mockExpense.id, userId: mockUsers.user2.id, amount: 100 },
        { id: 'split-3', expenseId: mockExpense.id, userId: mockUsers.user3.id, amount: 100 },
      ]);

      const result = await expenseService.createExpense(
        userId,
        groupId,
        'Dinner',
        amount,
        'USD',
        userId,
        'equal',
        splits
      );

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
        { userId: mockUsers.user1.id, amount: 100 },
        { userId: mockUsers.user2.id, amount: 150 },
        { userId: mockUsers.user3.id, amount: 50 },
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

      (expenseRepository.create as jest.Mock).mockResolvedValue(mockExpense);
      (expenseSplitRepository.createMany as jest.Mock).mockResolvedValue(
        splits.map((s, i) => ({
          id: `split-${i + 1}`,
          expenseId: mockExpense.id,
          ...s,
        }))
      );

      const result = await expenseService.createExpense(
        userId,
        groupId,
        'Shopping',
        amount,
        'USD',
        userId,
        'manual',
        splits
      );

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
      (groupMemberRepository.findByGroupAndUser as jest.Mock).mockResolvedValue(null);

      await expect(
        expenseService.createExpense(
          'non-member-id',
          groupId,
          'Test',
          100,
          'USD',
          userId,
          'equal',
          [{ userId }]
        )
      ).rejects.toMatchObject({
        statusCode: 403,
        code: 'NOT_A_MEMBER',
      });
    });
  });
});
