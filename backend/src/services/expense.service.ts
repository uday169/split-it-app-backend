import { AppError } from '../middleware/errorHandler';
import expenseRepository from '../repositories/expense.repository';
import expenseSplitRepository from '../repositories/expenseSplit.repository';
import groupMemberRepository from '../repositories/groupMember.repository';
import { Expense, ExpenseSplit } from '../types';
import logger from '../config/logger';

interface SplitInput {
  userId: string;
  amount?: number;
}

export class ExpenseService {
  async createExpense(
    userId: string,
    groupId: string,
    description: string,
    amount: number,
    currency: string,
    paidBy: string,
    splitType: 'equal' | 'manual',
    splits: SplitInput[],
    date?: string
  ): Promise<{ expense: Expense; splits: ExpenseSplit[] }> {
    // Verify user is a member of the group
    await this.checkGroupMembership(groupId, userId);

    // Verify paidBy user is a member
    await this.checkGroupMembership(groupId, paidBy);

    // Verify all split users are members
    await Promise.all(
      splits.map((split) => this.checkGroupMembership(groupId, split.userId))
    );

    // Calculate split amounts
    const calculatedSplits = this.calculateSplits(amount, splitType, splits);

    // Create expense
    const expense = await expenseRepository.create({
      groupId,
      description,
      amount,
      currency,
      paidBy,
      splitType,
      date: date ? new Date(date) : new Date(),
      createdBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Create splits
    const splitData = calculatedSplits.map((split) => ({
      expenseId: expense.id,
      userId: split.userId,
      amount: split.amount,
    }));

    const createdSplits = await expenseSplitRepository.createMany(splitData);

    logger.info(`Expense created: ${expense.id} in group ${groupId} by user ${userId}`);

    return {
      expense,
      splits: createdSplits,
    };
  }

  async getExpense(
    expenseId: string,
    userId: string
  ): Promise<{ expense: Expense; splits: ExpenseSplit[] }> {
    const expense = await expenseRepository.findById(expenseId);

    if (!expense) {
      throw new AppError(404, 'Expense not found', 'EXPENSE_NOT_FOUND');
    }

    // Verify user is a member of the group
    await this.checkGroupMembership(expense.groupId, userId);

    const splits = await expenseSplitRepository.findByExpenseId(expenseId);

    return {
      expense,
      splits,
    };
  }

  async getGroupExpenses(groupId: string, userId: string, limit?: number): Promise<Expense[]> {
    // Verify user is a member of the group
    await this.checkGroupMembership(groupId, userId);

    return expenseRepository.findByGroupId(groupId, limit);
  }

  async updateExpense(
    expenseId: string,
    userId: string,
    updates: {
      description?: string;
      amount?: number;
      date?: string;
      splitType?: 'equal' | 'manual';
      splits?: SplitInput[];
    }
  ): Promise<{ expense: Expense; splits: ExpenseSplit[] }> {
    const expense = await expenseRepository.findById(expenseId);

    if (!expense) {
      throw new AppError(404, 'Expense not found', 'EXPENSE_NOT_FOUND');
    }

    // Verify user is a member of the group
    await this.checkGroupMembership(expense.groupId, userId);

    // Only creator can update
    if (expense.createdBy !== userId) {
      throw new AppError(403, 'Only the creator can update this expense', 'INSUFFICIENT_PERMISSIONS');
    }

    // Prepare update data
    const updateData: Partial<Expense> = {};

    if (updates.description) updateData.description = updates.description;
    if (updates.date) updateData.date = new Date(updates.date);

    // If amount or splits are being updated, recalculate splits
    if (updates.amount !== undefined || updates.splits || updates.splitType) {
      const newAmount = updates.amount ?? expense.amount;
      const newSplitType = updates.splitType ?? expense.splitType;
      const newSplits = updates.splits ?? (await expenseSplitRepository.findByExpenseId(expenseId)).map(s => ({
        userId: s.userId,
        amount: s.amount,
      }));

      const calculatedSplits = this.calculateSplits(newAmount, newSplitType, newSplits);

      // Delete old splits
      await expenseSplitRepository.deleteByExpenseId(expenseId);

      // Create new splits
      const splitData = calculatedSplits.map((split) => ({
        expenseId: expense.id,
        userId: split.userId,
        amount: split.amount,
      }));

      await expenseSplitRepository.createMany(splitData);

      updateData.amount = newAmount;
      updateData.splitType = newSplitType;
    }

    // Update expense
    const updatedExpense = await expenseRepository.update(expenseId, updateData);

    if (!updatedExpense) {
      throw new AppError(404, 'Expense not found', 'EXPENSE_NOT_FOUND');
    }

    const splits = await expenseSplitRepository.findByExpenseId(expenseId);

    logger.info(`Expense updated: ${expenseId} by user ${userId}`);

    return {
      expense: updatedExpense,
      splits,
    };
  }

  async deleteExpense(expenseId: string, userId: string): Promise<void> {
    const expense = await expenseRepository.findById(expenseId);

    if (!expense) {
      throw new AppError(404, 'Expense not found', 'EXPENSE_NOT_FOUND');
    }

    // Verify user is a member of the group
    await this.checkGroupMembership(expense.groupId, userId);

    // Only creator can delete
    if (expense.createdBy !== userId) {
      throw new AppError(403, 'Only the creator can delete this expense', 'INSUFFICIENT_PERMISSIONS');
    }

    // Delete splits first
    await expenseSplitRepository.deleteByExpenseId(expenseId);

    // Delete expense
    await expenseRepository.delete(expenseId);

    logger.info(`Expense deleted: ${expenseId} by user ${userId}`);
  }

  // Helper methods
  private calculateSplits(
    amount: number,
    splitType: 'equal' | 'manual',
    splits: SplitInput[]
  ): Array<{ userId: string; amount: number }> {
    if (splitType === 'equal') {
      const splitAmount = amount / splits.length;
      return splits.map((split) => ({
        userId: split.userId,
        amount: Math.round(splitAmount * 100) / 100, // Round to 2 decimals
      }));
    } else {
      // Manual split - amounts should already be provided
      return splits.map((split) => ({
        userId: split.userId,
        amount: split.amount!,
      }));
    }
  }

  private async checkGroupMembership(groupId: string, userId: string): Promise<void> {
    const membership = await groupMemberRepository.findByGroupAndUser(groupId, userId);

    if (!membership) {
      throw new AppError(403, 'User is not a member of this group', 'NOT_A_MEMBER');
    }
  }
}

export default new ExpenseService();
