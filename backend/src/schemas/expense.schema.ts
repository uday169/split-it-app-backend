import { z } from 'zod';

export const createExpenseSchema = z.object({
  body: z.object({
    groupId: z.string().min(1, 'Group ID is required'),
    description: z.string().min(1, 'Description is required').max(200, 'Description is too long'),
    amount: z.number().positive('Amount must be positive'),
    currency: z.string().length(3, 'Currency must be 3 characters (e.g., USD)').default('USD'),
    paidBy: z.string().min(1, 'Paid by user ID is required'),
    splitType: z.enum(['equal', 'manual'], { errorMap: () => ({ message: 'Split type must be equal or manual' }) }),
    splits: z.array(
      z.object({
        userId: z.string().min(1, 'User ID is required'),
        amount: z.number().positive('Split amount must be positive').optional(),
      })
    ).min(1, 'At least one split is required'),
    date: z.string().datetime().optional(),
  }).refine(
    (data) => {
      if (data.splitType === 'manual') {
        const totalSplitAmount = data.splits.reduce((sum, split) => sum + (split.amount || 0), 0);
        return Math.abs(totalSplitAmount - data.amount) < 0.01; // Allow 1 cent tolerance for rounding
      }
      return true;
    },
    {
      message: 'For manual splits, the sum of split amounts must equal the total amount',
      path: ['splits'],
    }
  ),
});

export const updateExpenseSchema = z.object({
  params: z.object({
    expenseId: z.string().min(1, 'Expense ID is required'),
  }),
  body: z.object({
    description: z.string().min(1, 'Description is required').max(200, 'Description is too long').optional(),
    amount: z.number().positive('Amount must be positive').optional(),
    date: z.string().datetime().optional(),
    splitType: z.enum(['equal', 'manual']).optional(),
    splits: z.array(
      z.object({
        userId: z.string().min(1, 'User ID is required'),
        amount: z.number().positive('Split amount must be positive').optional(),
      })
    ).min(1, 'At least one split is required').optional(),
  }),
});

export const getExpenseSchema = z.object({
  params: z.object({
    expenseId: z.string().min(1, 'Expense ID is required'),
  }),
});

export const listExpensesSchema = z.object({
  params: z.object({
    groupId: z.string().min(1, 'Group ID is required').optional(),
  }),
  query: z.object({
    groupId: z.string().min(1, 'Group ID is required').optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  }),
}).refine(
  (data) => Boolean(data.params.groupId || data.query.groupId),
  {
    message: 'Group ID is required',
    path: ['groupId'],
  }
);

export const deleteExpenseSchema = z.object({
  params: z.object({
    expenseId: z.string().min(1, 'Expense ID is required'),
  }),
});

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>['body'];
export type UpdateExpenseInput = {
  params: z.infer<typeof updateExpenseSchema>['params'];
  body: z.infer<typeof updateExpenseSchema>['body'];
};
export type GetExpenseInput = z.infer<typeof getExpenseSchema>['params'];
export type ListExpensesInput = {
  params: z.infer<typeof listExpensesSchema>['params'];
  query: z.infer<typeof listExpensesSchema>['query'];
};
export type DeleteExpenseInput = z.infer<typeof deleteExpenseSchema>['params'];
