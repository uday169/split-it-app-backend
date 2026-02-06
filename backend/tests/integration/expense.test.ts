import request from 'supertest';
import app from '../../src/app';
import { generateToken } from '../../src/utils/jwt';
import expenseRepository from '../../src/repositories/expense.repository';
import expenseSplitRepository from '../../src/repositories/expenseSplit.repository';
import groupMemberRepository from '../../src/repositories/groupMember.repository';
import userRepository from '../../src/repositories/user.repository';
import { mockUsers, mockGroup, mockExpense } from '../helpers/testData';
import '../helpers/setup';

// Mock repositories
jest.mock('../../src/repositories/expense.repository');
jest.mock('../../src/repositories/expenseSplit.repository');
jest.mock('../../src/repositories/groupMember.repository');
jest.mock('../../src/repositories/user.repository');

describe('Expense API Integration Tests', () => {
  const userId = mockUsers.user1.id;
  const userEmail = mockUsers.user1.email;
  const groupId = mockGroup.id;
  let authToken: string;

  beforeEach(() => {
    jest.clearAllMocks();
    authToken = generateToken(userId, userEmail);
    (userRepository.findById as jest.Mock).mockResolvedValue(mockUsers.user1);
    (groupMemberRepository.findByGroupAndUser as jest.Mock).mockResolvedValue({
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
          { userId: mockUsers.user1.id },
          { userId: mockUsers.user2.id },
          { userId: mockUsers.user3.id },
        ],
      };

      (expenseRepository.create as jest.Mock).mockResolvedValue({
        ...mockExpense,
        ...newExpense,
        id: 'new-expense-id',
      });

      (expenseSplitRepository.createMany as jest.Mock).mockResolvedValue([
        { id: 'split-1', expenseId: 'new-expense-id', userId: mockUsers.user1.id, amount: 100 },
        { id: 'split-2', expenseId: 'new-expense-id', userId: mockUsers.user2.id, amount: 100 },
        { id: 'split-3', expenseId: 'new-expense-id', userId: mockUsers.user3.id, amount: 100 },
      ]);

      const res = await request(app)
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
          { userId: mockUsers.user1.id, amount: 100 },
          { userId: mockUsers.user2.id, amount: 150 },
          { userId: mockUsers.user3.id, amount: 50 },
        ],
      };

      (expenseRepository.create as jest.Mock).mockResolvedValue({
        ...mockExpense,
        ...newExpense,
        id: 'new-expense-id',
      });

      (expenseSplitRepository.createMany as jest.Mock).mockResolvedValue([
        { id: 'split-1', expenseId: 'new-expense-id', userId: mockUsers.user1.id, amount: 100 },
        { id: 'split-2', expenseId: 'new-expense-id', userId: mockUsers.user2.id, amount: 150 },
        { id: 'split-3', expenseId: 'new-expense-id', userId: mockUsers.user3.id, amount: 50 },
      ]);

      const res = await request(app)
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
      const res = await request(app)
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
      expect(expenseRepository.create).not.toHaveBeenCalled();
    });

    it('should reject invalid expense data', async () => {
      const res = await request(app)
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
      expect(expenseRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('GET /api/expenses/:groupId', () => {
    it('should return group expenses', async () => {
      const endpoint = `/api/expenses/${groupId}`;
      const expenses = [mockExpense];

      (expenseRepository.findByGroupId as jest.Mock).mockResolvedValue(expenses);

      const res = await request(app)
        .get(endpoint)
        .set('Authorization', `Bearer ${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0]).toMatchObject({
        id: mockExpense.id,
        description: mockExpense.description,
      });
    });

    it('should return empty array when no expenses', async () => {
      const endpoint = `/api/expenses/${groupId}`;
      (expenseRepository.findByGroupId as jest.Mock).mockResolvedValue([]);

      const res = await request(app)
        .get(endpoint)
        .set('Authorization', `Bearer ${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toEqual([]);
    });

    it('should reject non-member access', async () => {
      const endpoint = `/api/expenses/${groupId}`;
      (groupMemberRepository.findByGroupAndUser as jest.Mock).mockResolvedValue(null);

      const res = await request(app)
        .get(endpoint)
        .set('Authorization', `Bearer ${authToken}`)
        .expect('Content-Type', /json/)
        .expect(403);

      expect(res.body).toHaveProperty('success', false);
    });
  });

  describe('GET /api/expenses/detail/:id', () => {
    const expenseId = mockExpense.id;
    const endpoint = `/api/expenses/detail/${expenseId}`;

    it('should return expense details with splits', async () => {
      const splits = [
        { id: 'split-1', expenseId, userId: mockUsers.user1.id, amount: 100 },
        { id: 'split-2', expenseId, userId: mockUsers.user2.id, amount: 100 },
      ];

      (expenseRepository.findById as jest.Mock).mockResolvedValue(mockExpense);
      (expenseSplitRepository.findByExpenseId as jest.Mock).mockResolvedValue(splits);

      const res = await request(app)
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
      (expenseRepository.findById as jest.Mock).mockResolvedValue(null);

      const res = await request(app)
        .get(endpoint)
        .set('Authorization', `Bearer ${authToken}`)
        .expect('Content-Type', /json/)
        .expect(404);

      expect(res.body).toHaveProperty('success', false);
    });
  });
});
