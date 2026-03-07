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

router.post('/', validateRequest(createExpenseSchema), expenseController.createExpense);
router.get('/', validateRequest(listExpensesSchema), expenseController.listExpenses);
router.get('/:expenseId', validateRequest(getExpenseSchema), expenseController.getExpense);
router.put('/:expenseId', validateRequest(updateExpenseSchema), expenseController.updateExpense);
router.delete('/:expenseId', validateRequest(deleteExpenseSchema), expenseController.deleteExpense);

export default router;
