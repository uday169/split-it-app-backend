import { Response, NextFunction } from 'express';
import expenseService from '../services/expense.service';
import { AuthRequest, ApiResponse } from '../types';
import {
  CreateExpenseInput,
  UpdateExpenseInput,
  GetExpenseInput,
  ListExpensesInput,
  DeleteExpenseInput,
} from '../schemas/expense.schema';

export class ExpenseController {
  async createExpense(
    req: AuthRequest<{}, {}, CreateExpenseInput>,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { groupId, description, amount, currency, paidBy, splitType, splits, date } = req.body;

      const result = await expenseService.createExpense(
        userId,
        groupId,
        description,
        amount,
        currency,
        paidBy,
        splitType,
        splits,
        date
      );

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getExpense(
    req: AuthRequest<GetExpenseInput>,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { expenseId } = req.params;

      const result = await expenseService.getExpense(expenseId, userId);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async listExpenses(
    req: AuthRequest<{}, {}, {}, ListExpensesInput>,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { groupId, limit } = req.query;

      const expenses = await expenseService.getGroupExpenses(groupId, userId, limit);

      res.status(200).json({
        success: true,
        data: expenses,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateExpense(
    req: AuthRequest<UpdateExpenseInput['params'], {}, UpdateExpenseInput['body']>,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { expenseId } = req.params;
      const updates = req.body;

      const result = await expenseService.updateExpense(expenseId, userId, updates);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteExpense(
    req: AuthRequest<DeleteExpenseInput>,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { expenseId } = req.params;

      await expenseService.deleteExpense(expenseId, userId);

      res.status(200).json({
        success: true,
        data: {
          message: 'Expense deleted successfully',
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ExpenseController();
