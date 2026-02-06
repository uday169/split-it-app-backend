"use strict";
/**
 * Test data factories for creating consistent test data
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMockOtpRecord = exports.createMockExpense = exports.createMockGroup = exports.createMockUser = exports.mockOtpRecord = exports.mockExpense = exports.mockGroup = exports.mockUsers = void 0;
exports.mockUsers = {
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
exports.mockGroup = {
    id: 'group-1',
    name: 'Test Group',
    description: 'A test group',
    createdBy: exports.mockUsers.user1.id,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
};
exports.mockExpense = {
    id: 'expense-1',
    groupId: exports.mockGroup.id,
    description: 'Test Expense',
    amount: 100.0,
    currency: 'USD',
    paidBy: exports.mockUsers.user1.id,
    date: new Date('2024-01-15'),
    category: 'Food',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
};
exports.mockOtpRecord = {
    id: 'otp-1',
    email: exports.mockUsers.user1.email,
    otp: '123456',
    expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
    attempts: 0,
    verified: false,
    createdAt: new Date(),
};
const createMockUser = (overrides) => ({
    ...exports.mockUsers.user1,
    ...overrides,
});
exports.createMockUser = createMockUser;
const createMockGroup = (overrides) => ({
    ...exports.mockGroup,
    ...overrides,
});
exports.createMockGroup = createMockGroup;
const createMockExpense = (overrides) => ({
    ...exports.mockExpense,
    ...overrides,
});
exports.createMockExpense = createMockExpense;
const createMockOtpRecord = (overrides) => ({
    ...exports.mockOtpRecord,
    ...overrides,
});
exports.createMockOtpRecord = createMockOtpRecord;
