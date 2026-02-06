/**
 * Test data factories for creating consistent test data
 */

export const mockUsers = {
  user1: {
    id: 'user-1',
    email: 'user1@example.com',
    name: 'User One',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  user2: {
    id: 'user-2',
    email: 'user2@example.com',
    name: 'User Two',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  user3: {
    id: 'user-3',
    email: 'user3@example.com',
    name: 'User Three',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
};

export const mockGroup = {
  id: 'group-1',
  name: 'Test Group',
  description: 'A test group',
  createdBy: mockUsers.user1.id,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

export const mockExpense = {
  id: 'expense-1',
  groupId: mockGroup.id,
  description: 'Test Expense',
  amount: 100.0,
  currency: 'USD',
  paidBy: mockUsers.user1.id,
  date: new Date('2024-01-15'),
  category: 'Food',
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-15'),
};

export const mockOtpRecord = {
  id: 'otp-1',
  email: mockUsers.user1.email,
  otp: '123456',
  expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
  attempts: 0,
  verified: false,
  createdAt: new Date(),
};

export const createMockUser = (overrides?: Partial<typeof mockUsers.user1>) => ({
  ...mockUsers.user1,
  ...overrides,
});

export const createMockGroup = (overrides?: Partial<typeof mockGroup>) => ({
  ...mockGroup,
  ...overrides,
});

export const createMockExpense = (overrides?: Partial<typeof mockExpense>) => ({
  ...mockExpense,
  ...overrides,
});

export const createMockOtpRecord = (overrides?: Partial<typeof mockOtpRecord>) => ({
  ...mockOtpRecord,
  ...overrides,
});
