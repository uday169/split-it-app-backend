import { Router } from 'express';
import expenseController from '../controllers/expense.controller';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import {
  createExpenseSchema,
  updateExpenseSchema,
  getExpenseSchema,
  listExpensesSchema,
  deleteExpenseSchema,
} from '../schemas/expense.schema';

const router = Router();

// All expense routes require authentication
router.use(authenticate);

// POST /api/expenses - Create a new expense
router.post('/', validateRequest(createExpenseSchema), expenseController.createExpense);

// GET /api/expenses - List expenses for a group
router.get('/', validateRequest(listExpensesSchema), expenseController.listExpenses);

// GET /api/expenses/:expenseId - Get expense details
router.get('/:expenseId', validateRequest(getExpenseSchema), expenseController.getExpense);

// PUT /api/expenses/:expenseId - Update expense
router.put('/:expenseId', validateRequest(updateExpenseSchema), expenseController.updateExpense);

// DELETE /api/expenses/:expenseId - Delete expense
router.delete('/:expenseId', validateRequest(deleteExpenseSchema), expenseController.deleteExpense);

export default router;
