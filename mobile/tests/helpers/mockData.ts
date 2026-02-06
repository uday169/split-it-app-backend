/**
 * Mock data for testing
 */

export const mockUser = {
  id: 'user-1',
  email: 'test@example.com',
  name: 'Test User',
};

export const mockGroup = {
  id: 'group-1',
  name: 'Test Group',
  description: 'A test group',
  createdBy: mockUser.id,
  memberCount: 3,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

export const mockExpense = {
  id: 'expense-1',
  groupId: mockGroup.id,
  description: 'Test Expense',
  amount: 100,
  currency: 'USD',
  paidBy: mockUser.id,
  paidByName: mockUser.name,
  splitType: 'equal' as const,
  date: '2024-01-15T00:00:00.000Z',
  category: 'Food',
  createdBy: mockUser.id,
  createdAt: '2024-01-15T00:00:00.000Z',
  updatedAt: '2024-01-15T00:00:00.000Z',
};

export const mockBalance = {
  userId: mockUser.id,
  userName: mockUser.name,
  totalPaid: 100,
  totalOwed: 50,
  balance: 50,
};

export const mockSettlement = {
  id: 'settlement-1',
  groupId: mockGroup.id,
  fromUserId: 'user-2',
  fromUserName: 'User Two',
  toUserId: mockUser.id,
  toUserName: mockUser.name,
  amount: 50,
  currency: 'USD',
  date: '2024-01-20T00:00:00.000Z',
  confirmedByPayer: true,
  confirmedByPayee: true,
  createdAt: '2024-01-20T00:00:00.000Z',
};
